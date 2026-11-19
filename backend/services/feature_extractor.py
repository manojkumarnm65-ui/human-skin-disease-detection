import numpy as np
from PIL import Image

FEATURE_NAMES = [
    # 1-6. Central RGB Moments
    'c_r_mean', 'c_g_mean', 'c_b_mean',
    'c_r_std', 'c_g_std', 'c_b_std',
    # 7-9. Periphery RGB Means
    'p_r_mean', 'p_g_mean', 'p_b_mean',
    # 10-12. Delta RGB
    'delta_r', 'delta_g', 'delta_b',
    # 13-15. Grayscale & Darkness
    'c_gray_mean', 'p_gray_mean', 'delta_darkness',
    # 16-19. Erythema / Vascular Indices
    'c_erythema', 'p_erythema', 'delta_erythema', 'diffuse_erythema',
    # 20-22. Yellow / Honey Crust Indices
    'c_yellow', 'p_yellow', 'delta_yellow',
    # 23-25. Purple / Violaceous Indices
    'c_purple', 'p_purple', 'delta_purple',
    # 26-32. HSV Features
    'c_hue_mean', 'c_sat_mean', 'c_val_mean',
    'c_sat_std', 'c_val_std', 'delta_sat', 'delta_val',
    # 33-37. Texture & Gradients
    'c_grad_mean', 'c_grad_std', 'p_grad_mean', 'p_grad_std', 'grad_ratio',
    # 38-41. ABCD Asymmetry & Border
    'asym_horizontal', 'asym_vertical', 'quadrant_variance', 'border_contrast',
    # 42-47. CIE-Lab Perceptual Color Space (Center)
    'c_lab_L_mean', 'c_lab_a_mean', 'c_lab_b_mean',
    'c_lab_L_std', 'c_lab_a_std', 'c_lab_b_std',
    # 48-50. CIE-Lab Periphery Means
    'p_lab_L_mean', 'p_lab_a_mean', 'p_lab_b_mean',
    # 51-53. CIE-Lab Lesion Contrast Deltas
    'delta_lab_L', 'delta_lab_a', 'delta_lab_b',
    # 54. Dermatological Individual Typology Angle (ITA)
    'ita_angle',
    # 55-58. Clinical Pigment & Dermoscopy Indices
    'melanin_index', 'erythema_index', 'blue_gray_veil', 'color_variegation',
    # 59-62. Higher-Order Microtexture & Diagonal ABCD Metrics
    'laplacian_var', 'quadrant_asym_diag1', 'quadrant_asym_diag2', 'lesion_extent_ratio'
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

def rgb_to_lab_np(rgb_norm):
    """
    Vectorized, pure-NumPy sRGB to CIE-Lab D65 conversion.
    rgb_norm: float array with values in [0, 1].
    Returns: float array with channels [L, a, b].
    """
    mask = rgb_norm > 0.04045
    srgb = np.where(mask, ((rgb_norm + 0.055) / 1.055) ** 2.4, rgb_norm / 12.92)
    # sRGB to XYZ (D65 illuminant)
    x = srgb[..., 0] * 0.4124564 + srgb[..., 1] * 0.3575761 + srgb[..., 2] * 0.1804375
    y = srgb[..., 0] * 0.2126729 + srgb[..., 1] * 0.7151522 + srgb[..., 2] * 0.0721750
    z = srgb[..., 0] * 0.0193339 + srgb[..., 1] * 0.1191920 + srgb[..., 2] * 0.9503041

    # D65 white point reference
    xn, yn, zn = 0.95047, 1.00000, 1.08883
    xr, yr, zr = x / xn, y / yn, z / zn
    eps = 0.008856
    kappa = 903.3
    fx = np.where(xr > eps, np.cbrt(xr), (kappa * xr + 16.0) / 116.0)
    fy = np.where(yr > eps, np.cbrt(yr), (kappa * yr + 16.0) / 116.0)
    fz = np.where(zr > eps, np.cbrt(zr), (kappa * zr + 16.0) / 116.0)

    L = 116.0 * fy - 16.0
    a = 500.0 * (fx - fy)
    b = 200.0 * (fy - fz)
    return np.stack([L, a, b], axis=-1)

def check_skin_lesion_plausibility(image: Image.Image):
    """
    Validates cutaneous lesion plausibility to avoid diagnosing blank,
    solid-colored, pure-noise, or non-human-skin images.
    Returns: (is_valid: bool, reason: str, metadata: dict)
    """
    if image.mode != 'RGB':
        image = image.convert('RGB')
    resized = image.resize((128, 128))
    rgb = np.array(resized, dtype=np.float32)
    gray = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]

    gray_std = float(np.std(gray))
    mean_b = float(np.mean(gray))

    # 1. Blank or uniform solid color check
    if gray_std < 5.0:
        return False, "The image appears solid or blank with no detectable cutaneous structure.", {
            'skin_fraction': 0.0, 'brightness': mean_b, 'contrast': gray_std
        }
    if mean_b < 12.0:
        return False, "The image is completely pitch black or severely underexposed.", {
            'skin_fraction': 0.0, 'brightness': mean_b, 'contrast': gray_std
        }
    if mean_b > 248.0:
        return False, "The image is pure white or completely washed out with no visible skin tissue.", {
            'skin_fraction': 0.0, 'brightness': mean_b, 'contrast': gray_std
        }

    # 2. Skin chromaticity check across Fitzpatrick phototypes I to VI
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    # Human skin reflectance requires R > G and R > B or high melanin absorbance
    skin_mask = (r > g) & (g >= b * 0.70) & (r > 35) & (gray > 20) & (gray < 242)
    skin_fraction = float(np.mean(skin_mask))

    # In dark melanoma or necrosis, central lesion might be dark brown/black,
    # but surrounding border skin will match skin_mask. If less than 7% matches skin and variance is abnormal:
    if skin_fraction < 0.07 and gray_std < 18.0:
        return False, f"The photograph does not exhibit human skin tissue (skin gamut match: {skin_fraction*100:.1f}%).", {
            'skin_fraction': round(skin_fraction * 100, 1), 'brightness': mean_b, 'contrast': gray_std
        }

    return True, "Valid cutaneous skin lesion detected.", {
        'skin_fraction': round(skin_fraction * 100, 1),
        'brightness': round(mean_b, 1),
        'contrast': round(gray_std, 1)
    }

