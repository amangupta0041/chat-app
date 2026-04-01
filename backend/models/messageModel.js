import mongoose from 'mongoose';

const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true   
    },
    message:{
        type:String,
        required:true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    deletedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},{timestamps:true});
export const Message = mongoose.model("Message", messageModel);