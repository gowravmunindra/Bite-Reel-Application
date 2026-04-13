import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/video-interactions.css';
import '../../styles/reels.css';
import Reel from '../../components/Reel';

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/food/save', { withCredentials: true })
      .then((response) => {
        const savedFoods = response.data.savedFoods.map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          likeCount: item.food.likeCount,
          saveCount: item.food.saveCount,
          description: item.food.description,
          foodPartner: item.food.foodPartner,
        }));

        setSavedVideos(savedFoods);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/user/login');
        } else {
          console.error('Error fetching saved foods:', error);
        }
      });
  }, [navigate]);

  // IntersectionObserver to play/pause videos as they become visible — same behavior as Home
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.reel-item'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.id;
        const video = videoRefs.current.get(id);
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { root: container, threshold: [0.5, 0.6, 0.75] });

    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, [savedVideos]);

  return (
    <>
      <div className="saved-container">
        {savedVideos.length === 0 ? (
          <p style={{ padding: 20 }}>No saved videos yet.</p>
        ) : (
          <div className="reels-container" ref={containerRef}>
            {savedVideos.map((item) => (
              <Reel
                key={item._id}
                item={{
                  _id: item._id,
                  video: item.video,
                  poster: item.poster,
                  description: item.description || item.name,
                  likeCount: item.likeCount || 0,
                  saveCount: item.saveCount || 0,
                  foodPartner: item.foodPartner,
                  initialLiked: false,
                  initialSaved: true,
                }}
                setVideoRef={(el) => {
                  if (el) videoRefs.current.set(item._id, el);
                  else videoRefs.current.delete(item._id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <Link to="/feed" className={`bottom-nav-item ${location.pathname === '/feed' ? 'active' : ''}`}>
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span className="bottom-nav-label">Home</span>
        </Link>

        <Link to="/saved" className={`bottom-nav-item ${location.pathname === '/saved' ? 'active' : ''}`}>
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span className="bottom-nav-label">Saved</span>
        </Link>

        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }} 
          className="bottom-nav-item" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <svg className="bottom-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="bottom-nav-label">Logout</span>
        </button>
      </nav>
    </>
  );
};

export default SavedVideos;
