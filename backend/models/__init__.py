import json
from extensions import db
from .user import User
from .prediction import Prediction
from .disease import DiseaseInformation
from .disease_data import get_initial_diseases

def seed_initial_diseases():
    """Seeds or updates the educational disease library with all 22 conditions and detailed causes."""
    # Ensure causes_json column exists in database table
    try:
        from sqlalchemy import text
        db.session.execute(text("ALTER TABLE disease_information ADD COLUMN causes_json TEXT;"))
        db.session.commit()
    except Exception:
        db.session.rollback()

    diseases = get_initial_diseases()

    for item in diseases:
        existing = DiseaseInformation.query.filter_by(slug=item['slug']).first()
        if not existing:
            d = DiseaseInformation(**item)
            db.session.add(d)
        else:
            for key, val in item.items():
                setattr(existing, key, val)

    db.session.commit()
    print(f"[OK] Seeded/Updated {len(diseases)} educational disease records with human causes successfully.")
