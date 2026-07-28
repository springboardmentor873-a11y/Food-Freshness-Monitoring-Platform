import os
import base64
import tempfile
from datetime import datetime
from pathlib import Path

import streamlit as st
from PIL import Image

from predict import predict_food
from data import storage_info
from recommendation import get_safety_message, get_action_steps
from charts import show_probability_chart
from report import generate_text_report
from ai_insights import show_ai_insights
from history import show_history_page
from about import show_about_page

# =========================================================
# PAGE CONFIGURATION
# =========================================================
ASSETS = Path("assets")
LOGO_PATH = ASSETS / "logo.png"
HERO_PATH = ASSETS / "hero_bg.png"

page_icon = Image.open(LOGO_PATH) if LOGO_PATH.exists() else "🍃"
st.set_page_config(
    page_title="FreshSense AI",
    page_icon=page_icon,
    layout="wide",
    initial_sidebar_state="expanded",
)


# =========================================================
# HELPERS
# =========================================================
def file_to_base64(path: Path) -> str:
    if not path.exists():
        return ""
    return base64.b64encode(path.read_bytes()).decode("utf-8")


def format_class_name(class_name: str) -> str:
    return class_name.replace("_", " ").title()


def reset_analysis() -> None:
    for key in [
        "page",
        "uploaded_bytes",
        "uploaded_name",
        "predicted_class",
        "confidence",
        "probabilities",
        "analysed_at",
    ]:
        st.session_state.pop(key, None)
    st.session_state.page = "home"


