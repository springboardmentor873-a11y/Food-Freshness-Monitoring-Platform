import os
import tempfile
from datetime import datetime

import streamlit as st
from PIL import Image

from predict import predict_food
from data import storage_info
from recommendation import get_safety_message, get_action_steps
from charts import show_probability_chart
from report import generate_text_report
from PIL import Image
import base64
from pathlib import Path

# ---------------------------------------------------------
# PAGE CONFIGURATION
# ---------------------------------------------------------
logo = Image.open("assets/logo.png")
st.set_page_config(
    page_title="FreshSense AI",
    page_icon=logo,
    layout="wide",
    initial_sidebar_state="collapsed"
)



# ---------------------------------------------------------
# CUSTOM UI STYLING
# ---------------------------------------------------------

st.markdown(
    """
    <style>
        .stApp {
            background:
                radial-gradient(circle at top left, #e8fff2 0%, transparent 35%),
                radial-gradient(circle at top right, #eef5ff 0%, transparent 35%),
                #f8fafc;
        }

        .block-container {
            max-width: 1250px;
            padding-top: 4.5rem;
            padding-bottom: 3rem;
        }

        .hero-card {
            padding: 32px;
            border-radius: 24px;
            background: linear-gradient(135deg, #123524, #1e7045);
            color: white;
            box-shadow: 0 18px 50px rgba(18, 53, 36, 0.18);
            margin-top: 10px;
            margin-bottom: 24px;
        }
        .hero-title {
            font-size: 46px;
            font-weight: 800;
            margin: 0;
            letter-spacing: -1px;
        }

        .hero-subtitle {
            font-size: 18px;
            margin-top: 10px;
            color: #d8f3e3;
            max-width: 760px;
        }

        .section-title {
            font-size: 26px;
            font-weight: 750;
            color: #172033;
            margin-top: 15px;
            margin-bottom: 14px;
        }

        .result-banner-fresh {
            padding: 18px 22px;
            border-radius: 16px;
            background: #e9f9ef;
            border: 1px solid #b5e8c7;
            color: #126437;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 18px;
        }

        .result-banner-spoiled {
            padding: 18px 22px;
            border-radius: 16px;
            background: #fff0f0;
            border: 1px solid #f1baba;
            color: #a32626;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 18px;
        }

        .metric-card {
            min-height: 135px;
            padding: 20px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.94);
            border: 1px solid #e5e9ef;
            box-shadow: 0 10px 28px rgba(32, 45, 65, 0.07);
            margin-bottom: 12px;
        }

        .metric-icon {
            font-size: 25px;
            margin-bottom: 8px;
        }

        .metric-label {
            color: #6b7280;
            font-size: 13px;
            font-weight: 650;
            text-transform: uppercase;
            letter-spacing: 0.7px;
        }

        .metric-value {
            color: #172033;
            font-size: 20px;
            font-weight: 800;
            margin-top: 6px;
            overflow-wrap: anywhere;
        }

        .recommendation-card {
            padding: 22px;
            border-radius: 18px;
            background: #fffbea;
            border: 1px solid #f0df94;
            color: #634f00;
            box-shadow: 0 10px 28px rgba(84, 67, 0, 0.06);
            margin-top: 12px;
            margin-bottom: 22px;
        }

        .recommendation-title {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 7px;
        }

        .confidence-box {
            padding: 20px;
            border-radius: 18px;
            background: white;
            border: 1px solid #e5e9ef;
            box-shadow: 0 10px 28px rgba(32, 45, 65, 0.07);
            margin-bottom: 16px;
        }

        .details-card {
            min-height: 145px;
            padding: 22px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid #e5e9ef;
            box-shadow: 0 10px 28px rgba(32, 45, 65, 0.07);
            margin-bottom: 14px;
        }

        .details-title {
            color: #6b7280;
            font-size: 13px;
            font-weight: 750;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            margin-bottom: 8px;
        }

        .details-value {
            color: #172033;
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 10px;
        }

        .safety-safe {
            padding: 22px;
            border-radius: 18px;
            background: #e9f9ef;
            border: 1px solid #b5e8c7;
            color: #126437;
            font-size: 20px;
            font-weight: 850;
            text-align: center;
            box-shadow: 0 10px 28px rgba(18, 100, 55, 0.08);
            margin-bottom: 14px;
        }

        .safety-unsafe {
            padding: 22px;
            border-radius: 18px;
            background: #fff0f0;
            border: 1px solid #f1baba;
            color: #a32626;
            font-size: 20px;
            font-weight: 850;
            text-align: center;
            box-shadow: 0 10px 28px rgba(163, 38, 38, 0.08);
            margin-bottom: 14px;
        }

        .list-card {
            padding: 22px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid #e5e9ef;
            box-shadow: 0 10px 28px rgba(32, 45, 65, 0.07);
            margin-bottom: 18px;
        }

        .list-card ul {
            margin: 10px 0 0 20px;
            padding: 0;
        }

        .list-card li {
            margin-bottom: 9px;
            color: #334155;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            padding-top: 30px;
            padding-bottom: 12px;
        }

        [data-testid="stFileUploader"] {
            background: white;
            border: 1px solid #dfe5ec;
            border-radius: 18px;
            padding: 12px;
            box-shadow: 0 10px 28px rgba(32, 45, 65, 0.05);
        }

        [data-testid="stImage"] img {
            border-radius: 18px;
            border: 1px solid #e3e8ef;
            box-shadow: 0 12px 32px rgba(32, 45, 65, 0.10);
        }
    </style>
    """,
    unsafe_allow_html=True
)


# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------

def display_metric(icon: str, label: str, value: str) -> None:
    """Display a styled information card."""

    st.markdown(
        f"""
        <div class="metric-card">
            <div class="metric-icon">{icon}</div>
            <div class="metric-label">{label}</div>
            <div class="metric-value">{value}</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def format_class_name(class_name: str) -> str:
    """Convert a class key into a readable display label."""

    return class_name.replace("_", " ").title()


# ---------------------------------------------------------
# HEADER
# ---------------------------------------------------------


def get_base64_image(image_path: str) -> str:
    image_bytes = Path(image_path).read_bytes()
    return base64.b64encode(image_bytes).decode()


logo_base64 = get_base64_image("assets/logo.png")

hero_html = f"""
<div class="hero-card">
<div style="display:flex; align-items:center; gap:26px;">
<img
src="data:image/png;base64,{logo_base64}"
style="
width:125px;
height:125px;
object-fit:cover;
border-radius:24px;
background:white;
padding:6px;
box-shadow:0 10px 26px rgba(0,0,0,0.18);
flex-shrink:0;
"
/>

<div>
<div class="hero-title">FreshSense AI</div>
<div class="hero-subtitle">
Intelligent food freshness classification, confidence analysis,
shelf-life estimation and safe-storage recommendations powered by
EfficientNetB0 Transfer Learning.
</div>
</div>
</div>
</div>
"""

st.markdown(hero_html, unsafe_allow_html=True)
# ---------------------------------------------------------
# IMAGE UPLOAD
# ---------------------------------------------------------

st.markdown(
    '<div class="section-title">Upload food image</div>',
    unsafe_allow_html=True
)

uploaded_file = st.file_uploader(
    "Upload a JPG, JPEG or PNG food image",
    type=["jpg", "jpeg", "png"],
    label_visibility="collapsed"
)


# ---------------------------------------------------------
# PREDICTION AND RESULT DASHBOARD
# ---------------------------------------------------------

if uploaded_file is not None:
    temporary_path = None

    try:
        uploaded_image = Image.open(uploaded_file).convert("RGB")

        left_column, right_column = st.columns(
            [0.85, 1.45],
            gap="large"
        )

        with left_column:
            st.markdown(
                '<div class="section-title">Uploaded image</div>',
                unsafe_allow_html=True
            )

            st.image(
                uploaded_image,
                use_container_width=True
            )

            st.caption(
                f"File: {uploaded_file.name} | "
                f"Analysed: {datetime.now().strftime('%d %b %Y, %I:%M %p')}"
            )

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temporary_file:
            uploaded_image.save(
                temporary_file.name,
                format="JPEG"
            )
            temporary_path = temporary_file.name

        with st.spinner("FreshSense AI is analysing the image..."):
            predicted_class, confidence, probabilities = predict_food(
                temporary_path
            )

        if predicted_class not in storage_info:
            st.error(
                "Prediction was generated, but recommendation information "
                "for this category is unavailable."
            )
            st.stop()

        info = storage_info[predicted_class]
        readable_prediction = format_class_name(predicted_class)
        is_fresh = info["Status"] == "Fresh"

        with right_column:
            st.markdown(
                '<div class="section-title">AI analysis</div>',
                unsafe_allow_html=True
            )

            banner_class = (
                "result-banner-fresh"
                if is_fresh
                else "result-banner-spoiled"
            )

            status_icon = "✅" if is_fresh else "⚠️"

            st.markdown(
                f"""
                <div class="{banner_class}">
                    {status_icon} {readable_prediction} detected
                </div>
                """,
                unsafe_allow_html=True
            )

            st.markdown(
                f"""
                <div class="confidence-box">
                    <div class="metric-label">Model confidence</div>
                    <div class="metric-value">{confidence:.2f}%</div>
                </div>
                """,
                unsafe_allow_html=True
            )

            st.progress(
                min(max(int(round(confidence)), 0), 100),
                text=f"Prediction confidence: {confidence:.2f}%"
            )

        st.markdown(
            '<div class="section-title">Freshness and storage insights</div>',
            unsafe_allow_html=True
        )

        card_1, card_2, card_3 = st.columns(3)

        with card_1:
            display_metric(
                "📅",
                "Estimated shelf life",
                info["Shelf Life"]
            )

        with card_2:
            display_metric(
                "🌡️",
                "Recommended temperature",
                info["Temperature"]
            )

        with card_3:
            display_metric(
                "💧",
                "Recommended humidity",
                info["Humidity"]
            )

        card_4, card_5, card_6 = st.columns(3)

        with card_4:
            display_metric(
                "📦",
                "Storage method",
                info["Storage"]
            )

        with card_5:
            display_metric(
                "🔍",
                "Food status",
                info["Status"]
            )

        with card_6:
            display_metric(
                "🤖",
                "Detected category",
                readable_prediction
            )

        st.markdown(
            f"""
            <div class="recommendation-card">
                <div class="recommendation-title">
                    💡 Smart recommendation
                </div>
                <div>{info["Recommendation"]}</div>
            </div>
            """,
            unsafe_allow_html=True
        )
        safety_message = get_safety_message(info)
        action_steps = get_action_steps(info)

        st.markdown(
            '<div class="section-title">Safety summary and recommended actions</div>',
            unsafe_allow_html=True
        )

        st.info(safety_message)

        for step in action_steps:
            st.write(f"✅ {step}")

        # -------------------------------------------------
        # FOOD INFORMATION, HEALTH RISK AND SAFETY ANALYSIS
        # -------------------------------------------------

        st.markdown(
            '<div class="section-title">Food information and safety analysis</div>',
            unsafe_allow_html=True
        )

        food_col, category_col, risk_col = st.columns(3)

        with food_col:
            st.markdown(
                f'''
                <div class="details-card">
                    <div class="details-title">🍽️ Food name</div>
                    <div class="details-value">{info["Food Name"]}</div>
                    <div class="details-title">Detected class</div>
                    <div class="details-value">{readable_prediction}</div>
                </div>
                ''',
                unsafe_allow_html=True
            )

        with category_col:
            st.markdown(
                f'''
                <div class="details-card">
                    <div class="details-title">🏷️ Food category</div>
                    <div class="details-value">{info["Category"]}</div>
                    <div class="details-title">Freshness status</div>
                    <div class="details-value">{info["Status"]}</div>
                </div>
                ''',
                unsafe_allow_html=True
            )

        with risk_col:
            st.markdown(
                f'''
                <div class="details-card">
                    <div class="details-title">⚠️ Risk level</div>
                    <div class="details-value">{info["Risk"]}</div>
                    <div class="details-title">Consumption decision</div>
                    <div class="details-value">{"Safe" if is_fresh else "Unsafe"}</div>
                </div>
                ''',
                unsafe_allow_html=True
            )

        safety_class = "safety-safe" if is_fresh else "safety-unsafe"
        safety_icon = "✅" if is_fresh else "⛔"

        st.markdown(
            f'''
            <div class="{safety_class}">
                {safety_icon} {info["Safety"]}
            </div>
            ''',
            unsafe_allow_html=True
        )

        health_items = "".join(
            f"<li>{risk}</li>" for risk in info["Health Risk"]
        )
        prevention_items = "".join(
            f"<li>{tip}</li>" for tip in info["Prevention"]
        )

        health_col, prevention_col = st.columns(2, gap="large")

        with health_col:
            st.markdown(
                f'''
                <div class="list-card">
                    <div class="recommendation-title">❤️ Health risk assessment</div>
                    <ul>{health_items}</ul>
                </div>
                ''',
                unsafe_allow_html=True
            )

        with prevention_col:
            st.markdown(
                f'''
                <div class="list-card">
                    <div class="recommendation-title">🛡️ Prevention tips</div>
                    <ul>{prevention_items}</ul>
                </div>
                ''',
                unsafe_allow_html=True
            )

        st.markdown(
            '<div class="section-title">Top prediction probabilities</div>',
            unsafe_allow_html=True
        )

        sorted_predictions = sorted(
            probabilities.items(),
            key=lambda item: item[1],
            reverse=True
        )

        top_predictions = sorted_predictions[:3]

        for class_name, probability in top_predictions:
            display_name = format_class_name(class_name)

            st.write(
                f"**{display_name}** — {probability:.2f}%"
            )

            st.progress(
                min(max(int(round(probability)), 0), 100)
            )

        with st.expander("View probability for all eight classes"):
            for class_name, probability in sorted_predictions:
                st.write(
                    f"{format_class_name(class_name)}: "
                    f"{probability:.2f}%"
                )

        st.markdown(
            '<div class="section-title">Prediction probability chart</div>',
            unsafe_allow_html=True
        )

        show_probability_chart(probabilities)

        report_file = generate_text_report(
            image_name=uploaded_file.name,
            predicted_class=predicted_class,
            confidence=confidence,
            info=info
        )

        st.download_button(
            label="📄 Download AI Analysis Report",
            data=report_file,
            file_name="FreshSense_AI_Report.txt",
            mime="text/plain",
            use_container_width=True
        )

    except Exception as error:
        st.error(
            "The image could not be analysed. "
            "Please try another valid food image."
        )

        st.exception(error)

    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)

else:
    st.info(
        "Upload a food image to begin freshness analysis."
    )


# ---------------------------------------------------------
# FOOTER
# ---------------------------------------------------------

st.markdown(
    """
    <div class="footer">
        FreshSense AI • Powered by EfficientNetB0 Transfer Learning<br>
        Food Freshness Monitoring Platform
    </div>
    """,
    unsafe_allow_html=True
)