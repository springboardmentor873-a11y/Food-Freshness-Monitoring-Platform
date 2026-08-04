"""create inventory items

Revision ID: 20260729_01
Revises: 20260728_01
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260729_01"
down_revision = "20260728_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "inventory_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("food_name", sa.String(160), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("purchase_date", sa.Date(), nullable=False),
        sa.Column("expiry_date", sa.Date(), nullable=False),
        sa.Column("storage_location", sa.String(160), nullable=False),
        sa.Column("image_path", sa.String(500), nullable=True),
        sa.Column("prediction", sa.String(80), nullable=True),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("freshness_status", sa.String(20), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    for name, column in (("ix_inventory_items_user_id", "user_id"), ("ix_inventory_items_food_name", "food_name"), ("ix_inventory_items_category", "category"), ("ix_inventory_items_expiry_date", "expiry_date"), ("ix_inventory_items_prediction", "prediction"), ("ix_inventory_items_freshness_status", "freshness_status")):
        op.create_index(name, "inventory_items", [column])


def downgrade() -> None:
    op.drop_table("inventory_items")
