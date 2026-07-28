import io
import sqlite3
from datetime import datetime
from pathlib import Path

import pandas as pd
import streamlit as st


DB_PATH = Path("freshsense_history.db")


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def _initialise_database() -> None:
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_name TEXT NOT NULL,
                predicted_class TEXT NOT NULL,
                confidence REAL NOT NULL,
                analysed_at TEXT NOT NULL,
                status TEXT NOT NULL,
                image_bytes BLOB,
                session_key TEXT UNIQUE,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.commit()


def _format_class_name(class_name: str) -> str:
    return class_name.replace("_", " ").title()


def _get_status(predicted_class: str) -> str:
    return "Fresh" if predicted_class.lower().startswith("fresh") else "Spoiled"


def _save_current_session_once() -> None:
    required = [
        "uploaded_name",
        "predicted_class",
        "confidence",
        "analysed_at",
    ]

    if not all(key in st.session_state for key in required):
        return

    image_name = str(st.session_state.uploaded_name)
    predicted_class = str(st.session_state.predicted_class)
    confidence = float(st.session_state.confidence)
    analysed_at = str(st.session_state.analysed_at)
    status = _get_status(predicted_class)
    image_bytes = st.session_state.get("uploaded_bytes")

    session_key = (
        f"{image_name}|{predicted_class}|"
        f"{confidence:.4f}|{analysed_at}"
    )

    with _connect() as connection:
        connection.execute(
            """
            INSERT OR IGNORE INTO prediction_history (
                image_name,
                predicted_class,
                confidence,
                analysed_at,
                status,
                image_bytes,
                session_key,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                image_name,
                predicted_class,
                confidence,
                analysed_at,
                status,
                image_bytes,
                session_key,
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        connection.commit()


def _load_history() -> pd.DataFrame:
    with _connect() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                image_name,
                predicted_class,
                confidence,
                analysed_at,
                status,
                created_at
            FROM prediction_history
            ORDER BY id DESC
            """
        ).fetchall()

    if not rows:
        return pd.DataFrame(
            columns=[
                "ID",
                "Image",
                "Prediction",
                "Confidence",
                "Status",
                "Analysed At",
            ]
        )

    return pd.DataFrame(
        [
            {
                "ID": row["id"],
                "Image": row["image_name"],
                "Prediction": _format_class_name(row["predicted_class"]),
                "Confidence": float(row["confidence"]),
                "Status": row["status"],
                "Analysed At": row["analysed_at"],
            }
            for row in rows
        ]
    )


def _delete_history_record(record_id: int) -> None:
    with _connect() as connection:
        connection.execute(
            "DELETE FROM prediction_history WHERE id = ?",
            (record_id,),
        )
        connection.commit()


def _clear_all_history() -> None:
    with _connect() as connection:
        connection.execute("DELETE FROM prediction_history")
        connection.commit()


def _get_record_image(record_id: int) -> bytes | None:
    with _connect() as connection:
        row = connection.execute(
            """
            SELECT image_bytes
            FROM prediction_history
            WHERE id = ?
            """,
            (record_id,),
        ).fetchone()

    if row is None:
        return None

    return row["image_bytes"]


def _show_summary_metrics(history_df: pd.DataFrame) -> None:
    if history_df.empty:
        return

    total = len(history_df)
    fresh_count = int((history_df["Status"] == "Fresh").sum())
    spoiled_count = int((history_df["Status"] == "Spoiled").sum())
    average_confidence = float(history_df["Confidence"].mean())

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Analyses", total)

    with col2:
        st.metric("Fresh Results", fresh_count)

    with col3:
        st.metric("Spoiled Results", spoiled_count)

    with col4:
        st.metric("Average Confidence", f"{average_confidence:.2f}%")


