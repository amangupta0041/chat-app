import React from 'react'
import OtherUser from './OtherUser'
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from "react-redux";


const OtherUsers = ({ search = "" }) => {
    // 1. Fetch the list of users from the backend
    useGetOtherUsers();

    // 2. Get the full list and the logged-in user (you) from Redux
    const { otherUsers, authUser } = useSelector(store => store.user);

    // 3. Early return if the list hasn't loaded yet
    if (!otherUsers) return null;

    // 4. FILTER: Remove the logged-in user (aditya) from the list
    // This stops you from chatting with yourself and looks more professional.
    let filteredUsers = otherUsers?.filter((user) => user?._id !== authUser?._id);

    // 5. SEARCH FILTER: Reacts instantly to props flowing down
    if (search.trim() !== "") {
        filteredUsers = filteredUsers?.filter((user) => 
            user?.fullName.toLowerCase().includes(search.toLowerCase())
        );
    }

    return (
        <div className='overflow-auto flex-1'>
            {
                filteredUsers?.map((user) => {
                    return (
                        <OtherUser key={user?._id} user={user} />
                    )
                })
            }
            {/* Show a message if there are no other users found */}
            {filteredUsers?.length === 0 && (
                <div className='text-zinc-400 text-center mt-4 px-2'>
                    No other users found
                </div>
            )}
        </div>
    )
}

export default OtherUsers;