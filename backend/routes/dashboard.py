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
    
    # 1. Condition distribution: aggregate actual top conditions tested by this user
    # Fast single group by query:
    dist_results = (
        db.session.query(Prediction.predicted_class, db.func.count(Prediction.id))
        .filter(Prediction.user_id == user_id)
        .group_by(Prediction.predicted_class)
        .order_by(db.func.count(Prediction.id).desc())
        .limit(8)
        .all()
    )
    
    distribution = [{'name': name, 'count': count} for name, count in dist_results]
    if not distribution:
        fallback_classes = ["Melanoma", "Nevus", "Eczema", "Psoriasis", "Acne"]
        distribution = [{'name': cls, 'count': 0} for cls in fallback_classes]

    # 2. Daily trend over past 7 days in a single query
    now = datetime.now(timezone.utc)
    seven_days_ago = (now - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
    
    recent_preds = (
        Prediction.query
        .filter(Prediction.user_id == user_id, Prediction.created_at >= seven_days_ago)
        .all()
    )
    
    # Aggregate by day in memory (sub-millisecond performance)
    days_data = {}
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        days_data[day_date] = {'total': 0, 'benign': 0, 'concerning': 0}

    for p in recent_preds:
        if p.created_at:
            p_date = p.created_at.date()
            if p_date in days_data:
                days_data[p_date]['total'] += 1
                sev = (p.severity_level or '').lower()
                if 'benign' in sev or 'low risk' in sev:
                    days_data[p_date]['benign'] += 1
                elif 'concerning' in sev or 'high risk' in sev:
                    days_data[p_date]['concerning'] += 1

    weekly_trend = [
        {
            'date': d.strftime('%b %d'),
            'total': vals['total'],
            'benign': vals['benign'],
            'concerning': vals['concerning']
        }
        for d, vals in days_data.items()
    ]

    return jsonify({
        'condition_distribution': distribution,
        'weekly_trend': weekly_trend
    }), 200
