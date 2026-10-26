from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.prediction import Prediction
from .auth import validate_password_strength

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    prediction_count = Prediction.query.filter_by(user_id=user_id).count()
    latest_pred = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).first()

    return jsonify({
        'user': user.to_dict(),
        'total_predictions': prediction_count,
        'latest_prediction_date': latest_pred.created_at.isoformat() if latest_pred and latest_pred.created_at else None
    }), 200

@profile_bp.route('', methods=['PATCH'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json() or {}
    full_name = data.get('full_name')
    avatar = data.get('avatar')

    if full_name is not None:
        full_name = full_name.strip()
        if not full_name:
            return jsonify({'error': 'Full name cannot be empty'}), 400
        user.full_name = full_name

    if avatar is not None:
        user.avatar = avatar.strip()

    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

@profile_bp.route('/password', methods=['PATCH'])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json() or {}
    current_password = data.get('current_password') or ''
    new_password = data.get('new_password') or ''
    confirm_new_password = data.get('confirm_new_password') or ''

    if not current_password or not new_password:
        return jsonify({'error': 'Current password and new password are required'}), 400

    if not user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400

    is_valid, msg = validate_password_strength(new_password)
    if not is_valid:
        return jsonify({'error': msg}), 400

    if confirm_new_password and new_password != confirm_new_password:
        return jsonify({'error': 'New passwords do not match'}), 400

    try:
        user.set_password(new_password)
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update password: {str(e)}'}), 500

@profile_bp.route('/account', methods=['DELETE', 'POST'])
@profile_bp.route('/delete-account', methods=['POST'])
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User account not found.'}), 404

    # Comprehensive extraction from JSON, form-data, query parameters, headers, or raw payload
    data = request.get_json(force=True, silent=True) or {}
    if not isinstance(data, dict):
        data = {}

    password = (
        data.get('password') or
        data.get('confirm_password') or
        data.get('confirmation_password') or
        data.get('current_password') or
        request.form.get('password') or
        request.form.get('confirm_password') or
        request.args.get('password') or
        request.args.get('confirm_password') or
        request.headers.get('x-confirmation-password') or
        request.headers.get('x-password') or
        ''
    )

    if not password and request.data:
        try:
            raw_text = request.data.decode('utf-8', errors='ignore').strip()
            if raw_text and not raw_text.startswith('{'):
                password = raw_text
        except Exception:
            pass

    password = str(password).strip()

    if not password:
        return jsonify({'error': 'Password confirmation is required. Please enter your current account password to proceed.'}), 400

    if not user.check_password(password):
        return jsonify({'error': 'Incorrect password entered. Please enter your valid current account password.'}), 400

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Account and all associated records have been permanently deleted.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500
