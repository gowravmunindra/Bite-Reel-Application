import React, { useState, useEffect } from 'react';
import "../../styles/Profile.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Stat = ({ label, value }) => (
  <div className="pp-stat">
    <div className="pp-stat-label">{label}</div>
    <div className="pp-stat-value">{value}</div>
  </div>
);

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("Food Partner ID from URL:", id);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', contactName: '', phone: '', address: '', profileImage: null });
  const [imagePreview, setImagePreview] = useState(null);
  const isOwner = localStorage.getItem('partnerId') === id;

  useEffect(() => {
    axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
      .then(response => {
        const partner = response.data.foodPartner;
        setProfile(partner);
        setVideos(partner.foodItems);
        setEditData({
          name: partner.name || '',
          contactName: partner.contactName || '',
          phone: partner.phone || '',
          address: partner.address || '',
          profileImage: null
        });
      })
  }, [id])

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`http://localhost:3000/api/food/${videoId}`, { withCredentials: true });
      setVideos(videos.filter(v => v._id !== videoId));
      toast.success("Food item deleted successfully");
    } catch (err) {
      toast.error("Failed to delete food item");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('contactName', editData.contactName);
      formData.append('phone', editData.phone);
      formData.append('address', editData.address);
      if (editData.profileImage) {
        formData.append('profileImage', editData.profileImage);
      }

      const response = await axios.put(`http://localhost:3000/api/food-partner/update`, formData, { withCredentials: true });
      setProfile(response.data.foodPartner);
      setShowModal(false);
      setImagePreview(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('partnerId');
    // Also instruct the server to clear cookies if an endpoint exists, or just redirect
    navigate('/');
    toast.success("Logged out successfully");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pp-root">
      <div className="pp-card">
        <div className="pp-header">
          <div aria-hidden="true" style={{ position: 'relative' }}>
            <img
              className="pp-avatar"
              src={profile?.profileImage || "https://images.unsplash.com/photo-1760883956955-31d8adb4e6d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600"}
              onClick={() => { if (isOwner) setShowModal(true); }}
              title={isOwner ? "Click to update profile" : ""}
              style={{ cursor: isOwner ? 'pointer' : 'default', objectFit: 'cover' }}
            />
          </div>
          <div className="pp-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <h1 className="pp-partner-name">{profile?.name}</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleBack}
                  style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--text-main)', borderRadius: '5px', cursor: 'pointer', transition: 'var(--transition-speed)' }}>
                  Back
                </button>
                {isOwner && (
                  <button
                    onClick={handleLogout}
                    style={{ padding: '6px 12px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '5px', cursor: 'pointer', transition: 'var(--transition-speed)', fontWeight: 'bold' }}>
                    Logout
                  </button>
                )}
              </div>
            </div>

            <div className="pp-stats-row" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Stat label="Contact Person" value={profile?.contactName || "N/A"} />
              <Stat label="Phone" value={profile?.phone || "N/A"} />
              <Stat label="Location" value={profile?.address || "N/A"} />
            </div>

            {isOwner && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => navigate('/create-food')}
                  style={{ padding: '10px 20px', backgroundColor: 'var(--cta)', color: '#001219', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'var(--transition-speed)' }}>
                  Create Food Item
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className="pp-sep" />

        <div className="pp-grid">
          {videos.map((video, i) => (
            <div key={i} className="pp-grid-item" style={{ position: 'relative' }}>
              <div className="pp-video-placeholder">
                <video
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  src={video?.video} muted loop controls>
                </video>
              </div>
              <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#2a2a2a', color: 'white', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', fontWeight: 'bold' }}>
                {video?.name || "Untitled Food"}
              </div>
              {isOwner && (
                <button
                  onClick={() => handleDelete(video._id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', zIndex: 10, transition: 'var(--transition-speed)' }}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,18,25,0.85)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', color: 'white', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', boxShadow: 'var(--shadow-soft)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'transparent', color: 'white', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ textAlign: 'center', marginBottom: '10px', marginTop: 0, color: 'var(--text-main)' }}>Update Profile</h2>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
              <img
                src={imagePreview || profile?.profileImage || "https://images.unsplash.com/photo-1760883956955-31d8adb4e6d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600"}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
              />
              <label style={{ cursor: 'pointer', backgroundColor: 'var(--primary)', color: '#001219', padding: '8px 12px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Upload New Picture
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditData({ ...editData, profileImage: file });
                    setImagePreview(URL.createObjectURL(file));
                  }
                }} />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Partner Name" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ padding: '12px', borderRadius: '5px', border: '1px solid var(--primary)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
              <input type="text" placeholder="Contact Person" value={editData.contactName} onChange={e => setEditData({ ...editData, contactName: e.target.value })} style={{ padding: '12px', borderRadius: '5px', border: '1px solid var(--primary)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
              <input type="text" placeholder="Phone Number" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} style={{ padding: '12px', borderRadius: '5px', border: '1px solid var(--primary)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
              <input type="text" placeholder="Location/Address" value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })} style={{ padding: '12px', borderRadius: '5px', border: '1px solid var(--primary)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
            </div>

            <button onClick={handleUpdateProfile} style={{ padding: '12px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#001219', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '16px', transition: 'var(--transition-speed)' }}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
