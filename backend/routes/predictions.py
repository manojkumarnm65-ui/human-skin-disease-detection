import os
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.prediction import Prediction
from models.disease import DiseaseInformation
from services.image_service import save_and_validate_image
from services.prediction_service import prediction_service

predictions_bp = Blueprint('predictions', __name__, url_prefix='/api/predictions')

@predictions_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_image():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Unauthorized user'}), 401

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided in request. Key must be "image".'}), 400

    file = request.files['image']
    if not file or file.filename == '':
        return jsonify({'error': 'No image file selected.'}), 400

    notes = request.form.get('notes', '').strip()

    try:
        # 1. Validate, assess quality, and save image securely
        image_info = save_and_validate_image(file)
        saved_filename = image_info['saved_filename']
        saved_path = image_info['destination_path']
        original_filename = image_info['original_filename']
        quality = image_info['quality']

        # 2. Run inference via PredictionService
        result = prediction_service.predict(saved_path, quality_assessment=quality)

        # 3. Store record in database
        prediction = Prediction(
            user_id=user_id,
            image_path=saved_filename,
            original_filename=original_filename,
            predicted_class=result['predicted_class'],
            confidence=result['confidence'],
            probabilities_json=json.dumps(result['probabilities']),
            severity_level=result['severity_level'],
            model_version=result['model_version'],
            is_demo=result['is_demo'],
            notes=notes if notes else None,
            status='completed'
        )
        db.session.add(prediction)
        db.session.commit()

        # 4. Fetch educational disease information if matched
        disease_info = None
        disease_record = DiseaseInformation.query.filter(
            DiseaseInformation.name.ilike(f"%{result['predicted_class']}%")
        ).first()
        if disease_record:
            disease_info = disease_record.to_dict()

        response_data = {
            'prediction': prediction.to_dict(),
            'quality_assessment': quality,
            'disease_info': disease_info,
            'abcde_assessment': result.get('abcde_assessment', {}),
            'explanation': result.get('explanation', ''),
            'medical_disclaimer': (
                "IMPORTANT MEDICAL NOTICE: This analysis is an educational AI demonstration and research tool, "
                "not a certified medical diagnostic device. It should never substitute for professional clinical evaluation. "
                "If you notice any changing, bleeding, itching, or atypical skin lesion, please consult a qualified "
                "dermatologist or healthcare provider promptly."
            )
        }

        return jsonify(response_data), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Image analysis failed: {str(e)}'}), 500

@predictions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    user_id = int(get_jwt_identity())
    
    # Query parameters
    search = request.args.get('search', '').strip()
    class_filter = request.args.get('class_name', '').strip()
    severity_filter = request.args.get('severity', '').strip()
    page = max(1, int(request.args.get('page', 1)))
    limit = min(50, max(1, int(request.args.get('limit', 10))))

    query = Prediction.query.filter_by(user_id=user_id)

    if search:
        query = query.filter(
            db.or_(
                Prediction.predicted_class.ilike(f'%{search}%'),
                Prediction.original_filename.ilike(f'%{search}%'),
                Prediction.notes.ilike(f'%{search}%')
            )
        )

    if class_filter and class_filter.lower() != 'all':
        query = query.filter(Prediction.predicted_class.ilike(f'%{class_filter}%'))

    if severity_filter and severity_filter.lower() != 'all':
        query = query.filter(Prediction.severity_level.ilike(f'%{severity_filter}%'))

    total_records = query.count()
    total_pages = max(1, (total_records + limit - 1) // limit)
    
    predictions = query.order_by(Prediction.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'predictions': [p.to_dict() for p in predictions],
        'pagination': {
            'current_page': page,
            'total_pages': total_pages,
            'total_records': total_records,
            'limit': limit
        }
    }), 200

@predictions_bp.route('/<int:pred_id>', methods=['GET'])
@jwt_required()
def get_prediction_detail(pred_id):
    user_id = int(get_jwt_identity())
    prediction = db.session.get(Prediction, pred_id)

    if not prediction:
        return jsonify({'error': 'Prediction record not found'}), 404

    if prediction.user_id != user_id:
        # Check if user is admin
        user = db.session.get(User, user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Access denied'}), 403

    # Include related disease info
    disease_record = DiseaseInformation.query.filter(
        DiseaseInformation.name.ilike(f"%{prediction.predicted_class}%")
    ).first()

    return jsonify({
        'prediction': prediction.to_dict(),
        'disease_info': disease_record.to_dict() if disease_record else None
    }), 200

@predictions_bp.route('/<int:pred_id>', methods=['DELETE'])
@jwt_required()
def delete_prediction(pred_id):
    user_id = int(get_jwt_identity())
    prediction = db.session.get(Prediction, pred_id)

    if not prediction:
        return jsonify({'error': 'Prediction record not found'}), 404

    if prediction.user_id != user_id:
        user = db.session.get(User, user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Access denied'}), 403

    try:
        # Clean up image file from uploads folder if it exists
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, prediction.image_path)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Warning: could not delete file {file_path}: {e}")

        db.session.delete(prediction)
        db.session.commit()
        return jsonify({'message': 'Prediction record deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete prediction: {str(e)}'}), 500
