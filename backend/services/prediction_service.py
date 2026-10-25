import os
import json
import numpy as np
from PIL import Image
from config import Config

class PredictionService:
    def __init__(self):
        self.model = None
        self.class_names = []
        self.input_shape = (224, 224, 3)
        self.is_real_model = False
        self.initialization_message = ""
        self._load_class_names()
        self._load_model()

    def _load_class_names(self):
        """Loads class labels from class_names.json."""
        if os.path.exists(Config.CLASS_NAMES_PATH):
            try:
                with open(Config.CLASS_NAMES_PATH, 'r') as f:
                    self.class_names = json.load(f)
                print(f"[PredictionService] Loaded {len(self.class_names)} classes: {self.class_names}")
            except Exception as e:
                print(f"[PredictionService] Error loading class_names.json: {e}")
                self._fallback_classes()
        else:
            self._fallback_classes()

    def _fallback_classes(self):
        self.class_names = [
            "Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Actinic Keratosis",
            "Nevus", "Benign Keratosis", "Dermatofibroma", "Vascular Lesion",
            "Eczema", "Psoriasis", "Acne", "Rosacea",
            "Vitiligo", "Tinea (Ringworm)", "Urticaria (Hives)", "Shingles (Herpes Zoster)",
            "Impetigo", "Alopecia Areata"
        ]

    def _load_model(self):
        """Attempts to load Keras trained model if available."""
        if os.path.exists(Config.MODEL_PATH):
            try:
                import tensorflow as tf
                self.model = tf.keras.models.load_model(Config.MODEL_PATH)
                if hasattr(self.model, 'input_shape') and self.model.input_shape:
                    shape = self.model.input_shape
                    if len(shape) == 4 and shape[1] and shape[2]:
                        self.input_shape = (shape[1], shape[2], shape[3] if shape[3] else 3)
                
                self.is_real_model = True
                self.initialization_message = f"Trained Keras model loaded from {Config.MODEL_PATH}. Input dimensions: {self.input_shape}"
                print(f"[PredictionService] {self.initialization_message}")
            except Exception as e:
                self.is_real_model = False
                self.initialization_message = f"Found model file but failed to initialize TensorFlow model: {str(e)}. Operating in Demonstration Mode."
                print(f"[PredictionService] Warning: {self.initialization_message}")
        else:
            self.is_real_model = False
            self.initialization_message = "No trained model file found at backend/models/skin_disease_model.keras. Running in verified Demonstration Screening Mode."
            print(f"[PredictionService] Note: {self.initialization_message}")

    def get_severity_for_class(self, class_name):
        severity_map = {
            "Melanoma": "Concerning / High Risk",
            "Basal Cell Carcinoma": "Concerning / Moderate Risk",
            "Squamous Cell Carcinoma": "Concerning / High Risk",
            "Actinic Keratosis": "Concerning / Precancerous",
            "Nevus": "Benign / Low Risk",
            "Benign Keratosis": "Benign / Low Risk",
            "Dermatofibroma": "Benign / Low Risk",
            "Vascular Lesion": "Benign / Low Risk",
            "Eczema": "Manageable / Chronic",
            "Psoriasis": "Manageable / Chronic",
            "Acne": "Benign / Treatable",
            "Rosacea": "Manageable / Chronic",
            "Vitiligo": "Manageable / Chronic",
            "Tinea (Ringworm)": "Infectious / Treatable",
            "Urticaria (Hives)": "Manageable / Acute or Chronic",
            "Shingles (Herpes Zoster)": "Concerning / Acute Viral",
            "Impetigo": "Infectious / Treatable",
            "Alopecia Areata": "Manageable / Chronic"
        }
        return severity_map.get(class_name, "Evaluation Recommended")

    def predict(self, image_path, quality_assessment=None):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        try:
            image = Image.open(image_path).convert('RGB')
        except Exception as e:
            raise ValueError(f"Unable to read image for prediction: {str(e)}")

        if self.is_real_model and self.model is not None:
            return self._predict_with_real_model(image)
        else:
            return self._predict_with_demonstration_engine(image, quality_assessment)

    def _predict_with_real_model(self, image: Image.Image):
        target_w, target_h = self.input_shape[0], self.input_shape[1]
        resized = image.resize((target_w, target_h))
        
        img_array = np.array(resized, dtype=np.float32) / 255.0
        input_tensor = np.expand_dims(img_array, axis=0)

        raw_predictions = self.model.predict(input_tensor, verbose=0)
        scores = raw_predictions[0]
        if np.sum(scores) > 1.05 or np.sum(scores) < 0.95 or (scores < 0).any():
            exp_scores = np.exp(scores - np.max(scores))
            probs = exp_scores / np.sum(exp_scores)
        else:
            probs = scores

        class_probs = {}
        for idx, name in enumerate(self.class_names):
            if idx < len(probs):
                class_probs[name] = round(float(probs[idx]) * 100, 1)
            else:
                class_probs[name] = 0.0

        top_idx = int(np.argmax(probs))
        predicted_class = self.class_names[top_idx] if top_idx < len(self.class_names) else "Unknown"
        confidence = float(probs[top_idx]) * 100

        return {
            'predicted_class': predicted_class,
            'confidence': round(confidence, 1),
            'probabilities': class_probs,
            'severity_level': self.get_severity_for_class(predicted_class),
            'is_demo': False,
            'model_version': 'Keras-DeepLearning-v1.0',
            'explanation': f"Classified by deep neural network with {round(confidence, 1)}% model confidence."
        }

    def _predict_with_demonstration_engine(self, image: Image.Image, quality_assessment=None):
        """
        Dermatological Heuristic Demonstration Engine across 18 conditions:
        Extracts reproducible, explainable morphological features:
        - Darkness/Melanin Density
        - Erythema / Redness ratio (2*R - G - B)
        - Vascular Purple Hue
        - Asymmetry between opposing quadrants (ABCDE 'A')
        - Edge gradient rough texture (ABCDE 'B')
        - Annular central clearing (for Tinea)
        - Honey/Yellow crust hue (R + G high, B low for Impetigo)
        - Depigmentation / Chalky lightness (for Vitiligo)
        - Vesicular clustered sharpness (for Shingles)
        - Wheal edematous smooth pallor (for Urticaria)
        """
        resized = image.resize((200, 200))
        rgb_arr = np.array(resized, dtype=np.float32)

        r = rgb_arr[:, :, 0]
        g = rgb_arr[:, :, 1]
        b = rgb_arr[:, :, 2]

        grayscale = 0.299 * r + 0.587 * g + 0.114 * b
        mean_brightness = float(np.mean(grayscale))
        darkness_index = float(255.0 - mean_brightness)

        # Erythema (diffuse redness)
        redness_map = (2.0 * r - g - b)
        mean_redness = float(np.mean(redness_map))

        # Golden / Honey crust saturation (R + G high, B low)
        honey_crust_index = float(np.mean((r + g) - 1.8 * b))

        # Vascular saturation (red + blue dominance)
        vascular_index = float(np.mean((r + b) - 2.0 * g))

        # Asymmetry score
        q1 = grayscale[:100, :100]
        q4 = grayscale[100:, 100:]
        asymmetry_score = float(np.mean(np.abs(q1 - np.flip(q4))))

        # Border gradient & edge energy
        gy, gx = np.gradient(grayscale)
        gradient_energy = float(np.mean(gx**2 + gy**2))

        # Annular ring difference (center vs outer)
        center_patch = grayscale[70:130, 70:130]
        ring_periphery = np.concatenate([grayscale[:40, :], grayscale[160:, :]])
        ring_diff = float(np.mean(center_patch) - np.mean(ring_periphery))

        # Depigmentation
        color_saturation = float(np.mean(np.max(rgb_arr, axis=2) - np.min(rgb_arr, axis=2)))
        depigmentation_score = max(0.0, (mean_brightness - 180.0)) + max(0.0, (30.0 - color_saturation))

        w = {}
        # 1. Melanoma
        w["Melanoma"] = max(5.0, (darkness_index * 0.42) + (asymmetry_score * 0.85) + (gradient_energy * 0.05))
        # 2. Basal Cell Carcinoma
        w["Basal Cell Carcinoma"] = max(5.0, (gradient_energy * 0.09) + (vascular_index * 0.35) + 12.0)
        # 3. Squamous Cell Carcinoma
        w["Squamous Cell Carcinoma"] = max(5.0, (gradient_energy * 0.12) + (mean_redness * 0.4) + 10.0)
        # 4. Actinic Keratosis
        w["Actinic Keratosis"] = max(5.0, (gradient_energy * 0.1) + (mean_redness * 0.3) + 9.0)
        # 5. Nevus
        w["Nevus"] = max(8.0, (darkness_index * 0.58) - (asymmetry_score * 0.4) + 18.0)
        # 6. Benign Keratosis
        w["Benign Keratosis"] = max(5.0, (gradient_energy * 0.08) + (darkness_index * 0.35) + 10.0)
        # 7. Dermatofibroma
        w["Dermatofibroma"] = max(6.0, (darkness_index * 0.38) + 14.0)
        # 8. Vascular Lesion
        w["Vascular Lesion"] = max(5.0, (vascular_index * 0.75) + 16.0)
        # 9. Eczema
        w["Eczema"] = max(8.0, (mean_redness * 0.7) + (255.0 - darkness_index) * 0.15)
        # 10. Psoriasis
        w["Psoriasis"] = max(6.0, (gradient_energy * 0.11) + (mean_redness * 0.4))
        # 11. Acne
        w["Acne"] = max(8.0, (mean_redness * 0.85) - (darkness_index * 0.25) + 14.0)
        # 12. Rosacea
        w["Rosacea"] = max(6.0, (mean_redness * 0.8) + (vascular_index * 0.3) + 10.0)
        # 13. Vitiligo
        w["Vitiligo"] = max(4.0, (depigmentation_score * 0.85) + 8.0)
        # 14. Tinea (Ringworm)
        w["Tinea (Ringworm)"] = max(5.0, (abs(ring_diff) * 0.5) + (gradient_energy * 0.06) + 10.0)
        # 15. Urticaria (Hives)
        w["Urticaria (Hives)"] = max(5.0, (mean_redness * 0.6) + (mean_brightness * 0.08) + 8.0)
        # 16. Shingles (Herpes Zoster)
        w["Shingles (Herpes Zoster)"] = max(5.0, (gradient_energy * 0.09) + (mean_redness * 0.45) + 8.0)
        # 17. Impetigo
        w["Impetigo"] = max(5.0, (honey_crust_index * 0.65) + (mean_redness * 0.3) + 10.0)
        # 18. Alopecia Areata
        w["Alopecia Areata"] = max(4.0, (depigmentation_score * 0.4) + (255.0 - darkness_index) * 0.1 + 8.0)

        raw_weights = [w.get(name, 5.0) for name in self.class_names]

        # Softmax normalization
        exp_w = np.exp(np.array(raw_weights) / 20.0)
        probs = exp_w / np.sum(exp_w)

        probabilities = {}
        for idx, name in enumerate(self.class_names):
            if idx < len(probs):
                probabilities[name] = round(float(probs[idx]) * 100, 1)
            else:
                probabilities[name] = 0.0

        top_idx = int(np.argmax(probs))
        predicted_class = self.class_names[top_idx]
        confidence = float(probs[top_idx]) * 100

        return {
            'predicted_class': predicted_class,
            'confidence': round(confidence, 1),
            'probabilities': probabilities,
            'severity_level': self.get_severity_for_class(predicted_class),
            'is_demo': True,
            'model_version': 'Demonstration-Heuristic-v3.0 (18 Dermatological Conditions)',
            'explanation': (
                f"Demonstration Screening Result: Feature extraction estimated highest correlation with {predicted_class} "
                f"({round(confidence, 1)}% score). To evaluate with real deep-learning weights, place "
                "skin_disease_model.keras into backend/models/."
            )
        }

# Global singleton
prediction_service = PredictionService()
