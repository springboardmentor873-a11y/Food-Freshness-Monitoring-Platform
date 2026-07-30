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

  const handleAnalyze = () => {
    if (!file && !itemName) {
      appToast.error("Please upload an image or select a sample food item");
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => setCurrentStep(i), i * 650);
    });

    setTimeout(
      () => {
        const title = itemName || (file ? file.name.replace(/\.[^/.]+$/, "") : "Analyzed Food Item");
        const prediction = createMockPrediction(title, previewUrl);

        // Enhance prediction with user-provided storage inputs
        prediction.category = category;
        prediction.storageInputs = {
          temperature: `${temperature}°C`,
          humidity: `${humidity}%`,
          packaging,
          storageDays: `${storageDays} days`,
        };

        storePrediction(prediction);
        setIsAnalyzing(false);
        appToast.success("Food freshness analysis complete!");
        navigate(`/app/analyze/results/${prediction.id}`);
      },
      ANALYSIS_STEPS.length * 650 + 400
    );
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
