import json
from extensions import db
from .user import User
from .prediction import Prediction
from .disease import DiseaseInformation

def seed_initial_diseases():
    """Seeds the educational disease library with 18 comprehensive dermatological conditions."""
    diseases = [
        {
            "name": "Melanoma",
            "slug": "melanoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / High Risk",
            "description": "Melanoma is the most serious form of skin cancer, arising from melanocytes (pigment-producing cells). While it accounts for only ~1% of all skin cancers, it causes the vast majority of skin cancer deaths due to its aggressive capacity to metastasize if not detected in localized stages.",
            "symptoms_json": json.dumps([
                "Asymmetry: The two halves of the lesion do not match in outline or shape",
                "Border: Uneven, scalloped, notched, or poorly circumscribed margins",
                "Color: Non-uniform variegation including shades of tan, dark brown, black, white, blue, or red",
                "Diameter: Frequently exceeds 6 mm, though early lesions can present smaller",
                "Evolving: Any change in size, elevation, texture, or onset of itching or ulceration"
            ]),
            "risk_factors_json": json.dumps([
                "Cumulative and intense episodic ultraviolet (UV) radiation exposure",
                "History of blistering sunburns, particularly during childhood or adolescence",
                "Fair skin (Fitzpatrick types I and II), red or blond hair, light eye color",
                "High total mole count (>50) or clinically atypical (dysplastic) nevi",
                "First-degree family history of melanoma (CDKN2A/p16 mutations)",
                "Immunosuppression following organ transplantation or lymphoma"
            ]),
            "care_guidance_json": json.dumps([
                "Apply broad-spectrum sunscreen (SPF 30+) daily, reapplying every 2 hours",
                "Wear UV-protective clothing, broad-brimmed hats, and UV400 sunglasses",
                "Perform monthly total cutaneous self-examinations with full-length and handheld mirrors",
                "Avoid tanning beds and artificial UV sources completely"
            ]),
            "when_to_see_doctor": "Consult a board-certified dermatologist immediately upon noticing any mole with ABCDE warning features, a newly emergent pigmented macule in adulthood, or an 'ugly duckling' spot distinctly different from other lesions on your body.",
            "medical_references_json": json.dumps([
                "World Health Organization (WHO) - Global Skin Cancer Guidelines",
                "American Academy of Dermatology (AAD) - Melanoma Clinical Practice Guidelines",
                "National Cancer Institute (NCI) - SEER Cancer Stat Facts: Cutaneous Melanoma",
                "American Cancer Society (ACS) - Early Detection & Staging of Melanoma"
            ])
        },
        {
            "name": "Basal Cell Carcinoma",
            "slug": "basal-cell-carcinoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / Moderate Risk",
            "description": "Basal Cell Carcinoma (BCC) is the most prevalent malignancy worldwide, originating in the basal layer of the epidermis. BCC rarely metastasizes to distant organs, but if neglected it can invade deeply into cartilage, muscle, and bone, causing extensive local tissue destruction.",
            "symptoms_json": json.dumps([
                "Pearly, translucent, or waxy papule or nodule, often on sun-exposed facial areas",
                "Visible tiny branching blood vessels (telangiectasias) across the lesion surface",
                "Central depression or ulceration with rolled, raised borders ('rodent ulcer')",
                "Non-healing sore that repeatedly bleeds, oozes, crusts over, and re-ulcerates",
                "Flat, firm, scar-like whitish or yellowish area with ill-defined borders (morpheaform BCC)"
            ]),
            "risk_factors_json": json.dumps([
                "Extensive chronic ultraviolet light exposure (sunlight, tanning lamps)",
                "Advancing age (>50 years) and fair skin that burns easily",
                "Previous history of basal cell or squamous cell skin cancers",
                "Exposure to arsenic, ionizing radiation, or immunosuppressive therapy",
                "Genetic syndromes such as Gorlin-Goltz syndrome (PTCH1 mutations)"
            ]),
            "care_guidance_json": json.dumps([
                "Seek strict UV protection for face, neck, ears, scalp, and arms",
                "Wear wide-brimmed hats and wrap-around UV protective eyewear",
                "Schedule annual whole-body dermatological screening",
                "Do not attempt home remedies or topical acid burns on suspicious nodules"
            ]),
            "when_to_see_doctor": "Arrange an urgent dermatological biopsy if you have a spot, bump, or non-healing sore that bleeds readily, does not resolve after 3 weeks, or presents a pearly rolled edge.",
            "medical_references_json": json.dumps([
                "Skin Cancer Foundation - Basal Cell Carcinoma Overview & Treatment Modalities",
                "American Academy of Dermatology (AAD) - Basal Cell Carcinoma Diagnosis",
                "Journal of the National Comprehensive Cancer Network (NCCN) - BCC Guidelines"
            ])
        },
        {
            "name": "Squamous Cell Carcinoma",
            "slug": "squamous-cell-carcinoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / High Risk",
            "description": "Squamous Cell Carcinoma (SCC) is the second most common form of skin cancer, arising from malignant proliferation of keratinocytes in the stratum spinosum. Unlike BCC, SCC has a notable risk of regional lymph node metastasis if deep infiltration occurs.",
            "symptoms_json": json.dumps([
                "Thick, rough, scaly erythematous patch with irregular borders",
                "Elevated, firm dome-shaped growth or nodule with a central crusted depression",
                "Open non-healing sore that bleeds readily or oozes for weeks",
                "Warty cutaneous horn protruding from an indurated, tender base",
                "Tender, persistent ulcer on lower lip or ears in individuals with heavy sun exposure"
            ]),
            "risk_factors_json": json.dumps([
                "Cumulative chronic lifetime ultraviolet light exposure (outdoor workers)",
                "Pre-existing untreated actinic keratoses",
                "Organ transplant immunosuppressive medication (calcineurin inhibitors)",
                "Chronic non-healing burns, radiation scars, or cutaneous ulcers",
                "Human Papillomavirus (HPV) infection in genital or periungual regions"
            ]),
            "care_guidance_json": json.dumps([
                "Apply broad-spectrum water-resistant sunscreen with SPF 50 daily",
                "Inspect ears, scalp, lower lip, and backs of hands monthly",
                "Early surgical excision or Mohs micrographic surgery offers >95% cure rates"
            ]),
            "when_to_see_doctor": "Seek clinical evaluation promptly for any rapidly expanding, tender, firm nodule, or chronic scaly ulcer that does not heal.",
            "medical_references_json": json.dumps([
                "American Cancer Society - Squamous Cell Skin Cancer Guidelines",
                "American Academy of Dermatology - Cutaneous Squamous Cell Carcinoma",
                "National Comprehensive Cancer Network (NCCN) - Guidelines for SCC"
            ])
        },
        {
            "name": "Actinic Keratosis",
            "slug": "actinic-keratosis",
            "category": "Premalignant Cutaneous Dysplasia",
            "severity": "Concerning / Precancerous",
            "description": "Actinic Keratosis (solar keratosis) is a common UV-induced premalignant intraepidermal lesion composed of atypical keratinocytes. It represents a biological stepping stone along the continuum toward invasive squamous cell carcinoma.",
            "symptoms_json": json.dumps([
                "Rough, dry, sandpaper-like texture often felt before visibly observed",
                "Flat or slightly raised erythematous, tan, or flesh-colored macule or plaque",
                "Adherent gritty white or yellow hyperkeratotic scale",
                "Occasional burning, stinging, or tenderness when touched",
                "Predilection for face, bald scalp, forearms, ears, and backs of hands"
            ]),
            "risk_factors_json": json.dumps([
                "Excessive cumulative UV exposure over decades",
                "Fitzpatrick skin types I and II with blonde/red hair and blue eyes",
                "Age >40 years and geographic residence in high-UV regions",
                "Systemic immunosuppression"
            ]),
            "care_guidance_json": json.dumps([
                "Daily use of broad-spectrum SPF 30+ sun protection slows progression",
                "Dermatologists treat lesions via cryotherapy, 5-fluorouracil, or photodynamic therapy",
                "Regular annual skin checks to detect early dysplastic changes"
            ]),
            "when_to_see_doctor": "Consult a dermatologist if a sandpaper-like rough spot becomes thick, indurated, bleeds, or remains tender for multiple weeks.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology - Actinic Keratosis Diagnosis and Care",
                "Skin Cancer Foundation - Actinic Keratosis Overview",
                "Mayo Clinic - Solar Keratosis Guidance"
            ])
        },
        {
            "name": "Melanocytic Nevus",
            "slug": "nevus",
            "category": "Benign Melanocytic Neoplasm",
            "severity": "Benign / Low Risk",
            "description": "A common melanocytic nevus (mole) is a benign, localized proliferation of neural crest-derived melanocytes. Common moles have symmetric contours, distinct margins, and uniform coloration ranging from light tan to dark brown.",
            "symptoms_json": json.dumps([
                "Bilateral symmetry across both axes",
                "Well-defined, regular, smooth perimeter",
                "Homogeneous pigmentation (single shade of brown, tan, or flesh color)",
                "Flat macule or smooth elevated dome (intradermal nevus)",
                "Usually under 6 millimeters in diameter and stable over years"
            ]),
            "risk_factors_json": json.dumps([
                "Genetic predisposition and family history of multiple nevi",
                "Sun exposure during infancy and childhood",
                "Hormonal surges during pregnancy or adolescence"
            ]),
            "care_guidance_json": json.dumps([
                "Monitor moles periodically using the ABCDE self-check protocol",
                "Apply daily sun protection to prevent melanocytic dysplasia",
                "Avoid picking, scratching, or shaving over raised moles"
            ]),
            "when_to_see_doctor": "Schedule an examination if any mole undergoes sudden change in color, asymmetric enlargement, onset of bleeding, or spontaneous itching.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - What is a Mole?",
                "Mayo Clinic - Moles (Nevi) Diagnosis and Clinical Management",
                "DermNet NZ - Melanocytic Nevi Guide"
            ])
        },
        {
            "name": "Benign Keratosis",
            "slug": "benign-keratosis",
            "category": "Benign Epidermal Proliferation",
            "severity": "Benign / Low Risk",
            "description": "Benign keratoses (primarily Seborrheic Keratoses and Solar Lentigines) are non-cancerous, hyperkeratotic skin growths common in older adults. They often present with a characteristic 'stuck-on' waxy or warty appearance and do not possess malignant transformation potential.",
            "symptoms_json": json.dumps([
                "Well-circumscribed warty, verrucous, or waxy surface",
                "Classic 'pasted-on' or 'stuck-on' appearance as if melted candle wax",
                "Color ranging from pale yellow to light tan, dark brown, or black",
                "Often found on chest, back, shoulders, neck, and face",
                "Surface may contain tiny keratin horn cysts visible on close inspection"
            ]),
            "risk_factors_json": json.dumps([
                "Advancing age (very common in individuals over 50)",
                "Genetic predisposition (familial seborrheic keratosis)",
                "Cumulative chronic sun exposure (for solar lentigines)"
            ]),
            "care_guidance_json": json.dumps([
                "Benign keratoses require no medical excision unless irritated by clothing",
                "Avoid scratching or picking at plaques to prevent secondary infection",
                "Dermatologists can remove symptomatic lesions using cryotherapy or curettage"
            ]),
            "when_to_see_doctor": "Consult a doctor if a pigmented keratosis darkens rapidly, bleeds spontaneously, or mimics malignant melanoma under macroscopic view.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology - Seborrheic Keratoses",
                "Mayo Clinic - Seborrheic Keratosis Clinical Overview",
                "British Association of Dermatologists - Patient Information Leaflet"
            ])
        },
        {
            "name": "Dermatofibroma",
            "slug": "dermatofibroma",
            "category": "Benign Fibrohistiocytic Nodule",
            "severity": "Benign / Low Risk",
            "description": "A dermatofibroma (benign fibrous histiocytoma) is a common harmless cutaneous nodule composed of fibroblasts, myofibroblasts, and histiocytes. They are often triggered by minor trauma such as an insect bite or folliculitis, most commonly on the lower extremities.",
            "symptoms_json": json.dumps([
                "Firm, hard button-like dermal papule or nodule (usually 3 to 10 mm)",
                "Color ranging from pinkish-brown to dark gray or hyperpigmented brown",
                "Positive 'Fitzpatrick's pinch sign' (dimples inward when pinched between thumb and forefinger)",
                "Usually completely asymptomatic, occasionally pruritic or tender when pressed"
            ]),
            "risk_factors_json": json.dumps([
                "Minor prior cutaneous trauma (mosquito bites, superficial puncture, shaving nick)",
                "More prevalent in young and middle-aged adults, with female predilection"
            ]),
            "care_guidance_json": json.dumps([
                "Dermatofibromas are completely benign and typically require no treatment",
                "Surgical excision leaves a small scar and is only indicated if repeatedly irritated by shaving"
            ]),
            "when_to_see_doctor": "Have any newly emergent hard nodule clinically evaluated to rule out dermatofibrosarcoma protuberans (DFSP) or nodular melanoma.",
            "medical_references_json": json.dumps([
                "American Osteopathic College of Dermatology (AOCD) - Dermatofibroma",
                "DermNet NZ - Dermatofibroma Diagnostic Features",
                "Mayo Clinic - Benign Cutaneous Lesions"
            ])
        },
        {
            "name": "Vascular Lesion",
            "slug": "vascular-lesion",
            "category": "Benign Vascular Proliferation",
            "severity": "Benign / Low Risk",
            "description": "Vascular skin lesions comprise benign endothelial proliferations and capillary malformations, including cherry angiomas, pyogenic granulomas, and venous lakes. Cherry angiomas appear as bright cherry-red vascular domes on the trunk and limbs.",
            "symptoms_json": json.dumps([
                "Bright red, violaceous, or purple circular macule or smooth papule",
                "Blanches temporarily under direct diascopy pressure (glass slide pressure)",
                "Typically 1 to 5 mm in diameter, with regular margins",
                "May bleed briskly if scratched, nicked, or bumped"
            ]),
            "risk_factors_json": json.dumps([
                "Age-related capillary ectasia (ubiquitous in adults >30 years)",
                "Genetic family history",
                "Pregnancy and hormonal changes (for pyogenic granulomas)"
            ]),
            "care_guidance_json": json.dumps([
                "Reassurance is paramount: cherry angiomas have zero malignant potential",
                "Can be cosmetically treated with pulsed-dye laser or electrocautery if desired",
                "Apply gentle direct pressure with a clean cloth if bleeding occurs"
            ]),
            "when_to_see_doctor": "Consult a physician if a red-purple lesion darkens to blue-black, grows exponentially over days, or bleeds uncontrollably without trauma.",
            "medical_references_json": json.dumps([
                "National Institutes of Health (NIH) - Cutaneous Vascular Anomalies",
                "DermNet NZ - Cherry Angioma Clinical Overview",
                "American Academy of Dermatology - Angioma & Vascular Spots"
            ])
        },
        {
            "name": "Eczema (Atopic Dermatitis)",
            "slug": "eczema",
            "category": "Chronic Inflammatory Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Eczema (atopic dermatitis) is a chronic, non-contagious inflammatory skin condition characterized by an impaired epidermal barrier, dry skin, intense pruritus (itching), and erythematous patches. It frequently flares in response to environmental allergens, dry air, stress, or irritants.",
            "symptoms_json": json.dumps([
                "Intense, persistent itching, especially at night",
                "Dry, cracked, or scaly patches of skin",
                "Red to brownish-gray patches, commonly on flexural areas (hands, elbows, knees, neck)",
                "Small raised bumps that may weep fluid and crust when scratched",
                "Thickened, leathery skin (lichenification) from chronic rubbing"
            ]),
            "risk_factors_json": json.dumps([
                "Family history of atopic conditions (eczema, asthma, or allergic rhinitis)",
                "Genetic mutations in the filaggrin (FLG) skin-barrier gene",
                "Exposure to harsh soaps, detergents, fragrances, or wool fabrics",
                "Dry winter climate and low humidity",
                "Emotional stress and immune dysregulation"
            ]),
            "care_guidance_json": json.dumps([
                "Moisturize skin at least twice daily with rich fragrance-free ceramide ointments or creams",
                "Take short (5-10 minute) lukewarm baths or showers rather than hot water",
                "Apply moisturizers immediately after bathing within 3 minutes to seal in hydration",
                "Use gentle, soap-free cleansers without fragrances",
                "Wear soft, breathable cotton clothing and avoid scratchy wool",
                "Use a home humidifier during dry winter months"
            ]),
            "when_to_see_doctor": "See a physician or dermatologist if skin becomes painful, shows signs of infection (yellow crusting, pus, spreading redness, fever), interferes with sleep, or does not improve with over-the-counter moisturizers.",
            "medical_references_json": json.dumps([
                "National Eczema Association (NEA) - Clinical Management Guidelines",
                "American Academy of Dermatology (AAD) - Atopic Dermatitis Overview",
                "World Health Organization (WHO) - Global Report on Atopic Eczema"
            ])
        },
        {
            "name": "Psoriasis",
            "slug": "psoriasis",
            "category": "Autoimmune Chronic Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Psoriasis is a chronic autoimmune skin disease where an overactive immune system accelerates skin cell turnover. Normally, skin cells shed over 28 to 30 days; in psoriasis, they mature in 3 to 5 days, accumulating on the skin surface into thick, erythematous plaques covered with silvery scales.",
            "symptoms_json": json.dumps([
                "Red patches of skin covered with thick, silvery-white scales (plaque psoriasis)",
                "Dry, cracked skin that may bleed or itch",
                "Itching, burning, or soreness around lesions",
                "Thickened, pitted, or ridged fingernails and toenails",
                "Swollen, stiff joints (psoriatic arthritis in some patients)"
            ]),
            "risk_factors_json": json.dumps([
                "Family history and genetic susceptibility (HLA-Cw6 allele)",
                "Physical trauma to the skin (cuts, scrapes, sunburn - Koebner phenomenon)",
                "Streptococcal or systemic bacterial infections",
                "High psychological stress and smoking",
                "Certain medications (beta-blockers, lithium, antimalarials)"
            ]),
            "care_guidance_json": json.dumps([
                "Apply prescribed topical corticosteroids, vitamin D analogues, or moisturizers",
                "Take daily soothing colloidal oatmeal baths to soften plaques",
                "Expose skin to controlled, brief natural sunlight as recommended by your physician",
                "Avoid known triggers such as tobacco smoke, alcohol, and excessive stress",
                "Keep skin well moisturized with thick ointments"
            ]),
            "when_to_see_doctor": "Consult a dermatologist for formal diagnosis and personalized treatment options, especially if plaques cover large surface areas, joint pain develops, or lesions cause significant distress.",
            "medical_references_json": json.dumps([
                "National Psoriasis Foundation (NPF) - Clinical Standards and Guidance",
                "American Academy of Dermatology (AAD) - Guidelines of Care for Psoriasis",
                "Lancet Dermatology - Pathophysiology and Treatment of Psoriasis"
            ])
        },
        {
            "name": "Acne Vulgaris",
            "slug": "acne",
            "category": "Pilosebaceous Inflammatory Disorder",
            "severity": "Benign / Treatable",
            "description": "Acne vulgaris is a common inflammatory disorder of the pilosebaceous units (hair follicles and sebaceous glands). It occurs when follicles become plugged with sebum and dead skin cells, leading to colonization by Cutibacterium acnes bacteria, inflammation, and lesion formation.",
            "symptoms_json": json.dumps([
                "Non-inflammatory comedones: whiteheads (closed) and blackheads (open)",
                "Inflammatory papules and pustules (pimples)",
                "Larger, painful nodules and cysts beneath the skin surface",
                "Erythema, tenderness, and localized swelling",
                "Risk of post-inflammatory hyperpigmentation or scarring"
            ]),
            "risk_factors_json": json.dumps([
                "Androgenic hormone surges during adolescence or menstrual cycles",
                "Excessive cutaneous sebum production",
                "Use of comedogenic skin care or cosmetic products",
                "Friction or pressure from helmets, tight collars, or phone screens",
                "High glycemic index diet or dairy consumption in sensitive individuals"
            ]),
            "care_guidance_json": json.dumps([
                "Wash face twice daily with a gentle, non-comedogenic foaming cleanser",
                "Use over-the-counter active ingredients: salicylic acid, benzoyl peroxide, or adapalene",
                "Resist the urge to pop, squeeze, or pick blemishes to prevent deep scarring and infection",
                "Choose oil-free and non-comedogenic sunscreens and moisturizers",
                "Clean phone screens, pillowcases, and makeup brushes frequently"
            ]),
            "when_to_see_doctor": "Consult a dermatologist if over-the-counter treatments fail after 8-12 weeks, or if you develop severe cystic/nodular acne which can cause permanent scarring.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Guidelines of Care for Acne Vulgaris",
                "Mayo Clinic - Acne Symptoms, Causes, and Treatments",
                "Journal of the American Medical Association (JAMA) Dermatology - Acne Insights"
            ])
        },
        {
            "name": "Rosacea",
            "slug": "rosacea",
            "category": "Chronic Facial Vascular Disorder",
            "severity": "Manageable / Chronic",
            "description": "Rosacea is a chronic inflammatory cutaneous disorder predominantly affecting the central face (cheeks, nose, chin, and forehead). It is characterized by persistent facial erythema, episodic flushing, visible telangiectasias, and inflammatory papulopustules without comedones.",
            "symptoms_json": json.dumps([
                "Persistent central facial erythema (redness across cheeks and nose)",
                "Visible spider-like broken blood vessels (telangiectasias)",
                "Swollen red bumps and inflammatory pustules mimicking acne (no blackheads)",
                "Stinging, burning, or heightened sensitivity to skin-care products",
                "Bulbous thickening of nasal tissue (rhinophyma, primarily in men)",
                "Ocular symptoms: gritty, dry, inflamed eyelids (ocular rosacea)"
            ]),
            "risk_factors_json": json.dumps([
                "Female gender, middle age (30 to 50 years), and fair northern European descent",
                "Demodex folliculorum skin mite proliferation and innate immune hyperreactivity",
                "Dietary triggers: spicy foods, cinnamaldehyde, hot beverages, and red wine",
                "Environmental triggers: sun exposure, extreme temperatures, wind, and strenuous exercise"
            ]),
            "care_guidance_json": json.dumps([
                "Apply broad-spectrum mineral sunscreen (zinc oxide / titanium dioxide) every morning",
                "Identify and maintain a daily diary to avoid personal flushing triggers",
                "Cleanse gently with lukewarm water and soap-free, non-foaming cleansers",
                "Avoid astringents, alcohol-based toners, chemical scrubs, and menthol"
            ]),
            "when_to_see_doctor": "Consult a dermatologist for topical therapies (ivermectin, metronidazole, azelaic acid) or vascular laser treatment if redness persists or eyes feel gritty.",
            "medical_references_json": json.dumps([
                "National Rosacea Society (NRS) - Clinical Staging and Management",
                "American Academy of Dermatology (AAD) - Rosacea Clinical Overview",
                "British Journal of Dermatology - Rosacea Diagnostic Criteria"
            ])
        },
        {
            "name": "Vitiligo",
            "slug": "vitiligo",
            "category": "Autoimmune Pigmentary Disorder",
            "severity": "Manageable / Chronic",
            "description": "Vitiligo is a chronic autoimmune condition in which the immune system targets and destroys functional epidermal melanocytes. This results in well-demarcated, milky-white depigmented macules and patches across various cutaneous and mucosal distributions.",
            "symptoms_json": json.dumps([
                "Patchy loss of skin pigment appearing as chalky or milky-white macules",
                "Symmetric bilateral involvement (generalized vitiligo: hands, face, body folds)",
                "Premature whitening or graying of scalp hair, eyelashes, eyebrows, or beard (leukotrichia)",
                "Depigmentation inside mucosal tissues of mouth and genital areas",
                "Sharply circumscribed borders, sometimes with a hyperpigmented margin"
            ]),
            "risk_factors_json": json.dumps([
                "Personal or family history of autoimmune diseases (Hashimoto thyroiditis, Type 1 diabetes, alopecia areata)",
                "Specific genetic polymorphisms in immune-modulating loci (NLRP1, TYR)",
                "Physical trauma, severe sunburn, or chemical exposure (triggering Koebner phenomenon)"
            ]),
            "care_guidance_json": json.dumps([
                "Strict photoprotection: depigmented patches lack melanin and burn readily under UV light",
                "Apply high-SPF broad-spectrum sunscreen liberally to all white patches",
                "Topical corticosteroids or calcineurin inhibitors as prescribed by a physician",
                "Narrowband UVB phototherapy may stimulate melanocyte migration from hair follicles"
            ]),
            "when_to_see_doctor": "Seek a dermatological assessment promptly upon noticing progressive white patches. Early treatment during the active phase achieves significantly higher repigmentation rates.",
            "medical_references_json": json.dumps([
                "Vitiligo Research Foundation (VRF) - Global Consensus and Guidelines",
                "American Academy of Dermatology (AAD) - Vitiligo Overview",
                "Lancet Dermatology - Autoimmune Pathogenesis of Vitiligo"
            ])
        },
        {
            "name": "Tinea (Ringworm)",
            "slug": "tinea-ringworm",
            "category": "Superficial Fungal Infection",
            "severity": "Infectious / Treatable",
            "description": "Tinea corporis (ringworm) is a superficial dermatophyte fungal infection of keratinized skin (commonly caused by Trichophyton or Microsporum species). Despite its historical common name, it is completely unrelated to parasitic worms.",
            "symptoms_json": json.dumps([
                "Annular (circular or ring-shaped) erythematous plaque with a raised, active scaly border",
                "Characteristic 'central clearing' where the interior of the ring appears less inflamed",
                "Moderate to severe pruritus (itching) that worsens with heat or perspiration",
                "May present with multiple expanding or overlapping circular rings",
                "Possible mild follicular pustules along the active leading margin"
            ]),
            "risk_factors_json": json.dumps([
                "Direct skin-to-skin contact with an infected person or domestic pet (cats/dogs)",
                "Sharing contaminated towels, gym equipment, combs, or athletic clothing",
                "Participation in contact sports (wrestling - tinea corporis gladiatorum)",
                "Warm, humid climates and occlusive synthetic footwear or apparel",
                "Compromised immune system or diabetes mellitus"
            ]),
            "care_guidance_json": json.dumps([
                "Apply over-the-counter topical antifungals (terbinafine, clotrimazole, or ketoconazole) consistently",
                "Continue antifungal application for 1 to 2 weeks after visual clearing to eradicate fungal spores",
                "Keep infected skin clean, cool, and meticulously dry",
                "Wash contaminated bedsheets, towels, and athletic gear in hot water with laundry sanitizer",
                "Have household pets examined by a veterinarian if they show circular patchy fur loss"
            ]),
            "when_to_see_doctor": "Consult a healthcare provider if the infection fails to improve after 2 weeks of topical antifungal therapy, covers large body surfaces, or affects the scalp (tinea capitis requires oral antifungals).",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Fungal Diseases: Ringworm",
                "American Academy of Dermatology (AAD) - Tinea Corporis Diagnosis & Care",
                "Mayo Clinic - Ringworm (Body) Diagnosis and Management"
            ])
        },
        {
            "name": "Urticaria (Hives)",
            "slug": "urticaria",
            "category": "Allergic / Mast Cell Mediated",
            "severity": "Manageable / Acute or Chronic",
            "description": "Urticaria (hives) is a vascular reaction of the upper dermis characterized by transient, intensely pruritic, erythematous edematous wheals with pale central swelling. It is primarily caused by histamine degranulation from cutaneous mast cells.",
            "symptoms_json": json.dumps([
                "Raised, intensely itchy pink or red welts (wheals) with clear central pallor",
                "Transient individual lesions that evolve, migrate, and resolve within 24 hours without scarring",
                "Variable shapes and sizes ranging from tiny papules to confluent giant plaques",
                "Dermatographism: wheals triggered by mild stroking or scratching of the skin",
                "Associated angioedema (deeper swelling of lips, eyelids, or throat in severe cases)"
            ]),
            "risk_factors_json": json.dumps([
                "Hypersensitivity reactions to foods (peanuts, shellfish, dairy) or drugs (NSAIDs, antibiotics)",
                "Viral infections (especially in pediatric patients)",
                "Physical stimuli: cold, heat, pressure, vibration, or sunlight (physical urticarias)",
                "Chronic autoimmune antibodies against high-affinity IgE receptors"
            ]),
            "care_guidance_json": json.dumps([
                "Take second-generation non-sedating H1 antihistamines (cetirizine, fexofenadine, loratadine)",
                "Apply cool compresses or take soothing cool colloidal oatmeal baths",
                "Wear loose-fitting, soft cotton clothing to minimize mechanical friction",
                "Avoid known allergic triggers, hot showers, and excessive alcohol"
            ]),
            "when_to_see_doctor": "Seek emergency medical care immediately if hives are accompanied by lip or tongue swelling, difficulty breathing, throat tightness, or dizziness (anaphylaxis).",
            "medical_references_json": json.dumps([
                "World Allergy Organization (WAO) - Guidelines for the Management of Urticaria",
                "American Academy of Allergy, Asthma & Immunology (AAAAI) - Urticaria Guidelines",
                "Mayo Clinic - Hives and Angioedema Diagnosis and Treatment"
            ])
        },
        {
            "name": "Shingles (Herpes Zoster)",
            "slug": "shingles",
            "category": "Viral Infectious Dermatosis",
            "severity": "Concerning / Acute Viral",
            "description": "Shingles (herpes zoster) is a painful neurocutaneous condition caused by the reactivation of the varicella-zoster virus (VZV), which remains dormant in the sensory dorsal root ganglia following primary chickenpox infection.",
            "symptoms_json": json.dumps([
                "Prodromal burning, tingling, stinging, or hyperesthesia in a specific cutaneous zone",
                "Unilateral grouped vesicles on an erythematous base strictly limited to a single dermatome",
                "Does not cross the anatomical midline of the body",
                "Vesicles become cloudy, rupture, and crust over within 7 to 10 days",
                "Severe neuropathic stabbing or electric shock pain (risk of postherpetic neuralgia)"
            ]),
            "risk_factors_json": json.dumps([
                "Advancing age (>50 years) due to age-related decline in VZV-specific T-cell immunity",
                "Immunocompromised states (chemotherapy, HIV, corticosteroids, malignancy)",
                "Severe physical trauma or emotional exhaustion",
                "Prior history of varicella (chickenpox) infection"
            ]),
            "care_guidance_json": json.dumps([
                "Oral antiviral therapy (valacyclovir, acyclovir, famciclovir) initiated within 72 hours of rash onset",
                "Keep vesicular rash clean and covered with non-stick sterile dressings to prevent transmission",
                "Avoid contact with pregnant individuals, newborns, and immunocompromised persons until lesions crust",
                "Receive the recombinant zoster vaccine (Shingrix) for individuals aged 50 and older"
            ]),
            "when_to_see_doctor": "Consult a physician within 72 hours of symptom onset for early antiviral therapy. Seek urgent emergency care if shingles affects the forehead or near the eye (herpes zoster ophthalmicus carries severe risk of blindness).",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Shingles (Herpes Zoster) Overview",
                "American Academy of Ophthalmology - Herpes Zoster Ophthalmicus Guidelines",
                "New England Journal of Medicine (NEJM) - Clinical Practice: Herpes Zoster"
            ])
        },
        {
            "name": "Impetigo",
            "slug": "impetigo",
            "category": "Bacterial Cutaneous Infection",
            "severity": "Infectious / Treatable",
            "description": "Impetigo is a highly contagious superficial bacterial skin infection most prevalent in young children, caused by Staphylococcus aureus or Streptococcus pyogenes invading through minor epidermal breaks.",
            "symptoms_json": json.dumps([
                "Red sores that rapidly burst, ooze fluid, and develop characteristic golden honey-colored crusts",
                "Commonly centered around the nose, mouth, hands, and diaper area",
                "Bullous impetigo: painless, fluid-filled flaccid blisters that rupture leaving a collarette of scale",
                "Mild itching and localized regional lymphadenopathy",
                "Easily spread to other body sites through scratching or touching"
            ]),
            "risk_factors_json": json.dumps([
                "Age 2 to 5 years (daycare and school environments)",
                "Warm, humid weather and close contact sports",
                "Pre-existing skin disruptions (eczema, mosquito bites, scabies, cuts)",
                "Poor hygiene or crowded living conditions"
            ]),
            "care_guidance_json": json.dumps([
                "Topical mupirocin or retapamulin ointment for localized non-bullous lesions",
                "Oral antibiotics (cephalexin or amoxicillin-clavulanate) for widespread infections",
                "Gently cleanse crusts with antibacterial soap and warm water before applying topical ointments",
                "Keep child's fingernails trimmed short to prevent autoinoculation",
                "Wash contaminated clothes and linens separately in hot water"
            ]),
            "when_to_see_doctor": "Consult a pediatrician or doctor if sores spread rapidly, do not improve within 3 days of topical antibiotic therapy, or if the child develops a fever or swollen painful red surrounding skin (cellulitis).",
            "medical_references_json": json.dumps([
                "American Academy of Pediatrics (AAP) - Impetigo Clinical Management",
                "Centers for Disease Control and Prevention (CDC) - Group A Streptococcal Infections",
                "Mayo Clinic - Impetigo Symptoms and Causes"
            ])
        },
        {
            "name": "Alopecia Areata",
            "slug": "alopecia-areata",
            "category": "Autoimmune Follicular Disorder",
            "severity": "Manageable / Chronic",
            "description": "Alopecia areata is an autoimmune, non-scarring hair loss condition where auto-reactive cytotoxic CD8+ T lymphocytes attack anagen-phase hair follicles, disrupting hair growth without permanently destroying the follicular stem cells.",
            "symptoms_json": json.dumps([
                "Round or oval patches of sudden, completely smooth hair loss on the scalp or beard",
                "Preserved follicular ostia (no scarring or inflammation)",
                "Short, fractured 'exclamation point hairs' around the active expanding margin of the bald patch",
                "Nail abnormalities in ~20% of patients (fine stippled pitting, trachyonychia)",
                "Potential progression to complete scalp loss (alopecia totalis) or body loss (alopecia universalis)"
            ]),
            "risk_factors_json": json.dumps([
                "Personal or family history of alopecia areata or other autoimmune diseases (thyroiditis, vitiligo)",
                "Genetic human leukocyte antigen (HLA) associations (HLA-DQB1*03)",
                "Severe physiological or psychological stress triggers"
            ]),
            "care_guidance_json": json.dumps([
                "Intralesional corticosteroid injections (triamcinolone acetonide) administered by a dermatologist",
                "Topical immunotherapy or high-potency topical corticosteroids",
                "Emerging FDA-approved oral JAK inhibitors (baricitinib, ritlecitinib) for severe alopecia areata",
                "Use sun protection on exposed bald scalp patches to prevent severe sunburn"
            ]),
            "when_to_see_doctor": "Consult a dermatologist upon noticing any sudden focal hair loss patches. Prompt intervention during early focal phases yields higher rates of spontaneous or therapeutic regrowth.",
            "medical_references_json": json.dumps([
                "National Alopecia Areata Foundation (NAAF) - Clinical Standards",
                "American Academy of Dermatology (AAD) - Alopecia Areata Diagnosis & Treatments",
                "Lancet Dermatology - Pathogenesis and Therapies for Alopecia Areata"
            ])
        }
    ]

    for item in diseases:
        existing = DiseaseInformation.query.filter_by(slug=item['slug']).first()
        if not existing:
            d = DiseaseInformation(**item)
            db.session.add(d)
        else:
            for key, val in item.items():
                setattr(existing, key, val)

    db.session.commit()
    print(f"[OK] Seeded/Updated {len(diseases)} educational disease records successfully.")
