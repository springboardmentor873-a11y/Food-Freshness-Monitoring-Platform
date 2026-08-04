"""create prediction history

Revision ID: 20260729_02
Revises: 20260729_01
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260729_02"
down_revision = "20260729_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "prediction_history",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("image_path", sa.String(500), nullable=False),
        sa.Column("prediction", sa.String(80), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("freshness_status", sa.String(20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    for name, column in (("ix_prediction_history_user_id", "user_id"), ("ix_prediction_history_prediction", "prediction"), ("ix_prediction_history_freshness_status", "freshness_status"), ("ix_prediction_history_created_at", "created_at")):
        op.create_index(name, "prediction_history", [column])


def downgrade() -> None:
    op.drop_table("prediction_history")
