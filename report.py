from datetime import datetime
from io import BytesIO


def generate_text_report(
    image_name: str,
    predicted_class: str,
    confidence: float,
    info: dict
) -> bytes:
    readable_class = predicted_class.replace("_", " ").title()

    report = f"""
FRESHSENSE AI
Food Freshness Monitoring Platform

Generated On:
{datetime.now().strftime('%d %B %Y, %I:%M %p')}

Image:
{image_name}

Prediction:
{readable_class}

Confidence:
{confidence:.2f}%

Shelf Life:
{info['Shelf Life']}

Temperature:
{info['Temperature']}

Humidity:
{info['Humidity']}

Storage:
{info['Storage']}

Status:
{info['Status']}

Risk Level:
{info['Risk']}

Safety:
{info['Safety']}

Recommendation:
{info['Recommendation']}

Health Risks:
{chr(10).join('- ' + item for item in info['Health Risk'])}

Prevention Tips:
{chr(10).join('- ' + item for item in info['Prevention'])}
"""

    buffer = BytesIO()
    buffer.write(report.encode("utf-8"))
    buffer.seek(0)

    return buffer.getvalue()