from datetime import datetime
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.database import SessionLocal
from app.models.user_login_history import UserLoginHistory
from app.utils.security import decode_token

class ActiveUserTrackingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Fire-and-forget background touch for logged in users
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = decode_token(token)
            if payload and "sub" in payload:
                try:
                    user_id = int(payload["sub"])
                    db = SessionLocal()
                    try:
                        active_session = db.query(UserLoginHistory).filter(
                            UserLoginHistory.user_id == user_id,
                            UserLoginHistory.status == "Online"
                        ).order_by(UserLoginHistory.login_time.desc()).first()

                        if active_session:
                            active_session.last_active_time = datetime.utcnow()
                            db.commit()
                    finally:
                        db.close()
                except Exception:
                    pass

        return response
