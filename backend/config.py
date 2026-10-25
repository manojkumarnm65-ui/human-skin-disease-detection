import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env if present
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'skincare-ai-super-secret-key-2026-secure')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-skincare-ai-secret-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Primary MySQL URL with fallback to SQLite if MySQL is unavailable
    # e.g., mysql+pymysql://root:password@localhost:3306/skincare_ai
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'root')
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.environ.get('MYSQL_PORT', '3306')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'skincare_ai')
    
    DEFAULT_MYSQL_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
    SQLITE_FALLBACK_URI = f"sqlite:///{os.path.join(basedir, 'skincare_ai.db')}"
    
    # Can be overridden directly by DATABASE_URL
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Default to MySQL URI; app.py will verify connection and safely fallback to SQLite if needed
        SQLALCHEMY_DATABASE_URI = DEFAULT_MYSQL_URI
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    
    MODEL_PATH = os.path.join(basedir, 'models', 'skin_disease_model.keras')
    CLASS_NAMES_PATH = os.path.join(basedir, 'models', 'class_names.json')
    
    # CORS allowed origins
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
