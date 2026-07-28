import altair as alt
import pandas as pd
import streamlit as st


def show_probability_chart(probabilities: dict[str, float]) -> None:
    """Display all class probabilities as a horizontal bar chart."""

    chart_data = pd.DataFrame(
        [
            {
                "Class": class_name.replace("_", " ").title(),
                "Probability": float(probability)
            }
            for class_name, probability in probabilities.items()
        ]
    ).sort_values(
        by="Probability",
        ascending=False
    )

    chart = (
        alt.Chart(chart_data)
        .mark_bar(
            cornerRadiusTopRight=7,
            cornerRadiusBottomRight=7
        )
        .encode(
            x=alt.X(
                "Probability:Q",
                title="Probability (%)",
                scale=alt.Scale(domain=[0, 100])
            ),
            y=alt.Y(
                "Class:N",
                title=None,
                sort="-x"
            ),
            tooltip=[
                alt.Tooltip("Class:N", title="Class"),
                alt.Tooltip(
                    "Probability:Q",
                    title="Probability",
                    format=".2f"
                )
            ]
        )
        .properties(
            height=360
        )
    )

    st.altair_chart(
        chart,
        width="stretch"
    )