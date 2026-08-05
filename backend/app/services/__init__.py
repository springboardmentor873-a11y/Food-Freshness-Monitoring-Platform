from app.services.auth_service import seed_default_admin, register_user, authenticate_user, authenticate_admin, logout_user
from app.services.prediction_service import run_image_prediction, get_predictions_history, get_prediction_detail, delete_prediction_record
from app.services.admin_service import get_admin_dashboard_metrics, get_admin_users, get_user_login_history, update_user_by_admin, delete_user_by_admin, deactivate_user_by_admin, get_food_stats, get_system_status, get_analytics_trends
from app.services.inventory_service import create_inventory_item, get_user_inventory, update_inventory_item, delete_inventory_item
from app.services.notification_service import get_user_notifications, mark_notification_read, delete_notification
from app.services.report_service import create_report

__all__ = [
    "seed_default_admin",
    "register_user",
    "authenticate_user",
    "authenticate_admin",
    "logout_user",
    "run_image_prediction",
    "get_predictions_history",
    "get_prediction_detail",
    "delete_prediction_record",
    "get_admin_dashboard_metrics",
    "get_admin_users",
    "get_user_login_history",
    "update_user_by_admin",
    "delete_user_by_admin",
    "deactivate_user_by_admin",
    "get_food_stats",
    "get_system_status",
    "get_analytics_trends",
    "create_inventory_item",
    "get_user_inventory",
    "update_inventory_item",
    "delete_inventory_item",
    "get_user_notifications",
    "mark_notification_read",
    "delete_notification",
    "create_report",
]
