"""create notifications
Revision ID: 20260729_03
Revises: 20260729_02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
revision = "20260729_03"; down_revision = "20260729_02"; branch_labels = None; depends_on = None
def upgrade() -> None:
    op.create_table("notifications", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False), sa.Column("notification_type", sa.String(40), nullable=False), sa.Column("title", sa.String(160), nullable=False), sa.Column("message", sa.Text(), nullable=False), sa.Column("event_key", sa.String(200), nullable=False), sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")), sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"), sa.UniqueConstraint("event_key"))
    for name, column in (("ix_notifications_user_id", "user_id"), ("ix_notifications_type", "notification_type"), ("ix_notifications_is_read", "is_read"), ("ix_notifications_created_at", "created_at")): op.create_index(name, "notifications", [column])
def downgrade() -> None: op.drop_table("notifications")
