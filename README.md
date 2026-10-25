# SkinCare AI — AI-Based Skin Disease Detection Using Deep Learning

> **"AI-Powered Skin Analysis for a Healthier Future"**

SkinCare AI is a modern, responsive, full-stack dermatological screening web application developed as an educational final-year engineering capstone project. The system allows users to capture or upload skin lesion images and receive an AI-assisted classification of possible skin conditions with confidence scoring, image quality verification, longitudinal screening history, and a curated medical knowledge base.

---

## ⚠️ Important Medical Safety Disclaimer

**THIS SYSTEM IS AN EDUCATIONAL SCREENING AND ENGINEERING RESEARCH PROJECT, NOT A CERTIFIED MEDICAL DIAGNOSTIC DEVICE.**
- The predictions, confidence scores, and guidance provided by SkinCare AI are for educational awareness only and must never be interpreted as clinical diagnoses or medical confirmation/exclusion of melanoma or any other skin disease.
- Any suspicious, changing, bleeding, itching, or atypical skin lesion must be evaluated by a qualified, board-certified dermatologist or healthcare practitioner.

---

## 🎨 Visual Design & Branding

The design strictly reproduces the dark navy and electric cyan medical AI aesthetic:
- **Dark Navy Background**: `#020B1C`
- **Secondary Background**: `#06172D`
- **Card Background**: `#071B33` (with glassmorphism blur and subtle gradients)
- **Electric Blue**: `#087BFF`
- **Cyan Accent**: `#08C9F5` (with glowing neon highlights)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*)
- **Animations**: Glowing HUD concentric rings, sweeping cyan laser scan lines, and micro-interactions.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React.js 18+ with Vite
- **Styling**: Vanilla CSS3 design system with CSS custom properties, glassmorphism, glowing borders, and animations
- **Routing**: React Router DOM (v7)
- **Charts**: Recharts (for probability distributions and weekly telemetry)
- **Icons**: Lucide React
- **API Client**: Axios (configured with JWT bearer interceptors and automated error handling)

### Backend
- **Framework**: Python 3.11+, Flask 3.0+
- **Security & Authentication**: Flask-JWT-Extended, Werkzeug password hashing (PBKDF2)
- **CORS**: Flask-CORS
- **ORM / Database**: SQLAlchemy (Flask-SQLAlchemy) supporting **MySQL** with graceful **SQLite** fallback
- **Image Processing**: Pillow (PIL), NumPy
- **Deep Learning / AI**: TensorFlow / Keras (MobileNetV2 transfer learning architecture)

---

## 📂 Project Structure

```text
skincare-ai/
│
├── frontend/
│   ├── public/
│   │   ├── samples/                # Pre-packaged clinical demonstration lesions
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Public landing navigation
│   │   │   ├── Sidebar.jsx         # Collapsible dashboard sidebar
│   │   │   ├── TopNav.jsx          # Dashboard top bar with search & notifications
│   │   │   ├── StatCard.jsx        # Dynamic statistics cards
│   │   │   └── LoadingSpinner.jsx  # High-tech concentric scanner spinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT authentication & session state
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Public landing page (Hero, Scanner, Features, Disclaimer)
│   │   │   ├── Login.jsx           # Split layout with Medical AI graphic & Login form
│   │   │   ├── Register.jsx        # Registration form with password validation
│   │   │   ├── Dashboard.jsx       # Dynamic telemetry stats, charts, recent predictions
│   │   │   ├── UploadImage.jsx     # Two-card upload, quality check, & inference suite
│   │   │   ├── PredictionHistory.jsx # Search, filter, pagination, details modal
│   │   │   ├── DiseasesInfo.jsx    # Evidence-based dermatological condition library
│   │   │   ├── Profile.jsx         # User profile & avatar theme selector
│   │   │   └── Settings.jsx        # Password updates, theme preferences, account deletion
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated views
│   │   ├── services/
│   │   │   └── api.js              # Centralized Axios API client
│   │   ├── index.css               # Core design system tokens and animations
│   │   ├── App.jsx                 # Route definitions
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py                      # Flask app entrypoint, CORS, static routes, error handlers
│   ├── config.py                   # Configuration, MySQL and SQLite fallback URI
│   ├── extensions.py               # SQLAlchemy, JWTManager, CORS instances
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variables template
│   ├── .env                        # Local environment configuration
│   ├── generate_samples.py         # Generates sample clinical lesion textures
│   ├── seed_demo_data.py           # Seeds demo user, admin user, and history
│   ├── test_api_endpoints.py       # Automated end-to-end API test suite
│   ├── train_or_download_model.py  # Model training guide and Keras export script
│   ├── models/
│   │   ├── __init__.py             # Exports models and seeds initial disease data
│   │   ├── user.py                 # User model (PBKDF2 hashing)
│   │   ├── prediction.py           # Prediction model (confidence, probabilities, severity)
│   │   ├── disease.py              # DiseaseInformation model (symptoms, risk factors, references)
│   │   ├── class_names.json        # ["Melanoma", "Nevus", "Eczema", "Psoriasis", "Acne"]
│   │   └── skin_disease_model.keras # Destination for trained Keras model weights
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py                 # /api/auth/register, /login, /logout, /me, /forgot-password
│   │   ├── predictions.py          # /api/predictions/analyze, /history, /<id>
│   │   ├── dashboard.py            # /api/dashboard/stats, /recent-predictions, /chart-data
│   │   ├── diseases.py             # /api/diseases, /<id_or_slug>
│   │   └── profile.py              # /api/profile, /password, /account
│   ├── services/
│   │   ├── __init__.py
│   │   ├── image_service.py        # File validation, quality assessment (lighting, blur, contrast)
│   │   └── prediction_service.py   # Keras model inference & labeled demonstration engine
│   ├── samples/                    # Pre-packaged sample lesion images
│   └── uploads/                    # User uploaded images with unique UUID filenames
│
└── README.md
```

