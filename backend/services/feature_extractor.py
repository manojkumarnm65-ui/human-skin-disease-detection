import numpy as np
from PIL import Image

FEATURE_NAMES = [
    'c_r_mean', 'c_g_mean', 'c_b_mean',
    'c_r_std', 'c_g_std', 'c_b_std',
    'p_r_mean', 'p_g_mean', 'p_b_mean',
    'delta_r', 'delta_g', 'delta_b',
    'c_gray_mean', 'p_gray_mean', 'delta_darkness',
    'c_erythema', 'p_erythema', 'delta_erythema', 'diffuse_erythema',
    'c_yellow', 'p_yellow', 'delta_yellow',
    'c_purple', 'p_purple', 'delta_purple',
    'c_hue_mean', 'c_sat_mean', 'c_val_mean',
    'c_sat_std', 'c_val_std', 'delta_sat', 'delta_val',
    'c_grad_mean', 'c_grad_std', 'p_grad_mean', 'p_grad_std', 'grad_ratio',
    'asym_horizontal', 'asym_vertical', 'quadrant_variance', 'border_contrast'
]

def rgb_to_hsv_np(rgb_array):
    """Converts normalized RGB [0, 1] array to HSV."""
    r, g, b = rgb_array[..., 0], rgb_array[..., 1], rgb_array[..., 2]
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    v = maxc
    deltac = maxc - minc

    s = np.where(maxc != 0, deltac / np.maximum(maxc, 1e-6), 0.0)

    # Hue calculation
    rc = np.where(deltac != 0, (maxc - r) / np.maximum(deltac, 1e-6), 0.0)
    gc = np.where(deltac != 0, (maxc - g) / np.maximum(deltac, 1e-6), 0.0)
    bc = np.where(deltac != 0, (maxc - b) / np.maximum(deltac, 1e-6), 0.0)

    h = np.zeros_like(r)
    mask_r = (r == maxc) & (deltac != 0)
    mask_g = (g == maxc) & (r != maxc) & (deltac != 0)
    mask_b = (b == maxc) & (r != maxc) & (g != maxc) & (deltac != 0)

    h[mask_r] = bc[mask_r] - gc[mask_r]
    h[mask_g] = 2.0 + rc[mask_g] - bc[mask_g]
    h[mask_b] = 4.0 + gc[mask_b] - rc[mask_b]
    h = (h / 6.0) % 1.0

    return np.stack([h, s, v], axis=-1)

