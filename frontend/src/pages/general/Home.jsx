import React, { useEffect, useRef, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Reel from '../../components/Reel'

// Simple demo data; replace with API results when ready

const Home = () => {
  const [videos, setVideos] = useState([])
  const [interactions, setInteractions] = useState({})
  const videoRefs = useRef(new Map())
  const containerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch videos from backend (uncomment when API is ready)
  useEffect(() => {
    let mounted = true
    axios.get('http://localhost:3000/api/food', {withCredentials: true})
      .then(response => {
        if (mounted) {
          const foodItems = response.data.foodItems;
          setVideos(foodItems);
          // Initialize interactions state
          const initialInteractions = {};
          foodItems.forEach(item => {
            initialInteractions[item._id] = {
              liked: item.likes?.includes(item.currentUser),
              saved: item.saves?.includes(item.currentUser)
            };
          });
          setInteractions(initialInteractions);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/user/login');
        } else {
          console.error('Error fetching foods:', error);
        }
      })
    return () => { mounted = false }
  }, [navigate])

  async function likeVideo(item) {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/food/like`,
        { foodId: item._id},
        { withCredentials: true }
      );

      if(response.data.like){
        setVideos((prev) => prev.map((v) => v._id === item._id ? {
          ...v,
          likeCount: (v.likeCount ?? 0) + 1
        } : v));
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? {
          ...v,
          likeCount: Math.max(0, (v.likeCount ?? 0) - 1)
        } : v));
      }
      
      setInteractions(prev => ({
        ...prev,
        [item._id]: {
          ...prev[item._id],
          liked: !prev[item._id]?.liked
        }
      }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/user/login');
      } else {
        console.error('Error liking video:', error);
      }
    }
  };

  async function saveVideo(item){
    try {
      const response = await axios.post(
        `http://localhost:3000/api/food/save`,
        { foodId: item._id},
        { withCredentials: true }
      );
      
      if(response.data.save){
        setVideos((prev) => prev.map((v) => v._id === item._id ? {
          ...v,
          saveCount: (v.saveCount ?? 0) + 1
        } : v));
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? {
          ...v,
          saveCount: Math.max(0, (v.saveCount ?? 0) - 1)
        } : v));  
      }
      
      setInteractions(prev => ({
        ...prev,
        [item._id]: {
          ...prev[item._id],
          saved: !prev[item._id]?.saved
        }
      }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/user/login');
      } else {
        console.error('Error saving video:', error);
      }
    }
  }

  // Simple IntersectionObserver that watches each reel item and plays/pauses the associated video
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll('.reel-item'))

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.id
        const video = videoRefs.current.get(id)
        if (!video) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    }, { root: container, threshold: [0.5, 0.6, 0.75] })

    items.forEach((it) => io.observe(it))
    return () => io.disconnect()
  }, [videos])

  return (
    <>
      <div className="reels-container" ref={containerRef}>
        {videos.map((item) => (
          <Reel
            key={item._id}
            item={{
              ...item,
              likeCount: item.likeCount ?? item.likes?.length ?? 0,
              saveCount: item.saveCount ?? item.saves?.length ?? 0,
              initialLiked: interactions[item._id]?.liked,
              initialSaved: interactions[item._id]?.saved,
            }}
            setVideoRef={(el) => {
              if (el) videoRefs.current.set(item._id, el)
              else videoRefs.current.delete(item._id)
            }}
          />
        ))}
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
  )
}

export default Home