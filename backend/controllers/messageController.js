import mongoose from "mongoose";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // 1. Check if a conversation already exists between these two users
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // 2. If no conversation exists, create a new one
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // 3. Create the new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // 4. Push the new message's ID into the conversation's messages array
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        // 5. Optimized: Save both the conversation and message at the same time
        await Promise.all([gotConversation.save(), newMessage.save()]);

        // SOCKET IO 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // TODO: ADD SOCKET.IO LOGIC HERE FOR REAL-TIME UPDATES

        return res.status(201).json({
            newMessage
        })

    } catch (error) {
        console.log("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        // Auto mark messages from this user as read
        await Message.updateMany(
            { senderId: receiverId, receiverId: senderId, isRead: false },
            { $set: { isRead: true } }
        );

        // Find the conversation and replace the message IDs with actual message data
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: "messages",
            match: { deletedBy: { $ne: senderId } }
        });

        // If no conversation exists, return an empty array [] instead of undefined
        return res.status(200).json(conversation?.messages || []);

    } catch (error) {
        console.log("Error in getMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const senderId = req.id;

        // 1. Find the message to ensure it exists and belongs to the sender
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (String(message.senderId) !== String(senderId)) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        // 2. Delete the message physically
        await Message.findByIdAndDelete(messageId);

        // 3. Remove message reference from conversation
        await Conversation.updateOne(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        // 4. SOCKET IO - Emit 'messageDeleted' event to the receiver
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", messageId);
        }

        return res.status(200).json({ message: "Message deleted successfully", messageId });

    } catch (error) {
        console.log("Error in deleteMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUnreadCounts = async (req, res) => {
    try {
        const userId = req.id;
        // Group by senderId and count how many messages are unread for current user as receiver
        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: new mongoose.Types.ObjectId(userId), isRead: false, deletedBy: { $ne: new mongoose.Types.ObjectId(userId) } } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const countsMap = {};
        unreadCounts.forEach(item => {
            countsMap[item._id.toString()] = item.count;
        });

        return res.status(200).json(countsMap);
    } catch (error) {
        console.log("Error in getUnreadCounts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const { type } = req.query; // 'me' or 'everyone'

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        if (type === "everyone") {
            // Physically delete all messages
            await Message.deleteMany({ _id: { $in: conversation.messages } });
            await Conversation.findByIdAndDelete(conversation._id);
            
            const receiverSocketId = getReceiverSocketId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("conversationDeleted", { senderId });
            }
        } else {
            // Delete for me
            await Message.updateMany(
                { _id: { $in: conversation.messages } },
                { $addToSet: { deletedBy: senderId } }
            );
        }

        return res.status(200).json({ message: "Conversation deleted" });

    } catch (error) {
        console.log("Error in deleteConversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};