def extract_features_from_image(image: Image.Image) -> np.ndarray:
    """
    Extracts a normalized, comprehensive feature vector of 62 clinical and morphological
    features from a skin lesion image:
    - Central ROI vs baseline periphery RGB/Gray deltas
    - CIE-Lab perceptual color moments and Individual Typology Angle (ITA)
    - Melanin, erythema, honey crust, and violaceous color indices
    - Dermoscopic blue-gray veil and color variegation metrics
    - Directional gradient textures, Laplacian microtexture energy, and ABCD asymmetry metrics
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

    # 9. CIE-Lab Perceptual Color Spaces (Moments & Deltas)
    lab = rgb_to_lab_np(rgb / 255.0)
    c_lab = lab[56:168, 56:168]
    p_lab = np.concatenate([
        lab[:30].reshape(-1, 3),
        lab[194:].reshape(-1, 3),
        lab[30:194, :30].reshape(-1, 3),
        lab[30:194, 194:].reshape(-1, 3)
    ], axis=0)

    c_lab_L_mean = float(np.mean(c_lab[:, :, 0]))
    c_lab_a_mean = float(np.mean(c_lab[:, :, 1]))
    c_lab_b_mean = float(np.mean(c_lab[:, :, 2]))

    c_lab_L_std = float(np.std(c_lab[:, :, 0]))
    c_lab_a_std = float(np.std(c_lab[:, :, 1]))
    c_lab_b_std = float(np.std(c_lab[:, :, 2]))

    p_lab_L_mean = float(np.mean(p_lab[:, 0]))
    p_lab_a_mean = float(np.mean(p_lab[:, 1]))
    p_lab_b_mean = float(np.mean(p_lab[:, 2]))

    delta_lab_L = p_lab_L_mean - c_lab_L_mean
    delta_lab_a = c_lab_a_mean - p_lab_a_mean
    delta_lab_b = c_lab_b_mean - p_lab_b_mean

    # 10. Individual Typology Angle (ITA)
    ita_angle = float(np.arctan2(p_lab_L_mean - 50.0, max(abs(p_lab_b_mean), 1.0)) * 180.0 / np.pi)

    # 11. Clinical Pigment & Dermoscopy Indices
    melanin_index = float(100.0 * np.log10(256.0 / max(c_r_mean + 1.0, 1.0)))
    erythema_index = float(100.0 * (np.log10(256.0 / max(c_g_mean + 1.0, 1.0)) - np.log10(256.0 / max(c_r_mean + 1.0, 1.0))))
    blue_gray_veil = float((c_b_mean - c_r_mean) / max(c_r_mean + c_g_mean + c_b_mean, 1.0))
    color_variegation = float(c_r_std + c_g_std + c_b_std)

    # 12. Microtexture & Higher-Order ABCD Metrics
    # Laplacian variance
    laplacian_kernel = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=np.float32)
    # Fast 3x3 2D slice approximation for laplacian variance
    center_slice = gray[1:223, 1:223]
    lap_approx = (
        gray[0:222, 1:223] + gray[2:224, 1:223] +
        gray[1:223, 0:222] + gray[1:223, 2:224] - 4.0 * center_slice
    )
    laplacian_var = float(np.var(lap_approx))

    # Diagonal asymmetry
    quadrant_asym_diag1 = float(abs(q1 - q4) / 255.0)
    quadrant_asym_diag2 = float(abs(q2 - q3) / 255.0)

    # Lesion extent ratio (fraction of central pixels notably darker than surrounding baseline skin)
    lesion_pixels = np.sum(p_gray_mean - c_gray > 12.0)
    lesion_extent_ratio = float(lesion_pixels / (112.0 * 112.0))

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
        asym_horizontal, asym_vertical, quadrant_variance, border_contrast,
        c_lab_L_mean, c_lab_a_mean, c_lab_b_mean,
        c_lab_L_std, c_lab_a_std, c_lab_b_std,
        p_lab_L_mean, p_lab_a_mean, p_lab_b_mean,
        delta_lab_L, delta_lab_a, delta_lab_b,
        ita_angle,
        melanin_index, erythema_index, blue_gray_veil, color_variegation,
        laplacian_var, quadrant_asym_diag1, quadrant_asym_diag2, lesion_extent_ratio
    ], dtype=np.float32)

    return features
