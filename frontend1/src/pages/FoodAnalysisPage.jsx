import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ScanLine, Thermometer, Droplets, Package, Calendar, Sparkles, CheckCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import DragDropUpload from "../components/analysis/DragDropUpload";
import CameraScanModal from "../components/analysis/CameraScanModal";
import AnalysisProgress, { ANALYSIS_STEPS } from "../components/analysis/AnalysisProgress";
import { createMockPrediction, storePrediction } from "../mocks/predictions";
import { appToast } from "../components/ui/Toast";
import { apiService } from "../services/api";

const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy Products",
  "Meat & Poultry",
  "Seafood",
  "Bakery Products",
  "Packaged Foods",
  "Beverages",
];

const PACKAGING_TYPES = ["Unpackaged / Open", "Sealed Plastic Wrap", "Airtight Container", "Vacuum Sealed", "Cardboard Box", "Glass Bottle / Jar"];

const PRESET_SAMPLES = [
  { name: "Organic Strawberries", category: "Fruits", status: "Fresh" },
  { name: "Roma Tomatoes (Spoiled)", category: "Vegetables", status: "Spoiled" },
  { name: "Whole Milk 1L", category: "Dairy Products", status: "Good" },
  { name: "Atlantic Salmon Fillet", category: "Seafood", status: "Fresh" },
  { name: "Sourdough Loaf", category: "Bakery Products", status: "Acceptable" },
];

export default function FoodAnalysisPage() {
  const [file, setFile] = useState(null);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [temperature, setTemperature] = useState("4.0");
  const [humidity, setHumidity] = useState("85");
  const [packaging, setPackaging] = useState("Sealed Plastic Wrap");
  const [storageDays, setStorageDays] = useState("2");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    if (!itemName) {
      setItemName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSelectPreset = (sample) => {
    setItemName(sample.name);
    setCategory(sample.category);
    // Create dummy SVG data URL image representation for preset
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = sample.status === "Spoiled" ? "#451a03" : "#059669";
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sample.name, 150, 150);

    canvas.toBlob((blob) => {
      if (blob) {
        const dummyFile = new File([blob], `${sample.name}.jpg`, { type: "image/jpeg" });
        setFile(dummyFile);
        setPreviewUrl(canvas.toDataURL());
      }
    });
    appToast.success(`Selected sample: ${sample.name}`);
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setItemName("");
  };

  const handleAnalyze = async () => {
    if (!file && !itemName) {
      appToast.error("Please upload an image or select a sample food item");
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      let imageFile = file;
      if (!imageFile) {
        // Create a basic fallback JPEG canvas if only name was typed
        const canvas = document.createElement("canvas");
        canvas.width = 260;
        canvas.height = 260;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#059669";
        ctx.fillRect(0, 0, 260, 260);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(itemName || "Food Sample", 130, 130);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
        imageFile = new File([blob], `${itemName || "sample"}.jpg`, { type: "image/jpeg" });
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", itemName || imageFile.name.replace(/\.[^/.]+$/, ""));
      formData.append("category", category);
      if (temperature) formData.append("storage_temperature_c", temperature);
      if (humidity) formData.append("storage_humidity_pct", humidity);

      const result = await apiService.quickAssess(formData);

      clearInterval(stepInterval);
      setIsAnalyzing(false);

      // Map API response to prediction state structure
      const mappedPrediction = {
        id: result.id || `pred_${Date.now()}`,
        itemName: result.item_name,
        category: result.category,
        freshnessCategory: result.predicted_category,
        freshnessScore: Math.round(result.overall_freshness_score),
        confidence: Math.round(result.prediction_confidence * 100),
        healthScore: Math.round(result.overall_freshness_score * 0.95),
        shelfLifeDays: Math.round(result.remaining_shelf_life_days),
        visualScore: Math.round(result.visual_condition_score),
        storageScore: Math.round(result.storage_condition_score),
        shelfLifeScore: Math.round(result.shelf_life_score),
        productAgeScore: Math.round(result.product_age_score),
        riskLevel: result.risk_level,
        recommendation: result.recommendation,
        previewUrl: previewUrl,
        analyzedAt: result.created_at,
        storage: {
          recommendedTemp: `${temperature || 4.0}°C`,
          currentTemp: `${temperature || 4.0}°C`,
          recommendedHumidity: `${humidity || 85}%`,
          currentHumidity: `${humidity || 85}%`,
        },
      };

      storePrediction(mappedPrediction);
      appToast.success("Food freshness analysis complete!");
      navigate(`/app/analyze/results/${mappedPrediction.id}`, { state: { prediction: mappedPrediction } });
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      appToast.error(err.message || "Failed to analyze food freshness.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Food Freshness Analysis Engine</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload a food image or select a sample dataset to run the 4-part Weighted Scoring Model (Visual, Storage, Shelf-Life & Product Age).
        </p>
      </div>

      {/* Preset Samples Bar */}
      <Card className="bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={18} />
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              Quick Test Preset Food Samples:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SAMPLES.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSelectPreset(sample)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Image Upload / Camera Scan */}
        <Card className="lg:col-span-2">
          <Card.Header title="1. Food Image Upload & Visual Scan" subtitle="Upload clear photo showing item color and surface texture" />
          
          {isAnalyzing ? (
            <div className="flex h-72 flex-col items-center justify-center gap-6 sm:h-96">
              {previewUrl && <img src={previewUrl} alt="" className="h-24 w-24 rounded-2xl object-cover opacity-80 border border-emerald-500" />}
              <AnalysisProgress currentStep={currentStep} />
            </div>
          ) : (
            <DragDropUpload onFileSelect={handleFileSelect} previewUrl={previewUrl} onClear={handleClear} />
          )}

          {!isAnalyzing && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                leftIcon={<Camera size={16} />}
                onClick={() => setCameraOpen(true)}
                className="flex-1"
              >
                Scan with Camera
              </Button>
              <Button
                leftIcon={<ScanLine size={16} />}
                onClick={handleAnalyze}
                disabled={!file && !itemName}
                className="flex-1"
              >
                Run AI Freshness Analysis
              </Button>
            </div>
          )}
        </Card>

        {/* Right Column: Prediction Inputs & Storage Condition Parameters */}
        <Card className="space-y-4">
          <Card.Header title="2. Storage Condition Inputs" subtitle="Inputs used by the Prediction & Scoring Engine" />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Food Item Name
            </label>
            <Input
              placeholder="e.g. Organic Strawberries"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Food Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Thermometer size={12} className="text-emerald-500" /> Temp (°C)
              </label>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="4.0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Droplets size={12} className="text-blue-500" /> Humidity (%)
              </label>
              <Input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="85"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Package size={12} className="text-purple-500" /> Packaging Type
            </label>
            <select
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {PACKAGING_TYPES.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-amber-500" /> Storage Duration (Days)
            </label>
            <Input
              type="number"
              value={storageDays}
              onChange={(e) => setStorageDays(e.target.value)}
              placeholder="2"
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60 flex items-start gap-2">
            <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Model Weights:</strong> Visual Analysis (40%) + Storage Conditions (25%) + Remaining Shelf-Life (20%) + Product Age (15%).
            </span>
          </div>
        </Card>
      </div>

      <CameraScanModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFileSelect}
      />
    </div>
  );
}
