import os
import json
import shutil
from datetime import datetime, timedelta, timezone
from app import create_app
from extensions import db
from models.user import User
from models.prediction import Prediction
from models.disease import DiseaseInformation
from models import seed_initial_diseases
from config import Config

def seed_demo():
    app = create_app()
    with app.app_context():
        # Ensure database tables exist
        db.create_all()
        seed_initial_diseases()

        # Create or update demo user
        demo_email = "demo@skincare.ai"
        user = User.query.filter_by(email=demo_email).first()
        if not user:
            user = User(
                full_name="Dr. Alex Morgan",
                email=demo_email,
                role="user",
                avatar="avatar-1"
            )
            user.set_password("Password123!")
            db.session.add(user)
            db.session.commit()
            print(f"[OK] Created demo user: {demo_email} / Password123!")
        else:
            print(f"[OK] Demo user {demo_email} already exists.")

        # Ensure admin user
        admin_email = "admin@skincare.ai"
        admin = User.query.filter_by(email=admin_email).first()
        if not admin:
            admin = User(
                full_name="System Administrator",
                email=admin_email,
                role="admin",
                avatar="avatar-2"
            )
            admin.set_password("AdminSecure2026!")
            db.session.add(admin)
            db.session.commit()
            print(f"[OK] Created admin user: {admin_email} / AdminSecure2026!")

        # Copy sample images to uploads folder so they can be viewed
        samples_dir = os.path.join(os.path.dirname(__file__), 'samples')
        uploads_dir = Config.UPLOAD_FOLDER
        os.makedirs(uploads_dir, exist_ok=True)

        sample_mapping = [
            ("sample_melanoma.jpg", "demo_melanoma.jpg", "Melanoma", 92.4, "Concerning / High Risk", {"Melanoma": 92.4, "Nevus": 4.1, "Eczema": 1.2, "Psoriasis": 1.5, "Acne": 0.8}, "Irregular notched border on left shoulder. Recommended for dermatologist biopsy."),
            ("sample_nevus.jpg", "demo_nevus.jpg", "Nevus", 94.6, "Benign / Low Risk", {"Melanoma": 1.8, "Nevus": 94.6, "Eczema": 1.0, "Psoriasis": 1.4, "Acne": 1.2}, "Uniform symmetric melanocytic mole on right forearm. Stable morphology."),
            ("sample_eczema.jpg", "demo_eczema.jpg", "Eczema", 88.5, "Manageable / Chronic", {"Melanoma": 0.5, "Nevus": 1.2, "Eczema": 88.5, "Psoriasis": 7.3, "Acne": 2.5}, "Dry pruritic flexural rash on antecubital fossa. Emollient hydration recommended."),
            ("sample_psoriasis.jpg", "demo_psoriasis.jpg", "Psoriasis", 91.2, "Manageable / Chronic", {"Melanoma": 0.8, "Nevus": 1.5, "Eczema": 5.2, "Psoriasis": 91.2, "Acne": 1.3}, "Elevated erythematous plaque with silvery scale over extensor elbow surface."),
            ("sample_acne.jpg", "demo_acne.jpg", "Acne", 93.8, "Benign / Treatable", {"Melanoma": 0.2, "Nevus": 0.5, "Eczema": 2.1, "Psoriasis": 3.4, "Acne": 93.8}, "Follicular pustules and erythema on central facial zone. Gentle non-comedogenic care suggested.")
        ]

        # Check existing predictions for user
        existing_count = Prediction.query.filter_by(user_id=user.id).count()
        if existing_count < 3:
            now = datetime.now(timezone.utc)
            for idx, (src_name, dest_name, p_class, conf, severity, probs, notes) in enumerate(sample_mapping):
                src_path = os.path.join(samples_dir, src_name)
                dest_path = os.path.join(uploads_dir, dest_name)
                if os.path.exists(src_path):
                    shutil.copyfile(src_path, dest_path)

                pred_time = now - timedelta(days=idx, hours=idx*3)
                pred = Prediction(
                    user_id=user.id,
                    image_path=dest_name,
                    original_filename=src_name,
                    predicted_class=p_class,
                    confidence=conf,
                    probabilities_json=json.dumps(probs),
                    severity_level=severity,
                    model_version="Keras-MobileNetV2-v1.0",
                    is_demo=False,
                    notes=notes,
                    status="completed",
                    created_at=pred_time
                )
                db.session.add(pred)

            db.session.commit()
            print("[OK] Seeded 5 realistic historical predictions for demo user.")

if __name__ == '__main__':
    seed_demo()
