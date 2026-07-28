import streamlit as st


def show_about_page() -> None:
    st.markdown("## ℹ️ About FreshSense AI")

    st.markdown(
        """
        **FreshSense AI** is an AI-powered food freshness intelligence system.

        It analyses uploaded food images and provides:

        - Fresh or spoiled food classification
        - AI confidence score
        - Shelf-life estimation
        - Temperature and humidity guidance
        - Storage recommendations
        - Health-risk analysis
        - Prevention and safety suggestions
        - Downloadable analysis report

        **Model:** EfficientNetB0  
        **Framework:** TensorFlow / Keras  
        **Application:** Streamlit  
        **Developer:** Arzoo Jandu
        """
    )