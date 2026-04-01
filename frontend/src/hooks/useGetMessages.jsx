import React, { useEffect } from 'react'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { resetUnreadCount } from '../redux/userSlice';
import { BASE_URL } from '../config';

const useGetMessages = () => {
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if(!selectedUser) return;
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser?._id}`, {
                    withCredentials: true
                });
                dispatch(setMessages(res.data));
                dispatch(resetUnreadCount(selectedUser._id));
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages();
    }, [selectedUser, dispatch])
}

export default useGetMessages
