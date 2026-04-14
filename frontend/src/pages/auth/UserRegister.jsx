import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("https://bite-reel-backend.onrender.com/api/auth/user/register",{
          fullName: firstName + " " + lastName,
          email,
          password
        },{
          withCredentials: true
        });

      toast.success(response.data.message || "Registration successful!");
      navigate('/feed');
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
        <h1 className="auth-title">User Registration</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
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
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/user/login">Login here</Link>
        </div>
        <div className="auth-type-switch">
          <Link to="/user/register" className="active">Register as User</Link>
          <Link to="/food-partner/register">Register as Partner</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;