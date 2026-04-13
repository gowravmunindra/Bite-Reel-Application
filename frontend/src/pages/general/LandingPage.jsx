import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar overlay */}
      <motion.nav
        className="landing-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-brand">Bite Reel</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#partners">Partners</a>
          <Link to="/user/login" className="nav-btn-outline">Login</Link>
          <Link to="/user/register" className="nav-btn-solid">Sign Up</Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <img src="/hero-bg.png" alt="Bite Reel Hero" className="hero-bg-img" />

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUpVariant} className="hero-title">
            Welcome to <span>Bite Reel</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="hero-subtitle">
            Experience the world's most delicious cuisines through engaging, short-form food videos from top creators and culinary partners.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="hero-actions">
            <Link to="/user/login" className="btn-primary">Get Started</Link>
            <a href="#about" className="btn-secondary">Learn More</a>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <motion.div
          className="about-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div className="about-text" variants={fadeUpVariant}>
            <h2>About The Application</h2>
            <p>
              Bite Reel is an immersive platform bridging the gap between food enthusiasts and culinary creators.
              Scroll through endless streams of high-quality food reels, like your favorites, and save recipes to try later.
              Using dynamic intersection observers, Bite Reel automatically plays stunning food videography right as it swipes into view!
            </p>
          </motion.div>

          <motion.div className="developer-details" variants={fadeUpVariant}>
            <div className="dev-card">
              <div className="dev-icon">👨‍💻</div>
              <h3>Developer Info</h3>
              <p>Designed and built entirely as a showcase of modern full-stack web development. The architecture utilizes a robust Node.js Express backend matched with a blazing-fast React + Vite frontend.</p>
              <div className="dev-tags">
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
                <span>Framer Motion</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Food Partners Testimonials Section */}
      <section id="partners" className="partners-section">
        <motion.div
          className="partners-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
        >
          <h2>Trusted by Top Food Partners</h2>
          <p>See what leading restaurants and culinary creators are saying about Bite Reel.</p>
          <p style={{ fontSize: '12px', color: '#666' }}>(Note: This is a demo application and does not have real food partners.)</p>
        </motion.div>

        <motion.div
          className="testimonials-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {[
            {
              name: "Chef Mario",
              business: "Bella Napoli Pizzeria",
              quote: "Since posting our pizza toss reels on Bite Reel, our foot traffic has increased by 40%. The app is visually stunning and incredibly engaging!",
              delay: 0.2
            },
            {
              name: "Sarah Jenkins",
              business: "Sweet Tooth Bakery",
              quote: "Bite Reel allows my pastries to look as good as they taste. The vertical video format perfectly showcases the details of my cake decorating process.",
              delay: 0.4
            },
            {
              name: "Takeshi Sato",
              business: "Tokyo Sushi Bar",
              quote: "A perfect platform for culinary artists. Managing my food partner profile and interacting with my local audience is seamless and rewarding.",
              delay: 0.6
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="testimonial-card"
              variants={fadeUpVariant}
            >
              <div className="quote-mark">"</div>
              <p className="quote-text">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.business}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Bite Reel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
