import React, { useEffect, useState } from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BiTrash } from "react-icons/bi";
import axios from "axios";
import { BASE_URL } from '../config';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // logic: checks if the selected user's ID exists in the live onlineUsers array
    const isOnline = onlineUsers?.includes(selectedUser?._id);

    // Fallback logic for broken avatars
    const fallbackImage = selectedUser?.fullName 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.fullName)}&background=random` 
        : `https://ui-avatars.com/api/?name=?&background=random`;

    // cleanup function: reset selected user when component unmounts
    useEffect(() => {
        return () => dispatch(setSelectedUser(null));
    }, [dispatch]);

    const handleDeleteChat = async (type) => {
        try {
            await axios.delete(`${BASE_URL}/api/v1/message/conversation/${selectedUser._id}?type=${type}`, {
                withCredentials: true
            });
            dispatch(setMessages([]));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
    };

    return (
        <div className='flex flex-col h-full w-full'>
            {
                selectedUser !== null ? (
                    <>
                        {/* Header Section */}
                        {/* Header Section */}
                        <div className='flex justify-between items-center bg-zinc-800 text-white px-4 py-3 mb-1 border-b border-slate-700 shadow-sm'>
                            {/* Back button - mobile only */}
                            <button 
                                onClick={() => dispatch(setSelectedUser(null))}
                                className='md:hidden mr-2 p-1.5 rounded-full hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors'
                                title="Back"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className='flex gap-3 items-center'>
                                {/* DaisyUI 'online' class provides the green dot on the avatar */}
                                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                    <div className='w-10 rounded-full border border-slate-600 overflow-hidden bg-zinc-700'>
                                        <img 
                                            src={selectedUser?.profilePhoto || fallbackImage} 
                                            alt="user-profile" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='font-bold'>{selectedUser?.fullName}</p>
                                    {/* text-green-500 makes the Online status visible */}
                                    <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Delete Chat Icon */}
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className='p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-red-500 transition-colors'
                                title="Delete Chat"
                            >
                                <BiTrash className='w-5 h-5'/>
                            </button>
                        </div>

                        {/* Messages Section: flex-1 makes it fill the space */}
                        <div className='flex-1 overflow-auto bg-transparent'>
                            <Messages />
                        </div>

                        {/* Input Section */}
                        <SendInput />

                        {/* Delete Confirmation Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-2xl w-[320px]">
                                    <h3 className="font-bold text-lg text-white mb-2">Delete chat?</h3>
                                    <p className="text-zinc-400 text-sm mb-6">Choose how you want to clear your conversation history.</p>
                                    
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => handleDeleteChat('me')}
                                            className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors"
                                        >
                                            Delete for me
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteChat('everyone')}
                                            className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                                        >
                                            Delete for everyone
                                        </button>
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-full py-2 mt-2 bg-transparent border border-zinc-600 hover:border-zinc-500 text-zinc-300 rounded-md transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='flex flex-col justify-center items-center h-full w-full'>
                        <h1 className='text-4xl text-white font-bold mb-2'>Hi, {authUser?.fullName}</h1>
                        <h1 className='text-2xl text-slate-300'>Select a chat to start messaging</h1>
                    </div>
                )
            }
        </div>
    )
}

export default MessageContainer;