from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.prediction import Prediction
from models.disease import DiseaseInformation

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate statistics from actual database records
    user_preds = Prediction.query.filter_by(user_id=user_id)
    total_predictions = user_preds.count()
    
    # Benign vs Concerning vs Chronic counts
    benign_count = user_preds.filter(
        db.or_(
            Prediction.severity_level.ilike('%benign%'),
            Prediction.severity_level.ilike('%low risk%'),
            Prediction.predicted_class.in_(['Nevus', 'Acne'])
        )
    ).count()

    concerning_count = user_preds.filter(
        db.or_(
            Prediction.severity_level.ilike('%concerning%'),
            Prediction.severity_level.ilike('%high risk%'),
            Prediction.predicted_class == 'Melanoma'
        )
    ).count()

    chronic_count = user_preds.filter(
        db.or_(
            Prediction.severity_level.ilike('%chronic%'),
            Prediction.severity_level.ilike('%manageable%'),
            Prediction.predicted_class.in_(['Eczema', 'Psoriasis'])
        )
    ).count()

    # Admin info
    total_users_count = None
    if user.role == 'admin':
        total_users_count = User.query.count()

    return jsonify({
        'total_predictions': total_predictions,
        'normal_results': benign_count,
        'concerning_results': concerning_count,
        'chronic_results': chronic_count,
        'registered_users': total_users_count,
        'is_admin': user.role == 'admin'
    }), 200

@dashboard_bp.route('/recent-predictions', methods=['GET'])
@jwt_required()
def get_recent_predictions():
    user_id = int(get_jwt_identity())
    limit = int(request.args.get('limit', 5))

    recent = Prediction.query.filter_by(user_id=user_id)\
        .order_by(Prediction.created_at.desc())\
        .limit(limit)\
        .all()

    return jsonify({
        'recent_predictions': [p.to_dict() for p in recent]
    }), 200

@dashboard_bp.route('/chart-data', methods=['GET'])
@jwt_required()
def get_chart_data():
    user_id = int(get_jwt_identity())
    
    # 1. Condition distribution
    classes = ["Melanoma", "Nevus", "Eczema", "Psoriasis", "Acne"]
    distribution = []
    
    for cls in classes:
        cnt = Prediction.query.filter_by(user_id=user_id, predicted_class=cls).count()
        distribution.append({
            'name': cls,
            'count': cnt
        })

    # 2. Daily trend over past 7 days
    now = datetime.now(timezone.utc)
    weekly_trend = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_start = datetime(day_date.year, day_date.month, day_date.day, 0, 0, 0, tzinfo=timezone.utc)
        day_end = datetime(day_date.year, day_date.month, day_date.day, 23, 59, 59, tzinfo=timezone.utc)

        day_preds = Prediction.query.filter(
            Prediction.user_id == user_id,
            Prediction.created_at >= day_start,
            Prediction.created_at <= day_end
        )
        
        benign = day_preds.filter(Prediction.severity_level.ilike('%benign%')).count()
        concerning = day_preds.filter(Prediction.severity_level.ilike('%concerning%')).count()
        total = day_preds.count()

        weekly_trend.append({
            'date': day_date.strftime('%b %d'),
            'total': total,
            'benign': benign,
            'concerning': concerning
        })

    return jsonify({
        'condition_distribution': distribution,
        'weekly_trend': weekly_trend
    }), 200
