import urllib.request
import urllib.parse
import json
import mimetypes
import uuid

BASE_URL = "http://127.0.0.1:5000/api"

def run_tests():
    print("=" * 60)
    print("Testing SkinCare AI Backend API Endpoints")
    print("=" * 60)

    # 1. Health check
    req = urllib.request.Request(f"{BASE_URL}/health")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"[1] Health Check: Status {resp.status} -> {data}")

    # 2. Login
    login_payload = json.dumps({"email": "demo@skincare.ai", "password": "Password123!"}).encode()
    login_req = urllib.request.Request(f"{BASE_URL}/auth/login", data=login_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(login_req) as resp:
        login_data = json.loads(resp.read().decode())
        token = login_data['access_token']
        print(f"[2] Login: Success! User: {login_data['user']['full_name']}, Token obtained.")

    # 3. Get Dashboard Stats
    stats_req = urllib.request.Request(f"{BASE_URL}/dashboard/stats", headers={'Authorization': f'Bearer {token}'})
    with urllib.request.urlopen(stats_req) as resp:
        stats_data = json.loads(resp.read().decode())
        print(f"[3] Dashboard Stats: {stats_data}")

    # 4. Get Diseases Library
    diseases_req = urllib.request.Request(f"{BASE_URL}/diseases")
    with urllib.request.urlopen(diseases_req) as resp:
        diseases_data = json.loads(resp.read().decode())
        print(f"[4] Diseases Library: Retrieved {len(diseases_data['diseases'])} conditions.")
        for d in diseases_data['diseases']:
            print(f"    - {d['name']} ({d['category']}) [{d['severity']}]")

    # 5. Get Prediction History
    history_req = urllib.request.Request(f"{BASE_URL}/predictions/history", headers={'Authorization': f'Bearer {token}'})
    with urllib.request.urlopen(history_req) as resp:
        history_data = json.loads(resp.read().decode())
        print(f"[5] Prediction History: Retrieved {len(history_data['predictions'])} records.")
        for p in history_data['predictions'][:3]:
            print(f"    - #{p['id']}: {p['predicted_class']} ({p['confidence']}%) - {p['severity_level']}")

    # 6. Test Image Analysis via Multipart Form Data
    sample_img_path = "samples/sample_melanoma.jpg"
    with open(sample_img_path, 'rb') as f:
        img_bytes = f.read()

    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="test_melanoma.jpg"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode() + img_bytes + (
        f"\r\n--{boundary}\r\n"
        f'Content-Disposition: form-data; name="notes"\r\n\r\n'
        f"Automated test upload\r\n"
        f"--{boundary}--\r\n"
    ).encode()

    analyze_req = urllib.request.Request(
        f"{BASE_URL}/predictions/analyze",
        data=body,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'Authorization': f'Bearer {token}'
        }
    )
    with urllib.request.urlopen(analyze_req) as resp:
        pred_res = json.loads(resp.read().decode())
        print(f"[6] Image Analysis Endpoint: Success!")
        print(f"    - Predicted: {pred_res['prediction']['predicted_class']}")
        print(f"    - Confidence: {pred_res['prediction']['confidence']}%")
        print(f"    - Severity: {pred_res['prediction']['severity_level']}")
        print(f"    - Quality Score: {pred_res['quality_assessment']['quality_score']}/100")
        print(f"    - Probabilities: {pred_res['prediction']['probabilities']}")
        print(f"    - Disclaimer: {pred_res['medical_disclaimer'][:80]}...")

    print("=" * 60)
    print("ALL API ENDPOINTS TESTED & OPERATIONAL!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
