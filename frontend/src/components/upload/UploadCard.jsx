import { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaTrashAlt,
  FaImage,
} from "react-icons/fa";

import "./UploadCard.css";
import api from "../../services/api";

function UploadCard({ setPrediction }) {
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

  } catch (error) {
  console.log("========== ERROR ==========");

  console.log(error);

  console.log("Message:", error.message);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }

  if (error.request) {
    console.log("Request:", error.request);
  }

  alert("Prediction failed.");
}finally {
    setLoading(false);
}
};

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="upload-section">

      <div className="container">

        <div className="upload-card">

          <h2>Upload Food Image</h2>

          <p className="upload-subtitle">
            Upload an image to analyze its freshness using AI.
          </p>

          {!selectedImage ? (

            <div
              className={`drop-zone ${dragActive ? "active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >

              <FaCloudUploadAlt
                className="upload-icon"
              />

              <h4>Drag & Drop Image Here</h4>

              <p>or</p>

              <button
                className="btn btn-success"
                onClick={() => inputRef.current.click()}
              >
                Choose Image
              </button>

              <input
                type="file"
                hidden
                ref={inputRef}
                accept="image/*"
                onChange={handleInputChange}
              />

              <div className="upload-info">

                <small>
                  Supported: JPG, JPEG, PNG
                </small>

                <small>
                  Maximum Size: 5 MB
                </small>

              </div>

            </div>

          ) : (

            <div className="preview-card">

              <img
                src={selectedImage.preview}
                alt="Preview"
              />

              <div className="image-details">

                <h5>
                  <FaImage className="me-2" />
                  {selectedImage.file.name}
                </h5>

                <p>
                  {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

              <div className="button-group">

                <button
                  className="btn btn-outline-danger"
                  onClick={removeImage}
                >
                  <FaTrashAlt className="me-2" />
                  Remove
                </button>

                <button
                    className="btn btn-success"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze Freshness"}
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