import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, unsendMessage } from "../redux/messageSlice";
import { incrementUnreadCount } from "../redux/userSlice";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        // Listen for new messages sent from the backend socket
        socket?.on("newMessage", (newMessage) => {
            // If the message is from the currently active chat, append it
            if (selectedUser?._id === newMessage.senderId) {
                dispatch(setMessages([...messages, newMessage]));
            } else {
                // Otherwise increment the unread badge
                dispatch(incrementUnreadCount(newMessage.senderId));
            }
        });

        socket?.on("messageDeleted", (messageId) => {
            dispatch(unsendMessage(messageId));
        });
        
        socket?.on("conversationDeleted", (data) => {
            if (selectedUser?._id === data.senderId) {
                dispatch(setMessages([]));
            }
        });

        // Cleanup: Prevents duplicate listeners when the component unmounts
        return () => {
            socket?.off("newMessage");
            socket?.off("messageDeleted");
            socket?.off("conversationDeleted");
        }
        
    }, [socket, setMessages, unsendMessage, messages, selectedUser, dispatch]); 
};

export default useGetRealTimeMessage;