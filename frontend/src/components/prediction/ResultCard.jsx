import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaRedo, FaLeaf } from 'react-icons/fa';
import './ResultCard.css';
const foodEmojiMap = {
  apple: '🍎',
  banana: '🍌',
  grapes: '🍇',
  orange: '🍊',
  tomato: '🍅',
  potato: '🥔',
  carrot: '🥕',
  cucumber: '🥒',
  'bell pepper': '🫑',
  mango: '🥭',
  watermelon: '🍉',
  strawberry: '🍓',
  lime: '🍋',
  pomegranate: '❤️',
  guava: '🟢',
};
const ResultCard = ({ prediction }) => {
  if (!prediction) return null;
  const { food_name, freshness, confidence } = prediction;
  // 1. Determine Emoji dynamically based on food_name
  const normalizedFoodName = food_name ? food_name.toLowerCase() : '';
  const emoji = foodEmojiMap[normalizedFoodName] || '🍽️';
  // 2. Identify UI styling states based on freshness
  const isFresh = freshness?.toLowerCase() === 'fresh';
  const badgeClass = isFresh ? 'badge-fresh' : 'badge-rotten';
  const progressClass = isFresh ? 'bg-success' : 'bg-danger';
  const iconColor = isFresh ? 'text-success' : 'text-danger';
  // Format confidence to 2 decimal places if needed
  const confidenceValue = parseFloat(confidence).toFixed(2);
  return (
    <div className="container py-4 d-flex justify-content-center w-100">
      <div className="result-card card shadow-lg border-0 p-4">
        
        {/* Food Header Section */}
        <div className="d-flex align-items-center mb-4">
          <div className="food-emoji me-3 d-flex align-items-center justify-content-center shadow-sm">
            {emoji}
          </div>
          <div>
            <h2 className="mb-1 food-name fw-bolder">{food_name || 'Unknown Item'}</h2>
            <span className={`badge rounded-pill fw-semibold ${badgeClass}`}>
              {freshness || 'Unknown'}
            </span>
          </div>
        </div>
        {/* Confidence Progress Section */}
        <div className="confidence-section mb-4">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <span className="fw-semibold text-secondary">AI Confidence</span>
            <span className="fw-bold fs-5 text-dark">{confidenceValue}%</span>
          </div>
          <div className="progress rounded-pill overflow-hidden" style={{ height: '14px' }}>
            <div 
              className={`progress-bar progress-bar-striped progress-bar-animated ${progressClass}`} 
              role="progressbar" 
              style={{ width: `${confidenceValue}%` }} 
              aria-valuenow={confidenceValue} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        {/* AI Recommendation Section */}
        <div className="recommendation-section p-3 rounded-4 mb-4 bg-light border border-light-subtle">
          <h5 className="fw-bold mb-3 d-flex align-items-center">
            <FaLeaf className={`me-2 ${iconColor}`} /> AI Recommendation
          </h5>
          {isFresh ? (
            <ul className="list-unstyled mb-0">
              <li className="mb-2 d-flex align-items-start">
                <FaCheckCircle className="text-success mt-1 me-2 flex-shrink-0" /> 
                <span className="fw-semibold text-dark">Safe for consumption</span>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <FaCheckCircle className="text-success mt-1 me-2 flex-shrink-0" /> 
                <span className="text-secondary">Food appears fresh.</span>
              </li>
              <li className="d-flex align-items-start">
                <FaCheckCircle className="text-success mt-1 me-2 flex-shrink-0" /> 
                <span className="text-secondary">Store properly for maximum freshness.</span>
              </li>
            </ul>
          ) : (
            <ul className="list-unstyled mb-0">
              <li className="mb-2 d-flex align-items-start">
                <FaExclamationTriangle className="text-danger mt-1 me-2 flex-shrink-0" /> 
                <span className="fw-bold text-danger">Not recommended for consumption</span>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <FaExclamationTriangle className="text-secondary opacity-50 mt-1 me-2 flex-shrink-0" /> 
                <span className="text-secondary">Discard if spoilage is confirmed.</span>
              </li>
              <li className="d-flex align-items-start">
                <FaExclamationTriangle className="text-secondary opacity-50 mt-1 me-2 flex-shrink-0" /> 
                <span className="text-secondary">Avoid consuming if odor or texture has changed.</span>
              </li>
            </ul>
          )}
        </div>
        {/* Action Button Section */}
        <button className="btn btn-outline-success btn-lg w-100 fw-bold d-flex align-items-center justify-content-center rounded-pill action-btn">
          <FaRedo className="me-2" /> Analyze New Image
        </button>
      </div>
    </div>
  );
};
export default ResultCard;
