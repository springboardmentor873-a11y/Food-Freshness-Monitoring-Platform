from datetime import datetime
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.models.user import User
from app.models.user_login_history import UserLoginHistory
from app.schemas.user import UserRegister, UserLogin
from app.schemas.admin import AdminLogin
from app.utils.security import get_password_hash, verify_password, create_access_token

def seed_default_admin(db: Session):
    admin_user = db.query(User).filter(User.username == settings.DEFAULT_ADMIN_USERNAME).first()
    if not admin_user:
        hashed_password = get_password_hash(settings.DEFAULT_ADMIN_PASSWORD)
        admin_user = User(
            full_name="System Administrator",
            username=settings.DEFAULT_ADMIN_USERNAME,
            email=settings.DEFAULT_ADMIN_EMAIL,
            password_hash=hashed_password,
            role="Admin",
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f"[AUTH] Default Admin account seeded ({settings.DEFAULT_ADMIN_USERNAME}).")

def register_user(db: Session, data: UserRegister) -> Tuple[User, str]:
    # Support either name or full_name
    full_name = data.full_name or data.name or "User"
    email = data.email.lower().strip()
    
    # Generate username if not provided
    if data.username:
        username = data.username.lower().strip()
    else:
        base = email.split("@")[0]
        username = base
        count = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base}{count}"
            count += 1

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered"
        )

    if db.query(User).filter(User.username == username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )

    hashed_password = get_password_hash(data.password)
    new_user = User(
        full_name=full_name,
        username=username,
        email=email,
        mobile_number=data.mobile_number,
        password_hash=hashed_password,
        gender=data.gender,
        role=data.role or "Consumer",
        is_active=True,
        last_login=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log initial active session
    login_entry = UserLoginHistory(
        user_id=new_user.id,
        login_time=datetime.utcnow(),
        last_active_time=datetime.utcnow(),
        status="Online"
    )
    db.add(login_entry)
    db.commit()

    token = create_access_token({"sub": str(new_user.id), "role": new_user.role})
    return new_user, token

def authenticate_user(db: Session, login_data: UserLogin) -> Tuple[User, str]:
    identifier = (login_data.email or login_data.username or "").lower().strip()
    
    user = db.query(User).filter(
        (User.email == identifier) | (User.username == identifier)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is deactivated. Contact system administrator."
        )

    user.last_login = datetime.utcnow()
    
    # Mark old online sessions for this user as Offline
    db.query(UserLoginHistory).filter(
        UserLoginHistory.user_id == user.id,
        UserLoginHistory.status == "Online"
    ).update({"status": "Offline", "logout_time": datetime.utcnow()})

    # Log new login session
    login_entry = UserLoginHistory(
        user_id=user.id,
        login_time=datetime.utcnow(),
        last_active_time=datetime.utcnow(),
        status="Online"
    )
    db.add(login_entry)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return user, token

def authenticate_admin(db: Session, login_data: AdminLogin) -> Tuple[User, str]:
    username_or_email = (login_data.username or login_data.email or "").lower().strip()

    user = db.query(User).filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )

    if user.role.lower() not in ["admin", "administrator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have Administrator privileges"
        )

    user.last_login = datetime.utcnow()

    db.query(UserLoginHistory).filter(
        UserLoginHistory.user_id == user.id,
        UserLoginHistory.status == "Online"
    ).update({"status": "Offline", "logout_time": datetime.utcnow()})

    login_entry = UserLoginHistory(
        user_id=user.id,
        login_time=datetime.utcnow(),
        last_active_time=datetime.utcnow(),
        status="Online"
    )
    db.add(login_entry)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": "Admin"})
    return user, token

def logout_user(db: Session, user: User):
    db.query(UserLoginHistory).filter(
        UserLoginHistory.user_id == user.id,
        UserLoginHistory.status == "Online"
    ).update({"status": "Offline", "logout_time": datetime.utcnow()})
    db.commit()
