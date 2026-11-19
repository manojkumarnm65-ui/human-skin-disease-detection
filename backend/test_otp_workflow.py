import sys
import os
import time

backend_dir = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, backend_dir)

from app import create_app
from extensions import db
from models.user import User
from routes.auth import get_otp_expiry_seconds, get_otp_expiry_display, get_otp_record, set_otp_record, remove_otp_record

def test_workflow():
    app = create_app()
    client = app.test_client()

    with app.app_context():
        print("=== TEST 1: Unconfigured SMTP must return an explicit HTTP 400 error (Requirement 7 & 8) ===")
        test_email = "patient_recipient@example.com"
        
        # Ensure SMTP credentials are empty for this test
        os.environ['SMTP_USERNAME'] = ''
        os.environ['SMTP_PASSWORD'] = ''

        res = client.post('/api/auth/send-registration-otp', json={
            'full_name': 'Test Patient',
            'email': test_email,
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!'
        })
        print(f"Status code without SMTP: {res.status_code}")
        data = res.get_json()
        print(f"Response data: {data}")
        assert res.status_code == 400, f"Expected 400, got {res.status_code}"
        assert 'error' in data, "Expected error in response data"
        assert 'SMTP' in data['error'], "Error message must explain SMTP issue"
        print("[PASS] Requirement 7 & 8 verified: System displays actual error when email delivery cannot be performed.")

        print("\n=== TEST 2: OTP Verification and Expiration Logic ===")
        # Manually seed a valid OTP into persistent store to simulate verified delivery
        otp_code = "654321"
        expiry_seconds = get_otp_expiry_seconds()
        expires_at = time.time() + expiry_seconds
        set_otp_record(test_email, {
            'otp': otp_code,
            'expires_at': expires_at,
            'type': 'registration',
            'full_name': 'Test Patient',
            'password': 'SecurePassword123!',
            'is_existing': False
        })
        saved = get_otp_record(test_email)
        assert saved is not None
        assert saved['otp'] == otp_code
        assert saved['expires_at'] > time.time() + 86400  # at least 1 day
        print(f"[PASS] OTP stored securely with 7-day expiration ({get_otp_expiry_display()})")

        print("\n=== TEST 3: Verify OTP ===")
        # Test wrong OTP first
        res_wrong = client.post('/api/auth/verify-registration-otp', json={
            'email': test_email,
            'otp': '000000',
            'full_name': 'Test Patient',
            'password': 'SecurePassword123!'
        })
        assert res_wrong.status_code == 400
        print("[PASS] Rejects invalid OTP")

        # Test correct OTP
        res_correct = client.post('/api/auth/verify-registration-otp', json={
            'email': test_email,
            'otp': otp_code,
            'full_name': 'Test Patient',
            'password': 'SecurePassword123!'
        })
        assert res_correct.status_code == 201
        verify_data = res_correct.get_json()
        assert 'access_token' in verify_data
        print("[PASS] Correct OTP verifies and returns access token")

        # Ensure OTP record is destroyed after verification
        assert get_otp_record(test_email) is None
        print("[PASS] OTP consumed and deleted after verification")

        # Clean up test user
        user = User.query.filter_by(email=test_email).first()
        if user:
            db.session.delete(user)
            db.session.commit()

        print("\n=== ALL UNIT TESTS PASSED ===")

if __name__ == '__main__':
    test_workflow()
