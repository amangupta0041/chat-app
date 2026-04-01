import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '../config';


const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  
  // Forgot Password State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onResetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!resetUsername) {
      toast.error("Please enter a username");
      return;
    }
    try {
      setIsResetting(true);
      const res = await axios.post(`${BASE_URL}/api/v1/user/reset-password`, 
        { username: resetUsername },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      setGeneratedPassword(res.data.newPassword);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  }

  const closeResetModal = () => {
    setIsModalOpen(false);
    setResetUsername("");
    setGeneratedPassword("");
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Password copied to clipboard!");
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      console.log(res);
      dispatch(setAuthUser(res.data));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      username: "",
      password: ""
    })
  }
  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Login</h1>
        <form onSubmit={onSubmitHandler} action="">

          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username' />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password' />
          </div>
          <p className='text-center my-2'>Don't have an account? <Link to="/signup"> signup </Link></p>
          <div>
            <button type="submit" className='btn btn-block btn-sm mt-2 border border-slate-700'>Login</button>
          </div>
          <p className='text-center mt-4 text-sm'>
             <button type="button" onClick={() => setIsModalOpen(true)} className='text-blue-500 hover:text-blue-400 font-medium transition-colors outline-none'>
                Forgot Password?
             </button>
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl shadow-2xl w-full max-w-sm m-4 relative">
            <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
            
            {!generatedPassword ? (
              <form onSubmit={onResetPasswordHandler}>
                <p className="text-zinc-400 text-sm mb-4">Enter your exact username to securely generate a new temporary password.</p>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full input input-bordered bg-zinc-900 border-zinc-700 text-white mb-4 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={closeResetModal}
                    className="btn bg-transparent border-zinc-600 hover:border-zinc-500 text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isResetting}
                    className="btn bg-blue-600 hover:bg-blue-500 border-none text-white"
                  >
                    {isResetting ? "Generating..." : "Generate Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-zinc-400 text-sm text-center mb-4">Password generated successfully! Please copy it and log in.</p>
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 w-full text-center mb-4 relative flex flex-col items-center">
                  <p className="font-mono text-2xl font-bold text-green-400 select-all tracking-wider mb-3">{generatedPassword}</p>
                  <button 
                    onClick={handleCopyPassword}
                    className="btn btn-sm bg-green-600 hover:bg-green-500 text-white border-none shadow-md px-6"
                  >
                    Copy Password
                  </button>
                </div>
                <button 
                  onClick={closeResetModal}
                  className="btn w-full bg-blue-600 hover:bg-blue-500 border-none text-white mt-2"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login