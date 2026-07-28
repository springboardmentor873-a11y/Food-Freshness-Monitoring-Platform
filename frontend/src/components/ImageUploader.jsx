import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, RefreshCw, Scan, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onImageSelected, isAnalyzing, selectedPreview }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access failed or unavailable: " + err.message);
      setShowWebcam(false);
    }
  };

  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 400;
      canvas.height = videoRef.current.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      // Stop video stream
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowWebcam(false);

      // Convert to blob file
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          onImageSelected(file, dataUrl);
        });
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div className="section-header">
        <h2>
          <Scan size={22} color="var(--fresh-green)" />
          Food Image Scanner
        </h2>
        <p>Upload or capture a food item image for AI freshness classification & shelf-life prediction.</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {showWebcam ? (
        <div className="preview-container" style={{ flexDirection: 'column' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          <div style={{ padding: '12px', display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={captureCamera}>Take Snapshot</button>
            <button className="btn-secondary" onClick={() => setShowWebcam(false)}>Cancel</button>
          </div>
        </div>
      ) : selectedPreview ? (
        <div className="preview-container">
          <img src={selectedPreview} alt="Food scan preview" className="preview-img" />
          
          {isAnalyzing && (
            <>
              <div className="scanner-line"></div>
              <div className="scan-overlay">
                <div className="scan-badge">
                  <RefreshCw className="spin" size={16} />
                  ANALYZING FRESHNESS...
                </div>
              </div>
            </>
          )}

          <button
            className="btn-secondary"
            onClick={() => fileInputRef.current.click()}
            style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)' }}
          >
            Change Image
          </button>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <div className="upload-icon-wrapper">
            <UploadCloud size={32} />
          </div>
          <div className="dropzone-title">Drag & drop your food image here</div>
          <div className="dropzone-subtitle">Supports JPG, PNG, WEBP files up to 10MB</div>

          <div className="btn-group" onClick={(e) => e.stopPropagation()}>
            <button className="btn-primary" onClick={() => fileInputRef.current.click()}>
              <ImageIcon size={18} />
              Browse Image
            </button>
            <button className="btn-secondary" onClick={startCamera}>
              <Camera size={18} />
              Use Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
