import os
import re
import time
import json
import random
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from services.email_service import send_otp_email, send_email, sanitize_recipient

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

def validate_password_strength(password):
    """Validates password length (at least 6 characters)."""
    if not password or len(password) < 6:
        return False, 'Password must be at least 6 characters long.'
    return True, ''

# Persistent OTP storage for registration and password recovery across restarts
OTP_STORAGE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.otp_store.json')

def get_otp_expiry_seconds():
    """
    Returns OTP validity duration in seconds.
    Default: 7 days (168 hours = 604,800 seconds) for long-term reliability.
    Configurable via OTP_EXPIRE_DAYS or OTP_EXPIRE_HOURS or OTP_EXPIRE_SECONDS.
    """
    days = int(os.environ.get('OTP_EXPIRE_DAYS', 7))
    hours = int(os.environ.get('OTP_EXPIRE_HOURS', days * 24))
    return int(os.environ.get('OTP_EXPIRE_SECONDS', hours * 3600))

def get_otp_expiry_display():
    """Returns human-friendly expiration description like '7 days' or '24 hours'."""
    secs = get_otp_expiry_seconds()
    hours = secs // 3600
    if hours >= 24:
        days = hours // 24
        return f"{days} day{'s' if days > 1 else ''}"
    return f"{hours} hour{'s' if hours > 1 else ''}"

