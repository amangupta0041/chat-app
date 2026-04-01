import React, { useState } from 'react'
import { BiSearchAlt2, BiLogOut } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            // FIXED: Using BASE_URL for dynamic switching
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`, {
                withCredentials: true
            });

            // Redirect to login first
            navigate("/login");
            toast.success(res.data.message);

            // Clear all Redux states to prevent data leaks
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers([]));
            dispatch(setSelectedUser(null));
            
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Logout failed. Please try again.");
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        // Natively handled in real-time by React state binding directly down to <OtherUsers />
    }

    return (
        <div className='border-r border-slate-500 p-4 flex flex-col h-full'>
            {/* Search Section */}
            <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input input-bordered rounded-md bg-transparent text-white' 
                    type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn bg-zinc-700 hover:bg-zinc-800 text-white border-none'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>

            <div className="divider px-3"></div> 

            {/* User List Section */}
            <div className='flex-1 overflow-auto'>
                {/* Dynamically push the current search query strictly to the renderer component automatically */}
                <OtherUsers search={search} />
            </div>

            {/* Footer / Logout Section */}
            <div className='mt-4 pt-4 border-t border-slate-600/50'>
                <button 
                    onClick={logoutHandler} 
                    className='w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-slate-200 hover:text-white border border-slate-600 hover:border-slate-500 transition-all shadow-sm'
                >
                    <BiLogOut className='w-5 h-5'/>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar;