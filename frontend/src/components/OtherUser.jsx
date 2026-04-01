import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers, unreadCounts } = useSelector(store => store.user);
    
    const unreadCount = unreadCounts?.[user?._id] || 0;
    
    // Safety Check: Verify if user exists before checking online status
    const isOnline = onlineUsers?.includes(user?._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    }

    // Function to handle image errors gracefully by generating an avatar with initials
    const fallbackImage = user?.fullName 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName)}&background=random` 
        : `https://ui-avatars.com/api/?name=?&background=random`;

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite error loops
        e.target.src = fallbackImage;
    }

    return (
        <>
            <div 
                onClick={() => selectedUserHandler(user)} 
                className={` ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-zinc-900' : 'text-white'} flex gap-2 items-center hover:bg-zinc-200 hover:text-zinc-900 rounded p-2 cursor-pointer transition-all duration-200`}
            >
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 h-12 rounded-full border border-zinc-600 bg-zinc-700 flex items-center justify-center overflow-hidden'>
                        <img 
                            src={user?.profilePhoto || fallbackImage} 
                            alt={user?.fullName}
                            className="w-full h-full object-cover"
                            onError={handleImageError} 
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between items-center gap-2 '>
                        <p className='font-medium'>{user?.fullName}</p>
                        {/* New Unread Badge logic matching WhatsApp */}
                        {unreadCount > 0 && (
                            <div className="badge badge-success badge-sm border-none text-white font-bold h-5 w-min px-1.5 flex items-center justify-center mr-2 shadow-sm shrink-0">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-[1px] opacity-10'></div>
        </>
    )
}

export default OtherUser;