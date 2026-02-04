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
            isObjectIdOrHexString.to(receiverSocketId).emit("newMessage", newMessage);
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

        // Find the conversation and replace the message IDs with actual message data
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        // If no conversation exists, return an empty array [] instead of undefined
        return res.status(200).json(conversation?.messages || []);

    } catch (error) {
        console.log("Error in getMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};