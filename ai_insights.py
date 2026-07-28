import streamlit as st
from typing import Dict

try:
    import pandas as pd
except ImportError:
    pd = None

try:
    import plotly.express as px
    import plotly.graph_objects as go
except ImportError:
    px = None
    go = None


SUPPORTED_CLASSES = [
    "Fresh Apple",
    "Spoiled Apple",
    "Fresh Banana",
    "Spoiled Banana",
    "Fresh Bread",
    "Spoiled Bread",
    "Fresh Orange",
    "Spoiled Orange",
]


def _format_class_name(name: str) -> str:
    return name.replace("_", " ").title()


def _show_metric_cards() -> None:
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Model", "EfficientNetB0")
    with col2:
        st.metric("Food Classes", "8")
    with col3:
        st.metric("Framework", "TensorFlow")
    with col4:
        st.metric("Input Type", "Food Image")


def _show_live_prediction_insights() -> None:
    st.markdown("### 📈 Latest prediction insights")

    required_keys = ["predicted_class", "confidence", "probabilities"]
    if not all(key in st.session_state for key in required_keys):
        st.warning(
            "No food image has been analysed in this session. Go to Home, upload an image, "
            "and run the analysis to view live AI insights."
        )
        return

    predicted_class = str(st.session_state.predicted_class)
    confidence = float(st.session_state.confidence)
    probabilities: Dict[str, float] = dict(st.session_state.probabilities)

    metric1, metric2, metric3 = st.columns(3)
    with metric1:
        st.metric("Predicted Class", _format_class_name(predicted_class))
    with metric2:
        st.metric("Confidence", f"{confidence:.2f}%")
    with metric3:
        confidence_level = (
            "Very High" if confidence >= 90 else
            "High" if confidence >= 75 else
            "Moderate" if confidence >= 55 else
            "Low"
        )
        st.metric("Confidence Level", confidence_level)

    chart_col, gauge_col = st.columns([1.35, 1], gap="large")
    sorted_items = sorted(probabilities.items(), key=lambda item: float(item[1]), reverse=True)

    with chart_col:
        st.markdown("#### Class probability distribution")
        if px is not None and pd is not None:
            probability_df = pd.DataFrame({
                "Class": [_format_class_name(name) for name, _ in sorted_items],
                "Probability": [float(value) for _, value in sorted_items],
            })
            figure = px.bar(
                probability_df,
                x="Probability",
                y="Class",
                orientation="h",
                text="Probability",
            )
            figure.update_traces(texttemplate="%{text:.2f}%", textposition="outside")
            figure.update_layout(
                height=430,
                margin=dict(l=10, r=30, t=10, b=10),
                xaxis_title="Probability (%)",
                yaxis_title="",
                showlegend=False,
            )
            figure.update_yaxes(categoryorder="total ascending")
            st.plotly_chart(figure, use_container_width=True)
        else:
            for class_name, probability in sorted_items:
                st.write(f"**{_format_class_name(class_name)}:** {float(probability):.2f}%")
                st.progress(min(max(float(probability) / 100, 0.0), 1.0))

    with gauge_col:
        st.markdown("#### Confidence gauge")
        if go is not None:
            gauge = go.Figure(go.Indicator(
                mode="gauge+number",
                value=confidence,
                number={"suffix": "%"},
                title={"text": "Prediction confidence"},
                gauge={
                    "axis": {"range": [0, 100]},
                    "steps": [
                        {"range": [0, 55]},
                        {"range": [55, 75]},
                        {"range": [75, 90]},
                        {"range": [90, 100]},
                    ],
                    "threshold": {"line": {"width": 4}, "thickness": 0.75, "value": confidence},
                },
            ))
            gauge.update_layout(height=330, margin=dict(l=20, r=20, t=45, b=10))
            st.plotly_chart(gauge, use_container_width=True)
        else:
            st.metric("Prediction confidence", f"{confidence:.2f}%")
            st.progress(min(max(confidence / 100, 0.0), 1.0))

        st.caption(
            "A higher confidence score means the model found stronger visual evidence for the selected class."
        )


def _show_model_overview() -> None:
    st.markdown("### 🧠 Model overview")
    left, right = st.columns([1.25, 1], gap="large")

    with left:
        st.info(
            "FreshSense AI uses EfficientNetB0 with transfer learning to identify visual patterns "
            "related to food freshness. The model analyses colour, texture, surface quality, bruising, "
            "and other visible indicators before producing a class prediction and confidence score."
        )

        st.markdown("#### Processing workflow")
        workflow = [
            "Image upload and validation",
            "Image resizing and preprocessing",
            "Feature extraction using EfficientNetB0",
            "Freshness-class prediction",
            "Confidence and probability analysis",
            "Shelf-life, storage, and safety recommendations",
        ]
        for index, step in enumerate(workflow, start=1):
            st.markdown(f"**{index}.** {step}")

    with right:
        st.markdown("#### Technology stack")
        technology_data = {
            "Technology": ["Streamlit", "TensorFlow / Keras", "EfficientNetB0", "Pillow", "Plotly", "Pandas", "Python"],
            "Purpose": [
                "Application interface",
                "Model inference",
                "Image feature extraction",
                "Image processing",
                "Interactive visualisation",
                "Data organisation",
                "Core application logic",
            ],
        }
        if pd is not None:
            st.dataframe(pd.DataFrame(technology_data), use_container_width=True, hide_index=True)
        else:
            for technology, purpose in zip(technology_data["Technology"], technology_data["Purpose"]):
                st.write(f"**{technology}:** {purpose}")


def _show_supported_classes() -> None:
    st.markdown("### 🍎 Supported food classes")
    class_columns = st.columns(4)

    for index, class_name in enumerate(SUPPORTED_CLASSES):
        with class_columns[index % 4]:
            status_icon = "✅" if class_name.startswith("Fresh") else "⚠️"
            st.markdown(
                f"""
                <div style="background:white;border:1px solid #e7ece8;border-radius:14px;
                padding:16px;margin-bottom:12px;min-height:78px;
                box-shadow:0 8px 20px rgba(26,62,43,.05);">
                    <div style="font-size:23px;">{status_icon}</div>
                    <div style="font-weight:800;margin-top:6px;">{class_name}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def _show_capabilities_and_limitations() -> None:
    st.markdown("### 🔍 System capabilities and limitations")
    capability_col, limitation_col = st.columns(2, gap="large")

    with capability_col:
        st.success(
            """
            **Current capabilities**

            - Fresh and spoiled food classification  
            - Confidence-score calculation  
            - Eight-class probability comparison  
            - Shelf-life estimation  
            - Storage-temperature guidance  
            - Humidity recommendations  
            - Health-risk and prevention advice  
            - Downloadable analysis report
            """
        )

    with limitation_col:
        st.warning(
            """
            **Important limitations**

            - Predictions depend on image quality and lighting  
            - Hidden spoilage cannot be detected from an image  
            - Unseen food categories may be classified incorrectly  
            - The system should support, not replace, human inspection  
            - Food with unusual smell, texture, or packaging damage should not be consumed
            """
        )


def show_ai_insights() -> None:
    st.markdown("## 📊 AI Insights")
    st.caption("Explore the model, technology stack, supported classes, and live prediction analytics.")

    _show_metric_cards()
    st.divider()
    _show_live_prediction_insights()
    st.divider()
    _show_model_overview()
    st.divider()
    _show_supported_classes()
    st.divider()
    _show_capabilities_and_limitations()