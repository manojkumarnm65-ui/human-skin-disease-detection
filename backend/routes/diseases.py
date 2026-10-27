from flask import Blueprint, jsonify
from extensions import db
from models.disease import DiseaseInformation

diseases_bp = Blueprint('diseases', __name__, url_prefix='/api/diseases')

@diseases_bp.route('', methods=['GET'])
@diseases_bp.route('/', methods=['GET'])
def get_all_diseases():
    records = DiseaseInformation.query.order_by(DiseaseInformation.id.asc()).all()
    return jsonify({
        'diseases': [d.to_dict() for d in records]
    }), 200

@diseases_bp.route('/<identifier>', methods=['GET'])
def get_disease_by_id_or_slug(identifier):
    if identifier.isdigit():
        disease = db.session.get(DiseaseInformation, int(identifier))
    else:
        disease = DiseaseInformation.query.filter(
            db.or_(
                DiseaseInformation.slug == identifier.lower(),
                DiseaseInformation.name.ilike(f'%{identifier}%')
            )
        ).first()

    if not disease:
        return jsonify({'error': f'Disease record "{identifier}" not found'}), 404

    return jsonify({
        'disease': disease.to_dict()
    }), 200
