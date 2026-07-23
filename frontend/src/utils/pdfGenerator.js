import jsPDF from "jspdf";

export const generatePDF = (prediction, imageData) => {
  if (!prediction) return;

  const {
    food_name,
    freshness,
    confidence,
    shelf_life,
    storage,
    recommendation,
    risk_level,
  } = prediction;

  const doc = new jsPDF();

  // Header
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Food Freshness Monitoring Platform", 20, 20);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text("AI Analysis Report", 20, 42);

  // Add uploaded image
  if (imageData) {
    try {
      doc.addImage(imageData, "JPEG", 20, 50, 60, 60);
    } catch (e) {
      console.log("Image could not be added to PDF", e);
    }
  }

  let y = 125;

  const addRow = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);

    doc.setFont("helvetica", "normal");
    doc.text(String(value), 80, y);

    y += 12;
  };

  addRow("Food Name", food_name);
  addRow("Prediction", freshness);
  addRow("Confidence", `${confidence}%`);
  addRow("Shelf Life", shelf_life);
  addRow("Storage", storage);
  addRow("Risk Level", risk_level);

  // Recommendation
  doc.setFont("helvetica", "bold");
  doc.text("Recommendation", 20, y);

  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(recommendation, 110);
  doc.text(lines, 80, y);

  y += lines.length * 8 + 12;

  addRow("Generated On", new Date().toLocaleString());

  // Footer
  doc.setDrawColor(180);
  doc.line(20, 270, 190, 270);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Generated using Artificial Intelligence", 20, 280);

  doc.save(`${food_name}_AI_Report.pdf`);
};