def load_otp_store():
    """Reads saved OTP records from persistent file."""
    if os.path.exists(OTP_STORAGE_FILE):
        try:
            with open(OTP_STORAGE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_otp_store(store):
    """Safely saves active OTP records to disk."""
    try:
        with open(OTP_STORAGE_FILE, 'w', encoding='utf-8') as f:
            json.dump(store, f, indent=2)
    except Exception as e:
        print(f"[OTP STORAGE ERROR] Could not save store: {e}", flush=True)

def clean_expired_otps():
    """Removes expired OTP tokens from persistent store."""
    now = time.time()
    store = load_otp_store()
    expired_keys = [k for k, v in store.items() if v.get('expires_at', 0) < now]
    if expired_keys:
        for k in expired_keys:
            store.pop(k, None)
        save_otp_store(store)

def get_otp_record(email):
    clean_expired_otps()
    store = load_otp_store()
    return store.get((email or '').strip().lower())

def set_otp_record(email, record):
    clean_expired_otps()
    store = load_otp_store()
    store[(email or '').strip().lower()] = record
    save_otp_store(store)

def remove_otp_record(email):
    store = load_otp_store()
    key = (email or '').strip().lower()
    if key in store:
        store.pop(key, None)
        save_otp_store(store)

@auth_bp.route('/send-registration-otp', methods=['POST'])
def send_registration_otp():
    """Generates a 6-digit OTP for new user registration with long validity and stores state."""
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

    is_valid, msg = validate_password_strength(password)
    if not is_valid:
        return jsonify({'error': msg}), 400

    if confirm_password and password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    is_existing = bool(existing_user)

    # Generate 6-digit OTP code & calculate long-term expiration (7 days default)
    otp_code = f"{random.randint(100000, 999999)}"
    expiry_seconds = get_otp_expiry_seconds()
    expiry_display = get_otp_expiry_display()
    expires_at = time.time() + expiry_seconds

    record = {
        'otp': otp_code,
        'expires_at': expires_at,
        'type': 'registration',
        'full_name': full_name,
        'password': password,
        'is_existing': is_existing
    }
    set_otp_record(email, record)

    # Dispatch real email via SMTP
    email_result = send_otp_email(
        to_email=email,
        otp_code=otp_code,
        full_name=full_name,
        purpose='registration',
        expiry_display=expiry_display
    )

    print(f"\n[OTP DISPATCH] >>> Verification Code for {email}: {otp_code} (Valid for {expiry_display}) <<<\n", flush=True)

    was_sent = email_result.get('success', False)
    if not was_sent:
        error_msg = email_result.get('error') or "Failed to deliver verification email. Please check your SMTP configuration."
        return jsonify({
            'error': error_msg,
            'email': email,
            'email_sent': False
        }), 400

    return jsonify({
        'message': f'Verification OTP successfully dispatched to {email}. Code is valid for {expiry_display}. Please check your inbox and spam folder.',
        'expires_in': expiry_seconds,
        'expiry_display': expiry_display,
        'email': email,
        'email_sent': True
    }), 200

@auth_bp.route('/verify-registration-otp', methods=['POST'])
def verify_registration_otp():
    """Verifies the submitted registration OTP, commits or updates the account in the database, and logs in."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    submitted_otp = (data.get('otp') or '').strip()

    if not email or not submitted_otp:
        return jsonify({'error': 'Email and 6-digit verification code are required'}), 400

    record = get_otp_record(email)
    if not record or record.get('type') != 'registration':
        return jsonify({'error': 'No active registration OTP found for this email. Please request a new code.'}), 400

    if time.time() > record.get('expires_at', 0):
        remove_otp_record(email)
        return jsonify({'error': 'Verification code has expired. Please request a new code.'}), 400

    if record.get('otp') != submitted_otp:
        return jsonify({'error': 'Invalid verification code. Please check and retry.'}), 400

    full_name = record.get('full_name') or data.get('full_name') or 'User'
    password = record.get('password') or data.get('password') or 'Password123!'

    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            # Update existing account with verified new password & details
            existing_user.full_name = full_name
            existing_user.set_password(password)
            user = existing_user
        else:
            # Create new account
            user = User(full_name=full_name, email=email)
            user.set_password(password)
            db.session.add(user)

        db.session.commit()

        # Clean up OTP upon successful registration
        remove_otp_record(email)

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Account verified and authenticated successfully!',
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

    is_valid, msg = validate_password_strength(password)
    if not is_valid:
        return jsonify({'error': msg}), 400

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
    """Generates and sends a 6-digit recovery OTP with long validity to the user's registered email."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({'error': 'Please provide a valid registered email address'}), 400

    user = User.query.filter_by(email=email).first()
    full_name = user.full_name if user else email.split('@')[0].capitalize()

    # Generate 6-digit OTP code & calculate long-term expiration (7 days default)
    otp_code = f"{random.randint(100000, 999999)}"
    expiry_seconds = get_otp_expiry_seconds()
    expiry_display = get_otp_expiry_display()
    expires_at = time.time() + expiry_seconds

    record = {
        'otp': otp_code,
        'expires_at': expires_at,
        'type': 'password_reset',
        'is_new_user': (user is None)
    }
    set_otp_record(email, record)

    # Dispatch real email via SMTP
    email_result = send_otp_email(
        to_email=email,
        otp_code=otp_code,
        full_name=full_name,
        purpose='password_reset',
        expiry_display=expiry_display
    )

    print(f"\n[RECOVERY OTP DISPATCH] >>> Password Reset Code for {email}: {otp_code} (Valid for {expiry_display}) <<<\n", flush=True)

    was_sent = email_result.get('success', False)
    if not was_sent:
        error_msg = email_result.get('error') or "Failed to deliver recovery email. Please check your SMTP configuration."
        return jsonify({
            'error': error_msg,
            'email': email,
            'email_sent': False
        }), 400

    return jsonify({
        'message': f'Password recovery code successfully sent to {email}. Code is valid for {expiry_display}. Please check your inbox and spam folder.',
        'expires_in': expiry_seconds,
        'expiry_display': expiry_display,
        'email': email,
        'email_sent': True
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Verifies the recovery OTP and updates or establishes the account password."""
    clean_expired_otps()
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    submitted_otp = (data.get('otp') or '').strip()
    new_password = data.get('new_password') or ''
    confirm_password = data.get('confirm_password') or ''

    if not email or not submitted_otp or not new_password:
        return jsonify({'error': 'Email, recovery OTP, and new password are required'}), 400

    is_valid, msg = validate_password_strength(new_password)
    if not is_valid:
        return jsonify({'error': msg}), 400

    if confirm_password and new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    record = get_otp_record(email)
    if not record or record.get('type') != 'password_reset':
        return jsonify({'error': 'No active password recovery request found for this email. Please request a new code.'}), 400

    if time.time() > record.get('expires_at', 0):
        remove_otp_record(email)
        return jsonify({'error': 'Recovery code has expired. Please request a new code.'}), 400

    if record.get('otp') != submitted_otp:
        return jsonify({'error': 'Invalid recovery code. Please check and retry.'}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            # Create user if previously non-existent
            user = User(full_name=email.split('@')[0].capitalize(), email=email)
            user.set_password(new_password)
            db.session.add(user)
        else:
            user.set_password(new_password)

        db.session.commit()
        remove_otp_record(email)

        return jsonify({
            'message': 'Password has been successfully updated! You can now log in with your new password.'
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

@auth_bp.route('/smtp-status', methods=['GET'])
def get_smtp_status():
    """Returns whether SMTP is configured and the masked sender email."""
    username = os.environ.get('SMTP_USERNAME', '').strip()
    password = os.environ.get('SMTP_PASSWORD', '').strip()
    configured = bool(username and password)
    
    masked = None
    if configured and '@' in username:
        parts = username.split('@')
        masked = f"{parts[0][:3]}***@{parts[1]}"
    
    return jsonify({
        'configured': configured,
        'sender_email': masked,
        'smtp_server': os.environ.get('SMTP_SERVER', 'smtp.gmail.com'),
        'smtp_port': int(os.environ.get('SMTP_PORT', 587)),
    }), 200

@auth_bp.route('/smtp-config', methods=['POST'])
def configure_smtp():
    """Validates real SMTP credentials, sends a test email, and permanently writes to backend/.env."""
    data = request.get_json() or {}
    username = (data.get('smtp_username') or '').strip()
    password = (data.get('smtp_password') or '').strip().replace(' ', '')
    server = (data.get('smtp_server') or 'smtp.gmail.com').strip()
    try:
        port = int(data.get('smtp_port') or 587)
    except ValueError:
        port = 587
    test_recipient = (data.get('test_recipient') or username).strip()

    if not username or not password:
        return jsonify({'error': 'Both sender email address and App Password are required'}), 400

    # 1. Test live SMTP login & dispatch a test verification email
    try:
        print(f"[SMTP VERIFY] Testing connection to {server}:{port} with user {username}...")
        try:
            ctx = ssl.create_default_context()
            if port == 465:
                smtp_client = smtplib.SMTP_SSL(server, port, context=ctx, timeout=15)
            else:
                smtp_client = smtplib.SMTP(server, port, timeout=15)
                smtp_client.ehlo()
                smtp_client.starttls(context=ctx)
                smtp_client.ehlo()
            smtp_client.login(username, password)
        except (ssl.SSLCertVerificationError, ssl.SSLError):
            unverified_ctx = ssl._create_unverified_context()
            if port == 465:
                smtp_client = smtplib.SMTP_SSL(server, port, context=unverified_ctx, timeout=15)
            else:
                smtp_client = smtplib.SMTP(server, port, timeout=15)
                smtp_client.ehlo()
                smtp_client.starttls(context=unverified_ctx)
                smtp_client.ehlo()
            smtp_client.login(username, password)

        # Dispatch test email
        test_msg = MIMEMultipart()
        test_msg['Subject'] = "Human Skin Disease Detection — SMTP Email Delivery Verified!"
        test_msg['From'] = f"Human Skin Disease Detection AI <{username}>"
        test_msg['To'] = test_recipient
        test_body = (
            f"Hello!\n\n"
            f"Congratulations! Your SMTP email delivery connection has been verified successfully.\n"
            f"From now on, all 6-digit verification OTP codes will be delivered directly to the user's specific email address.\n\n"
            f"Sender Account: {username}\n"
            f"System: Human Skin Disease Detection AI Platform\n"
        )
        test_msg.attach(MIMEText(test_body, 'plain'))
        smtp_client.sendmail(username, [test_recipient], test_msg.as_string())
        smtp_client.quit()
        print(f"[SMTP VERIFY SUCCESS] Test email delivered to {test_recipient}!")

    except Exception as e:
        err = str(e)
        print(f"[SMTP VERIFY FAILED] Error: {err}")
        return jsonify({
            'error': f"SMTP Connection Failed: {err}. If using Gmail, ensure 2-Step Verification is ON and you generated a 16-character App Password at myaccount.google.com/apppasswords."
        }), 400

    # 2. Persist to backend/.env file
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    try:
        env_lines = []
        if os.path.exists(env_path):
            with open(env_path, 'r', encoding='utf-8') as f:
                env_lines = f.readlines()

        keys_to_update = {
            'SMTP_SERVER': server,
            'SMTP_PORT': str(port),
            'SMTP_USERNAME': username,
            'SMTP_PASSWORD': password,
            'SMTP_FROM_EMAIL': username,
            'SMTP_USE_TLS': 'True'
        }

        updated_keys = set()
        new_lines = []
        for line in env_lines:
            matched = False
            for k, v in keys_to_update.items():
                if line.startswith(f"{k}="):
                    new_lines.append(f"{k}={v}\n")
                    updated_keys.add(k)
                    matched = True
                    break
            if not matched:
                new_lines.append(line)

        for k, v in keys_to_update.items():
            if k not in updated_keys:
                new_lines.append(f"{k}={v}\n")

        with open(env_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

        # Update current process environment immediately without requiring restart
        for k, v in keys_to_update.items():
            os.environ[k] = v

    except Exception as e:
        print(f"[SMTP CONFIG WARNING] Could not write .env file: {e}")

    return jsonify({
        'success': True,
        'message': f"SMTP successfully connected! A test verification email was sent to {test_recipient}. All future OTPs will now be delivered directly to the recipient's inbox."
    }), 200

@auth_bp.route('/send-test-email', methods=['POST'])
def send_test_email():
    """Dispatches a test diagnostic email to any specified recipient email address."""
    data = request.get_json() or {}
    recipient = sanitize_recipient(data.get('recipient_email') or '')
    if not recipient or '@' not in recipient:
        return jsonify({'error': 'Please provide a valid recipient email address'}), 400

    subject = "Human Skin Disease Detection — SMTP Verification & Test Email"
    html_content = f"""
    <div style="max-width: 560px; margin: 0 auto; background: #071B33; border: 1px solid rgba(8, 201, 245, 0.4); border-radius: 12px; padding: 28px; font-family: 'Segoe UI', Tahoma, sans-serif; color: #FFFFFF;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 32px;">🔬</span>
        <h2 style="margin: 8px 0 0; color: #FFFFFF; font-size: 20px;">Human Skin Disease <span style="color: #08C9F5;">Detection</span></h2>
        <p style="margin: 4px 0 0; color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">SMTP Email Delivery Test</p>
      </div>
      <div style="background: rgba(8, 201, 245, 0.1); border-left: 4px solid #08C9F5; padding: 14px; border-radius: 6px; margin-bottom: 16px;">
        <strong style="color: #08C9F5;">Direct Delivery Success!</strong>
        <p style="margin: 4px 0 0; color: #CBD5E1; font-size: 13px;">This test confirms that emails from the AI platform are successfully delivered to <strong>{recipient}</strong>.</p>
      </div>
      <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
        Human Skin Disease Detection AI System &bull; Automated Test Notification
      </p>
    </div>
    """
    plain_content = f"Human Skin Disease Detection — Email Delivery Test\n\nThis confirms that test emails from the system successfully reach: {recipient}."

    result = send_email(to_email=recipient, subject=subject, html_content=html_content, plain_content=plain_content)
    if result.get('success'):
        return jsonify({
            'success': True,
            'message': f"Test email successfully delivered directly to {recipient}!"
        }), 200
    else:
        return jsonify({
            'error': f"Failed to deliver email to {recipient}: {result.get('error', 'SMTP connection error')}"
        }), 400

