import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserLogin = () => {
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
      e.preventDefault();

      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const response = await axios.post("https://bite-reel-backend.onrender.com/api/auth/user/login",{
            email,
            password
        },{
          withCredentials: true
        })

        toast.success(response.data.message || "Login successful!");
        navigate("/feed")
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred during login.");
        }
      }
    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">User Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/user/register">Register here</Link>
        </div>
        <div className="auth-type-switch">
          <Link to="/user/login" className="active">Login as User</Link>
          <Link to="/food-partner/login">Login as Partner</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;