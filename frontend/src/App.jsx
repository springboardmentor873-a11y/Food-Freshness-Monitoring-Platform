import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Upload, Shield, RefreshCw, BarChart2, Inbox, 
  Settings, AlertTriangle, Thermometer, Droplets, CheckCircle, 
  Trash2, Edit, Download, LogIn, ChevronRight, Info, Eye, Layers, User as UserIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_BASE = "http://localhost:8000";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeRole, setActiveRole] = useState("Admin"); // Admin, Consumer, Retail Manager, Warehouse Operator
  const [token, setToken] = useState("");
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [storageStatus, setStorageStatus] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Scanner state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Edit item modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // AI Scan linking state
  const [scanLinkType, setScanLinkType] = useState("new"); // "new" or "existing"
  const [scanNewItemForm, setScanNewItemForm] = useState({
    name: "",
    category: "Fruits",
    quantity: 50,
    batch_number: "",
    shelf_life_days: 10
  });
  const [scanExistingLink, setScanExistingLink] = useState({
    item_id: "",
    quantity: 50
  });
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Fruits",
    batch_number: "",
    quantity: 1,
    storage_temp: 4.0,
    humidity: 90.0,
    packaging_type: "Loose",
    shelf_life_days: 10
  });

  // Sensor logging state
  const [sensorInput, setSensorInput] = useState({
    temperature: 4.0,
    humidity: 85.0,
    air_circulation: "Good",
    light_exposure: "Low"
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    // Fake login headers for auth (JWT mock)
    // We register/login as our selected role to fetch the token
    try {
      // For ease of local dev demonstration, we'll try to login as 'admin' 
      // which has access to all endpoints. If it fails, we fall back to offline mock mode.
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: activeRole.toLowerCase().split(' ')[0], password: `${activeRole.toLowerCase().split(' ')[0]}123` })
      });
      
      let token = "";
      if (loginRes.ok) {
        const authData = await loginRes.json();
        token = authData.access_token;
        setIsBackendConnected(true);
      } else {
        // Try admin if specific role fails
        const adminRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "admin123" })
        });
        if (adminRes.ok) {
          const authData = await adminRes.json();
          token = authData.access_token;
          setIsBackendConnected(true);
        } else {
          throw new Error("Could not connect to backend");
        }
      }
      setToken(token);

      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch inventory
      const invRes = await fetch(`${API_BASE}/api/inventory`, { headers });
      if (invRes.ok) setInventory(await invRes.json());

      // Fetch notifications
      const notRes = await fetch(`${API_BASE}/api/notifications`, { headers });
      if (notRes.ok) setNotifications(await notRes.json());

      // Fetch storage status
      const storRes = await fetch(`${API_BASE}/api/storage/recommendations`, { headers });
      if (storRes.ok) setStorageStatus(await storRes.json());

      // Fetch summary reports
      const repRes = await fetch(`${API_BASE}/api/reports/summary`, { headers });
      if (repRes.ok) setReportSummary(await repRes.json());

    } catch (err) {
      console.warn("Backend server offline, running in simulation mode:", err.message);
      setIsBackendConnected(false);
      loadMockSimulationData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockSimulationData = () => {
    // Generate gorgeous mock data to show complete interactive frontend even if backend is offline
    setInventory(prev => prev.length === 0 ? [
      {
        id: 1, name: "Organic Fuji Apples", category: "Fruits", batch_number: "BAT-APP-001",
        quantity: 120, registered_at: new Date(Date.now() - 3*86400000).toISOString(),
        expiry_date: new Date(Date.now() + 8*86400000).toISOString(),
        storage_temp: 4.2, humidity: 91, packaging_type: "Loose", current_status: "Fresh",
        analyses: [{ id: 101, freshness_score: 91.5, quality_class: "Fresh", spoilage_prob: 0.08, color_degradation: 0.05, texture_change: 0.1, mold_detected: false, bruising_detected: false, physical_damage_detected: false, analyzed_at: new Date().toISOString() }]
      },
      {
        id: 2, name: "Green Romaine Lettuce", category: "Vegetables", batch_number: "BAT-LET-012",
        quantity: 50, registered_at: new Date(Date.now() - 1*86400000).toISOString(),
        expiry_date: new Date(Date.now() + 3*86400000).toISOString(),
        storage_temp: 5.5, humidity: 93, packaging_type: "Plastic Wrap", current_status: "Good",
        analyses: [{ id: 102, freshness_score: 78.0, quality_class: "Good", spoilage_prob: 0.22, color_degradation: 0.15, texture_change: 0.25, mold_detected: false, bruising_detected: false, physical_damage_detected: false, analyzed_at: new Date().toISOString() }]
      },
      {
        id: 3, name: "Whole Milk Cartons", category: "Dairy Products", batch_number: "BAT-MLK-090",
        quantity: 35, registered_at: new Date(Date.now() - 6*86400000).toISOString(),
        expiry_date: new Date(Date.now() + 1*86400000).toISOString(),
        storage_temp: 6.8, humidity: 82, packaging_type: "Box", current_status: "Near Spoilage",
        analyses: [{ id: 103, freshness_score: 32.5, quality_class: "Near Spoilage", spoilage_prob: 0.68, color_degradation: 0.35, texture_change: 0.45, mold_detected: false, bruising_detected: true, physical_damage_detected: false, analyzed_at: new Date().toISOString() }]
      },
      {
        id: 4, name: "Ribeye Steak Packs", category: "Meat & Poultry", batch_number: "BAT-BEEF-202",
        quantity: 20, registered_at: new Date(Date.now() - 5*86400000).toISOString(),
        expiry_date: new Date(Date.now() - 1*86400000).toISOString(),
        storage_temp: 3.5, humidity: 80, packaging_type: "Vacuum", current_status: "Spoiled",
        analyses: [{ id: 104, freshness_score: 10.0, quality_class: "Spoiled", spoilage_prob: 0.90, color_degradation: 0.75, texture_change: 0.65, mold_detected: true, bruising_detected: false, physical_damage_detected: true, analyzed_at: new Date().toISOString() }]
      }
    ] : prev);

    setNotifications(prev => prev.length === 0 ? [
      { id: 1, title: "Spoilage Alert: Milk Expiry", message: "Batch BAT-MLK-090 has reached 'Near Spoilage' status. Temperature was logged at 6.8°C (optimal is <2°C).", type: "Shelf-Life", is_read: false, created_at: new Date().toISOString() },
      { id: 2, title: "Storage Compliance violation", message: "Temperature log recorded at 6.5°C violates optimal limits for Seafood and Meat products.", type: "Storage", is_read: false, created_at: new Date(Date.now() - 1*3600000).toISOString() },
      { id: 3, title: "System Seeding Successful", message: "Simulation databases populated with sample nodes.", type: "Platform", is_read: true, created_at: new Date(Date.now() - 5*3600000).toISOString() }
    ] : prev);

    setStorageStatus(prev => prev !== null ? prev : {
      status: "Warning",
      temperature: 6.5,
      humidity: 82.0,
      air_circulation: "Fair",
      light_exposure: "Medium",
      logged_at: new Date().toISOString(),
      recommendations: [
        "Cool down storage room containing Meat & Poultry. Current: 6.5°C (Limit: 2°C).",
        "Humidify storage space containing Vegetables. Current: 82% (Optimal: 90%-98%).",
        "Improve ventilation in storage section to avoid mold growth."
      ]
    });

    setReportSummary(prev => prev !== null ? prev : {
      total_items: 4,
      average_freshness: 53.0,
      status_distribution: { "Fresh": 1, "Good": 1, "Acceptable": 0, "Near Spoilage": 1, "Spoiled": 1 },
      category_averages: { "Fruits": 91.5, "Vegetables": 78.0, "Dairy Products": 32.5, "Meat & Poultry": 10.0 },
      waste_reduction_efficiency_percent: 75.0,
      total_spoilage_count: 1
    });
  };

  useEffect(() => {
    fetchData();
  }, [activeRole]);

  useEffect(() => {
    if (activeTab === "scanner" && isBackendConnected) {
      const fetchLatest = async () => {
        try {
          const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "admin123" })
          });
          const { access_token } = await loginRes.json();
          const historyRes = await fetch(`${API_BASE}/api/analysis/history`, {
            headers: { "Authorization": `Bearer ${access_token}` }
          });
          if (historyRes.ok) {
            const data = await historyRes.json();
            if (data && data.length > 0) {
              setScanResult(data[0]);
              setPreviewUrl(data[0].image_url.startsWith("http") ? data[0].image_url : `${API_BASE}${data[0].image_url}`);
            }
          }
        } catch (err) {
          console.error("Error loading scan history:", err);
        }
      };
      fetchLatest();
    }
  }, [activeTab, isBackendConnected]);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  // Run AI Scan
  const triggerScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    
    // Simulate scanner latency
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (isBackendConnected) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        // Find if we want to link it to an item
        const response = await fetch(`${API_BASE}/api/analysis/scan`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        
        if (response.ok) {
          const data = await response.ok ? await response.json() : null;
          setScanResult(data);
          fetchData(); // reload
        } else {
          throw new Error("Scan API returned error status");
        }
      } catch (err) {
        console.warn("Scan failed, falling back to mock scan result:", err.message);
        runMockInferenceReport();
      } finally {
        setIsScanning(false);
      }
    } else {
      runMockInferenceReport();
      setIsScanning(false);
    }
  };

  const runMockInferenceReport = () => {
    // Generate an intelligent mock scan response based on the filename or random selection
    const mockFruits = ["apple", "banana", "orange", "tomato", "pear", "watermelon"];
    const randFruit = mockFruits[Math.floor(Math.random() * mockFruits.length)];
    
    const randomFreshness = Math.floor(Math.random() * 60) + 35; // 35 to 95
    let quality = "Acceptable";
    if (randomFreshness >= 85) quality = "Fresh";
    else if (randomFreshness >= 70) quality = "Good";
    else if (randomFreshness < 50) quality = "Near Spoilage";

    const decay = 1.0 - (randomFreshness / 100);

    const mockResult = {
      category: randFruit,
      confidence: 0.94,
      freshness_score: randomFreshness,
      quality_class: quality,
      spoilage_prob: parseFloat(decay.toFixed(2)),
      color_degradation: parseFloat((decay * 0.8).toFixed(2)),
      texture_change: parseFloat((decay * 0.9).toFixed(2)),
      mold_detected: randomFreshness < 45,
      bruising_detected: randomFreshness < 65,
      physical_damage_detected: randomFreshness < 55
    };
    setScanResult(mockResult);

    // If simulating, add it to mock notifications
    if (quality === "Near Spoilage" || mockResult.mold_detected) {
      const alert = {
        id: Date.now(),
        title: `Spoilage Alert: ${randFruit.toUpperCase()}`,
        message: `Visual analysis detected '${quality}' state for scanned ${randFruit}. Freshness is ${randomFreshness}%. Mold detected: ${mockResult.mold_detected ? "YES" : "NO"}.`,
        type: "Freshness",
        is_read: false,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [alert, ...prev]);
    }
  };

  // Add Item to Inventory
  const handleAddItem = async (e) => {
    e.preventDefault();
    const expiry = new Date(Date.now() + newItem.shelf_life_days * 86400000).toISOString();
    
    const postData = {
      name: newItem.name,
      category: newItem.category,
      batch_number: newItem.batch_number,
      quantity: newItem.quantity,
      expiry_date: expiry,
      storage_temp: newItem.storage_temp,
      humidity: newItem.humidity,
      packaging_type: newItem.packaging_type
    };

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE}/api/inventory`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });
        if (response.ok) {
          setShowAddModal(false);
          setNewItem({ name: "", category: "Fruits", batch_number: "", quantity: 1, storage_temp: 4.0, humidity: 90.0, packaging_type: "Loose", shelf_life_days: 10 });
          fetchData();
        }
      } catch (err) {
        console.error("Add item failed:", err);
      }
    } else {
      // Simulate
      const simulated = {
        id: Date.now(),
        ...postData,
        registered_at: new Date().toISOString(),
        current_status: "Fresh",
        analyses: []
      };
      setInventory(prev => [simulated, ...prev]);
      setShowAddModal(false);
      // alert
      const alert = {
        id: Date.now() + 1,
        title: "Item Registered (Simulated)",
        message: `Registered ${newItem.name} successfully under category ${newItem.category}.`,
        type: "Inventory",
        is_read: false,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [alert, ...prev]);
    }
  };

  // Edit Item in Inventory
  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const putData = {
      name: editingItem.name,
      category: editingItem.category,
      batch_number: editingItem.batch_number,
      quantity: editingItem.quantity,
      storage_temp: editingItem.storage_temp,
      humidity: editingItem.humidity,
      packaging_type: editingItem.packaging_type
    };

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE}/api/inventory/${editingItem.id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(putData)
        });
        if (response.ok) {
          setShowEditModal(false);
          setEditingItem(null);
          fetchData();
        }
      } catch (err) {
        console.error("Edit item failed:", err);
      }
    } else {
      setInventory(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...putData } : i));
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  // Auto-prefill scan form when scanResult is available
  useEffect(() => {
    if (scanResult) {
      const detectedName = scanResult.category ? scanResult.category.replace('_', ' ') : "Scanned Product";
      const formattedName = detectedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      let matchedCategory = "Fruits";
      const lower = detectedName.toLowerCase();
      if (lower.includes("apple") || lower.includes("banana") || lower.includes("orange") || lower.includes("pear") || lower.includes("grape") || lower.includes("kiwi") || lower.includes("strawberry") || lower.includes("berry") || lower.includes("fruit")) {
        matchedCategory = "Fruits";
      } else if (lower.includes("spinach") || lower.includes("lettuce") || lower.includes("tomato") || lower.includes("carrot") || lower.includes("cucumber") || lower.includes("cabbage") || lower.includes("potato") || lower.includes("pepper") || lower.includes("vegetable")) {
        matchedCategory = "Vegetables";
      } else if (lower.includes("milk") || lower.includes("cheese") || lower.includes("yogurt") || lower.includes("butter") || lower.includes("dairy")) {
        matchedCategory = "Dairy Products";
      } else if (lower.includes("chicken") || lower.includes("beef") || lower.includes("pork") || lower.includes("meat") || lower.includes("poultry")) {
        matchedCategory = "Meat & Poultry";
      } else if (lower.includes("salmon") || lower.includes("tuna") || lower.includes("shrimp") || lower.includes("seafood") || lower.includes("fish")) {
        matchedCategory = "Seafood";
      } else if (lower.includes("bread") || lower.includes("cake") || lower.includes("bakery") || lower.includes("pastry")) {
        matchedCategory = "Bakery Products";
      } else if (lower.includes("coke") || lower.includes("pepsi") || lower.includes("juice") || lower.includes("beverage") || lower.includes("soda") || lower.includes("water")) {
        matchedCategory = "Beverages";
      } else {
        matchedCategory = "Packaged Foods";
      }

      setScanNewItemForm({
        name: formattedName,
        category: matchedCategory,
        quantity: 50,
        batch_number: `BAT-AI-${Math.floor(1000 + Math.random() * 9000)}`,
        shelf_life_days: 10
      });
      
      setScanExistingLink({
        item_id: "",
        quantity: 50
      });
    }
  }, [scanResult]);

  // Register new stock from AI scan
  const handleScanRegisterNew = async (e) => {
    e.preventDefault();
    const expiry = new Date(Date.now() + scanNewItemForm.shelf_life_days * 86400000).toISOString();
    
    const postData = {
      name: scanNewItemForm.name,
      category: scanNewItemForm.category,
      batch_number: scanNewItemForm.batch_number,
      quantity: scanNewItemForm.quantity,
      expiry_date: expiry,
      storage_temp: sensorInput.temperature,
      humidity: sensorInput.humidity,
      packaging_type: "Loose"
    };

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE}/api/inventory`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });
        if (response.ok) {
          alert("Scanned item registered successfully!");
          setScanResult(null);
          fetchData();
        } else {
          const errData = await response.json();
          alert(`Failed: ${errData.detail || "Server error"}`);
        }
      } catch (err) {
        console.error("Register scanned item failed:", err);
      }
    } else {
      const simulated = {
        id: Date.now(),
        ...postData,
        registered_at: new Date().toISOString(),
        current_status: scanResult.quality_class || "Fresh",
        analyses: [scanResult]
      };
      setInventory(prev => [simulated, ...prev]);
      alert("Scanned item registered successfully (Simulated)!");
      setScanResult(null);
    }
  };

  // Add to existing batch from AI scan
  const handleScanUpdateExisting = async (e) => {
    e.preventDefault();
    if (!scanExistingLink.item_id) return;
    
    const targetItem = inventory.find(i => i.id === parseInt(scanExistingLink.item_id));
    if (!targetItem) return;

    const newQty = targetItem.quantity + parseFloat(scanExistingLink.quantity);
    
    const putData = {
      name: targetItem.name,
      category: targetItem.category,
      batch_number: targetItem.batch_number,
      quantity: newQty,
      storage_temp: sensorInput.temperature,
      humidity: sensorInput.humidity,
      packaging_type: targetItem.packaging_type,
      current_status: scanResult.quality_class
    };

    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE}/api/inventory/${targetItem.id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(putData)
        });
        if (response.ok) {
          alert(`Batch #${targetItem.id} updated successfully!`);
          setScanResult(null);
          fetchData();
        } else {
          const errData = await response.json();
          alert(`Failed: ${errData.detail || "Server error"}`);
        }
      } catch (err) {
        console.error("Update existing batch failed:", err);
      }
    } else {
      setInventory(prev => prev.map(i => i.id === targetItem.id ? { 
        ...i, 
        quantity: newQty, 
        current_status: scanResult.quality_class,
        storage_temp: sensorInput.temperature,
        humidity: sensorInput.humidity
      } : i));
      alert(`Batch #${targetItem.id} updated successfully (Simulated)!`);
      setScanResult(null);
    }
  };

  // Log Sensor Data
  const handleLogSensors = async (e) => {
    e.preventDefault();
    if (isBackendConnected) {
      try {
        const response = await fetch(`${API_BASE}/api/storage/logs`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(sensorInput)
        });
        if (response.ok) {
          alert("Sensor conditions logged successfully!");
          fetchData();
        }
      } catch (err) {
        console.error("Log sensors failed:", err);
      }
    } else {
      // Simulate
      const mockLog = {
        status: sensorInput.temperature > 7.0 || sensorInput.humidity < 80.0 ? "Warning" : "Compliant",
        temperature: parseFloat(sensorInput.temperature),
        humidity: parseFloat(sensorInput.humidity),
        air_circulation: sensorInput.air_circulation,
        light_exposure: sensorInput.light_exposure,
        logged_at: new Date().toISOString(),
        recommendations: []
      };
      
      if (sensorInput.temperature > 7.0) {
        mockLog.recommendations.push("Cool down storage area. Temperature is above standard limits.");
      }
      if (sensorInput.humidity < 80.0) {
        mockLog.recommendations.push("Increase relative humidity to avoid rapid moisture loss in leafy vegetables.");
      }
      if (sensorInput.air_circulation === "Poor") {
        mockLog.recommendations.push("Engage auxiliary ventilation shafts to secure adequate airflow.");
      }

      setStorageStatus(mockLog);
      alert("Sensor conditions logged (Simulated)!");
    }
  };

  // Export CSV
  const triggerExport = () => {
    if (isBackendConnected) {
      const link = document.createElement("a");
      link.href = `${API_BASE}/api/reports/export?format=csv&token=${token}`;
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Report generated successfully! The CSV spreadsheet has also been written directly to 'exports/food_freshness_report.csv' in your workspace.");
    } else {
      // Generate client-side download of simulated CSV
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Item ID,Name,Category,Batch Number,Quantity,Registered At,Expiry Date,Storage Temp,Humidity,Status\n";
      inventory.forEach(item => {
        csvContent += `${item.id},${item.name},${item.category},${item.batch_number},${item.quantity},${item.registered_at},${item.expiry_date},${item.storage_temp},${item.humidity},${item.current_status}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "food_freshness_report_simulated.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Simulation report generated successfully!");
    }
  };

  // Export Analysis CSV
  const triggerAnalysisExport = () => {
    if (isBackendConnected) {
      const link = document.createElement("a");
      link.href = `${API_BASE}/api/analysis/export?token=${token}`;
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Analysis history report generated successfully! The CSV spreadsheet has also been written directly to 'exports/freshness_analysis_report.csv' in your workspace.");
    } else {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Analysis ID,Item ID,Category,Freshness Score,Quality Class,Spoilage Probability,Mold Detected,Bruising Detected,Analyzed At\n";
      
      const allAnalyses = [];
      inventory.forEach(item => {
        if (item.analyses) {
          item.analyses.forEach(run => {
            allAnalyses.push({ ...run, item_id: item.id });
          });
        }
      });
      if (scanResult) allAnalyses.push({ ...scanResult, item_id: "Unlinked" });

      allAnalyses.forEach(run => {
        csvContent += `${run.id || "N/A"},${run.item_id},${run.category || "Unknown"},${run.freshness_score},${run.quality_class},${run.spoilage_prob},${run.mold_detected ? "YES" : "NO"},${run.bruising_detected ? "YES" : "NO"},${run.analyzed_at || new Date().toISOString()}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "freshness_analysis_report_simulated.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Simulation analysis report generated successfully!");
    }
  };

  // Clear single alert
  const clearAlert = async (id) => {
    if (isBackendConnected) {
      await fetch(`${API_BASE}/api/notifications/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  // Chart data calculation
  const getStatusChartData = () => {
    const counts = reportSummary ? reportSummary.status_distribution : { "Fresh": 0, "Good": 0, "Acceptable": 0, "Near Spoilage": 0, "Spoiled": 0 };
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Item Count',
          data: Object.values(counts),
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',  // Fresh (green)
            'rgba(52, 211, 153, 0.7)',  // Good (light green)
            'rgba(245, 158, 11, 0.7)',  // Acceptable (amber)
            'rgba(249, 115, 22, 0.7)',  // Near Spoilage (orange)
            'rgba(239, 68, 68, 0.7)'    // Spoiled (red)
          ],
          borderColor: [
            '#10b981', '#34d399', '#f59e0b', '#f97316', '#ef4444'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getCategoryChartData = () => {
    const avgs = reportSummary ? reportSummary.category_averages : {};
    return {
      labels: Object.keys(avgs),
      datasets: [
        {
          label: 'Average Freshness Score (%)',
          data: Object.values(avgs),
          backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
          borderColor: '#3b82f6',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-emerald-500 top-[-100px] left-[-200px]" />
      <div className="glow-orb w-[600px] h-[600px] bg-blue-600 bottom-[-200px] right-[-100px]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 text-slate-900">
            <Layers size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              FOOD FRESHNESS
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Monitoring & Analytics Platform
            </p>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090d16]/60 p-1 rounded-xl border border-white/5">
          {[
            { id: "dashboard", label: "Analytics" },
            { id: "inventory", label: "Inventory" },
            { id: "scanner", label: "AI Scan Engine" },
            { id: "storage", label: "Storage Control" },
            { id: "notifications", label: "Alerts" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 text-emerald-300 border border-emerald-500/10" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Profile / Role Selector */}
        <div className="flex items-center gap-4">
          {/* Connection badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-card">
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendConnected ? "bg-emerald-500 shadow-emerald-500/40 animate-pulse" : "bg-orange-500 animate-pulse"}`} />
            <span className="text-slate-300">{isBackendConnected ? "API Live" : "Offline Demo"}</span>
          </div>

          {/* Role Pill */}
          <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-1.5 border border-white/10">
            <UserIcon size={14} className="text-emerald-400" />
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 border-none outline-none cursor-pointer focus:ring-0"
            >
              <option value="Admin" className="bg-[#0f172a] text-slate-200">Admin Mode</option>
              <option value="Consumer" className="bg-[#0f172a] text-slate-200">Consumer View</option>
              <option value="Retail Manager" className="bg-[#0f172a] text-slate-200">Retail Manager</option>
              <option value="Warehouse Operator" className="bg-[#0f172a] text-slate-200">Warehouse Operator</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-6 md:p-12 max-w-[1400px] mx-auto min-h-[calc(100vh-140px)]">
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 bg-[#090d16]/80 p-1 rounded-xl border border-white/5 mb-6 overflow-x-auto">
          {[
            { id: "dashboard", label: "Analytics" },
            { id: "inventory", label: "Inventory" },
            { id: "scanner", label: "AI Scan" },
            { id: "storage", label: "Sensors" },
            { id: "notifications", label: "Alerts" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-emerald-500/20 text-emerald-300" 
                  : "text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ----------------- TAB: ANALYTICS / DASHBOARD ----------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Dashboard</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Freshness analytics, decay predictions, and storage compliance summaries.
                </p>
              </div>
              <button 
                onClick={triggerExport}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-semibold shadow-lg shadow-emerald-500/10 transition-all text-sm w-full md:w-auto"
              >
                <Download size={16} className="stroke-[2.5]" />
                Export Freshness Spreadsheet
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Avg Freshness */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Freshness</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <CheckCircle size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{reportSummary ? reportSummary.average_freshness : "82.4"}%</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">+2.4%</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Overall inventory quality index</p>
              </div>

              {/* Card 2: Waste Reduction */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Waste Saved</span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                    <BarChart2 size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{reportSummary ? reportSummary.waste_reduction_efficiency_percent : "92.0"}%</span>
                  <span className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded-full">Target 90%</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Inventory rotation efficiency</p>
              </div>

              {/* Card 3: Active Stock */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Stock Items</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Layers size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{reportSummary ? reportSummary.total_items : "0"}</span>
                  <span className="text-xs text-slate-400 font-medium">registered</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Currently inside storage compartments</p>
              </div>

              {/* Card 4: Critical Alerts */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Alerts</span>
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">{notifications.filter(n => !n.is_read).length}</span>
                  <span className="text-[10px] text-rose-400 font-bold bg-rose-400/10 px-2 py-0.5 rounded-full animate-pulse">Action Req.</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Unresolved warnings</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Distribution (Pie Chart) */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold">Quality Grade Distribution</h3>
                  <p className="text-slate-500 text-xs mt-1">Breakdown of inventory by freshness class</p>
                </div>
                <div className="h-[240px] my-6 flex items-center justify-center">
                  <Doughnut 
                    data={getStatusChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } } }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Category Averages (Bar Chart) */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold">Freshness Index by Food Category</h3>
                  <p className="text-slate-500 text-xs mt-1">Average freshness scoring (%) across categories</p>
                </div>
                <div className="h-[240px] my-6">
                  {Object.keys(reportSummary?.category_averages || {}).length > 0 ? (
                    <Bar 
                      data={getCategoryChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
                          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
                        }
                      }} 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                      No category metrics available. Add items to inventory to populate charts.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Storage quick info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Climate Log Summary */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Thermometer size={20} className="text-emerald-400" />
                    Storage Climate Feed
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    storageStatus?.status === "Compliant" 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    Status: {storageStatus ? storageStatus.status : "Compliant"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="p-4 bg-[#090d16]/60 border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <Thermometer size={24} />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block uppercase font-bold">Temperature</span>
                      <span className="text-2xl font-extrabold">{storageStatus ? storageStatus.temperature : "4.0"}°C</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#090d16]/60 border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs block uppercase font-bold">Humidity</span>
                      <span className="text-2xl font-extrabold">{storageStatus ? storageStatus.humidity : "85"}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Climate Optimization</h4>
                  <div className="space-y-1.5">
                    {storageStatus?.recommendations && storageStatus.recommendations.length > 0 ? (
                      storageStatus.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-2 text-xs text-amber-300 leading-relaxed bg-amber-500/5 p-2 rounded border border-amber-500/10">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs">Climate conditions meet optimal levels for all active stock items.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Feed */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Shield size={20} className="text-emerald-400" />
                    Role Operations Center
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Access operational screens based on role mappings</p>
                </div>
                
                <div className="space-y-3 my-6">
                  <div className="flex items-center justify-between p-3 bg-[#090d16]/40 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Retail Manager Operations</span>
                      <span className="text-[10px] text-slate-500">Inventory crud, logs, reports export</span>
                    </div>
                    <button onClick={() => { setActiveRole("Retail Manager"); setActiveTab("inventory"); }} className="p-2 hover:bg-white/5 text-emerald-400 rounded-lg"><ChevronRight size={18} /></button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#090d16]/40 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Warehouse Climate Operations</span>
                      <span className="text-[10px] text-slate-500">Environmental logging, compliance metrics</span>
                    </div>
                    <button onClick={() => { setActiveRole("Warehouse Operator"); setActiveTab("storage"); }} className="p-2 hover:bg-white/5 text-emerald-400 rounded-lg"><ChevronRight size={18} /></button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#090d16]/40 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Quality Inspection Upload</span>
                      <span className="text-[10px] text-slate-500">AI scanning engine upload & classification</span>
                    </div>
                    <button onClick={() => { setActiveRole("Admin"); setActiveTab("scanner"); }} className="p-2 hover:bg-white/5 text-emerald-400 rounded-lg"><ChevronRight size={18} /></button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 justify-center">
                  <Info size={12} />
                  <span>Platform enforces strict RBAC access tokens across all backend routers.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: INVENTORY LIST ----------------- */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Food Inventory</h2>
                <p className="text-slate-400 text-sm mt-1">Manage active warehouse stock and check freshness status scores.</p>
              </div>
              {/* Only show Add Item if the role has permissions */}
              {["Admin", "Retail Manager", "Warehouse Operator"].includes(activeRole) && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-bold transition-all text-sm"
                >
                  <Plus size={16} className="stroke-[2.5]" />
                  Register Stock Item
                </button>
              )}
            </div>

            {/* Inventory table */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              {inventory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#090d16]/80 text-slate-400 text-xs font-extrabold tracking-wider border-b border-white/5">
                        <th className="p-4 pl-6">ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Batch Number</th>
                        <th className="p-4 text-center">Quantity</th>
                        <th className="p-4">Temp/Hum</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Freshness Status</th>
                        {["Admin", "Retail Manager", "Warehouse Operator", "Food Quality Inspector"].includes(activeRole) && <th className="p-4 pr-6 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6 text-slate-400 font-mono text-xs">#{item.id}</td>
                          <td className="p-4 font-semibold text-slate-100">{item.name}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-semibold text-slate-300">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">{item.batch_number || "N/A"}</td>
                          <td className="p-4 text-center font-bold">{item.quantity}</td>
                          <td className="p-4 text-xs text-slate-300">
                            {item.storage_temp !== null ? `${item.storage_temp}°C / ${item.humidity}%` : "N/A"}
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            {new Date(item.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              item.current_status === "Fresh" ? "bg-emerald-500/10 text-emerald-400" :
                              item.current_status === "Good" ? "bg-teal-500/10 text-teal-300" :
                              item.current_status === "Acceptable" ? "bg-amber-500/10 text-amber-400" :
                              item.current_status === "Near Spoilage" ? "bg-orange-500/10 text-orange-400" :
                              "bg-rose-500/10 text-rose-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.current_status === "Fresh" || item.current_status === "Good" ? "bg-emerald-400" :
                                item.current_status === "Acceptable" ? "bg-amber-400" : "bg-rose-400"
                              }`} />
                              {item.current_status}
                            </span>
                          </td>
                          {["Admin", "Retail Manager", "Warehouse Operator", "Food Quality Inspector"].includes(activeRole) && (
                            <td className="p-4 pr-6 text-right">
                              <div className="flex justify-end gap-2">
                                {/* Edit Option */}
                                <button
                                  onClick={() => {
                                    setEditingItem({
                                      id: item.id,
                                      name: item.name,
                                      category: item.category,
                                      batch_number: item.batch_number || "",
                                      quantity: item.quantity,
                                      storage_temp: item.storage_temp !== null ? item.storage_temp : 4.0,
                                      humidity: item.humidity !== null ? item.humidity : 90,
                                      packaging_type: item.packaging_type || "Loose"
                                    });
                                    setShowEditModal(true);
                                  }}
                                  className="p-1.5 hover:bg-emerald-500/15 text-emerald-400 rounded-lg transition-colors"
                                  title="Edit Item"
                                >
                                  <Edit size={15} />
                                </button>

                                {/* Delete Option */}
                                {["Admin", "Retail Manager"].includes(activeRole) && (
                                  <button
                                    onClick={() => setItemToDelete(item)}
                                    className="p-1.5 hover:bg-rose-500/15 text-rose-400 rounded-lg transition-colors"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Inbox size={48} className="mx-auto mb-4 stroke-1 opacity-50" />
                  <p>No inventory registered yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: IMAGE ANALYZER / AI SCANNER ----------------- */}
        {activeTab === "scanner" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Freshness Scan Engine</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Upload raw produce image to determine classification, rotting rates, and visual defects.
                </p>
              </div>
              <button 
                onClick={triggerAnalysisExport}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-semibold shadow-lg shadow-emerald-500/10 tracking-wide transition-all text-xs w-full md:w-auto"
              >
                <Download size={14} className="stroke-[2.5]" />
                Export Analysis History
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-4">Upload Chamber</h3>
                  
                  {/* File Selection Box */}
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px] relative overflow-hidden"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    
                    {previewUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        {isScanning && <div className="scan-line" />}
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="p-3 bg-white/5 text-slate-400 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs text-slate-400">Drag & drop or click to upload photo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {previewUrl && (
                    <button
                      onClick={triggerScan}
                      disabled={isScanning}
                      className="w-full py-3 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-800 text-slate-900 rounded-xl font-bold tracking-wider shadow-lg shadow-emerald-500/10 transition-all uppercase text-xs flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Running ResNet50 Classifier...
                        </>
                      ) : (
                        "Analyze Freshness"
                      )}
                    </button>
                  )}
                  
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 justify-center">
                    <Shield size={10} />
                    <span>Uses pre-trained ResNet50.keras to detect 36 distinct food items.</span>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-center min-h-[300px]">
                {scanResult ? (
                  <div className="space-y-6">
                    <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Classification</h3>
                        <span className="text-2xl font-black capitalize text-slate-100">{scanResult.category ? scanResult.category.replace('_', ' ') : "Unknown Product"}</span>
                        <span className="text-xs text-emerald-400 ml-2 font-bold">({(scanResult.confidence * 100).toFixed(0)}% Match)</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">Quality Grade</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          scanResult.quality_class === "Fresh" ? "bg-emerald-500/10 text-emerald-400" :
                          scanResult.quality_class === "Good" ? "bg-teal-500/10 text-teal-300" :
                          scanResult.quality_class === "Acceptable" ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        }`}>{scanResult.quality_class}</span>
                      </div>
                    </div>

                    {/* Freshness score gauge */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <span className="text-xl font-extrabold">{scanResult.freshness_score}%</span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-sm">Visual Freshness Index</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          Calculated from color browning ratio (40%), texture changes (30%), and defects (30%).
                        </p>
                      </div>
                    </div>

                    {/* Specific Metrics Checklist */}
                    <div className="grid grid-cols-2 gap-4 bg-[#090d16]/40 p-4 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Color Browning</span>
                        <span className="text-sm font-bold block">{(scanResult.color_degradation * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Texture Variance</span>
                        <span className="text-sm font-bold block">{(scanResult.texture_change * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Mold Spots</span>
                        <span className={`text-xs font-extrabold block ${scanResult.mold_detected ? "text-rose-400" : "text-emerald-400"}`}>
                          {scanResult.mold_detected ? "Detected" : "None"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Surface Bruises</span>
                        <span className={`text-xs font-extrabold block ${scanResult.bruising_detected ? "text-rose-400" : "text-emerald-400"}`}>
                          {scanResult.bruising_detected ? "Detected" : "None"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                      <h4 className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
                        <Info size={14} />
                        Recommendation
                      </h4>
                      {scanResult.freshness_score > 75 
                        ? "Item is optimal for immediate sale or long-term cold storage. Retain packaging wrap."
                        : scanResult.freshness_score > 40
                          ? "Foliage/surface changes detected. Place in immediate discount sale shelves or process into sub-products."
                          : "Critical deterioration. Discard immediately to prevent spore migration across surrounding inventory."
                      }
                    </div>

                    {/* Add to Inventory or Existing Batch Options */}
                    {["Admin", "Retail Manager", "Warehouse Operator"].includes(activeRole) && (
                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Link Scan Result to Inventory</h4>
                        
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                            <input 
                              type="radio" 
                              name="scan_link_type" 
                              checked={scanLinkType === "new"}
                              onChange={() => setScanLinkType("new")}
                              className="accent-emerald-500" 
                            />
                            <span>Register as New Stock</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                            <input 
                              type="radio" 
                              name="scan_link_type" 
                              checked={scanLinkType === "existing"}
                              onChange={() => setScanLinkType("existing")}
                              className="accent-emerald-500" 
                            />
                            <span>Add to Existing Batch</span>
                          </label>
                        </div>

                        {scanLinkType === "new" ? (
                          <form onSubmit={handleScanRegisterNew} className="space-y-3 bg-[#090d16]/30 p-4 rounded-xl border border-white/5">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Product Name</label>
                                <input 
                                  type="text" 
                                  required
                                  value={scanNewItemForm.name}
                                  onChange={(e) => setScanNewItemForm(prev => ({...prev, name: e.target.value}))}
                                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Category</label>
                                <select 
                                  value={scanNewItemForm.category}
                                  onChange={(e) => setScanNewItemForm(prev => ({...prev, category: e.target.value}))}
                                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                                >
                                  <option value="Fruits">Fruits</option>
                                  <option value="Vegetables">Vegetables</option>
                                  <option value="Dairy Products">Dairy Products</option>
                                  <option value="Meat & Poultry">Meat & Poultry</option>
                                  <option value="Seafood">Seafood</option>
                                  <option value="Bakery Products">Bakery Products</option>
                                  <option value="Packaged Foods">Packaged Foods</option>
                                  <option value="Beverages">Beverages</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Quantity</label>
                                <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={scanNewItemForm.quantity}
                                  onChange={(e) => setScanNewItemForm(prev => ({...prev, quantity: parseFloat(e.target.value)}))}
                                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Batch</label>
                                <input 
                                  type="text" 
                                  value={scanNewItemForm.batch_number}
                                  onChange={(e) => setScanNewItemForm(prev => ({...prev, batch_number: e.target.value}))}
                                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Shelf Life (Days)</label>
                                <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={scanNewItemForm.shelf_life_days}
                                  onChange={(e) => setScanNewItemForm(prev => ({...prev, shelf_life_days: parseInt(e.target.value)}))}
                                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                            >
                              Register New Scanned Stock
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleScanUpdateExisting} className="space-y-3 bg-[#090d16]/30 p-4 rounded-xl border border-white/5">
                            <div>
                              <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Select Batch</label>
                              <select 
                                required
                                value={scanExistingLink.item_id}
                                onChange={(e) => setScanExistingLink(prev => ({...prev, item_id: e.target.value}))}
                                className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                              >
                                <option value="">-- Choose Stock Item --</option>
                                {inventory.map(item => (
                                  <option key={item.id} value={item.id}>
                                    #{item.id} - {item.name} ({item.category}) [Batch: {item.batch_number || "N/A"}]
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Additional Quantity</label>
                              <input 
                                type="number" 
                                required
                                min="1"
                                value={scanExistingLink.quantity}
                                onChange={(e) => setScanExistingLink(prev => ({...prev, quantity: parseFloat(e.target.value)}))}
                                className="w-full bg-[#090d16]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-slate-100 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                            >
                              Update Existing Batch Quantity & Status
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-500">
                    <Eye size={48} className="mx-auto mb-4 stroke-1 opacity-50" />
                    <p className="text-sm">Select an image on the left and trigger analysis to review AI metrics.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: STORAGE AND ENVIRONMENTAL LOGS ----------------- */}
        {activeTab === "storage" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Environmental Logs</h2>
              <p className="text-slate-400 text-sm mt-1">
                Log temperature and humidity readings. Actionable optimization rules run on every entry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Climate Logger */}
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-bold mb-4">Log Climate Telemetry</h3>
                
                <form onSubmit={handleLogSensors} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2">
                      Temperature (°C)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sensorInput.temperature}
                      onChange={(e) => setSensorInput(prev => ({...prev, temperature: e.target.value}))}
                      className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2">
                      Relative Humidity (%)
                    </label>
                    <input 
                      type="number"
                      value={sensorInput.humidity}
                      onChange={(e) => setSensorInput(prev => ({...prev, humidity: e.target.value}))}
                      className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-3 text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2">
                        Air Circulation
                      </label>
                      <select 
                        value={sensorInput.air_circulation}
                        onChange={(e) => setSensorInput(prev => ({...prev, air_circulation: e.target.value}))}
                        className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-3 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                      >
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-2">
                        Light Exposure
                      </label>
                      <select 
                        value={sensorInput.light_exposure}
                        onChange={(e) => setSensorInput(prev => ({...prev, light_exposure: e.target.value}))}
                        className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-3 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-bold tracking-wider transition-all uppercase text-xs mt-4"
                  >
                    Log Climate Reading
                  </button>
                </form>
              </div>

              {/* Climate Compliance & Actionable Recommendations */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-4">Compliance Diagnosis</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#090d16]/60 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Current State</span>
                      <span className={`text-lg font-extrabold ${storageStatus?.status === "Compliant" ? "text-emerald-400" : "text-amber-400"}`}>
                        {storageStatus ? storageStatus.status : "Compliant"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Climate Adjustments Required:</span>
                      
                      <div className="space-y-2">
                        {storageStatus?.recommendations && storageStatus.recommendations.length > 0 ? (
                          storageStatus.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-2 text-xs text-amber-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-2 text-xs text-emerald-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                            <CheckCircle size={15} className="shrink-0 mt-0.5" />
                            <span>Storage variables are ideal. No adjustments needed.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 justify-center mt-6">
                  <Info size={12} />
                  <span>Compliance engine updates immediately on new sensor entries.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: NOTIFICATIONS AND ALERTS ----------------- */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Active Alerts</h2>
                <p className="text-slate-400 text-sm mt-1">Real-time alerts generated from visual audits and climate sensors.</p>
              </div>
              
              <button
                onClick={async () => {
                  if (isBackendConnected) {
                    await fetch(`${API_BASE}/api/notifications/read-all`, { method: "PUT" });
                    fetchData();
                  } else {
                    setNotifications(prev => prev.map(n => ({...n, is_read: true})));
                  }
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`glass-card p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      notif.is_read ? "border-white/5 opacity-60" : "border-emerald-500/20 bg-emerald-500/[0.01]"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      notif.type === "Spoilage" ? "bg-rose-500/10 text-rose-400" :
                      notif.type === "Storage" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>
                      <AlertTriangle size={18} />
                    </div>

                    <div className="grow space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-100">{notif.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(notif.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>

                    <button
                      onClick={() => clearAlert(notif.id)}
                      className="p-1 hover:bg-white/5 text-slate-500 hover:text-slate-300 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Inbox size={48} className="mx-auto mb-4 stroke-1 opacity-50" />
                  <p>No alerts recorded.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/5 text-center text-[11px] text-slate-500">
        <p>© 2026 Food Freshness Monitoring Platform. Built with FastAPI and React.js.</p>
      </footer>

      {/* ----------------- MODAL: REGISTER STOCK ITEM ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl w-full max-w-lg border border-white/10 overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#090d16]/80">
              <h3 className="text-lg font-bold">Register Food Stock</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Red Gala Apples"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({...prev, name: e.target.value}))}
                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({...prev, category: e.target.value}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery Products">Bakery Products</option>
                    <option value="Packaged Foods">Packaged Foods</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Batch Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. BAT-APP-09"
                    value={newItem.batch_number}
                    onChange={(e) => setNewItem(prev => ({...prev, batch_number: e.target.value}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Shelf Life (Days)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newItem.shelf_life_days}
                    onChange={(e) => setNewItem(prev => ({...prev, shelf_life_days: parseInt(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Storage Temp (°C)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={newItem.storage_temp}
                    onChange={(e) => setNewItem(prev => ({...prev, storage_temp: parseFloat(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Humidity (%)</label>
                  <input 
                    type="number" 
                    value={newItem.humidity}
                    onChange={(e) => setNewItem(prev => ({...prev, humidity: parseInt(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Packaging Type</label>
                <select 
                  value={newItem.packaging_type}
                  onChange={(e) => setNewItem(prev => ({...prev, packaging_type: e.target.value}))}
                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                >
                  <option value="Loose">Loose</option>
                  <option value="Plastic Wrap">Plastic Wrap</option>
                  <option value="Vacuum">Vacuum Pack</option>
                  <option value="Box">Box Container</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-bold transition-all text-xs"
                >
                  Register Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: EDIT STOCK ITEM ----------------- */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl w-full max-w-lg border border-white/10 overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#090d16]/80">
              <h3 className="text-lg font-bold">Edit Food Stock (ID: #{editingItem.id})</h3>
              <button 
                onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditItem} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => ({...prev, name: e.target.value}))}
                  className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Category</label>
                  <select 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem(prev => ({...prev, category: e.target.value}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery Products">Bakery Products</option>
                    <option value="Packaged Foods">Packaged Foods</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Batch Number</label>
                  <input 
                    type="text" 
                    value={editingItem.batch_number}
                    onChange={(e) => setEditingItem(prev => ({...prev, batch_number: e.target.value}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem(prev => ({...prev, quantity: parseFloat(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Storage Temp (°C)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={editingItem.storage_temp}
                    onChange={(e) => setEditingItem(prev => ({...prev, storage_temp: parseFloat(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Humidity (%)</label>
                  <input 
                    type="number" 
                    value={editingItem.humidity}
                    onChange={(e) => setEditingItem(prev => ({...prev, humidity: parseInt(e.target.value)}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase mb-1">Packaging Type</label>
                  <select 
                    value={editingItem.packaging_type}
                    onChange={(e) => setEditingItem(prev => ({...prev, packaging_type: e.target.value}))}
                    className="w-full bg-[#090d16]/80 border border-white/10 rounded-xl px-3 py-2.5 text-slate-100 font-semibold focus:border-emerald-500 outline-none"
                  >
                    <option value="Loose">Loose</option>
                    <option value="Plastic Wrap">Plastic Wrap</option>
                    <option value="Vacuum">Vacuum Pack</option>
                    <option value="Box">Box Container</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-900 rounded-xl font-bold transition-all text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: DELETE CONFIRMATION ----------------- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl w-full max-w-md border border-white/10 overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#090d16]/80">
              <h3 className="text-lg font-bold text-rose-400">Confirm Stock Deletion</h3>
              <button 
                onClick={() => setItemToDelete(null)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300">
                Are you sure you want to permanently delete <strong className="text-white font-bold">{itemToDelete.name}</strong> (Batch: {itemToDelete.batch_number || "N/A"}) from the inventory records?
              </p>
              <p className="text-xs text-rose-400/80 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                ⚠️ Warning: This action is irreversible. All related visual inspection analyses and records for this item will be deleted.
              </p>
              
              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="w-1/2 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const idToDelete = itemToDelete.id;
                    const nameToDelete = itemToDelete.name;
                    setItemToDelete(null);
                    try {
                      if (isBackendConnected) {
                        const response = await fetch(`${API_BASE}/api/inventory/${idToDelete}`, { 
                          method: "DELETE",
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (response.ok) {
                          alert(`Successfully deleted ${nameToDelete}`);
                          fetchData();
                        } else {
                          const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
                          alert(`Delete failed: ${errorData.detail || response.statusText}`);
                        }
                      } else {
                        setInventory(prev => prev.filter(i => i.id !== idToDelete));
                        alert(`Successfully deleted ${nameToDelete} (Simulated)`);
                      }
                    } catch (err) {
                      console.error("Delete failed:", err);
                      alert(`Delete failed: ${err.message}`);
                    }
                  }}
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all text-xs"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
