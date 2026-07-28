import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AssessmentResult from './components/AssessmentResult';
import InventoryBoard from './components/InventoryBoard';
import AnalyticsBoard from './components/AnalyticsBoard';
import { Scan, Package, BarChart3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('SCANNER');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [inventory, setInventory] = useState([]);

  // Fetch initial inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleImageSelected = async (file, preview) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
    setIsAnalyzing(true);
    setAssessmentResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/classify', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.error) {
        alert("Classification Error: " + data.error);
      } else {
        setAssessmentResult(data);
      }
    } catch (err) {
      alert("Failed to connect to backend server: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToInventory = async (itemData) => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
      }
    } catch (err) {
      console.error("Failed to save item to inventory:", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/api/inventory/${itemId}`, { method: 'DELETE' });
      fetchInventory();
    } catch (err) {
      console.error("Failed to delete inventory item:", err);
    }
  };

  return (
    <div className="app-container">
      <Header />

      {/* Navigation Bar */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'SCANNER' ? 'active' : ''}`}
          onClick={() => setActiveTab('SCANNER')}
        >
          <Scan size={18} />
          Freshness Scanner
        </button>

        <button
          className={`tab-btn ${activeTab === 'INVENTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('INVENTORY')}
        >
          <Package size={18} />
          Inventory Tracker ({inventory.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
          onClick={() => setActiveTab('ANALYTICS')}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
      </nav>

      {/* Tab Contents */}
      {activeTab === 'SCANNER' && (
        <div className="main-grid">
          <ImageUploader
            onImageSelected={handleImageSelected}
            isAnalyzing={isAnalyzing}
            selectedPreview={previewUrl}
          />
          <AssessmentResult
            result={assessmentResult}
            onAddToInventory={handleAddToInventory}
          />
        </div>
      )}

      {activeTab === 'INVENTORY' && (
        <InventoryBoard
          inventory={inventory}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {activeTab === 'ANALYTICS' && (
        <AnalyticsBoard />
      )}
    </div>
  );
}
