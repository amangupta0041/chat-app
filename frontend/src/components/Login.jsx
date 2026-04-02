import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '../config';
import { BiUser, BiLock, BiShow, BiHide, BiCopy } from 'react-icons/bi';
import { IoChatbubblesOutline } from 'react-icons/io5';

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onResetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!resetUsername) { toast.error("Please enter a username"); return; }
    try {
      setIsResetting(true);
      const res = await axios.post(`${BASE_URL}/api/v1/user/reset-password`,
        { username: resetUsername },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setGeneratedPassword(res.data.newPassword);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally { setIsResetting(false); }
  }

  const closeResetModal = () => { setIsModalOpen(false); setResetUsername(""); setGeneratedPassword(""); }
  const handleCopyPassword = () => { navigator.clipboard.writeText(generatedPassword); toast.success("Copied!"); }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      });
      dispatch(setAuthUser(res.data));
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally { setLoading(false); setUser({ username: "", password: "" }); }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div style={{
        background: 'rgba(8, 20, 10, 0.58)',
        backdropFilter: 'blur(28px) saturate(150%)',
        WebkitBackdropFilter: 'blur(28px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.13)',
        borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
        <div style={{ padding: '36px 32px 32px' }}>

          {/* Branding */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 14px',
              background: 'rgba(74, 222, 128, 0.18)',
              border: '1px solid rgba(74, 222, 128, 0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IoChatbubblesOutline style={{ width: '26px', height: '26px', color: '#4ade80' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f0fdf4', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(220, 252, 231, 0.5)', margin: 0 }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={onSubmitHandler}>

            {/* Username */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.06em', color: 'rgba(187, 247, 208, 0.6)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <BiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(74, 222, 128, 0.6)' }} />
                <input
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  type="text" placeholder="Your username" required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 12px 10px 38px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px', color: '#f0fdf4',
                    fontSize: '0.875rem', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.06em', color: 'rgba(187, 247, 208, 0.6)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <BiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(74, 222, 128, 0.6)' }} />
                <input
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  type={showPassword ? "text" : "password"} placeholder="Your password" required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 40px 10px 38px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px', color: '#f0fdf4',
                    fontSize: '0.875rem', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                  {showPassword ? <BiHide style={{ width: '16px', height: '16px' }} /> : <BiShow style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button type="button" onClick={() => setIsModalOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'rgba(134, 239, 172, 0.75)', fontWeight: '500', padding: 0 }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px',
                background: loading ? 'rgba(34, 197, 94, 0.35)' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontWeight: '600', fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.18s ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(22, 163, 74, 0.35)'; }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(220, 252, 231, 0.45)', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#86efac', fontWeight: '600', textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
          <div style={{
            width: '100%', maxWidth: '340px', borderRadius: '16px',
            background: 'rgba(8, 20, 10, 0.90)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f0fdf4', margin: '0 0 4px' }}>Reset Password</h2>
              {!generatedPassword ? (
                <form onSubmit={onResetPasswordHandler}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(220,252,231,0.45)', margin: '0 0 16px' }}>
                    Enter your username to get a temporary password.
                  </p>
                  <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <BiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(74,222,128,0.6)' }} />
                    <input type="text" placeholder="Username" value={resetUsername} onChange={(e) => setResetUsername(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f0fdf4', fontSize: '0.85rem', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={closeResetModal} style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={isResetting} style={{ flex: 1, padding: '9px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '9px', color: 'white', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                      {isResetting ? 'Generating…' : 'Generate'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(220,252,231,0.45)', margin: 0, textAlign: 'center' }}>Copy your temporary password below.</p>
                  <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: '700', color: '#4ade80', letterSpacing: '0.1em', margin: '0 0 10px' }}>{generatedPassword}</p>
                    <button onClick={handleCopyPassword} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '7px', color: '#4ade80', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <BiCopy style={{ width: '14px', height: '14px' }} /> Copy
                    </button>
                  </div>
                  <button onClick={closeResetModal} style={{ padding: '9px', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none', borderRadius: '9px', color: 'white', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login