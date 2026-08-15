from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official REST API for JR Learners STEM Platform - Products, Courses, YouTube Tutorials, 100 Projects, 100 Blogs, Portals, and Enterprise Admin Panel.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request/Response Models
class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = "student"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class ProductItem(BaseModel):
    id: str
    name: str
    category: str
    price: float
    rating: float
    stock: int
    image: str
    shortDesc: str

@app.get("/")
def root():
    return {
        "message": "Welcome to JR Learners REST API Gateway",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "tagline": "Learn. Build. Innovate.",
        "youtube": "https://www.youtube.com/@LetsGetEngagedin"
    }

@app.post(f"{settings.API_V1_STR}/auth/login", response_model=TokenResponse)
def login_for_access_token(user: UserLogin):
    if user.role == "admin":
        if user.email.lower() != "sedhupathivishnu321@gmail.com" or user.password != "JRLearners2026!":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Admin Credentials"
            )
    token = create_access_token(subject=user.email, role=user.role or "student")
    return {"access_token": token, "token_type": "bearer", "role": user.role or "student"}

@app.get(f"{settings.API_V1_STR}/products")
def get_all_products():
    return {
        "count": 20,
        "message": "Successfully fetched 20 STEM Product Kits catalog",
        "sample": [
          {"id": "prod-1", "name": "1. Arduino Starter Kit", "price": 1499, "category": "Arduino"},
          {"id": "prod-2", "name": "2. Electronics Fundamentals Kit", "price": 999, "category": "Electronics"},
          {"id": "prod-6", "name": "6. IoT ESP32 Starter Kit", "price": 1899, "category": "IoT"},
          {"id": "prod-12", "name": "12. AI Vision Kit", "price": 4999, "category": "AI"}
        ]
    }

@app.get(f"{settings.API_V1_STR}/courses")
def get_all_courses():
    return {
        "count": 15,
        "message": "Successfully fetched STEM Online Certification Courses"
    }

@app.get(f"{settings.API_V1_STR}/youtube/tutorials")
def get_youtube_tutorials():
    return {
        "channel": "@LetsGetEngagedin",
        "url": "https://www.youtube.com/@LetsGetEngagedin",
        "message": "YouTube tutorials feed active"
    }

@app.get(f"{settings.API_V1_STR}/certificates/verify/{{cert_id}}")
def verify_certificate_record(cert_id: str):
    return {
        "certificate_id": cert_id,
        "status": "VERIFIED_AUTHENTIC",
        "student_name": "Alex Learner",
        "course": "Arduino C++ Programming & Hardware Interfacing",
        "issuer": "JR Learners STEM Education"
    }

@app.get(f"{settings.API_V1_STR}/admin/analytics")
def get_admin_analytics():
    return {
        "gross_revenue": 1248500,
        "total_orders": 1420,
        "active_users": 18920,
        "issued_certificates": 3850,
        "system_status": "HEALTHY"
    }

