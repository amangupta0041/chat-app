import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:[], // FIXED: Changed from null to []
        selectedUser:null,
        onlineUsers:[], // FIXED: Changed from null to []
        unreadCounts: {}, // Map of unread messages by user ID
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        setUnreadCounts: (state, action) => {
            state.unreadCounts = action.payload;
        },
        incrementUnreadCount: (state, action) => {
            const userId = action.payload;
            state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
        },
        resetUnreadCount: (state, action) => {
            const userId = action.payload;
            state.unreadCounts[userId] = 0;
        }
    }
});
export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers, setUnreadCounts, incrementUnreadCount, resetUnreadCount} = userSlice.actions;
export default userSlice.reducer;