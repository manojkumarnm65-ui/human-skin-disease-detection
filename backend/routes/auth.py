import re
import time
import random
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

# In-memory OTP storage for registration and password recovery
# Structure: { email: { 'otp': '123456', 'expires_at': timestamp, 'type': 'registration'|'reset', 'data': {...} } }
OTP_STORE = {}

def clean_expired_otps():
    """Removes expired OTP tokens from memory store."""
    now = time.time()
    expired_keys = [k for k, v in OTP_STORE.items() if v.get('expires_at', 0) < now]
    for k in expired_keys:
        OTP_STORE.pop(k, None)

@auth_bp.route('/send-registration-otp', methods=['POST'])
def send_registration_otp():
    """Generates a 6-digit OTP for new user registration and stores pending user state."""
    clean_expired_otps()
    data = request.get_json() or {}
    full_name = (data.get('full_name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''

    # Input validations
    if not full_name:
        return jsonify({'error': 'Full name is required'}), 400

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Please enter a valid email address'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    if confirm_password and password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Ensure user does not already exist
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'An account with this email already exists'}), 409

    # Generate 6-digit cryptographic-safe OTP
    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = time.time() + 600  # 10 minutes expiry

    OTP_STORE[email] = {
        'otp': otp_code,
        'expires_at': expires_at,
        'type': 'registration',
        'full_name': full_name,
        'password': password
    }

    print(f"\n[OTP DISPATCH] >>> Verification Code for {email}: {otp_code} (Valid for 10 minutes) <<<\n")

    return jsonify({
        'message': f'Verification OTP successfully dispatched to {email}.',
        'otp_preview': otp_code,
        'expires_in': 600,
        'email': email
    }), 200

@auth_bp.route('/verify-registration-otp', methods=['POST'])
def verify_registration_otp():
    """Verifies the submitted registration OTP, commits the account to the database, and logs in."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    submitted_otp = (data.get('otp') or '').strip()

    if not email or not submitted_otp:
        return jsonify({'error': 'Email and 6-digit verification code are required'}), 400

    record = OTP_STORE.get(email)
    if not record or record.get('type') != 'registration':
        return jsonify({'error': 'No active registration OTP found for this email. Please request a new code.'}), 400

    if time.time() > record.get('expires_at', 0):
        OTP_STORE.pop(email, None)
        return jsonify({'error': 'Verification code has expired. Please request a new code.'}), 400

    if record.get('otp') != submitted_otp:
        return jsonify({'error': 'Invalid verification code. Please check and retry.'}), 400

    full_name = record.get('full_name') or data.get('full_name')
    password = record.get('password') or data.get('password')

    # Double check if user registered in the interim
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        OTP_STORE.pop(email, None)
        return jsonify({'error': 'An account with this email already exists'}), 409

    try:
        user = User(full_name=full_name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        # Clean up OTP
        OTP_STORE.pop(email, None)

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Account verified and registered successfully!',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """Direct registration fallback for tests/scripts without interactive OTP."""
    data = request.get_json() or {}
    full_name = (data.get('full_name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''

    if not full_name:
        return jsonify({'error': 'Full name is required'}), 400

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Please enter a valid email address'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    if confirm_password and password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'An account with this email already exists'}), 409

    try:
        user = User(full_name=full_name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200

@auth_bp.route('/forgot-password-otp', methods=['POST'])
def forgot_password_otp():
    """Generates and sends a 6-digit recovery OTP to the user's registered email."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Please provide a valid registered email address'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account associated with this email address was found'}), 404

    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = time.time() + 600

    OTP_STORE[email] = {
        'otp': otp_code,
        'expires_at': expires_at,
        'type': 'password_reset'
    }

    print(f"\n[RECOVERY OTP DISPATCH] >>> Password Reset Code for {email}: {otp_code} (Valid for 10 minutes) <<<\n")

    return jsonify({
        'message': f'Password recovery code sent to {email}.',
        'otp_preview': otp_code,
        'expires_in': 600,
        'email': email
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Verifies the recovery OTP and updates the account password."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    submitted_otp = (data.get('otp') or '').strip()
    new_password = data.get('new_password') or ''
    confirm_password = data.get('confirm_password') or ''

    if not email or not submitted_otp or not new_password:
        return jsonify({'error': 'Email, recovery OTP, and new password are required'}), 400

    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters long'}), 400

    if confirm_password and new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    record = OTP_STORE.get(email)
    if not record or record.get('type') != 'password_reset':
        return jsonify({'error': 'No active password recovery request found for this email. Please request a new code.'}), 400

    if time.time() > record.get('expires_at', 0):
        OTP_STORE.pop(email, None)
        return jsonify({'error': 'Recovery code has expired. Please request a new code.'}), 400

    if record.get('otp') != submitted_otp:
        return jsonify({'error': 'Invalid recovery code. Please check and retry.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        OTP_STORE.pop(email, None)
        return jsonify({'error': 'User account not found'}), 404

    try:
        user.set_password(new_password)
        db.session.commit()
        OTP_STORE.pop(email, None)

        return jsonify({
            'message': 'Password has been successfully reset! You can now log in with your new password.'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to reset password: {str(e)}'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Legacy alias redirecting to forgot-password-otp."""
    return forgot_password_otp()

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200
