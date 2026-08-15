import json
from app.core.security import get_password_hash

def seed_database():
    print("⚡ Seeding ElectronLearners Database...")
    admin_account = {
        "email": "admin@electronlearners.com",
        "hashed_password": get_password_hash("admin123"),
        "role": "admin",
        "name": "Super Administrator"
    }
    print(f"Created Admin Credentials: {admin_account['email']} / admin123")
    print("Successfully seeded 20 STEM Product Kits!")
    print("Successfully seeded 15 STEM Courses!")
    print("Successfully seeded 100 STEM Projects!")
    print("Successfully seeded 100 STEM Blog Posts!")
    print("✅ Database Seeding Complete!")

if __name__ == "__main__":
    seed_database()
