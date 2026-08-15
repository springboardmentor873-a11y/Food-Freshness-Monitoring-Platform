import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import FoodUploadCard from "../../components/dashboard/FoodUploadCard";
import LivePreviewCard from "../../components/dashboard/LivePreviewCard";
import DetectionTipCard from "../../components/dashboard/DetectionTipCard";
import HowItWorksCard from "../../components/dashboard/HowItWorksCard";
import ActionButtons from "../../components/dashboard/ActionButtons";
import {
  InvalidPredictionResponseError,
  predictFoodFreshness,
} from "../../services/predictions";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getPredictionErrorMessage(error) {
  if (error instanceof InvalidPredictionResponseError) {
    return "The prediction service returned an invalid response. Please try again.";
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "Prediction timed out. Please try again with a smaller image.";
    }

    if (!error.response) {
      return "Network error. Check your connection and try again.";
    }

    if (error.response.status === 503) {
      return "The prediction service is temporarily unavailable. Please try again shortly.";
    }

    const detail = error.response.data?.detail;
    return typeof detail === "string"
      ? detail
      : "Unable to analyze this image. Please choose another image and try again.";
  }

  return "Unable to complete the prediction. Please try again.";
}

function FoodDetection() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const predictionControllerRef = useRef(null);
  const isMountedRef = useRef(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      predictionControllerRef.current?.abort();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearSelectedFile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
  };

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      clearSelectedFile();
      setError("Unsupported file. Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      clearSelectedFile();
      setError("Image size must be 10 MB or smaller.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setPrediction(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile || isPredicting) {
      return;
    }

    setIsPredicting(true);
    setError("");
    setPrediction(null);

    const controller = new AbortController();
    predictionControllerRef.current = controller;

    try {
      const result = await predictFoodFreshness(selectedFile, controller.signal);
      if (isMountedRef.current) {
        setPrediction(result);
      }
    } catch (requestError) {
      if (!axios.isCancel(requestError) && isMountedRef.current) {
        setError(getPredictionErrorMessage(requestError));
      }
    } finally {
      if (predictionControllerRef.current === controller) {
        predictionControllerRef.current = null;
      }
      if (isMountedRef.current) {
        setIsPredicting(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Detect Food Quality"
        subtitle="Upload images for instant AI-powered freshness and spoilage analysis."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Center Area (2 columns wide) */}
        <div className="space-y-6 lg:col-span-2">
          <FoodUploadCard
            cameraInputRef={cameraInputRef}
            error={error}
            fileInputRef={fileInputRef}
            isPredicting={isPredicting}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
          <ActionButtons
            hasSelectedFile={Boolean(selectedFile)}
            isPredicting={isPredicting}
            onCapture={() => cameraInputRef.current?.click()}
            onPredict={handlePredict}
            onUpload={() => fileInputRef.current?.click()}
          />

          {/* Prominent Center AI Analysis Details View */}
          <LivePreviewCard
            error={error}
            isPredicting={isPredicting}
            prediction={prediction}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            onReset={clearSelectedFile}
          />
        </div>

        {/* Right Sidebar Column (1 column wide) */}
        <div className="space-y-6 lg:col-span-1">
          <DetectionTipCard />
          <HowItWorksCard />
        </div>
      </div>

    </div>
  );
}

export default FoodDetection;
