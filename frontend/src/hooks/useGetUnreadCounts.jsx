import { useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCounts } from '../redux/userSlice';
import { BASE_URL } from '../config';

const useGetUnreadCounts = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.user);
  
    useEffect(() => {
        const fetchUnreadCounts = async () => {
            try {
                if(!authUser) return;
                const res = await axios.get(`${BASE_URL}/api/v1/message/unread`, {
                    withCredentials: true 
                });
                dispatch(setUnreadCounts(res.data));
            } catch (error) {
                console.error("Error fetching unread counts:", error);
            }
        }
        fetchUnreadCounts();
    }, [dispatch, authUser]); 
}

export default useGetUnreadCounts;
