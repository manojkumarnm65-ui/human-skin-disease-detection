import json
from extensions import db

class DiseaseInformation(db.Model):
    __tablename__ = 'disease_information'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Neoplasm, Inflammatory, Autoimmune, Infectious, etc.
    severity = db.Column(db.String(50), nullable=False)  # High Risk / Concerning / Benign / Chronic
    description = db.Column(db.Text, nullable=False)
    causes_json = db.Column(db.Text, nullable=True)  # Primary biological, microbiological, genetic, and environmental causes
    symptoms_json = db.Column(db.Text, nullable=False)
    risk_factors_json = db.Column(db.Text, nullable=False)
    care_guidance_json = db.Column(db.Text, nullable=False)
    when_to_see_doctor = db.Column(db.Text, nullable=False)
    medical_references_json = db.Column(db.Text, nullable=False)

    def to_dict(self):
        def parse_json_field(val):
            if not val:
                return []
            try:
                return json.loads(val)
            except Exception:
                return [val]

        slug_to_image = {
            'melanoma': '/samples/sample_melanoma.jpg',
            'basal-cell-carcinoma': '/samples/sample_bcc.jpg',
            'squamous-cell-carcinoma': '/samples/sample_squamous_cell_carcinoma.jpg',
            'actinic-keratosis': '/samples/sample_actinic_keratosis.jpg',
            'nevus': '/samples/sample_nevus.jpg',
            'benign-keratosis': '/samples/sample_benign_keratosis.jpg',
            'dermatofibroma': '/samples/sample_dermatofibroma.jpg',
            'vascular-lesion': '/samples/sample_vascular.jpg',
            'eczema': '/samples/sample_eczema.jpg',
            'psoriasis': '/samples/sample_psoriasis.jpg',
            'acne': '/samples/sample_acne.jpg',
            'rosacea': '/samples/sample_rosacea.jpg',
            'vitiligo': '/samples/sample_vitiligo.jpg',
            'tinea-ringworm': '/samples/sample_tinea.jpg',
            'urticaria': '/samples/sample_urticaria_hives.jpg',
            'shingles': '/samples/sample_shingles_herpes_zoster.jpg',
            'impetigo': '/samples/sample_impetigo.jpg',
            'alopecia-areata': '/samples/sample_alopecia_areata.jpg',
            'contact-dermatitis': '/samples/sample_contact_dermatitis.jpg',
            'seborrheic-dermatitis': '/samples/sample_seborrheic_dermatitis.jpg',
            'folliculitis': '/samples/sample_folliculitis.jpg',
            'lichen-planus': '/samples/sample_lichen_planus.jpg',
            'warts': '/samples/sample_warts.jpg',
            'scabies': '/samples/sample_scabies.jpg',
            'athletes-foot': '/samples/sample_athletes_foot.jpg',
            'nail-fungus': '/samples/sample_nail_fungus.jpg',
            'cellulitis': '/samples/sample_cellulitis.jpg',
            'chickenpox': '/samples/sample_chickenpox.jpg'
        }

        causes = parse_json_field(self.causes_json) if getattr(self, 'causes_json', None) else []
        if not causes:
            # Fallback to risk factors if causes not yet populated
            causes = parse_json_field(self.risk_factors_json)

        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category,
            'severity': self.severity,
            'description': self.description,
            'image_url': slug_to_image.get(self.slug, f"/samples/sample_{self.slug.replace('-', '_')}.jpg"),
            'causes': causes,
            'symptoms': parse_json_field(self.symptoms_json),
            'risk_factors': parse_json_field(self.risk_factors_json),
            'care_guidance': parse_json_field(self.care_guidance_json),
            'when_to_see_doctor': self.when_to_see_doctor,
            'medical_references': parse_json_field(self.medical_references_json)
        }
