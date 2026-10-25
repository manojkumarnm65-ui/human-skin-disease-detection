import json
from datetime import datetime, timezone
from extensions import db

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    image_path = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=True)
    predicted_class = db.Column(db.String(100), nullable=False, index=True)
    confidence = db.Column(db.Float, nullable=False)
    probabilities_json = db.Column(db.Text, nullable=True)
    severity_level = db.Column(db.String(50), default='Benign') # Benign, Low Risk, Concerning, High Risk
    model_version = db.Column(db.String(50), default='1.0.0')
    is_demo = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='completed')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        probs = {}
        if self.probabilities_json:
            try:
                probs = json.loads(self.probabilities_json)
            except Exception:
                probs = {}

        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': f'/uploads/{self.image_path}',
            'original_filename': self.original_filename,
            'predicted_class': self.predicted_class,
            'confidence': round(self.confidence, 1),
            'probabilities': probs,
            'severity_level': self.severity_level,
            'model_version': self.model_version,
            'is_demo': self.is_demo,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
