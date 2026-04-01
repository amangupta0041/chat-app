import { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                // FIXED: Using BASE_URL for dynamic switching
                const res = await axios.get(`${BASE_URL}/api/v1/user/`, {
                    withCredentials: true 
                });
                
                // console.log("Users fetched successfully:", res.data);
                
                // Dispatching the data to your Redux store
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                // This is where you were seeing the 401 error in the console
                console.error("Error fetching other users:", error);
            }
        }
        fetchOtherUsers();
    }, [dispatch]); // Added dispatch to the dependency array for best practice
}

export default useGetOtherUsers;