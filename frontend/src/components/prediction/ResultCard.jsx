import React from "react";
import { generatePDF } from "../../utils/pdfGenerator";
import { FaFilePdf } from "react-icons/fa";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaLeaf,
  FaClock,
  FaWarehouse,
  FaShieldAlt,
  FaBrain,
  FaInfoCircle,
} from "react-icons/fa";

import "./ResultCard.css";

const foodEmojiMap = {
  apple: "🍎",
  banana: "🍌",
  grapes: "🍇",
  orange: "🍊",
  tomato: "🍅",
  potato: "🥔",
  carrot: "🥕",
  cucumber: "🥒",
  "bell pepper": "🫑",
  mango: "🥭",
  watermelon: "🍉",
  strawberry: "🍓",
  lime: "🍋",
  pomegranate: "❤️",
  guava: "🥝",
  "bitter gourd": "🥒",
  kaki: "🟠",
  jujube: "🍏",
};

const ResultCard = ({ prediction, uploadedImage, onReset }) => {

  if (!prediction) return null;

  const {
    food_name,
    freshness,
    confidence,
    shelf_life,
    storage,
    recommendation,
    risk_level,
  } = prediction;
  
  const handleDownload = () => {
    generatePredictionPDF(prediction);
  };

  const emoji =
    foodEmojiMap[food_name?.toLowerCase()] || "🍽️";

  const isFresh =
    freshness?.toLowerCase() === "fresh";

  const confidenceValue = Number(confidence).toFixed(2);

  let confidenceLabel = "Low Confidence";

  if (confidenceValue >= 95)
    confidenceLabel = "Excellent Prediction";
  else if (confidenceValue >= 85)
    confidenceLabel = "High Confidence";
  else if (confidenceValue >= 70)
    confidenceLabel = "Moderate Confidence";

  return (
    <section id="result-section" className="result-wrapper">

      <div className="result-card">

        {/* HEADER */}

        <div className="result-header">

          <div
            className={`emoji-ring ${
              isFresh ? "ring-fresh" : "ring-rotten"
            }`}
          >
            <div className="food-emoji">{emoji}</div>
          </div>

          <div className="header-content">

            <h2>{food_name}</h2>

            <div className="header-row">

              <span
                className={`status-badge ${
                  isFresh ? "fresh" : "rotten"
                }`}
              >
                {freshness}
              </span>

              <div className="confidence-chip">

                <FaBrain />

                <span>{confidenceValue}%</span>

              </div>

            </div>

          </div>

        </div>

        {/* CONFIDENCE */}

        <div className="section-block">

          <div className="section-title-row">

            <span>AI Confidence</span>

            <strong>{confidenceValue}%</strong>

          </div>

          <div className="confidence-bar">

            <div
              className={`confidence-fill ${
                isFresh
                  ? "fill-fresh"
                  : "fill-rotten"
              }`}
              style={{
                "--progress": `${confidenceValue}%`,
              }}
            />

          </div>

          <div className="confidence-status">

            {confidenceLabel}

          </div>

        </div>

        {/* INSIGHTS */}

        <div className="insights-grid">

          <div className="insight-card">

            <div className="insight-icon green">

              <FaClock />

            </div>

            <div>

              <small>Shelf Life</small>

              <h4>{shelf_life}</h4>

            </div>

          </div>

          <div className="insight-card">

            <div className="insight-icon blue">

              <FaWarehouse />

            </div>

            <div>

              <small>Storage</small>

              <h4>{storage}</h4>

            </div>

          </div>

          <div className="insight-card full-width">

            <div
              className={`insight-icon ${
                isFresh ? "green" : "red"
              }`}
            >
              <FaShieldAlt />
            </div>

            <div>

              <small>Risk Level</small>

              <h4
                className={
                  risk_level === "Low"
                    ? "risk-low"
                    : risk_level === "Medium"
                    ? "risk-medium"
                    : "risk-high"
                }
              >
                {risk_level === "Low" && "🟢 Low Risk"}

                {risk_level === "Medium" &&
                  "🟠 Medium Risk"}

                {risk_level === "High" &&
                  "🔴 High Risk"}
              </h4>

            </div>

          </div>

        </div>

        {/* RECOMMENDATION */}

        <div className="recommendation-box">

          <div className="recommendation-title">

            <FaLeaf
              className={
                isFresh
                  ? "text-green"
                  : "text-red"
              }
            />

            <span>AI Recommendation</span>

          </div>

          <ul>

            <li>

              {isFresh ? (
                <FaCheckCircle className="text-green" />
              ) : (
                <FaExclamationTriangle className="text-red" />
              )}

              <span>{recommendation}</span>

            </li>

            {isFresh ? (
              <>
                <li>

                  <FaCheckCircle className="text-green" />

                  Safe for consumption

                </li>

                <li>

                  <FaCheckCircle className="text-green" />

                  Store properly to maximize freshness.

                </li>
              </>
            ) : (
              <>
                <li>

                  <FaExclamationTriangle className="text-red" />

                  Avoid consuming spoiled food.

                </li>

                <li>

                  <FaExclamationTriangle className="text-red" />

                  Dispose safely if spoilage is confirmed.

                </li>
              </>
            )}

          </ul>

        </div>

        {/* DISCLAIMER */}

        <div className="result-disclaimer">

          <FaInfoCircle />

          <span>

            Prediction generated using AI computer vision.

            Always inspect food manually before consumption.

          </span>

        </div>

        {/* ACTION BUTTONS */}

      <div className="result-actions">

        <button
          className="secondary-btn"
          onClick={() => generatePDF(prediction, uploadedImage)}
        >
          📄 Download AI Report
        </button>
        <button
          className="primary-btn"
          onClick={onReset}
        >
          <FaRedo className="me-2" />
          Analyze Another Image
        </button>

      </div>

      </div>

    </section>
  );
}

export default ResultCard;