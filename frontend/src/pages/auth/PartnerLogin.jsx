import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async(e) =>{
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/login",{
        email,
        password
      },{
        withCredentials: true
      })
      toast.success(response.data.message || "Partner login successful!");
      localStorage.setItem('partnerId', response.data.foodPartner.id);
      navigate(`/food-partner/${response.data.foodPartner.id}`);
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
        <h1 className="auth-title">Partner Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="Enter your business email"
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
            Login as Partner
          </button>
        </form>
        <div className="auth-link">
          Don't have a partner account? <Link to="/food-partner/register">Register here</Link>
        </div>
        <div className="auth-type-switch">
          <Link to="/user/login">Login as User</Link>
          <Link to="/food-partner/login" className="active">Login as Partner</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;