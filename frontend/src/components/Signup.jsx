import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '../config';
import { BiUser, BiLock, BiShow, BiHide, BiIdCard } from 'react-icons/bi';
import { IoChatbubblesOutline } from 'react-icons/io5';

const Signup = () => {
  const [user, setUser] = useState({ fullName: "", username: "", password: "", confirmPassword: "", gender: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckbox = (gender) => setUser({ ...user, gender });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user.gender) { toast.error("Please select a gender"); return; }
    if (user.password !== user.confirmPassword) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      });
      if (res.data.success) { navigate("/login"); toast.success(res.data.message); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
      setUser({ fullName: "", username: "", password: "", confirmPassword: "", gender: "" });
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px 10px 38px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px', color: '#f0fdf4',
    fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: '600',
    letterSpacing: '0.06em', color: 'rgba(187, 247, 208, 0.6)',
    marginBottom: '6px', textTransform: 'uppercase'
  };
  const iconStyle = {
    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
    width: '16px', height: '16px', color: 'rgba(74, 222, 128, 0.6)'
  };
  const onFocus = e => { e.target.style.borderColor = 'rgba(74, 222, 128, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.08)'; };
  const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; };

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
        <div style={{ padding: '32px 32px 28px' }}>

          {/* Branding */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 12px',
              background: 'rgba(74, 222, 128, 0.18)',
              border: '1px solid rgba(74, 222, 128, 0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IoChatbubblesOutline style={{ width: '26px', height: '26px', color: '#4ade80' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f0fdf4', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Create account
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(220, 252, 231, 0.5)', margin: 0 }}>
              Join and start chatting
            </p>
          </div>

          <form onSubmit={onSubmitHandler}>

            {/* Full Name */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <BiIdCard style={iconStyle} />
                <input value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  type="text" placeholder="Your full name" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <BiUser style={iconStyle} />
                <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
                  type="text" placeholder="Choose a username" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <BiLock style={iconStyle} />
                <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
                  type={showPassword ? "text" : "password"} placeholder="Create a password" required
                  style={{ ...inputStyle, paddingRight: '40px' }} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                  {showPassword ? <BiHide style={{ width: '16px', height: '16px' }} /> : <BiShow style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <BiLock style={iconStyle} />
                <input value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                  type={showConfirm ? "text" : "password"} placeholder="Confirm your password" required
                  style={{ ...inputStyle, paddingRight: '40px' }} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                  {showConfirm ? <BiHide style={{ width: '16px', height: '16px' }} /> : <BiShow style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gender</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['male', 'female'].map((g) => (
                  <button key={g} type="button" onClick={() => handleCheckbox(g)}
                    style={{
                      padding: '9px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '500',
                      cursor: 'pointer', transition: 'all 0.18s ease', textTransform: 'capitalize',
                      background: user.gender === g ? 'rgba(74, 222, 128, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: user.gender === g ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: user.gender === g ? '#4ade80' : 'rgba(255,255,255,0.45)',
                      boxShadow: user.gender === g ? '0 0 12px rgba(74, 222, 128, 0.12)' : 'none',
                    }}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
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
                transition: 'all 0.18s ease', letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(22, 163, 74, 0.35)'; }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(220, 252, 231, 0.45)', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#86efac', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup