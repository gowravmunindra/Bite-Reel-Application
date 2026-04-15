import React, { useState } from 'react';
import '../../styles/create-food.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BACKEND_URL = 'https://bite-reel-backend.onrender.com';
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

const CreateFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null
  });
  const [videoPreview, setVideoPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.video) {
      toast.error('Please select a video file.');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Get short-lived ImageKit auth params from our backend
      const authRes = await axios.get(`${BACKEND_URL}/api/food/imagekit-auth`, {
        withCredentials: true
      });
      const { token, expire, signature } = authRes.data;

      // Step 2: Upload video directly from the browser to ImageKit
      const ikFormData = new FormData();
      ikFormData.append('file', formData.video);
      ikFormData.append('fileName', `${Date.now()}_${formData.video.name}`);
      ikFormData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      ikFormData.append('signature', signature);
      ikFormData.append('expire', expire);
      ikFormData.append('token', token);

      const uploadRes = await axios.post(IMAGEKIT_UPLOAD_URL, ikFormData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      const videoUrl = uploadRes.data.url;

      // Step 3: Save food item (only text + URL) to our backend
      const response = await axios.post(`${BACKEND_URL}/api/food`, {
        name: formData.name,
        description: formData.description,
        videoUrl
      }, {
        withCredentials: true
      });

      console.log(response.data);
      toast.success('Food item created successfully!');

      const partnerId = localStorage.getItem('partnerId');
      if (partnerId) {
        navigate(`/food-partner/${partnerId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to create food item.';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="cf-container">
      <div className="cf-card">
        <h1 className="cf-title">Create Food Item</h1>
        <form className="cf-form" onSubmit={handleSubmit}>
          <div className="cf-form-group">
            <label className="cf-form-label" htmlFor="name">Food Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="cf-form-input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="cf-form-group">
            <label className="cf-form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="cf-form-input cf-form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your food item"
              required
            />
          </div>

          <div className="cf-form-group">
            <label className="cf-form-label" htmlFor="video">Video</label>
            <div className="cf-upload-container">
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                className="cf-form-file"
                onChange={handleVideoChange}
                required
              />
              <div className="cf-upload-area">
                <svg className="cf-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="cf-upload-text">
                  {formData.video ? 'Change video' : 'Upload your video'}
                </span>
                <span className="cf-upload-hint">
                  Click or drag &amp; drop your video here
                </span>
                <div className={`cf-upload-progress ${formData.video ? 'active' : ''}`}>
                  <div 
                    className="cf-progress-bar" 
                    style={{ width: isUploading ? `${uploadProgress}%` : formData.video ? '100%' : '0%' }}
                  />
                </div>
                {isUploading && (
                  <span className="cf-upload-hint" style={{ marginTop: '8px', color: '#4ecdc4' }}>
                    Uploading... {uploadProgress}%
                  </span>
                )}
              </div>
            </div>
            {videoPreview && (
              <div className="cf-preview-container">
                <video
                  src={videoPreview}
                  className="cf-video-preview"
                  controls
                  muted
                  playsInline
                />
                <button 
                  type="button" 
                  className="cf-remove-video" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, video: null }));
                    setVideoPreview('');
                    setUploadProgress(0);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="cf-submit-btn" disabled={isUploading}>
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Create Food Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;