def metric_card(icon: str, label: str, value: str, tone: str = "green") -> None:
    st.markdown(
        f"""
        <div class="metric-card tone-{tone}">
            <div class="metric-icon">{icon}</div>
            <div>
                <div class="metric-label">{label}</div>
                <div class="metric-value">{value}</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def confidence_ring(value: float, fresh: bool) -> None:
    ring_color = "#2faf59" if fresh else "#ef5350"
    st.markdown(
        f"""
        <div class="confidence-card">
            <div class="confidence-label">AI confidence score</div>
            <div class="confidence-ring" style="--score:{max(0, min(value, 100))}; --ring:{ring_color};">
                <div class="confidence-inner">
                    <strong>{value:.1f}%</strong>
                    <span>{'Very high' if value >= 90 else 'High' if value >= 75 else 'Moderate'}</span>
                </div>
            </div>
            <div class="quality-stars">★★★★★</div>
            <div class="quality-copy">Model prediction certainty</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# =========================================================
# STATE
# =========================================================
if "page" not in st.session_state:
    st.session_state.page = "home"

if "menu" not in st.session_state:
    st.session_state.menu = "home"


# =========================================================
# PREMIUM CSS
# =========================================================
logo_b64 = file_to_base64(LOGO_PATH)
hero_b64 = file_to_base64(HERO_PATH)
hero_background = (
    f"linear-gradient(90deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.18) 45%, rgba(0,0,0,.05) 100%), "
    f"url('data:image/png;base64,{hero_b64}')"
    if hero_b64
    else "linear-gradient(90deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.18) 45%, rgba(0,0,0,.05) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2200&q=90')"
)

st.markdown(
    f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');

    :root {{
        --forest:#073b2a;
        --forest-2:#0d5539;
        --leaf:#74c044;
        --leaf-bright:#9bdd55;
        --cream:#fbfaf5;
        --ink:#14231c;
        --muted:#67736c;
        --line:#e7ebe7;
        --danger:#e94f4f;
    }}

    html, body, [class*="css"] {{ font-family:'DM Sans',sans-serif; }}
    h1,h2,h3,.brand-name,.hero-title {{ font-family:'Manrope',sans-serif; }}
    .stApp {{ background:#f8f8f4; color:var(--ink); }}
    .block-container {{ max-width:1440px; padding:1.2rem 2rem 3rem 2rem; }}
    header[data-testid="stHeader"] {{ background:transparent; }}
    #MainMenu, footer {{ visibility:hidden; }}

    [data-testid="stSidebar"] {{
        background:linear-gradient(180deg,#042e21 0%,#073d2b 55%,#0b5136 100%);
        border-right:1px solid rgba(255,255,255,.08);
        min-width:245px;
        max-width:245px;
    }}
    [data-testid="stSidebar"] > div:first-child {{ padding:1.25rem .9rem 1.25rem; }}
    [data-testid="stSidebar"] * {{ color:white; }}

    .sidebar-brand {{ display:flex; align-items:center; gap:11px; padding:8px 5px 22px; }}
    .sidebar-logo {{ width:44px; height:44px; object-fit:cover; border-radius:14px; background:white; padding:4px; }}
    .brand-name {{ font-size:19px; font-weight:800; line-height:1.05; }}
    .brand-name span {{ color:#a5e45e; }}
    .brand-tag {{ font-size:10px; color:#b8d8c9!important; margin-top:4px; }}

    .nav-item {{ display:flex; align-items:center; gap:12px; padding:12px 13px; border-radius:12px; margin:5px 0; font-weight:600; color:#d9eee4; }}
    .nav-item.active {{ background:linear-gradient(90deg,#71bf3c,#16824f); color:white; box-shadow:0 8px 22px rgba(61,183,102,.22); }}
    .nav-icon {{ width:22px; text-align:center; }}

    .sidebar-ai-card {{ margin-top:38px; border:1px solid rgba(163,228,94,.25); border-radius:16px; padding:16px; background:rgba(3,27,19,.35); box-shadow:inset 0 1px 0 rgba(255,255,255,.04); }}
    .sidebar-kicker {{ color:#9cdd55!important; font-size:10px; font-weight:800; letter-spacing:.8px; }}
    .sidebar-ai-title {{ font-weight:800; margin:6px 0 10px; }}
    .sidebar-ai-copy {{ color:#cce0d5!important; font-size:11px; line-height:1.65; }}
    .ai-orb {{ height:105px; margin-top:13px; border-radius:14px; background:radial-gradient(circle at 50% 45%,rgba(99,230,139,.55),rgba(15,95,65,.15) 45%,transparent 67%); display:flex; align-items:center; justify-content:center; font-size:42px; }}

    .top-actions {{ display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-bottom:12px; }}
    .user-pill {{ background:white; border:1px solid var(--line); border-radius:999px; padding:8px 13px; box-shadow:0 6px 20px rgba(19,52,36,.06); font-size:13px; font-weight:700; }}

    .hero {{
      
    position:relative;
    min-height:700px;
    border-radius:26px;
    overflow:hidden;

    display:flex;
    justify-content:center;
    align-items:center;

    text-align:center;

    background-image:{hero_background};
    background-size:cover;
    background-position:center;

    padding:40px;

    }}
    .hero-content {{  max-width:900px;
    width:100%;

    position:relative;
    z-index:2;

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    text-align:center;

    padding:0; }}
    .ai-badge {{ display:inline-flex; background:rgba(126,207,69,.92); color:#123421; border-radius:999px; padding:7px 13px; font-size:12px; font-weight:800; margin-bottom:15px; }}
    .hero-title{{
    color:#ffffff;

    font-size:96px;

    font-weight:900;

    line-height:1;

    letter-spacing:-3px;

    margin-bottom:18px;

    text-shadow:
        0px 4px 20px rgba(0,0,0,.45);
}}
    .hero-title span {{   color:#8EE63A;

    text-shadow:
        0px 0px 20px rgba(142,230,58,.45); }}
   .hero-subtitle{{
    color:white;

    font-size:28px;

    font-weight:700;

    margin-top:8px;

    margin-bottom:18px;
}}
.hero-copy{{

    color:#ffffff;

    font-size:20px;

    max-width:850px;

    line-height:1.8;

    margin:20px auto;

    text-shadow:
        0 2px 8px rgba(0,0,0,.45);

}}
   .hero-points{{

    display:flex;

    justify-content:center;

    align-items:center;

    gap:45px;

    margin-top:28px;

}}
    .hero-point {{ color:white; font-size:12px; font-weight:700; }}
    .hero-point small {{ display:block; color:#cfe6d7; font-weight:500; margin-top:2px; }}

    .section-heading {{ display:flex; align-items:center; gap:9px; margin:25px 0 13px; font:800 19px 'Manrope'; color:#183326; }}
    .leaf-dot {{ color:#5eaf38; }}

    .upload-overlap {{ margin-top:-112px; position:relative; z-index:5; padding:0 34px; }}
    .upload-title {{ text-align:center; color:#173426; font:800 24px 'Manrope'; margin-bottom:8px; }}
    .upload-subtitle {{ text-align:center; color:#6b786f; font-size:13px; margin-bottom:14px; }}

    [data-testid="stFileUploader"] {{
        background:rgba(255,255,255,.985); border:2px dashed #9dca8b; border-radius:22px;
        padding:28px 28px; box-shadow:0 12px 34px rgba(24,74,45,.07); transition:.25s ease;
    }}
    [data-testid="stFileUploader"]:hover {{ border-color:#42a45e; transform:translateY(-2px); box-shadow:0 18px 38px rgba(24,74,45,.12); }}
    [data-testid="stFileUploaderDropzone"] {{ min-height:165px; border:none; background:transparent; }}
    [data-testid="stFileUploader"] button {{ background:linear-gradient(90deg,#67b934,#1b944e)!important; color:white!important; border:none!important; border-radius:12px!important; font-weight:800!important; padding:.65rem 1.3rem!important; }}

    .features-grid {{ display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }}
    .feature-card {{ background:white; border:1px solid #edf0ed; border-radius:18px; padding:18px 10px; text-align:center; min-height:132px; box-shadow:0 10px 28px rgba(28,61,44,.06); transition:.25s ease; }}
    .feature-card:hover {{ transform:translateY(-6px); box-shadow:0 18px 38px rgba(28,61,44,.12); }}
    .feature-icon {{ width:45px; height:45px; display:flex; align-items:center; justify-content:center; margin:0 auto 11px; border-radius:14px; font-size:23px; background:#eff9e9; }}
    .feature-title {{ font-weight:800; font-size:13px; }}
    .feature-copy {{ color:var(--muted); font-size:11px; margin-top:4px; }}

    .steps {{ display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:8px; }}
    .step-card {{ background:white; border:1px solid #edf0ed; border-radius:18px; padding:19px 16px; box-shadow:0 10px 25px rgba(28,61,44,.05); position:relative; }}
    .step-number {{ width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#ddf1cd; color:#2e7a35; font-weight:800; margin-bottom:12px; }}
    .step-title {{ font-weight:800; font-size:13px; }}
    .step-copy {{ font-size:11px; line-height:1.5; color:var(--muted); margin-top:5px; }}

    .results-header {{ display:flex; justify-content:space-between; align-items:center; margin:4px 0 16px; }}
    .results-title {{ font:800 26px 'Manrope'; }}
    .results-subtitle {{ color:var(--muted); font-size:13px; margin-top:4px; }}

    .panel {{ background:white; border:1px solid #e9ede9; border-radius:20px; padding:20px; box-shadow:0 12px 30px rgba(26,62,43,.07); height:100%; }}
    .panel-title {{ font:800 14px 'Manrope'; color:#1b3025; margin-bottom:14px; }}
    [data-testid="stImage"] img {{ border-radius:16px; border:1px solid #e7ece8; box-shadow:0 10px 22px rgba(22,53,37,.09); }}

    .prediction-name {{ font:800 29px 'Manrope'; text-align:center; margin-top:8px; }}
    .status-badge {{ display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:8px 17px; font-weight:800; font-size:12px; margin:9px auto 0; }}
    .fresh-badge {{ background:#15ad46; color:white; }}
    .spoiled-badge {{ background:#ea4e4e; color:white; }}
    .badge-wrap {{ text-align:center; }}

    .confidence-card {{ text-align:center; }}
    .confidence-label {{ color:#5c6861; font-size:12px; font-weight:700; margin:14px 0 12px; }}
    .confidence-ring {{ --size:145px; width:var(--size); height:var(--size); border-radius:50%; margin:0 auto; display:grid; place-items:center; background:conic-gradient(var(--ring) calc(var(--score)*1%),#e9eee9 0); position:relative; }}
    .confidence-ring:before {{ content:""; position:absolute; width:112px; height:112px; border-radius:50%; background:white; }}
    .confidence-inner {{ position:relative; z-index:1; display:flex; flex-direction:column; }}
    .confidence-inner strong {{ font:800 25px 'Manrope'; }}
    .confidence-inner span {{ color:#7b867f; font-size:10px; }}
    .quality-stars {{ color:#64ad37; letter-spacing:3px; margin-top:10px; }}
    .quality-copy {{ color:#7b867f; font-size:11px; }}

    .metric-card {{ display:flex; align-items:center; gap:12px; padding:14px; border-radius:15px; border:1px solid #edf0ed; margin-bottom:10px; background:#fcfdfc; }}
    .metric-icon {{ width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:#edf8e7; font-size:18px; }}
    .metric-label {{ color:#77827c; text-transform:uppercase; letter-spacing:.55px; font-size:9px; font-weight:800; }}
    .metric-value {{ color:#183126; font:800 14px 'Manrope'; margin-top:2px; overflow-wrap:anywhere; }}

    .safety-box {{ padding:17px; border-radius:15px; margin-bottom:14px; }}
    .safe-box {{ background:linear-gradient(90deg,#eff9e7,#dff1c8); color:#22612f; }}
    .unsafe-box {{ background:linear-gradient(90deg,#fff0ee,#ffd9d5); color:#922f2f; }}
    .safety-title {{ font:800 18px 'Manrope'; }}
    .safety-copy {{ font-size:12px; margin-top:4px; }}

    .recommendation-strip {{ background:linear-gradient(90deg,#fffaf0,#fff5dd); border:1px solid #f3dda4; border-radius:18px; padding:18px; margin-top:16px; }}
    .recommendation-title {{ font:800 15px 'Manrope'; color:#5a4510; margin-bottom:7px; }}
    .recommendation-copy {{ color:#67592f; font-size:13px; line-height:1.6; }}

    .list-box {{ background:#fcfdfc; border:1px solid #edf0ed; border-radius:16px; padding:16px; }}
    .list-box ul {{ margin:9px 0 0 19px; padding:0; }}
    .list-box li {{ color:#57635c; margin-bottom:7px; font-size:12px; line-height:1.5; }}

    .prob-row {{ margin-bottom:13px; }}
    .prob-head {{ display:flex; justify-content:space-between; font-size:11px; margin-bottom:5px; }}
    .prob-track {{ height:9px; border-radius:999px; background:#edf1ed; overflow:hidden; }}
    .prob-fill {{ height:100%; border-radius:999px; background:linear-gradient(90deg,#7bc943,#279a51); }}

    .footer-premium {{ margin-top:30px; background:linear-gradient(90deg,#052f22,#083f2c); color:white; border-radius:21px; padding:23px 28px; display:flex; justify-content:space-between; gap:20px; align-items:center; }}
    .footer-brand {{ font:800 18px 'Manrope'; }}
    .footer-brand span {{ color:#9bdd55; }}
    .footer-copy {{ color:#bdd5c9; font-size:11px; margin-top:4px; }}
    .footer-tech {{ color:#dce9e2; font-size:12px; text-align:right; }}

    div.stButton > button {{ border-radius:12px; min-height:43px; font-weight:800; }}

    div.stButton > button[kind="primary"] {{
        background:linear-gradient(90deg,#69ba36,#16894d);
        color:white;
        border:none;
        box-shadow:0 9px 22px rgba(39,148,81,.22);
    }}

    [data-testid="stSidebar"] div.stButton > button {{
        width:100%;
        background:rgba(255,255,255,.03)!important;
        color:#dff3e7!important;
        border:1px solid rgba(255,255,255,.08)!important;
        border-radius:14px!important;
        min-height:52px;
        text-align:left;
        justify-content:flex-start;
        padding-left:18px;
        font-weight:700;
        box-shadow:none!important;
    }}

    [data-testid="stSidebar"] div.stButton > button:hover {{
        background:linear-gradient(90deg,#69ba36,#16894d)!important;
        color:#ffffff!important;
        border-color:transparent!important;
        transform:translateX(3px);
    }}

    [data-testid="stSidebar"] div.stButton > button:focus {{
        background:linear-gradient(90deg,#69ba36,#16894d)!important;
        color:#ffffff!important;
        border-color:transparent!important;
        box-shadow:0 8px 20px rgba(45,168,89,.22)!important;
    }}
    [data-testid="stDownloadButton"] button {{ background:linear-gradient(90deg,#69ba36,#16894d); color:white; border:none; border-radius:12px; font-weight:800; min-height:45px; }}

    @media(max-width:1100px) {{
        .features-grid {{ grid-template-columns:repeat(3,1fr); }}
        .steps {{ grid-template-columns:repeat(2,1fr); }}
        .hero-title {{ font-size:46px; }}
    }}
    </style>
    """,
    unsafe_allow_html=True,
)


# =========================================================
# SIDEBAR
# =========================================================
with st.sidebar:
    logo_tag = (
        f'<img class="sidebar-logo" src="data:image/png;base64,{logo_b64}">'
        if logo_b64
        else '<div class="sidebar-logo">🍃</div>'
    )

    st.markdown(
        f"""
        <div class="sidebar-brand">
            {logo_tag}
            <div>
                <div class="brand-name">FreshSense <span>AI</span></div>
                <div class="brand-tag">Food freshness intelligence</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.button("🏠  Home", use_container_width=True):
        st.session_state.menu = "home"
        st.session_state.page = "home"
        st.rerun()

    if st.button("📷  Analyse Food", use_container_width=True):
        st.session_state.menu = "analyse"
        st.session_state.page = "home"
        st.rerun()

    if st.button("📊  AI Insights", use_container_width=True):
        st.session_state.menu = "insights"
        st.rerun()

    if st.button("🕒  Session Result", use_container_width=True):
        st.session_state.menu = "history"
        st.rerun()

    if st.button("ℹ️  About Model", use_container_width=True):
        st.session_state.menu = "about"
        st.rerun()

    st.markdown(
        """
        <div class="sidebar-ai-card">
            <div class="sidebar-kicker">AI POWERED</div>
            <div class="sidebar-ai-title">Food Intelligence</div>
            <div class="sidebar-ai-copy">
                Smart analysis.<br>
                Better decisions.<br>
                Healthier life.
            </div>
            <div class="ai-orb">AI</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# =========================================================
# HOME PAGE
# =========================================================
def show_home_page() -> None:
    st.markdown('<div class="top-actions"><div class="user-pill">Arzoo Jandu&nbsp;⌄</div></div>', unsafe_allow_html=True)

    st.markdown(
        """
        <section class="hero">
            <div class="hero-content">
                <div class="ai-badge">AI Powered</div>
                <h1 class="hero-title">FreshSense <span>AI</span></h1>
                <div class="hero-subtitle">Food Freshness Intelligence System</div>
                <div class="hero-copy">
                    Upload a food image and receive instant AI-powered freshness prediction,
                    shelf-life estimation, storage recommendations and health-risk analysis.
                </div>
                <div class="hero-points">
                    <div class="hero-point">◎ Accurate<small>8-category classification</small></div>
                    <div class="hero-point">ϟ Fast<small>Real-time AI analysis</small></div>
                    <div class="hero-point">⬡ Reliable<small>Health-focused insights</small></div>
                </div>
            </div>
        </section>
        """,
        unsafe_allow_html=True,
    )

    st.markdown('''<div class="upload-overlap"><div class="upload-title">Upload a food image</div><div class="upload-subtitle">Drag & drop or browse a clear JPG, JPEG or PNG image</div></div>''', unsafe_allow_html=True)
    uploaded_file = st.file_uploader(
        "Drag and drop a food image or browse files",
        type=["jpg", "jpeg", "png"],
        help="Upload a clear image of bread, dairy, fruit or vegetables.",
    )

    st.markdown('<div style="height:2px"></div>', unsafe_allow_html=True)
    analyse_clicked = st.button(
        "Analyse Food Freshness →",
        type="primary",
        use_container_width=True,
        disabled=uploaded_file is None,
    )

    if analyse_clicked and uploaded_file is not None:
        temporary_path = None
        try:
            uploaded_bytes = uploaded_file.getvalue()
            uploaded_image = Image.open(uploaded_file).convert("RGB")
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                uploaded_image.save(temp_file.name, format="JPEG")
                temporary_path = temp_file.name

            with st.spinner("FreshSense AI is analysing category, freshness and safety..."):
                predicted_class, confidence, probabilities = predict_food(temporary_path)

            if predicted_class not in storage_info:
                st.error("Prediction completed, but recommendation information for this category is unavailable.")
                return

            st.session_state.uploaded_bytes = uploaded_bytes
            st.session_state.uploaded_name = uploaded_file.name
            st.session_state.predicted_class = predicted_class
            st.session_state.confidence = float(confidence)
            st.session_state.probabilities = probabilities
            st.session_state.analysed_at = datetime.now().strftime("%d %b %Y, %I:%M %p")
            st.session_state.page = "results"
            st.session_state.menu = "results"
            st.rerun()

        except Exception as error:
            st.error("The image could not be analysed. Please upload another clear JPG or PNG food image.")
            st.exception(error)
        finally:
            if temporary_path and os.path.exists(temporary_path):
                os.remove(temporary_path)

    st.markdown('<div class="section-heading"><span class="leaf-dot">●</span> What you get</div>', unsafe_allow_html=True)
    st.markdown(
        """
        <div class="features-grid">
            <div class="feature-card"><div class="feature-icon">▦</div><div class="feature-title">8 Food Categories</div><div class="feature-copy">Fresh and spoiled classes</div></div>
            <div class="feature-card"><div class="feature-icon">▣</div><div class="feature-title">Shelf-Life</div><div class="feature-copy">Estimated usable duration</div></div>
            <div class="feature-card"><div class="feature-icon">▤</div><div class="feature-title">Storage Guidance</div><div class="feature-copy">Temperature and humidity</div></div>
            <div class="feature-card"><div class="feature-icon">◇</div><div class="feature-title">Health Risk</div><div class="feature-copy">Food-safety evaluation</div></div>
            <div class="feature-card"><div class="feature-icon">↗</div><div class="feature-title">AI Confidence</div><div class="feature-copy">Prediction certainty score</div></div>
            <div class="feature-card"><div class="feature-icon">▧</div><div class="feature-title">Detailed Report</div><div class="feature-copy">Downloadable analysis</div></div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown('<div class="section-heading"><span class="leaf-dot">●</span> How it works</div>', unsafe_allow_html=True)
    st.markdown(
        """
        <div class="steps">
            <div class="step-card"><div class="step-number">01</div><div class="step-title">Upload image</div><div class="step-copy">Choose a clear food photograph.</div></div>
            <div class="step-card"><div class="step-number">02</div><div class="step-title">AI analysis</div><div class="step-copy">EfficientNetB0 processes visual features.</div></div>
            <div class="step-card"><div class="step-number">03</div><div class="step-title">Freshness detection</div><div class="step-copy">The system identifies class and status.</div></div>
            <div class="step-card"><div class="step-number">04</div><div class="step-title">Detailed insights</div><div class="step-copy">View storage, shelf-life and safety advice.</div></div>
            <div class="step-card"><div class="step-number">05</div><div class="step-title">Download report</div><div class="step-copy">Save the complete result as a text report.</div></div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# =========================================================
# RESULTS PAGE
# =========================================================
def show_results_page() -> None:
    required = ["uploaded_bytes", "predicted_class", "confidence", "probabilities"]
    if not all(key in st.session_state for key in required):
        reset_analysis()
        st.rerun()

    predicted_class = st.session_state.predicted_class
    confidence = st.session_state.confidence
    probabilities = st.session_state.probabilities
    info = storage_info[predicted_class]
    readable_prediction = format_class_name(predicted_class)
    is_fresh = info["Status"] == "Fresh"
    uploaded_image = Image.open(__import__("io").BytesIO(st.session_state.uploaded_bytes)).convert("RGB")

    header_left, header_right = st.columns([5, 1.3])
    with header_left:
        st.markdown(
            f"""
            <div class="results-header">
                <div>
                    <div class="results-title">Freshness analysis results</div>
                    <div class="results-subtitle">{st.session_state.uploaded_name} • Analysed {st.session_state.analysed_at}</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with header_right:
        if st.button("← Analyse another", use_container_width=True):
            reset_analysis()
            st.rerun()

    image_col, result_col, info_col = st.columns([1.05, 1.05, 1.25], gap="large")

    with image_col:
        st.markdown('<div class="panel"><div class="panel-title">Uploaded image</div>', unsafe_allow_html=True)
        st.image(uploaded_image, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with result_col:
        st.markdown('<div class="panel"><div class="panel-title">Prediction result</div>', unsafe_allow_html=True)
        st.markdown(f'<div class="prediction-name">{info["Food Name"]}</div>', unsafe_allow_html=True)
        badge_class = "fresh-badge" if is_fresh else "spoiled-badge"
        badge_text = "✓ FRESH" if is_fresh else "⚠ SPOILED"
        st.markdown(f'<div class="badge-wrap"><div class="status-badge {badge_class}">{badge_text}</div></div>', unsafe_allow_html=True)
        confidence_ring(confidence, is_fresh)
        st.markdown('</div>', unsafe_allow_html=True)

    with info_col:
        st.markdown('<div class="panel"><div class="panel-title">Key information</div>', unsafe_allow_html=True)
        metric_card("▦", "Category", info["Category"])
        metric_card("▣", "Shelf life", info["Shelf Life"])
        metric_card("♨", "Temperature", info["Temperature"])
        metric_card("◉", "Humidity", info["Humidity"])
        metric_card("▤", "Storage", info["Storage"])
        st.markdown('</div>', unsafe_allow_html=True)

    lower_left, lower_mid, lower_right = st.columns([1.05, 1.05, 1.05], gap="large")

    sorted_predictions = sorted(probabilities.items(), key=lambda item: item[1], reverse=True)

    with lower_left:
        st.markdown('<div class="panel"><div class="panel-title">Prediction probabilities</div>', unsafe_allow_html=True)
        for class_name, probability in sorted_predictions[:5]:
            st.markdown(
                f"""
                <div class="prob-row">
                    <div class="prob-head"><span>{format_class_name(class_name)}</span><strong>{probability:.2f}%</strong></div>
                    <div class="prob-track"><div class="prob-fill" style="width:{max(0,min(probability,100))}%"></div></div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with st.expander("View all eight classes"):
            for class_name, probability in sorted_predictions:
                st.write(f"{format_class_name(class_name)}: {probability:.2f}%")
        st.markdown('</div>', unsafe_allow_html=True)

    with lower_mid:
        st.markdown('<div class="panel"><div class="panel-title">Shelf-life and storage timeline</div>', unsafe_allow_html=True)
        timeline_items = [
            ("Today", f"Detected as {info['Status'].lower()}"),
            (f"Store at {info['Temperature']}", info["Storage"]),
            ("Recommended shelf life", info["Shelf Life"]),
            ("Monitor regularly", "Check odour, colour and texture before use"),
        ]
        for index, (title, copy) in enumerate(timeline_items, start=1):
            st.markdown(
                f'<div class="metric-card"><div class="metric-icon">{index}</div><div><div class="metric-value">{title}</div><div class="feature-copy">{copy}</div></div></div>',
                unsafe_allow_html=True,
            )
        st.markdown('</div>', unsafe_allow_html=True)

    with lower_right:
        safety_message = get_safety_message(info)
        safety_class = "safe-box" if is_fresh else "unsafe-box"
        st.markdown('<div class="panel"><div class="panel-title">Health and safety</div>', unsafe_allow_html=True)
        st.markdown(
            f'<div class="safety-box {safety_class}"><div class="safety-title">{info["Risk"]} risk</div><div class="safety-copy">{safety_message}</div></div>',
            unsafe_allow_html=True,
        )
        action_steps = get_action_steps(info)
        action_html = "".join(f"<li>{step}</li>" for step in action_steps)
        st.markdown(f'<div class="list-box"><strong>Recommended actions</strong><ul>{action_html}</ul></div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown(
        f"""
        <div class="recommendation-strip">
            <div class="recommendation-title">AI recommendation</div>
            <div class="recommendation-copy">{info['Recommendation']}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    health_col, prevention_col = st.columns(2, gap="large")
    health_items = "".join(f"<li>{item}</li>" for item in info["Health Risk"])
    prevention_items = "".join(f"<li>{item}</li>" for item in info["Prevention"])
    with health_col:
        st.markdown(f'<div class="panel"><div class="panel-title">Health-risk assessment</div><div class="list-box"><ul>{health_items}</ul></div></div>', unsafe_allow_html=True)
    with prevention_col:
        st.markdown(f'<div class="panel"><div class="panel-title">Prevention tips</div><div class="list-box"><ul>{prevention_items}</ul></div></div>', unsafe_allow_html=True)

    st.markdown('<div class="section-heading"><span class="leaf-dot">●</span> Detailed probability chart</div>', unsafe_allow_html=True)
    show_probability_chart(probabilities)

    report_file = generate_text_report(
        image_name=st.session_state.uploaded_name,
        predicted_class=predicted_class,
        confidence=confidence,
        info=info,
    )
    st.download_button(
        label="Download complete AI analysis report",
        data=report_file,
        file_name="FreshSense_AI_Report.txt",
        mime="text/plain",
        use_container_width=True,
    )


# =========================================================
# ROUTER
# =========================================================
menu = st.session_state.get("menu", "home")

if menu == "results" or st.session_state.get("page") == "results":
    show_results_page()

elif menu == "home":
    show_home_page()

elif menu == "analyse":
    show_home_page()

elif menu == "insights":
    show_ai_insights()

elif menu == "history":
    show_history_page()

elif menu == "about":
    show_about_page()


# =========================================================
# FOOTER
# =========================================================
st.markdown(
    """
    <div class="footer-premium">
        <div>
            <div class="footer-brand">FreshSense <span>AI</span></div>
            <div class="footer-copy">AI-powered food freshness intelligence for smarter and safer decisions.</div>
        </div>
        <div class="footer-tech">Developed by <strong>Arzoo Jandu</strong><br>TensorFlow • EfficientNetB0 • Streamlit</div>
    </div>
    """,
    unsafe_allow_html=True,
)
