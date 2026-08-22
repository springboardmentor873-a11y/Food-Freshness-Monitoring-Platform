import React, { useState, useRef, useCallback } from 'react';
import { FoodCategory } from '../../types';
import { SAMPLE_PRESET_IMAGES } from '../../data/mockData';
import { 
  UploadCloud, 
  Camera, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle, 
  Check,
  Thermometer,
  Droplets,
  Package,
  Layers
} from 'lucide-react';

interface ImageUploaderProps {
  onStartAnalysis: (data: {
    imageUrl: string;
    imageBase64?: string;
    foodName: string;
    category: FoodCategory;
    batchId: string;
    temperature: number;
    humidity: number;
    packaging: string;
    storageDays: number;
  }) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onStartAnalysis,
  isLoading
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRESET_IMAGES[0].url);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets'>('presets');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Form Fields
  const [foodName, setFoodName] = useState('Vine-Ripened Tomatoes');
  const [category, setCategory] = useState<FoodCategory>('Vegetables');
  const [batchId, setBatchId] = useState(`BATCH-${new Date().getFullYear()}-084`);
  const [storageDays, setStorageDays] = useState(2);
  const [temperature, setTemperature] = useState(8.5);
  const [humidity, setHumidity] = useState(85);
  const [packaging, setPackaging] = useState('Perforated Polybags');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
      setActiveTab('upload');
    }
  };

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please verify camera permissions in your browser or use file upload.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataUrl);
        setImageBase64(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please upload or select an image first.');
      return;
    }
    onStartAnalysis({
      imageUrl: selectedImage,
      imageBase64,
      foodName,
      category,
      batchId,
      temperature,
      humidity,
      packaging,
      storageDays
    });
  };

  return (
    <div id="image-analysis-form" className="w-full">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection / Camera / Dropzone (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              id="tab-presets"
              onClick={() => {
                stopCamera();
                setActiveTab('presets');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Produce</span>
            </button>

            <button
              type="button"
              id="tab-upload"
              onClick={() => {
                stopCamera();
                setActiveTab('upload');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              type="button"
              id="tab-camera"
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'camera'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
          </div>

          {/* Active View Area */}
          <div className="relative flex-1 min-h-[320px] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 flex flex-col items-center justify-center overflow-hidden">
            {/* Presets View */}
            {activeTab === 'presets' && (
              <div className="w-full space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Select Test Sample Produce:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click any preset to load</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PRESET_IMAGES.map((preset) => {
                    const isSelected = selectedImage === preset.url;
                    return (
                      <div
                        key={preset.id}
                        id={preset.id}
                        onClick={() => {
                          setSelectedImage(preset.url);
                          setFoodName(preset.name);
                          setCategory(preset.category);
                        }}
                        className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                          isSelected
                            ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                            {preset.name}
                          </div>
                          <div className="flex items-center justify-between mt-0.5 text-[10px]">
                            <span className="text-slate-500">{preset.category}</span>
                            <span className={`font-bold ${preset.score >= 80 ? 'text-emerald-600' : preset.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                              {preset.expectedFreshness}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Drag & Drop View */}
            {activeTab === 'upload' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-full min-h-[280px] rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-2 border-emerald-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-file-input"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Drag & Drop Food Image Here
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Supports JPG, PNG, WEBP files up to 15MB. Clear lighting delivers highest prediction accuracy.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}

            {/* Camera View */}
            {activeTab === 'camera' && (
              <div className="w-full flex flex-col items-center">
                {cameraError ? (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center max-w-sm">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p>{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                    >
                      Switch to File Upload
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full max-w-md h-64 sm:h-72 bg-black rounded-2xl overflow-hidden shadow-md">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scanning Reticle Frame */}
                      <div className="absolute inset-4 border border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-emerald-400 rounded-lg animate-pulse" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        type="button"
                        id="capture-photo-btn"
                        onClick={capturePhoto}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs"
                        title="Restart Camera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Preview Thumbnail Bar */}
          {selectedImage && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedImage}
                  alt="Selected food target"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Target Image Ready</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Ready for neural spoilage assessment</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedImage('');
                  setImageBase64(undefined);
                }}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Contextual Form Parameters (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Produce & Storage Context
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Environmental variables improve shelf-life prediction precision.
              </p>
            </div>

            {/* Food Name */}
            <div>
              <label htmlFor="food-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Produce Name / Variety
              </label>
              <input
                type="text"
                id="food-name-input"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="e.g. Heirloom Vine Tomatoes"
              />
            </div>

            {/* Food Category */}
            <div>
              <label htmlFor="food-category-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Food Category
              </label>
              <select
                id="food-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Vegetables">Vegetables (AI Model Primary Support)</option>
                <option value="Fruits">Fruits (AI Model Primary Support)</option>
                <option value="Dairy Products">Dairy Products (Planned Model)</option>
                <option value="Meat & Poultry">Meat & Poultry (Planned Model)</option>
                <option value="Seafood">Seafood (Planned Model)</option>
                <option value="Bakery Products">Bakery Products (Planned Model)</option>
                <option value="Packaged Foods">Packaged Foods (Planned Model)</option>
                <option value="Beverages">Beverages (Planned Model)</option>
              </select>
            </div>

            {/* Batch ID & Days in Storage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="batch-id-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batch ID (Optional)
                </label>
                <input
                  type="text"
                  id="batch-id-input"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="storage-days-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Days in Storage
                </label>
                <input
                  type="number"
                  id="storage-days-input"
                  min="0"
                  max="60"
                  value={storageDays}
                  onChange={(e) => setStorageDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Environmental Sensors: Temperature & Humidity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="temperature-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-500" />
                  <span>Storage Temp (°C)</span>
                </label>
                <input
                  type="number"
                  id="temperature-input"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="humidity-input" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-500" />
                  <span>Humidity (%)</span>
                </label>
                <input
                  type="number"
                  id="humidity-input"
                  min="10"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Packaging Type */}
            <div>
              <label htmlFor="packaging-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Packaging Format
              </label>
              <select
                id="packaging-select"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Perforated Polybags">Perforated Polybags / Vented Bag</option>
                <option value="Clamshell Plastic">Rigid Clamshell Punnet</option>
                <option value="Vented Wooden Crates">Vented Wooden Crates / Field Bins</option>
                <option value="Shrink Wrapped">Modified Atmosphere / Shrink Wrap</option>
                <option value="Unpackaged Loose">Loose Unpackaged Display</option>
              </select>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            id="run-analysis-btn"
            disabled={isLoading || !selectedImage}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Analyze Food Freshness</span>
          </button>
        </div>
      </form>
    </div>
  );
};
