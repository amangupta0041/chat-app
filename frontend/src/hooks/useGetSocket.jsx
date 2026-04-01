import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setSocket } from "../redux/socketSlice";
import { setOnlineUsers } from "../redux/userSlice";
import { BASE_URL } from "../config";

const useGetSocket = () => {
    const { authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authUser) {
            // 1. Connect to backend
            const socketInstance = io(`${BASE_URL}`, {
                query: {
                    userId: authUser?._id // This identifies YOU to the backend
                }
            });

            // 2. Save the socket object in Redux so other hooks can use it
            dispatch(setSocket(socketInstance));

            // 3. Listen for the 'Online Users' list from your socket.js file
            socketInstance.on('getOnlineUsers', (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            });

            // 4. Cleanup: Disconnect when the user logs out or closes the app
            return () => {
                socketInstance.close();
                dispatch(setSocket(null));
            };
        } else {
            // If there's no authUser, make sure the socket is closed
            dispatch(setSocket(null));
        }
    }, [authUser, dispatch]);
};

export default useGetSocket;