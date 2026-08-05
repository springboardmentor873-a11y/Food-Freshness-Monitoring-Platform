import os
import csv
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(title: str, predictions: list, inventory_items: list, output_path: str) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#065f46'),
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#047857'),
        spaceBefore=14,
        spaceAfter=8
    )

    normal_style = styles['Normal']

    story = []
    story.append(Paragraph(f"🍃 {title}", title_style))
    story.append(Paragraph(f"<b>Generated On:</b> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", normal_style))
    story.append(Spacer(1, 14))

    # Prediction Summary Section
    story.append(Paragraph("Food Freshness AI Predictions Summary", h2_style))

    if not predictions:
        story.append(Paragraph("No prediction records found.", normal_style))
    else:
        pred_data = [["ID", "Item Name", "Category", "Freshness Score", "Category", "Confidence", "Analyzed Date"]]
        for p in predictions[:20]:
            analyzed = p.analyzed_at.strftime('%Y-%m-%d %H:%M') if isinstance(p.analyzed_at, datetime) else str(p.analyzed_at)
            pred_data.append([
                str(p.id)[:12],
                str(p.item_name),
                str(p.category),
                f"{p.freshness_score:.1f}%",
                str(p.freshness_category),
                f"{p.confidence:.1f}%",
                analyzed
            ])

        t_pred = Table(pred_data, colWidths=[70, 110, 80, 80, 80, 60, 90])
        t_pred.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0fdf4')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#a7f3d0')),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
        ]))
        story.append(t_pred)

    story.append(Spacer(1, 16))

    # Inventory Section
    story.append(Paragraph("Current Food Inventory & Expiry Status", h2_style))

    if not inventory_items:
        story.append(Paragraph("No inventory records found.", normal_style))
    else:
        inv_data = [["Food Name", "Category", "Quantity", "Added Date", "Expiry Date", "Location", "Status"]]
        for i in inventory_items[:25]:
            added = i.date_added.strftime('%Y-%m-%d') if isinstance(i.date_added, datetime) else str(i.date_added)
            expiry = i.expiry_date.strftime('%Y-%m-%d') if isinstance(i.expiry_date, datetime) else str(i.expiry_date)
            inv_data.append([
                str(i.food_name),
                str(i.category),
                f"{i.quantity} {i.unit}",
                added,
                expiry,
                str(i.storage_location),
                str(i.status)
            ])

        t_inv = Table(inv_data, colWidths=[100, 80, 70, 70, 70, 80, 70])
        t_inv.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#047857')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
        ]))
        story.append(t_inv)

    doc.build(story)
    return output_path

def generate_csv_report(predictions: list, inventory_items: list, output_path: str) -> str:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["=== FOOD FRESHNESS AI PREDICTIONS ==="])
        writer.writerow(["ID", "Item Name", "Category", "Freshness Score", "Freshness Category", "Confidence", "Shelf Life (Days)", "Health Score", "Analyzed At"])
        for p in predictions:
            analyzed = p.analyzed_at.strftime('%Y-%m-%d %H:%M:%S') if isinstance(p.analyzed_at, datetime) else str(p.analyzed_at)
            writer.writerow([p.id, p.item_name, p.category, p.freshness_score, p.freshness_category, p.confidence, p.shelf_life_days, p.health_score, analyzed])

        writer.writerow([])
        writer.writerow(["=== INVENTORY ITEMS ==="])
        writer.writerow(["ID", "Food Name", "Category", "Quantity", "Unit", "Added Date", "Expiry Date", "Storage Location", "Status"])
        for i in inventory_items:
            added = i.date_added.strftime('%Y-%m-%d') if isinstance(i.date_added, datetime) else str(i.date_added)
            expiry = i.expiry_date.strftime('%Y-%m-%d') if isinstance(i.expiry_date, datetime) else str(i.expiry_date)
            writer.writerow([i.id, i.food_name, i.category, i.quantity, i.unit, added, expiry, i.storage_location, i.status])

    return output_path