---

## 🚀 Installation & Running Guide (Windows & VS Code)

### Prerequisites
1. **Python 3.10 or 3.11** (Ensure *"Add Python to PATH"* was selected during installation).
2. **Node.js 18+ and npm** (Verify by running `node -v` and `npm -v`).
3. **MySQL Server** (Optional: the backend automatically uses local SQLite if MySQL is not running).

---

### Step 1: Open Project in VS Code
Open VS Code and navigate to the project directory:
```powershell
cd C:\Users\manoj\.gemini\antigravity-ide\scratch\skincare-ai
```

---

### Step 2: Configure & Start Backend

Open a new PowerShell terminal in VS Code:
```powershell
cd backend

# 1. Install dependencies
python -m pip install -r requirements.txt

# 2. Generate demonstration lesion samples (Melanoma, Nevus, Eczema, Psoriasis, Acne)
python generate_samples.py

# 3. Seed demo accounts and initial history
python seed_demo_data.py

# 4. Start Flask backend server
python app.py
```
> The backend server will start on **`http://127.0.0.1:5000`**.

---

### Step 3: Configure & Start Frontend

Open a **second** terminal in VS Code:
```powershell
cd frontend

# 1. Install npm packages
npm install

# 2. Start Vite development server
npm run dev
```
> The frontend application will be live on **`http://127.0.0.1:5173`**.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with accounts for immediate demonstration testing:

| Role | Email | Password |
|---|---|---|
| **Demo Patient** | `demo@skincare.ai` | `Password123!` |
| **Administrator** | `admin@skincare.ai` | `AdminSecure2026!` |

*You can also register a brand-new account directly via the Sign Up form.*

---

## 🧪 Deep Learning Model Architecture & Integration

SkinCare AI supports 5 clinical diagnostic categories:
1. **Melanoma** (Concerning / High Risk)
2. **Melanocytic Nevus** (Benign / Low Risk)
3. **Eczema** (Manageable / Chronic)
4. **Psoriasis** (Manageable / Chronic)
5. **Acne Vulgaris** (Benign / Treatable)

### Real Keras Deep Learning Model
When a trained Keras model is placed at `backend/models/skin_disease_model.keras`, the backend automatically:
1. Loads the model into memory once at application launch.
2. Inspects input tensor dimensions (e.g., $224 \times 224 \times 3$).
3. Resizes uploaded images, converts RGB values to normalized float tensors.
4. Executes forward-pass neural inference and computes class probabilities.
5. Maps outputs to `backend/models/class_names.json`.

### Verified Demonstration Screening Mode
If the weights file `skin_disease_model.keras` has not been generated or downloaded yet:
- The system operates in a **Clearly Labeled Demonstration Screening Mode**.
- It extracts biological image features using Pillow and NumPy (analyzing **asymmetry**, **border irregularities**, **color hue**, and **erythema/redness** based on clinical ABCDE criteria).
- It explicitly marks predictions with `is_demo: true` and displays an informative banner explaining that the weights file is pending.

### Training Your Own Model
To train a transfer-learning convolutional network on the benchmark **HAM10000** or **ISIC** datasets, see `backend/train_or_download_model.py`:
```powershell
cd backend
python train_or_download_model.py
```

---

## 🛠️ Comprehensive Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| **`npm not recognized`** | Node.js is not added to the Windows environment `PATH`. | Re-run Node.js installer, select *"Add to PATH"*, and restart VS Code. |
| **`Python module not found`** | Packages were installed in a different Python version or user directory. | Run `python -m pip install -r requirements.txt` to install directly to the active interpreter. |
| **`MySQL connection errors`** | MySQL server is stopped or credentials differ in `.env`. | The application **automatically falls back to SQLite** (`skincare_ai.db`) so execution never halts. To use MySQL, verify MySQL is running and update `MYSQL_PASSWORD` in `backend/.env`. |
| **`CORS errors`** | Frontend origin is blocked by the backend. | Flask-CORS is configured for `http://localhost:5173` and `http://127.0.0.1:5173`. Ensure requests target `http://127.0.0.1:5000/api`. |
| **`Application Control Policy / DLL block`** | Windows AppLocker policy blocks Cython binaries in `%APPDATA%`. | We locked `sqlalchemy>=2.0.0,<2.1.0` in `requirements.txt` which avoids the unverified Cython extension issue. |
| **`Image upload error / 413`** | Uploaded image exceeds the 5 MB limit or has an invalid file extension. | Ensure the file is under 5 MB in PNG, JPG, JPEG, or WEBP format. |
| **`JWT Token Expired`** | Session token expired (default 7 days). | Simply sign out and sign back in with your credentials. |

---

## 📜 Academic Project Notice
Designed and developed for a college final-year engineering demonstration. All rights reserved © 2026 SkinCare AI.