def extract_features_from_image(image: Image.Image) -> np.ndarray:
    """
    Extracts a normalized, comprehensive feature vector of 41 clinical and morphological
    features from a skin lesion image.
    Features include central ROI vs baseline periphery deltas, erythema indices,
    honey/violaceous saturation, gradient textures, and ABCD asymmetry metrics.
    """
    if image.mode != 'RGB':
        image = image.convert('RGB')

    resized = image.resize((224, 224))
    rgb = np.array(resized, dtype=np.float32)

    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    gray = 0.299 * r + 0.587 * g + 0.114 * b

    # Central Region of Interest (ROI) - middle 50%
    c_roi = rgb[56:168, 56:168]
    c_gray = gray[56:168, 56:168]

    # Baseline periphery outer ring
    periph_rgb = np.concatenate([
        rgb[:30].reshape(-1, 3),
        rgb[194:].reshape(-1, 3),
        rgb[30:194, :30].reshape(-1, 3),
        rgb[30:194, 194:].reshape(-1, 3)
    ], axis=0)

    periph_gray = 0.299 * periph_rgb[:, 0] + 0.587 * periph_rgb[:, 1] + 0.114 * periph_rgb[:, 2]

    # 1. Color moments (Central & Periphery)
    c_r_mean = float(np.mean(c_roi[:, :, 0]))
    c_g_mean = float(np.mean(c_roi[:, :, 1]))
    c_b_mean = float(np.mean(c_roi[:, :, 2]))

    c_r_std = float(np.std(c_roi[:, :, 0]))
    c_g_std = float(np.std(c_roi[:, :, 1]))
    c_b_std = float(np.std(c_roi[:, :, 2]))

    p_r_mean = float(np.mean(periph_rgb[:, 0]))
    p_g_mean = float(np.mean(periph_rgb[:, 1]))
    p_b_mean = float(np.mean(periph_rgb[:, 2]))

    delta_r = c_r_mean - p_r_mean
    delta_g = c_g_mean - p_g_mean
    delta_b = c_b_mean - p_b_mean

    # 2. Grayscale & Darkness
    c_gray_mean = float(np.mean(c_gray))
    p_gray_mean = float(np.mean(periph_gray))
    delta_darkness = p_gray_mean - c_gray_mean

    # 3. Erythema / Vascular indices
    c_erythema = float(2.0 * c_r_mean - c_g_mean - c_b_mean)
    p_erythema = float(2.0 * p_r_mean - p_g_mean - p_b_mean)
    delta_erythema = c_erythema - p_erythema
    diffuse_erythema = float(np.mean(2.0 * r - g - b) / 255.0)

    # 4. Honey / Crust yellow index
    c_yellow = float(c_r_mean + c_g_mean - 2.0 * c_b_mean)
    p_yellow = float(p_r_mean + p_g_mean - 2.0 * p_b_mean)
    delta_yellow = c_yellow - p_yellow

    # 5. Purple / Violaceous index
    c_purple = float(c_r_mean + c_b_mean - 2.0 * c_g_mean)
    p_purple = float(p_r_mean + p_b_mean - 2.0 * p_g_mean)
    delta_purple = c_purple - p_purple

    # 6. HSV Features
    hsv = rgb_to_hsv_np(rgb / 255.0)
    c_hsv = hsv[56:168, 56:168]
    p_hsv = np.concatenate([
        hsv[:30].reshape(-1, 3),
        hsv[194:].reshape(-1, 3),
        hsv[30:194, :30].reshape(-1, 3),
        hsv[30:194, 194:].reshape(-1, 3)
    ], axis=0)

    c_hue_mean = float(np.mean(c_hsv[:, :, 0]))
    c_sat_mean = float(np.mean(c_hsv[:, :, 1]))
    c_val_mean = float(np.mean(c_hsv[:, :, 2]))

    c_sat_std = float(np.std(c_hsv[:, :, 1]))
    c_val_std = float(np.std(c_hsv[:, :, 2]))

    p_sat_mean = float(np.mean(p_hsv[:, 1]))
    p_val_mean = float(np.mean(p_hsv[:, 2]))

    delta_sat = c_sat_mean - p_sat_mean
    delta_val = c_val_mean - p_val_mean

    # 7. Texture & Gradients
    gy, gx = np.gradient(gray)
    grad_mag = np.sqrt(gx**2 + gy**2)

    c_grad = grad_mag[56:168, 56:168]
    p_grad = np.concatenate([
        grad_mag[:30].ravel(),
        grad_mag[194:].ravel(),
        grad_mag[30:194, :30].ravel(),
        grad_mag[30:194, 194:].ravel()
    ])

    c_grad_mean = float(np.mean(c_grad))
    c_grad_std = float(np.std(c_grad))
    p_grad_mean = float(np.mean(p_grad))
    p_grad_std = float(np.std(p_grad))
    grad_ratio = c_grad_std / max(p_grad_std, 1e-4)

    # 8. Asymmetry (ABCD criteria)
    asym_horizontal = float(np.mean(np.abs(gray[:112, :] - np.flipud(gray[112:, :]))) / 255.0)
    asym_vertical = float(np.mean(np.abs(gray[:, :112] - np.fliplr(gray[:, 112:]))) / 255.0)

    # Quadrant variance
    q1 = np.mean(gray[:112, :112])
    q2 = np.mean(gray[:112, 112:])
    q3 = np.mean(gray[112:, :112])
    q4 = np.mean(gray[112:, 112:])
    quadrant_variance = float(np.std([q1, q2, q3, q4]))

    # Border contrast (inner transition zone 45-65 vs 155-175)
    border_zone = np.concatenate([
        gray[45:65, 45:175].ravel(),
        gray[155:175, 45:175].ravel(),
        gray[65:155, 45:65].ravel(),
        gray[65:155, 155:175].ravel()
    ])
    border_contrast = float(np.std(border_zone))

    features = np.array([
        c_r_mean, c_g_mean, c_b_mean,
        c_r_std, c_g_std, c_b_std,
        p_r_mean, p_g_mean, p_b_mean,
        delta_r, delta_g, delta_b,
        c_gray_mean, p_gray_mean, delta_darkness,
        c_erythema, p_erythema, delta_erythema, diffuse_erythema,
        c_yellow, p_yellow, delta_yellow,
        c_purple, p_purple, delta_purple,
        c_hue_mean, c_sat_mean, c_val_mean,
        c_sat_std, c_val_std, delta_sat, delta_val,
        c_grad_mean, c_grad_std, p_grad_mean, p_grad_std, grad_ratio,
        asym_horizontal, asym_vertical, quadrant_variance, border_contrast
    ], dtype=np.float32)

    return features
