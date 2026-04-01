import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { unsendMessage } from '../redux/messageSlice';
import { BASE_URL } from '../config';

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/api/v1/message/delete/${message._id}`, {
                withCredentials: true
            });
            // Update local state instantly for snappy feeling
            dispatch(unsendMessage(message._id));
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    useEffect(() => {
        // FIXED: Using scrollIntoView to keep the latest message in sight
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // CRITICAL: Strict string comparison to separate sender and receiver
    // We use String() to ensure even undefined/null values don't crash the app
    const isSender = String(message?.senderId) === String(authUser?._id);

    // Format timestamp
    const formattedTime = message?.createdAt 
        ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
        : '';

    // Fallback image
    const fallbackImage = selectedUser?.fullName 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.fullName)}&background=random` 
        : `https://ui-avatars.com/api/?name=?&background=random`;

    return (
        <div ref={scroll} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4 px-2`}>
            <div className={`chat ${isSender ? 'chat-end' : 'chat-start'} w-full max-w-[85%]`}>
                
                {/* 1. Profile Photo: Only show for the other user (Receiver) */}
                {!isSender && (
                    <div className="chat-image avatar">
                        <div className="w-9 rounded-full border border-zinc-600 overflow-hidden bg-zinc-700">
                            <img 
                                alt="Receiver profile" 
                                src={selectedUser?.profilePhoto || fallbackImage} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                            />
                        </div>
                    </div>
                )}

                {/* 2. Header: Dynamic alignment for the timestamp */}
                <div className={`chat-header mb-1 flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <time className="text-[10px] opacity-60 text-white mx-1">{formattedTime}</time>
                </div>

                {/* 3. Bubble Styling: Added 'w-fit' and specific rounding for tails */}
                <div className={`relative group chat-bubble shadow-lg break-words px-4 py-2 text-sm min-h-0 w-fit ${
                    isSender 
                    ? 'bg-blue-600 text-white rounded-tr-none ml-auto' 
                    : 'bg-zinc-700 text-white rounded-tl-none mr-auto'
                }`}>
                    {isSender && (
                        <div 
                            onClick={handleDelete}
                            className="absolute -left-7 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-red-500 cursor-pointer shadow-sm hover:bg-zinc-700"
                            title="Unsend"
                        >
                            ✕
                        </div>
                    )}
                    {message?.message}
                </div>

                {/* 4. Footer: Status for your own messages */}
                {isSender && (
                    <div className="chat-footer opacity-60 text-[10px] text-white mt-1 flex justify-end">
                        Delivered
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;