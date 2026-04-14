import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const PartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    try {
      const response = await axios.post("https://bite-reel-backend.onrender.com/api/auth/food-partner/register",{
          name,
          contactName,
          email,
          phone,
          password,
          address
      },{
        withCredentials: true
      })
      toast.success(response.data.message || "Partner registration successful!");
      navigate('/create-food');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during registration.");
      }
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Partner Registration</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter business name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <input
              type="text"
              name="contactName"
              className="form-input"
              placeholder="Enter contact name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter business email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Enter contact number"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Enter your address"
            />
          </div>
          <button type="submit" className="auth-button">
            Register as Partner
          </button>
        </form>
        <div className="auth-link">
          Already have a partner account? <Link to="/food-partner/login">Login here</Link>
        </div>
        <div className="auth-type-switch">
          <Link to="/user/register">Register as User</Link>
          <Link to="/food-partner/register" className="active">Register as Partner</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;