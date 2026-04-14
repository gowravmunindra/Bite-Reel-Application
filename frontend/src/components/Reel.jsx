import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Reel = ({ item, setVideoRef }) => {
  const [liked, setLiked] = useState(!!item.initialLiked)
  const [saved, setSaved] = useState(!!item.initialSaved)
  const [likesCount, setLikesCount] = useState(item.likeCount ?? (item.likes?.length ?? 0))
  const [savesCount, setSavesCount] = useState(item.saveCount ?? (item.saves?.length ?? 0))

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `https://bite-reel-backend.onrender.com/api/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.like) {
        setLikesCount(prev => Math.max(0, (prev ?? 0) + 1));
      } else {
        setLikesCount(prev => Math.max(0, (prev ?? 0) - 1));
      }
      setLiked(prev => !prev);
    } catch (err) {
      console.error('like error', err);
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `https://bite-reel-backend.onrender.com/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.save) {
        setSavesCount(prev => Math.max(0, (prev ?? 0) + 1));
      } else {
        setSavesCount(prev => Math.max(0, (prev ?? 0) - 1));
      }
      setSaved(prev => !prev);
    } catch (err) {
      console.error('save error', err);
    }
  }

  return (
    <div className="reel-item" data-id={item._id}>
      <video
        className="reel-video"
        ref={(el) => {
          if (typeof setVideoRef === 'function') setVideoRef(el)
        }}
        src={item.video}
        poster={item.poster}
        playsInline
        muted
        loop
        autoPlay
        preload="auto"
      />

      <div className="reel-overlay">
        <div className="reel-description">{item.description}</div>
        {item.foodPartner && (
          <Link className="reel-visit" to={`/food-partner/${item.foodPartner._id || item.foodPartner}`}>
            Visit {item.foodPartner.name ? item.foodPartner.name : 'Store'}
          </Link>
        )}
      </div>

      <div className="reel-interactions">
        <div>
          <button className={`reel-interaction-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <div className="reel-interaction-count">{likesCount}</div>
        </div>

        <div>
          <button className={`reel-interaction-btn ${saved ? 'active' : ''}`} onClick={handleSave}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <div className="reel-interaction-count">{savesCount}</div>
        </div>

        {/* Comments removed - feature disabled */}
      </div>
    </div>
  )
}

export default Reel
