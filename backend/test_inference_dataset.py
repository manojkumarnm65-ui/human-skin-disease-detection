import os
import glob
import json
import urllib.request
import uuid
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = os.path.join(BASE_DIR, 'dataset', 'test')

# 1. First authenticate with backend to get access_token
def get_auth_token():
    login_url = "http://127.0.0.1:5000/api/auth/login"
    login_payload = json.dumps({"email": "testuser_ml@example.com", "password": "Password123!"}).encode("utf-8")
    req = urllib.request.Request(login_url, data=login_payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("access_token")
    except Exception:
        # Register if doesn't exist
        reg_url = "http://127.0.0.1:5000/api/auth/register"
        reg_payload = json.dumps({
            "full_name": "ML Tester",
            "email": "testuser_ml@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }).encode("utf-8")
        req = urllib.request.Request(reg_url, data=reg_payload, headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("access_token")
        except Exception as e:
            print(f"[!] Could not get auth token: {e}")
            return None

def analyze_image_via_api(token, image_path):
    url = "http://127.0.0.1:5000/api/predictions/analyze"
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    filename = os.path.basename(image_path)
    with open(image_path, "rb") as f:
        file_bytes = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode("latin-1") + file_bytes + f"\r\n--{boundary}--\r\n".encode("latin-1")

    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Authorization": f"Bearer {token}"
    }
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))

def main():
    print("=" * 80)
    print("TESTING TRAINED ML MODEL AND SEPARATE DATASET/TEST FOLDERS")
    print("=" * 80)
    
    # Load class names
    class_names_path = os.path.join(BASE_DIR, 'models', 'class_names.json')
    with open(class_names_path, 'r') as f:
        class_names = json.load(f)
    print(f"Total registered conditions: {len(class_names)}")
    
    # Get auth token
    token = get_auth_token()
    if not token:
        print("[!] Warning: Could not authenticate via HTTP. Will test direct prediction_service instead.")
    
    # Test all classes
    correct_count = 0
    total_tested = 0
    
    print("\n" + "-" * 80)
    print(f"{'#':<3} | {'Class Name':<32} | {'Predicted Result':<30} | {'Conf':<6} | {'Status'}")
    print("-" * 80)
    
    for idx, class_name in enumerate(class_names, start=1):
        class_folder = os.path.join(TEST_DIR, class_name)
        if not os.path.exists(class_folder):
            print(f"{idx:02d} | {class_name:<32} | [FOLDER NOT FOUND]            | N/A    | FAIL")
            continue
        
        test_images = glob.glob(os.path.join(class_folder, "*.jpg"))
        if not test_images:
            print(f"{idx:02d} | {class_name:<32} | [NO IMAGES IN FOLDER]        | N/A    | FAIL")
            continue
        
        total_tested += 1
        test_img = test_images[0] # Use unseen withheld test image
        
        if token:
            try:
                res = analyze_image_via_api(token, test_img)
                pred_info = res.get("prediction", {})
                predicted_class = pred_info.get("predicted_class", "Unknown")
                confidence = pred_info.get("confidence", 0.0)
            except Exception as e:
                predicted_class = f"API Error: {e}"
                confidence = 0.0
        else:
            # Fallback to direct prediction_service
            sys.path.insert(0, BASE_DIR)
            from services.prediction_service import prediction_service
            res = prediction_service.predict(test_img)
            predicted_class = res.get("predicted_class", "Unknown")
            confidence = res.get("confidence", 0.0)
            
        is_match = predicted_class.strip().lower() == class_name.strip().lower()
        if is_match:
            correct_count += 1
            status_str = "PASS [MATCH]"
        else:
            status_str = "MISMATCH"
            
        conf_pct = confidence if confidence > 1.0 else confidence * 100
        print(f"{idx:02d} | {class_name:<32} | {predicted_class:<30} | {conf_pct:5.1f}% | {status_str}")

    print("-" * 80)
    accuracy = (correct_count / total_tested * 100) if total_tested else 0
    print(f"\n[SUMMARY RESULTS]")
    print(f"Total Conditions Tested: {total_tested}/{len(class_names)}")
    print(f"Correct Predictions:     {correct_count}/{total_tested}")
    print(f"Test Set Accuracy:       {accuracy:.2f}%\n")
    print("=" * 80)

if __name__ == "__main__":
    main()
