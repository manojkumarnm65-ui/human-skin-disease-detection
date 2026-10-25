import os
import uuid
from PIL import Image, ImageStat
import numpy as np
from werkzeug.utils import secure_filename
from config import Config

def is_allowed_file(filename):
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS

def assess_image_quality(img: Image.Image):
    """
    Performs standard image quality checks on uploaded skin photo:
    - Minimum resolution
    - Brightness / Lighting level
    - Contrast
    - Sharpness / blurriness estimation
    Returns quality score (0-100), status, and helpful recommendations.
    """
    width, height = img.size
    issues = []
    tips = []
    
    # 1. Resolution check
    if width < 150 or height < 150:
        issues.append("Image resolution is very low.")
        tips.append("Upload an image of at least 200x200 pixels for better detail.")
    elif width < 300 or height < 300:
        tips.append("Higher resolution photos capture lesion border characteristics better.")

    # 2. Lighting / Brightness check
    grayscale = img.convert('L')
    stat = ImageStat.Stat(grayscale)
    mean_brightness = stat.mean[0] # 0 (dark) to 255 (white)
    
    if mean_brightness < 45:
        issues.append("Image is too dark or underexposed.")
        tips.append("Ensure good, direct diffuse lighting without strong shadows.")
    elif mean_brightness > 220:
        issues.append("Image is overexposed or washed out by flash.")
        tips.append("Avoid harsh direct flash that causes glare on skin.")

    # 3. Contrast check
    rms_contrast = stat.rms[0]
    if rms_contrast < 20:
        issues.append("Low contrast; skin lesion is difficult to separate from surroundings.")
        tips.append("Ensure the lesion is in crisp focus against surrounding skin.")

    # 4. Blur / Sharpness heuristic
    gray_np = np.array(grayscale, dtype=np.float32)
    # Simple discrete gradient / Laplacian variance estimation
    gy, gx = np.gradient(gray_np)
    gnorm = np.sqrt(gx**2 + gy**2)
    sharpness_score = np.mean(gnorm)
    
    is_blurry = sharpness_score < 4.0
    if is_blurry:
        issues.append("Lesion appears blurry or out of focus.")
        tips.append("Keep your camera steady and tap on the lesion to focus before taking the photo.")

    score = 100
    if issues:
        score -= len(issues) * 20
    score = max(20, min(100, int(score)))

    is_suitable = score >= 50 and not (mean_brightness < 30 or mean_brightness > 235)

    return {
        'suitable': is_suitable,
        'quality_score': score,
        'mean_brightness': round(float(mean_brightness), 1),
        'sharpness_score': round(float(sharpness_score), 2),
        'issues': issues,
        'recommendations': tips if tips else ["Image lighting and focus are acceptable for analysis."]
    }

def save_and_validate_image(file_storage):
    """
    Validates uploaded file, ensures it can be decoded as a valid image,
    and saves it with a randomized secure filename.
    """
    if not file_storage or file_storage.filename == '':
        raise ValueError("No file provided.")

    filename = secure_filename(file_storage.filename)
    if not is_allowed_file(filename):
        raise ValueError("Invalid file extension. Allowed formats: PNG, JPG, JPEG, WEBP.")

    try:
        # Open and verify image content
        image = Image.open(file_storage.stream)
        image.verify()  # Verify file is not corrupt
    except Exception as e:
        raise ValueError(f"Uploaded file cannot be decoded as a valid image: {str(e)}")

    # Reopen because verify() closes the stream or leaves pointer at EOF
    file_storage.stream.seek(0)
    image = Image.open(file_storage.stream)

    # Convert to RGB if needed (handling RGBA or grayscale)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    quality_assessment = assess_image_quality(image)

    # Generate unique filename
    ext = os.path.splitext(filename)[1].lower()
    if not ext:
        ext = '.jpg'
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    destination_path = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
    
    # Save optimized copy
    image.save(destination_path, quality=92, optimize=True)

    return {
        'saved_filename': unique_filename,
        'destination_path': destination_path,
        'original_filename': filename,
        'dimensions': image.size,
        'quality': quality_assessment
    }