def _show_latest_session() -> None:
    required = [
        "uploaded_name",
        "predicted_class",
        "confidence",
        "analysed_at",
    ]

    if not all(key in st.session_state for key in required):
        st.info("No food analysis has been completed in the current session.")
        return

    st.markdown("### Latest Session Result")

    predicted_class = str(st.session_state.predicted_class)
    confidence = float(st.session_state.confidence)
    status = _get_status(predicted_class)

    image_col, detail_col = st.columns([1, 1.5], gap="large")

    with image_col:
        uploaded_bytes = st.session_state.get("uploaded_bytes")

        if uploaded_bytes:
            st.image(
                io.BytesIO(uploaded_bytes),
                caption=st.session_state.uploaded_name,
                use_container_width=True,
            )
        else:
            st.info("Image preview is unavailable.")

    with detail_col:
        col1, col2 = st.columns(2)

        with col1:
            st.metric(
                "Prediction",
                _format_class_name(predicted_class),
            )

        with col2:
            st.metric(
                "Confidence",
                f"{confidence:.2f}%",
            )

        status_icon = "✅" if status == "Fresh" else "⚠️"
        st.write(f"**Status:** {status_icon} {status}")
        st.write(f"**Image:** {st.session_state.uploaded_name}")
        st.write(f"**Analysed at:** {st.session_state.analysed_at}")

        if st.button(
            "Open Complete Result",
            type="primary",
            use_container_width=True,
        ):
            st.session_state.menu = "results"
            st.session_state.page = "results"
            st.rerun()


def _show_history_table(history_df: pd.DataFrame) -> None:
    st.markdown("### Saved Prediction History")

    if history_df.empty:
        st.info(
            "No saved history is available yet. "
            "Analyse a food image to create the first record."
        )
        return

    filter_col1, filter_col2 = st.columns([1.2, 1])

    with filter_col1:
        search_text = st.text_input(
            "Search history",
            placeholder="Search by image or prediction...",
        )

    with filter_col2:
        status_filter = st.selectbox(
            "Filter by status",
            ["All", "Fresh", "Spoiled"],
        )

    filtered_df = history_df.copy()

    if search_text.strip():
        search_lower = search_text.strip().lower()
        filtered_df = filtered_df[
            filtered_df["Image"].str.lower().str.contains(
                search_lower,
                na=False,
            )
            | filtered_df["Prediction"].str.lower().str.contains(
                search_lower,
                na=False,
            )
        ]

    if status_filter != "All":
        filtered_df = filtered_df[
            filtered_df["Status"] == status_filter
        ]

    display_df = filtered_df.copy()

    if not display_df.empty:
        display_df["Confidence"] = display_df["Confidence"].map(
            lambda value: f"{value:.2f}%"
        )

    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True,
    )

    csv_data = filtered_df.to_csv(index=False).encode("utf-8")

    st.download_button(
        label="Download History as CSV",
        data=csv_data,
        file_name="FreshSense_AI_History.csv",
        mime="text/csv",
        use_container_width=True,
    )


def _show_record_manager(history_df: pd.DataFrame) -> None:
    if history_df.empty:
        return

    st.markdown("### Manage Saved Records")

    record_options = {
        f"#{int(row['ID'])} — {row['Image']} — {row['Prediction']}": int(row["ID"])
        for _, row in history_df.iterrows()
    }

    selected_label = st.selectbox(
        "Select a record",
        list(record_options.keys()),
    )
    selected_id = record_options[selected_label]

    image_bytes = _get_record_image(selected_id)

    if image_bytes:
        with st.expander("Preview selected image"):
            st.image(
                io.BytesIO(image_bytes),
                use_container_width=True,
            )

    delete_col, clear_col = st.columns(2)

    with delete_col:
        if st.button(
            "Delete Selected Record",
            use_container_width=True,
        ):
            _delete_history_record(selected_id)
            st.success("Selected history record deleted.")
            st.rerun()

    with clear_col:
        confirm_clear = st.checkbox(
            "Confirm clearing all history"
        )

        if st.button(
            "Clear All History",
            use_container_width=True,
            disabled=not confirm_clear,
        ):
            _clear_all_history()
            st.success("All saved history has been cleared.")
            st.rerun()


def show_history_page() -> None:
    _initialise_database()
    _save_current_session_once()

    st.markdown("## 🕒 Session Result & History")
    st.caption(
        "View the latest analysis and manage permanently saved prediction records."
    )

    _show_latest_session()
    st.divider()

    history_df = _load_history()

    _show_summary_metrics(history_df)
    st.divider()

    _show_history_table(history_df)
    st.divider()

    _show_record_manager(history_df)