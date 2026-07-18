import React from 'react';
import { 
  FaBrain, 
  FaRocket, 
  FaChartLine, 
  FaCheck, 
  FaArrowRight,
  FaShieldAlt,
  FaMicrochip
} from 'react-icons/fa';
import './Hero.css';
import heroImage from "../../assets/images/hero-food.jpg";

const Hero = () => {
  const handleScrollToUpload = () => {
    // Target the upload section if you have one, or fall back gracefully
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center mb-5 pb-lg-4">
          
          {/* Left Content Column */}
          <div className="col-lg-6 pe-lg-5 mb-5 mb-lg-0">
            <div className="animate-delay-1 mb-3">
              <span className="badge-ai">
                <FaBrain className="me-2" /> AI Powered Solution
              </span>
            </div>
            
            <h1 className="hero-title display-4 mb-4 animate-delay-2">
              Food Freshness
              <br />
              <span className="text-success">Monitoring Platform</span>
            </h1>
            
            <p className="hero-subtitle animate-delay-3">
              Harness the power of Artificial Intelligence to instantly analyze food 
              quality. Our cutting-edge vision model detects freshness with precision, 
              delivering fast, reliable, and intelligent insights to reduce waste and ensure safety.
            </p>
            
            <ul className="feature-list animate-delay-3">
              <li>
                <div className="feature-icon-wrapper">
                  <FaCheck size={14} />
                </div>
                AI-Powered Food Analysis
              </li>
              <li>
                <div className="feature-icon-wrapper">
                  <FaCheck size={14} />
                </div>
                Fast & Reliable Detection
              </li>
              <li>
                <div className="feature-icon-wrapper">
                  <FaCheck size={14} />
                </div>
                Smart Insights & Recommendations
              </li>
            </ul>

            <div className="d-flex flex-wrap gap-3 mt-5 animate-delay-4">
              <button 
                onClick={handleScrollToUpload} 
                className="btn btn-primary-custom d-flex align-items-center"
              >
                Analyze Food <FaArrowRight className="ms-2" />
              </button>
              <button className="btn btn-outline-custom">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right Image/Illustration Column */}
          <div className="col-lg-6 position-relative animate-delay-2 mt-4 mt-lg-0">
            <div className="hero-image-wrapper p-lg-3">
              
              {/* Floating Glass Card 1 */}
              <div className="glass-card floating-card-1 p-3 d-flex align-items-center shadow-sm d-none d-md-flex">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '44px', height: '44px'}}>
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Quality Assured</h6>
                  <small className="text-muted fw-semibold">High Precision AI</small>
                </div>
              </div>

              {/* Main Illustration/Image */}
              <img
                src={heroImage}
                alt="Food Freshness Monitoring"
                className="img-fluid w-100 main-hero-img"
              />

              {/* Floating Glass Card 2 */}
              <div className="glass-card floating-card-2 p-3 d-flex align-items-center shadow-sm d-none d-md-flex">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '44px', height: '44px'}}>
                  <FaChartLine size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Real-time Analysis</h6>
                  <small className="text-muted fw-semibold">Instant processing</small>
                </div>
              </div>
              
            </div>
          </div>

        </div>

        {/* Stats Row Below Hero */}
        <div className="row stats-container animate-delay-4 mt-2">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="glass-card stat-card h-100">
              <FaMicrochip className="stat-icon mb-3" />
              <h5 className="stat-title">AI Powered</h5>
              <p className="stat-desc">State-of-the-art computer vision models seamlessly analyzing visual features in the background.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="glass-card stat-card h-100">
              <FaShieldAlt className="stat-icon text-success mb-3" />
              <h5 className="stat-title">High Accuracy</h5>
              <p className="stat-desc">Built and trained to ensure reliable detection of food spoilage and optimal freshness.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-card stat-card h-100">
              <FaRocket className="stat-icon text-warning mb-3" />
              <h5 className="stat-title">Real-Time Analysis</h5>
              <p className="stat-desc">Lightning-fast inference delivers immediate, actionable results straight to your screen.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;