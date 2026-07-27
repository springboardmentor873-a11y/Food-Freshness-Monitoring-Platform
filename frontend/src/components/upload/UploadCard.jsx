import { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaTrashAlt,
  FaImage,
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";

import "./UploadCard.css";
import api from "../../services/api";

function UploadCard({ setPrediction, setUploadedImage }){
  const inputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage.file);

    try {
      setLoading(true);

      const response = await api.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPrediction(response.data);

      setTimeout(() => {
        document
          .getElementById("result-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);

    } catch (error) {
      console.log(error);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return alert("Only image files are allowed.");
    }

    if (file.size > 10 * 1024 * 1024) {
      return alert("Maximum size is 10 MB.");
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageBase64 = reader.result;

      setSelectedImage({
        file,
        preview: imageBase64,
      });

      setUploadedImage(imageBase64);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
   if (selectedImage?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="upload-section" id="upload-section">
      <div className="container">

        <div className="upload-card">

          <h2>Upload Food Image</h2>

          <p className="upload-subtitle">
            Drag & Drop or browse your image for AI-powered freshness analysis.
          </p>

          {!selectedImage ? (

            <div
              className={`drop-zone ${dragActive ? "active" : ""}`}
              onClick={() => inputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >

              <FaCloudUploadAlt className="upload-icon" />

              <h4>Drag & Drop Image Here</h4>

              <p>or click anywhere to browse</p>

              <button className="browse-btn">
                Browse Files
              </button>

              <input
                hidden
                ref={inputRef}
                type="file"
                accept="image/*,.webp"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              <div className="upload-info">

                <span>JPG</span>
                <span>PNG</span>
                <span>JPEG</span>
                <span>WEBP</span>

              </div>

              <small>Maximum Size : 10 MB</small>

            </div>

          ) : (

            <div className="preview-card">

              <img
                src={selectedImage.preview}
                alt="preview"
              />

              <div className="image-details">

                <h5>

                  <FaImage />

                  {selectedImage.file.name}

                </h5>

                <p>

                  {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB

                </p>

                <div className="ready">

                  <FaCheckCircle />

                  Ready for AI Analysis

                </div>

              </div>

              <div className="button-group">

                <button
                  className="remove-btn"
                  onClick={removeImage}
                >
                  <FaTrashAlt />

                  Remove
                </button>

                <button
                  className="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  <FaRobot />

                  {loading ? "Analyzing..." : "Analyze Food"}

                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default UploadCard;