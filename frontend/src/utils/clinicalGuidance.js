/**
 * Clinical Dermatological Guidance Dictionary
 * Provides comprehensive clinical recommendations, evidence-based treatments,
 * and nutritional food remedies across all 18 supported skin disease classes.
 */

export const CLINICAL_DISEASE_GUIDANCE = {
  'Melanoma': {
    category: 'Malignant Skin Neoplasm',
    severity: 'Concerning / High Risk',
    overview: 'Aggressive cutaneous malignancy arising from pigment-producing melanocytes. Early surgical excision is curative, whereas late stages require systemic targeted and immunotherapies.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Urgent wide local surgical excision with histologically confirmed negative margins (1-2 cm)',
        'Sentinel Lymph Node Biopsy (SLNB) for intermediate or deep Breslow thickness (>0.8 mm)',
        'Total cutaneous digital dermoscopy and lymph node ultrasound surveillance'
      ],
      prescriptionTopicals: [
        'Topical agents are generally contraindicated for primary invasive melanoma; surgical excision is mandatory',
        'Topical Imiquimod 5% cream may be considered selectively for Lentigo Maligna in elderly/non-surgical candidates'
      ],
      systemicTherapies: [
        'Targeted BRAF/MEK inhibitors (e.g., Dabrafenib + Trametinib) for BRAF V600 mutant metastatic cases',
        'Immune checkpoint inhibitors (Anti-PD-1: Pembrolizumab, Nivolumab; Anti-CTLA-4: Ipilimumab)'
      ],
      specialistCriteria: 'Immediate urgent referral to a dermatologic oncologist or surgical oncologist within 7 days.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Wild cold-water fish (salmon, sardines, mackerel) rich in anti-inflammatory EPA and DHA omega-3 fatty acids',
        'Deeply pigmented berries (blueberries, blackberries) containing anthocyanins and polyphenolic antioxidants',
        'Cruciferous vegetables (broccoli sprouts, kale, watercress) rich in sulforaphane to stimulate cellular phase-2 detoxification',
        'Green tea (EGCG polyphenols) and extra virgin olive oil (oleocanthal) to counteract oxidative DNA damage'
      ],
      foodsToAvoid: [
        'Charred, grilled, and well-done meats high in heterocyclic amines and polycyclic aromatic hydrocarbons',
        'Processed deli meats containing nitrates and nitrosamines',
        'High-fructose corn syrup, refined white sugars, and sweetened carbonated beverages',
        'Excessive alcohol consumption which impairs DNA repair enzymes and increases cellular oxidation'
      ],
      dietaryHabits: [
        'Adopt a strict anti-inflammatory Mediterranean dietary pattern with 35-40g dietary fiber daily',
        'Consume minimum 2.5 to 3 liters of filtered water daily to maintain epidermal cellular turgor',
        'Check serum 25-hydroxy Vitamin D levels and supplement under medical direction if deficient'
      ],
      micronutrientSupport: 'Omega-3 fatty acids, CoQ10, Resveratrol, Astaxanthin, and Vitamin D3 (monitored).'
    }
  },

  'Basal Cell Carcinoma': {
    category: 'Malignant Skin Neoplasm',
    severity: 'Concerning / Moderate Risk',
    overview: 'Most common non-melanoma skin cancer originating in epidermal basal cells. High local invasiveness with minimal metastasis potential.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Mohs Micrographic Surgery for high-risk facial, peri-orbital, nasolabial, or recurrent lesions (cure rate >99%)',
        'Standard surgical excision with 4-5 mm clear clinical margins',
        'Electrodessication and Curettage (ED&C) for low-risk superficial trunk/extremity lesions',
        'Cryosurgery or Photodynamic Therapy (PDT with 5-ALA) for superficial thin plaques'
      ],
      prescriptionTopicals: [
        'Topical Fluorouracil (5-FU 5% cream) twice daily for 3-6 weeks for superficial BCC',
        'Topical Imiquimod 5% cream applied 5 times weekly for 6 weeks for superficial BCC'
      ],
      systemicTherapies: [
        'Hedgehog pathway inhibitors (Vismodegib, Sonidegib) for locally advanced, unresectable or metastatic tumors'
      ],
      specialistCriteria: 'Schedule dermatological consultation for biopsy, histopathologic subtyping, and surgical mapping.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Cooked tomatoes, tomato paste, and watermelon rich in bioavailable lycopene for UV photoprotection',
        'Dark leafy greens (spinach, Swiss chard) high in lutein, zeaxanthin, and folate',
        'Citrus fruits (oranges, lemons) providing bioflavonoids and Vitamin C for collagen remodeling',
        'Pumpkin seeds and Brazil nuts providing elemental zinc and selenium for DNA synthesis'
      ],
      foodsToAvoid: [
        'High glycemic-index foods and refined flours that elevate systemic inflammation and insulin spikes',
        'Hydrogenated vegetable oils, trans fats, and industrially fried fast foods',
        'Excessive alcohol and tobacco use which impede microvascular healing and tissue oxygenation'
      ],
      dietaryHabits: [
        'Emphasize daily intake of carotenoids to support endogenous cutaneous UV defense',
        'Pair iron and zinc-rich foods with natural Vitamin C for optimal absorption and skin repair'
      ],
      micronutrientSupport: 'Lycopene, Nicotinamide (Vitamin B3 500mg twice daily), Zinc, and Vitamin C.'
    }
  },

  'Squamous Cell Carcinoma': {
    category: 'Malignant Skin Neoplasm',
    severity: 'Concerning / High Risk',
    overview: 'Malignant proliferation of keratinocytes. Carries an established risk of regional lymph node metastasis, especially on lips, ears, or in immunocompromised patients.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Mohs Micrographic Surgery or complete surgical excision with wide margins (4-6 mm min)',
        'Curettage and electrodessication for small (<1cm) primary, well-differentiated low-risk lesions',
        'Adjuvant radiotherapy for perineural invasion, close/positive surgical margins, or deep invasion'
      ],
      prescriptionTopicals: [
        '5-Fluorouracil (5-FU) or 5% Imiquimod exclusively for in-situ Bowens disease',
        'Topical retinoids for prevention of field cancerization under dermatologist supervision'
      ],
      systemicTherapies: [
        'PD-1 inhibitor Cemiplimab or Pembrolizumab for locally advanced or metastatic cutaneous SCC',
        'Oral acitretin chemoprevention for high-risk solid organ transplant recipients'
      ],
      specialistCriteria: 'Prompt evaluation by a dermatologic surgeon or head and neck surgical team.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Carrots, sweet potatoes, and butternut squash loaded with beta-carotene',
        'Cruciferous vegetables (cabbage, Brussels sprouts, broccoli) containing glucosinolates',
        'Wild Alaskan salmon, chia seeds, and walnuts providing anti-inflammatory alpha-linolenic acid (ALA)',
        'Green tea and matcha rich in polyphenolic epigallocatechin gallate (EGCG)'
      ],
      foodsToAvoid: [
        'Over-charred and smoked foods containing heterocyclic carcinogens',
        'Processed snacks containing high-fructose corn syrup and chemical stabilizers',
        'Excessive sodium and cured meats with potassium nitrate preservatives'
      ],
      dietaryHabits: [
        'Hydrate with minimum 2.5 liters daily; avoid drinking scalding hot liquids that irritate oral epithelium',
        'Incorporate colorful whole plant foods to supply diverse phytonutrients for cellular repair'
      ],
      micronutrientSupport: 'Oral Nicotinamide (Vitamin B3), Beta-carotene, Zinc glycinate, and Polyphenols.'
    }
  },

  'Actinic Keratosis': {
    category: 'Precancerous Keratinocytic Dysplasia',
    severity: 'Concerning / Precancerous',
    overview: 'Precancerous rough, scaly cutaneous macules caused by cumulative ultraviolet exposure. Can transform into invasive Squamous Cell Carcinoma if untreated.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Cryotherapy with liquid nitrogen (-196°C) for discrete, well-defined hyperkeratotic lesions',
        'Photodynamic Therapy (PDT) utilizing 5-aminolevulinic acid (ALA) for extensive field cancerization',
        'Medium-depth chemical resurfacing (trichloroacetic acid TCA or Jessner peel)'
      ],
      prescriptionTopicals: [
        'Fluorouracil (5-FU 0.5% - 5% cream) daily for 2-4 weeks',
        'Imiquimod (3.75% or 5% cream) applied topically over a 2-6 week cycle',
        'Tirbanibulin ointment 1% applied once daily for 5 consecutive days',
        'Diclofenac sodium 3% gel in 2.5% hyaluronan applied twice daily for 60-90 days'
      ],
      systemicTherapies: [
        'Oral Nicotinamide (Vitamin B3) 500 mg twice daily has been clinically shown to reduce new actinic keratoses'
      ],
      specialistCriteria: 'Annual full-body skin examination by a certified dermatologist for field cancerization mapping.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Foods rich in Vitamin B3 (niacin/nicotinamide): chicken breast, turkey, tuna, portobello mushrooms',
        'Rich dietary lycopene: cooked tomato puree, rosehips, guava, pink grapefruit',
        'Dark leafy greens providing lutein and zeaxanthin for solar radiation filtering',
        'Avocados, extra virgin olive oil, and flaxseed oil for dermal lipid barrier preservation'
      ],
      foodsToAvoid: [
        'Refined sugars, pastries, and candy that increase systemic advanced glycation end-products (AGEs)',
        'Deep-fried vegetable oils (canola, corn, cottonseed) that release inflammatory free radicals',
        'Excess alcohol that impairs hepatic phase-1/phase-2 detox and increases cutaneous sensitivity'
      ],
      dietaryHabits: [
        'Commit to daily oral hydration (2.5L clean water) alongside green tea intake',
        'Eat a minimum of 5 portions of deeply pigmented vegetables and fruits daily'
      ],
      micronutrientSupport: 'Nicotinamide 500mg, Vitamin C, Vitamin E (d-alpha tocopherol), and Selenium.'
    }
  },

  'Nevus': {
    category: 'Benign Melanocytic Proliferation',
    severity: 'Benign / Low Risk',
    overview: 'Common benign melanocytic mole composed of organized clusters of melanocytes. Completely harmless unless exhibiting atypical dysplastic features.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Serial clinical observation with dermoscopic documentation (ABCDE framework)',
        'Prophylactic excision is NOT clinically indicated for normal symmetric nevi',
        'Full-thickness excisional biopsy with 2mm margin if sudden changes in size, border, or color occur'
      ],
      prescriptionTopicals: [
        'No topical medications needed; topical acids or bleaching agents are contraindicated on pigmented nevi'
      ],
      systemicTherapies: [
        'None indicated for benign melanocytic nevi'
      ],
      specialistCriteria: 'Review by a dermatologist if any mole shows asymmetry, ragged borders, multicolor mottling, or grows after age 30.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Foods high in natural antioxidants: blueberries, blackberries, pomegranates, and dark chocolate (>70% cocoa)',
        'Beta-carotene sources (carrots, butternut squash) to support healthy skin cellular turnover',
        'Flaxseeds, chia seeds, and wild salmon for essential cellular membrane lipids',
        'Green leafy vegetables delivering folate and magnesium for DNA repair'
      ],
      foodsToAvoid: [
        'Ultra-processed snack foods and sodas',
        'Excessive trans-fat rich convenience meals',
        'Excessive alcohol consumption'
      ],
      dietaryHabits: [
        'Maintain a balanced, nutrient-dense whole-food diet',
        'Support cellular hydration with 2 liters of water daily'
      ],
      micronutrientSupport: 'General multivitamin with Zinc, Vitamin C, Vitamin D3, and Folate.'
    }
  },

  'Benign Keratosis': {
    category: 'Benign Keratinocytic Lesion',
    severity: 'Benign / Low Risk',
    overview: 'Seborrheic keratosis / benign ephelide. Harmless warty, pasted-on cutaneous papule or plaque common with maturity.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Clinical reassurance: Benign condition without malignant potential; treatment is elective',
        'Cryotherapy with liquid nitrogen spray for flat or thin lesions',
        'Light curettage or tangential shave excision under local anesthesia for elevated lesions',
        'Electrodessication or focal laser ablation'
      ],
      prescriptionTopicals: [
        'Hydrogen peroxide 40% topical solution (Eskata) applied under clinical direction',
        'Ammonium lactate 12% or urea 20% cream for softening hyperkeratotic roughness'
      ],
      systemicTherapies: [
        'None indicated'
      ],
      specialistCriteria: 'Dermatology consultation only if lesion bleeds spontaneously, becomes inflamed, or mimics melanoma (Sign of Leser-Trélat).'
    },
    foodRemedies: {
      beneficialFoods: [
        'Healthy monounsaturated fatty acids: avocados, raw almonds, extra virgin olive oil',
        'Hydrating fruits and vegetables: cucumbers, celery, watermelon, oranges',
        'Vitamin A rich foods (sweet potatoes, apricots) supporting orderly epidermal stratification',
        'Zinc-dense foods (lentils, chickpea hummus, pumpkin seeds) for barrier repair'
      ],
      foodsToAvoid: [
        'Harsh systemic irritants and dehydrating excessive caffeinated energy beverages',
        'High sodium preserved meats and deep-fried fast food items',
        'Excessive refined sugars'
      ],
      dietaryHabits: [
        'Maintain proper systemic hydration to keep the stratum corneum supple and pliable',
        'Use gentle non-soap cleansers and avoid mechanical scratching or picking at plaques'
      ],
      micronutrientSupport: 'Vitamin E, Omega-7 (sea buckthorn), Zinc, and Vitamin A.'
    }
  },

  'Dermatofibroma': {
    category: 'Benign Fibrous Histiocytoma',
    severity: 'Benign / Low Risk',
    overview: 'Benign dermal nodule composed of fibroblasts, histiocytes, and collagen. Typically presents on lower extremities and exhibits a pathognomonic central dimple sign.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Reassurance of benign nature; intervention is rarely required',
        'Complete conservative surgical excision if painfully irritated by clothing, shaving, or seat belts',
        'Cryosurgery to flatten the surface contour (may produce residual hypopigmentation)',
        'Punch biopsy to confirm diagnosis if nodule is atypical or rapidly enlarging'
      ],
      prescriptionTopicals: [
        'None indicated; topical therapies do not penetrate deep dermal fibrous tissue'
      ],
      systemicTherapies: [
        'None indicated'
      ],
      specialistCriteria: 'Specialist evaluation if multiple eruptive lesions appear or if lesion exhibits rapid growth.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Anti-inflammatory spices: organic turmeric (with black pepper piperine) and ginger root',
        'Collagen precursors: bone broth, citrus fruits (Vitamin C), proline/lysine-rich legumes',
        'Cruciferous vegetables to facilitate natural hepatic cellular detoxification',
        'Adequate clean water intake (2+ liters daily)'
      ],
      foodsToAvoid: [
        'Pro-inflammatory refined seed oils (corn, soybean, cottonseed)',
        'High-sugar confectioneries that promote collagen cross-linking and glycation',
        'Excessive alcohol intake'
      ],
      dietaryHabits: [
        'Emphasize a clean, whole-foods anti-inflammatory meal plan',
        'Protect lower extremities from insect bites and mechanical micro-trauma'
      ],
      micronutrientSupport: 'Turmeric/Curcumin, Vitamin C, MSM (methylsulfonylmethane), and Zinc.'
    }
  },

  'Vascular Lesion': {
    category: 'Benign Vascular Malformation / Hemangioma',
    severity: 'Benign / Low Risk',
    overview: 'Abnormal proliferation of vascular endothelial cells or dilated capillaries (e.g., cherry angioma, port-wine stain, pyogenic granuloma).',
    recommendedTreatments: {
      clinicalProcedures: [
        'Pulsed Dye Laser (PDL 595 nm) or Nd:YAG laser therapy for photocoagulation of vessel lumen',
        'Electrocautery or fine-needle hyfrecation under local topical anesthesia',
        'Shave excision with chemical cautery (aluminum chloride / silver nitrate) for pyogenic granulomas',
        'Cryotherapy with light contact probe'
      ],
      prescriptionTopicals: [
        'Topical beta-blocker (Timolol maleate 0.5% gel) for superficial proliferating infantile hemangiomas',
        'Alclometasone or gentle barrier balms for irritated surface fissures'
      ],
      systemicTherapies: [
        'Oral Propranolol hydrochloride for complex, sight-threatening or airway infantile hemangiomas under pediatric cardiology supervision'
      ],
      specialistCriteria: 'Dermatology or vascular surgery evaluation if lesion bleeds profusely, ulcerates, or expands abruptly.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Rutin and bioflavonoid-rich foods: buckwheat groats, whole apples (with peel), citrus, figs',
        'Anthocyanin-loaded berries: blackberries, elderberries, aronia berries to strengthen capillary walls',
        'Leafy greens rich in natural Vitamin K (kale, collard greens) supporting proper coagulatory balance',
        'Vitamin C rich bell peppers and kiwi supporting vascular collagen integrity'
      ],
      foodsToAvoid: [
        'Vasodilatory dietary triggers: spicy chili peppers, ghost pepper sauces, and piping hot soups',
        'Excessive alcohol and red wine that provoke peripheral facial vasodilation',
        'Excess sodium which elevates vascular pressures and capillary fragility'
      ],
      dietaryHabits: [
        'Avoid extreme sudden temperature shifts in food and beverages to minimize flush reactions',
        'Ensure steady, calm hydration throughout the day'
      ],
      micronutrientSupport: 'Rutin, Citrus Bioflavonoids, Vitamin C, Hesperidin, and Vitamin K2.'
    }
  },

  'Eczema': {
    category: 'Chronic Inflammatory Dermatitis',
    severity: 'Manageable / Chronic',
    overview: 'Pruritic, inflammatory epidermal condition characterized by skin barrier breakdown (filaggrin deficiency), immune dysregulation, and heightened allergen sensitivity.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Intensive barrier repair protocol: apply thick ceramide-dominant moisturizers within 3 minutes of bathing',
        'Wet wrap therapy during acute, severe pruritic flare-ups',
        'Narrowband UVB phototherapy (NB-UVB) for widespread refractory atopic dermatitis',
        'Allergy patch testing to identify specific contact allergens'
      ],
      prescriptionTopicals: [
        'Topical corticosteroids (hydrocortisone 2.5%, triamcinolone 0.1%, or betamethasone) for acute flares',
        'Topical Calcineurin Inhibitors (Tacrolimus 0.1%, Pimecrolimus 1%) for face, neck, and flexural folds',
        'Phosphodiesterase-4 (PDE-4) inhibitor: Crisaborole 2% ointment for mild-to-moderate eczema'
      ],
      systemicTherapies: [
        'Biologic IL-4 / IL-13 receptor antagonist (Dupilumab, Tralokinumab) for moderate-to-severe refractory disease',
        'Oral JAK inhibitors (Upadacitinib, Abrocitinib) under specialist monitoring',
        'Short-course oral antihistamines for nocturnal sedation and itch control'
      ],
      specialistCriteria: 'Dermatologist consultation if eczema is non-responsive to topical steroids or if recurrent secondary bacterial infection occurs.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Omega-3 rich foods: wild salmon, mackerel, chia seeds, flaxseed oil to downregulate leukotrienes',
        'Probiotic and fermented foods: organic kefir, coconut yogurt, miso, kimchi to restore the gut-skin microbiome axis',
        'Quercetin-rich foods: organic apples, red onions, capers which serve as natural mast cell stabilizers',
        'Bone broth providing gelatin, collagen, and glycine to support intestinal barrier integrity'
      ],
      foodsToAvoid: [
        'Common clinical flare triggers: cow milk dairy, gluten, soy, eggs, and peanuts (confirm via elimination)',
        'High-histamine or histamine-liberating foods: aged hard cheeses, cured salami, wine, canned tuna',
        'Artificial food additives: tartrazine, monosodium glutamate (MSG), and synthetic sulfites',
        'Refined sugar and inflammatory seed oils'
      ],
      dietaryHabits: [
        'Practice a 3-week systematic elimination protocol to objectively isolate individual flare foods',
        'Drink 2.5 liters of room-temperature filtered water daily to hydrate the dermal matrix',
        'Take evening primrose oil or borage oil for gamma-linolenic acid (GLA) support'
      ],
      micronutrientSupport: 'Omega-3 (EPA/DHA), Zinc bisglycinate, Vitamin D3 (4000 IU), Quercetin, and Multi-strain Spore Probiotics.'
    }
  },

  'Psoriasis': {
    category: 'Autoimmune Papulosquamous Disease',
    severity: 'Manageable / Chronic',
    overview: 'Immune-mediated systemic inflammatory disease mediated by the IL-23/IL-17 axis, accelerating epidermal keratinocyte turnover from 28 days down to 3-5 days.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Narrowband UVB (NB-UVB 311 nm) phototherapy 2-3 times weekly',
        'Excimer laser (308 nm) for localized recalcitrant plaques on elbows, knees, or scalp',
        'Keratolytic baths with dead sea salts or colloidal oatmeal to gently loosen thick silver scales'
      ],
      prescriptionTopicals: [
        'Combination topical therapy: Betamethasone dipropionate + Calcipotriene (Vitamin D3 analogue)',
        'Topical retinoid: Tazarotene 0.05% - 0.1% gel/cream',
        'Topical aryl hydrocarbon receptor agonist: Tapinarof 1% cream or Roflumilast 0.3% cream'
      ],
      systemicTherapies: [
        'Biologics targeting IL-17 (Secukinumab, Ixekizumab), IL-23 (Guselkumab, Risankizumab), or TNF-alpha (Adalimumab)',
        'Oral PDE-4 inhibitor: Apremilast (Otezla)',
        'Oral Methotrexate or Cyclosporine for severe plaque or erythrodermic flares'
      ],
      specialistCriteria: 'Dermatologist and rheumatologist co-management, especially if morning joint stiffness or psoriatic arthritis is suspected.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Anti-inflammatory Mediterranean diet centered on deep greens, extra virgin olive oil, and wild fatty fish',
        'Turmeric and curcumin extract with black pepper to suppress TNF-alpha and NF-kB pathways',
        'Fiber-rich legumes and steel-cut oats producing gut short-chain fatty acids (SCFAs: butyrate)',
        'Avocados, walnuts, and flaxseeds delivering anti-inflammatory monounsaturated and polyunsaturated fats'
      ],
      foodsToAvoid: [
        'Nightshade vegetables if sensitive (tomatoes, white potatoes, eggplants, bell peppers)',
        'Alcohol and beer: Alcohol strongly aggravates psoriasis flares and interacts negatively with methotrexate',
        'Gluten and refined wheat products (up to 25% of psoriasis patients possess elevated anti-gliadin antibodies)',
        'Processed red meats, sausage, bacon, and trans fats containing arachidonic acid'
      ],
      dietaryHabits: [
        'Maintain a healthy body mass index (BMI); clinical weight loss of 5-10% significantly improves biologic efficacy',
        'Intermittent fasting (16:8 schedule) has shown positive clinical reductions in PASI severity scores',
        'Consume minimum 2.5-3 liters of clean water daily'
      ],
      micronutrientSupport: 'Curcumin (standardized 95%), High-dose Vitamin D3 (monitored), Omega-3 Fish Oil (3g/day), and Zinc.'
    }
  },

  'Acne': {
    category: 'Pilosebaceous Inflammatory Disorder',
    severity: 'Benign / Treatable',
    overview: 'Multifactorial disorder involving follicular hyperkeratinization, excess sebum driven by androgens, Cutibacterium acnes proliferation, and localized inflammation.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Comedone extraction and chemical peels (Salicylic Acid 20-30% or Glycolic Acid)',
        'Blue light (415 nm) and Red light phototherapy to target C. acnes porphyrins and reduce erythema',
        'Intralesional triamcinolone acetonide (1.5 - 2.5 mg/mL) injections for acute painful cystic nodules',
        'Fractional non-ablative laser or microneedling for post-acne atrophic scarring'
      ],
      prescriptionTopicals: [
        'Topical Retinoids (Adapalene 0.1%-0.3%, Tretinoin 0.025%-0.1%, or Trifarotene)',
        'Benzoyl Peroxide (2.5% - 5% wash or gel) to reduce bacterial resistance without antibiotics',
        'Azelaic Acid 15%-20% for comedones, papules, and post-inflammatory hyperpigmentation (PIH)',
        'Topical Clindamycin 1% paired strictly with Benzoyl Peroxide'
      ],
      systemicTherapies: [
        'Oral Tetracycline antibiotics (Doxycycline 50-100mg daily) for moderate inflammatory papulopustular acne',
        'Hormonal therapies for adult females (Spironolactone 50-100mg or combined oral contraceptives)',
        'Oral Isotretinoin (Accutane) for severe nodulocystic, scarring, or treatment-refractory acne'
      ],
      specialistCriteria: 'Consult a dermatologist early if cystic lesions or atrophic scarring emerge.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Low-glycemic index whole foods: quinoa, brown basmati rice, lentils, chickpeas, oats to prevent IGF-1 spikes',
        'Zinc-dense foods: raw pumpkin seeds, hemp hearts, lentils, pasture-raised eggs (zinc reduces sebum production)',
        'Antioxidant-loaded green tea (drinking and cold topical compresses with cooled green tea)',
        'Cruciferous vegetables (cabbage, broccoli) containing indole-3-carbinol (I3C) to support estrogen clearance'
      ],
      foodsToAvoid: [
        'Cow milk and dairy products (particularly skim milk and whey protein isolate powders which elevate IGF-1 and mTOR)',
        'High glycemic-load sweets, milk chocolates, white bread, pastries, and sugar-sweetened beverages',
        'Greasy, deep-fried fast foods containing oxidized omega-6 seed oils',
        'Excess iodine (large quantities of kelp, seaweeds, or specific weight loss supplements)'
      ],
      dietaryHabits: [
        'Maintain stable blood sugar through balanced meals with fiber, healthy fats, and clean protein',
        'Drink 2.5 to 3 liters of filtered water daily to assist natural dermal cellular waste excretion',
        'Avoid restrictive crash diets that dysregulate adrenal cortisol'
      ],
      micronutrientSupport: 'Zinc picolinate (30mg), Omega-3 fatty acids, Chromium, Vitamin A (dietary), and EGCG green tea extract.'
    }
  },

  'Rosacea': {
    category: 'Chronic Facial Neurovascular Disorder',
    severity: 'Manageable / Chronic',
    overview: 'Chronic central facial dermatosis marked by vascular hyperreactivity, persistent erythema, telangiectasias, inflammatory papules, and Demodex mite hypersensitivity.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Vascular laser therapy: Pulsed Dye Laser (PDL) or Intense Pulsed Light (IPL) for telangiectasias and flushing',
        'Gentle barrier-repair skincare regimen with zero abrasive scrubs or chemical fragrances'
      ],
      prescriptionTopicals: [
        'Topical Ivermectin 1% cream once daily (targets Demodex folliculorum mites and neurogenic inflammation)',
        'Topical Metronidazole 0.75% or 1% gel/cream applied twice daily',
        'Azelaic Acid 15% gel or foam for inflammatory papules and background erythema',
        'Topical Brimonidine tartrate 0.33% gel or Oxymetazoline 1% cream for transient reduction of persistent erythema'
      ],
      systemicTherapies: [
        'Sub-antimicrobial dose oral Doxycycline (40 mg modified-release daily) for anti-inflammatory anti-MMP suppression',
        'Low-dose oral Isotretinoin for severe recalcitrant papulopustular or phymatous rosacea'
      ],
      specialistCriteria: 'Dermatologist visit indicated for diagnosis and laser scheduling; ophthalmologist review mandatory if ocular stinging or gritty eyes occur.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Cooling, alkaline-rich vegetables: organic cucumbers, celery, zucchini, steamed asparagus',
        'Anti-inflammatory berries (blackberries, raspberries) rich in bioflavonoids to strengthen capillary walls',
        'Healthy fats: chia seeds, flaxseed oil, cold-water salmon',
        'Chamomile tea and iced peppermint tea for calming internal thermal regulation'
      ],
      foodsToAvoid: [
        'Piping hot thermal beverages: steaming coffee, boiling teas, and hot soups that trigger facial vasodilation',
        'Spicy foods containing capsaicin: jalapeños, chili peppers, cayenne pepper, hot curries',
        'Alcohol, especially red wine and champagne which stimulate vasodilation and mast cell degranulation',
        'Cinnamaldehyde-rich foods: tomatoes, citrus fruits, cinnamon, and aged cheeses if identified as triggers'
      ],
      dietaryHabits: [
        'Allow freshly prepared hot foods to cool to lukewarm room temperature before consuming',
        'Keep a structured 14-day food-flush journal to pinpoint individual culinary trigger ingredients',
        'Consume cool filtered water continuously throughout warm days'
      ],
      micronutrientSupport: 'Zinc glycinate, Bioflavonoids, Quercetin, Omega-3 fatty acids, and Probiotics.'
    }
  },

  'Vitiligo': {
    category: 'Autoimmune Melanocyte Destruction',
    severity: 'Manageable / Chronic',
    overview: 'Autoimmune condition where cytotoxic CD8+ T-cells target and destroy epidermal melanocytes, producing sharply circumscribed depigmented macules.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Narrowband UVB (NB-UVB 311 nm) phototherapy 2-3 times weekly to stimulate follicular hair follicle melanocyte reservoirs',
        'Targeted 308 nm Excimer Laser for localized focal patches',
        'Autologous non-cultured melanocyte-keratinocyte cell suspension transplantation (MKTP) for stable disease (>1 yr)'
      ],
      prescriptionTopicals: [
        'Topical JAK inhibitor: Ruxolitinib 1.5% cream (Opzelura) applied twice daily to affected areas',
        'Topical Calcineurin Inhibitors (Tacrolimus 0.1% or Pimecrolimus 1%) preferred for facial and intertriginous zones',
        'High-potency topical corticosteroids (Clobetasol propionate) used cyclically under physician direction'
      ],
      systemicTherapies: [
        'Oral mini-pulse (OMP) systemic corticosteroids (e.g., Dexamethasone 2.5mg on 2 consecutive days weekly) to arrest rapidly progressing vitiligo'
      ],
      specialistCriteria: 'Immediate consultation with a vitiligo specialist dermatologist to arrest active spreading depigmentation.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Foods providing copper and zinc (co-factors for tyrosinase melanogenesis): sunflower seeds, lentils, garbanzo beans',
        'Vitamin B12 and Folate-rich foods: nutritional yeast, pasture-raised eggs, dark leafy greens',
        'Antioxidant-dense vegetables: carrots, beets, purple cabbage, dark berries to neutralize reactive oxygen species (ROS)',
        'Ginkgo biloba tea/extract (clinical trials demonstrate support for halting vitiligo progression)'
      ],
      foodsToAvoid: [
        'Excess synthetic mega-doses of Vitamin C (>1000mg) taken concurrently with phototherapy (Vitamin C can inhibit tyrosinase activity)',
        'Processed foods with artificial chemical colorings, benzoates, and industrial emulsifiers',
        'Gluten and cow dairy if autoimmune thyroiditis (Hashimoto) comorbidity is present',
        'Excessive alcohol which depletes cellular glutathione stores'
      ],
      dietaryHabits: [
        'Screen annually for autoimmune thyroid disorders (TSH, free T4, anti-TPO) and Vitamin B12 levels',
        'Maintain a nutrient-dense whole-food regimen rich in phytochemicals and zinc'
      ],
      micronutrientSupport: 'Ginkgo biloba extract, Vitamin B12 (methylcobalamin), Folate (L-methylfolate), Zinc, and Alpha-Lipoic Acid.'
    }
  },

  'Tinea (Ringworm)': {
    category: 'Superficial Dermatophytic Fungal Infection',
    severity: 'Infectious / Treatable',
    overview: 'Superficial fungal infection caused by keratinophilic dermatophytes (Trichophyton, Microsporum, or Epidermophyton) producing an expanding annular ring with central clearing.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Potassium hydroxide (KOH) direct microscopic preparation of epidermal skin scrapings to confirm hyphae',
        'Thorough disinfection of towels, athletic gear, clothing, and footwear in hot water (>60°C)',
        'Exclusion from contact sports until 72 hours of topical antifungal treatment is completed'
      ],
      prescriptionTopicals: [
        'Topical Allylamines: Terbinafine 1% cream or Butenafine 1% cream applied once or twice daily for 2 weeks',
        'Topical Imidazoles: Clotrimazole 1%, Ketoconazole 2%, or Miconazole 2% cream applied for 2-4 weeks',
        'Apply cream at least 2 to 3 cm beyond the expanding active erythematous border',
        'AVOID combination steroid-antifungal creams (e.g., Lotrisone) which cause tinea incognito'
      ],
      systemicTherapies: [
        'Oral Terbinafine 250 mg daily for 2-4 weeks for extensive, refractory tinea or tinea capitis',
        'Oral Itraconazole or Fluconazole as secondary systemic alternatives'
      ],
      specialistCriteria: 'Dermatologist visit if rash worsens after 2 weeks of antifungal cream, or if scalp/nails are involved.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Crushed raw garlic containing allicin (exhibits well-documented natural fungicidal properties)',
        'Extra virgin coconut oil containing caprylic acid and lauric acid which disrupt fungal cell membranes',
        'Fermented organic foods: unsweetened kefir, natural sauerkraut to foster healthy gut and skin microbiome diversity',
        'Culinary antifungal herbs: oregano, thyme, rosemary, and clove added freely to meals'
      ],
      foodsToAvoid: [
        'Refined sugars, high-fructose corn syrups, and sweet treats which feed superficial microbial blooms',
        'Yeasty baked goods, refined white flour breads, and processed snacks',
        'Beer, sweet wines, and alcoholic drinks containing residual sugars',
        'Aged, mold-ripened cheeses (blue cheese, Roquefort, Gorgonzola)'
      ],
      dietaryHabits: [
        'Keep affected cutaneous zones scrupulously clean and thoroughly dry after showering',
        'Hydrate with clean water and herbal Pau dArco or Thyme teas'
      ],
      micronutrientSupport: 'Caprylic acid, Oregano oil extract, Zinc, and Multi-strain Spore Probiotics.'
    }
  },

  'Urticaria (Hives)': {
    category: 'Acute / Chronic Mast Cell Mediated Eruption',
    severity: 'Manageable / Acute or Chronic',
    overview: 'Transient, pruritic, edematous erythematous wheals resulting from cutaneous mast cell and basophil degranulation with sudden release of histamine, prostaglandins, and leukotrienes.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Identification and immediate elimination of inciting physical stimuli (cold, heat, pressure, vibratory, cholinergic)',
        'Autologous Serum Skin Test (ASST) or thyroid antibody panel if chronic urticaria lasts >6 weeks',
        'Emergency intramuscular Epinephrine (EpiPen 0.3mg) if accompanied by angioedema or airway compromise'
      ],
      prescriptionTopicals: [
        'Topical soothing calamine lotion or 1% pramoxine anti-itch lotion for local symptomatic relief',
        'Topical cool compresses; avoid hot baths which accelerate cutaneous mast cell degranulation'
      ],
      systemicTherapies: [
        'Second-generation H1-Antihistamines (Cetirizine 10mg, Fexofenadine 180mg, Levocetirizine 5mg, or Bilastine 20mg)',
        'Up-titration of 2nd-gen H1-antihistamines up to 4-times standard daily dose under medical supervision',
        'Addition of H2-antihistamine (Famotidine 20mg twice daily) or leukotriene receptor antagonist (Montelukast 10mg)',
        'Biologic Anti-IgE Monoclonal Antibody: Omalizumab (Xolair 300mg subcutaneous monthly) for chronic refractory cases'
      ],
      specialistCriteria: 'Seek emergency hospital care immediately if lip/tongue swelling or breathing difficulty occurs. Consult an allergist/dermatologist for chronic hives.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Strict Low-Histamine diet: freshly prepared poultry, freshly caught white fish, rice, oats, zucchini, broccoli',
        'Quercetin-rich plant foods: organic yellow and red onions, apples, capers (natural mast cell stabilizers)',
        'Vitamin C rich fresh vegetables: broccoli, cauliflower, Brussels sprouts to accelerate enzymatic histamine breakdown',
        'Nettle tea (Urtica dioica) which provides natural anti-allergic bioflavonoids'
      ],
      foodsToAvoid: [
        'High-histamine aged foods: mature cheeses, dry-cured salami, prosciutto, bacon, sauerkraut, kimchi',
        'Fermented beverages: red wine, beer, champagne, kombucha',
        'Canned and smoked fish, shellfish, and crustacea',
        'Histamine-releasing foods: ripe tomatoes, spinach, strawberries, citrus fruits, chocolate, egg whites',
        'Synthetic artificial food colorants (tartrazine) and preservative sulfites/benzoates'
      ],
      dietaryHabits: [
        'Consume freshly prepared food; avoid leftovers kept in refrigerator where bacterial histamine accumulates',
        'Drink 2.5 to 3 liters of fresh room-temperature water daily to dilute systemic histamine clearance'
      ],
      micronutrientSupport: 'Quercetin with Bromelain, Vitamin C (buffered ascorbic acid), Vitamin B6 (P5P), and Diamine Oxidase (DAO) enzymes.'
    }
  },

  'Shingles (Herpes Zoster)': {
    category: 'Acute Viral Neurocutaneous Infection',
    severity: 'Concerning / Acute Viral',
    overview: 'Reactivation of dormant Varicella-Zoster Virus (VZV) residing in sensory dorsal root ganglia, manifesting as painful, dermatomal, grouped vesicular clusters.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Initiation of oral antiviral therapy strictly within 72 hours of initial rash appearance to reduce postherpetic neuralgia',
        'Keep vesicular lesions clean, dry, and loosely covered with non-adherent sterile dressings',
        'Strict prevention of contact with pregnant women, newborns, and immunosuppressed individuals until all vesicles crust'
      ],
      prescriptionTopicals: [
        'Calamine lotion or cool aluminium acetate (Burow solution) compresses to soothe weeping blisters',
        'Topical Lidocaine 5% patches applied directly to intact skin for localized neuropathic pain',
        'Topical Capsaicin 0.075% cream only after all vesicles have completely healed for postherpetic neuralgia'
      ],
      systemicTherapies: [
        'Oral Antivirals: Valacyclovir (1000 mg 3 times daily for 7 days), Famciclovir (500 mg 3 times daily), or Acyclovir (800 mg 5 times daily)',
        'Neuropathic pain analgesics: Gabapentin (300-900mg tid) or Pregabalin (75-150mg bid)',
        'Short-course oral NSAIDs or corticosteroids for acute inflammatory neuritis in severe cases'
      ],
      specialistCriteria: 'IMMEDIATE emergency ophthalmology evaluation if vesicles involve the nose tip (Hutchinsons sign) indicating ophthalmic nerve risk.'
    },
    foodRemedies: {
      beneficialFoods: [
        'High L-Lysine to L-Arginine ratio foods: pasture-raised chicken, turkey, wild fish, organic eggs, plain yogurt',
        'Vitamin B-complex rich foods to accelerate myelin and peripheral nerve repair: nutritional yeast, avocados, legumes',
        'Deeply colored berries, leafy greens, and orange sweet potatoes for cellular Vitamin A and C immunity',
        'Hydrating bone broths containing zinc and soothing amino acids'
      ],
      foodsToAvoid: [
        'High-arginine foods that stimulate herpes virus replication: chocolate, peanuts, almonds, walnuts, cashews, gelatin, seeds',
        'Refined white sugars, sodas, and candies that acutely suppress neutrophil phagocytosis and immune response',
        'Excessive alcohol and caffeine that deplete neuroprotective B-vitamins and disrupt sleep',
        'Salty, ultra-processed packaged meals'
      ],
      dietaryHabits: [
        'Supplement with dietary L-lysine (1000-3000mg daily during acute flare) to outcompete viral arginine uptake',
        'Prioritize 8-9 hours of restful sleep in a dark room to allow cellular nervous system regeneration'
      ],
      micronutrientSupport: 'L-Lysine (1000mg tid), Vitamin B12, Benfotiamine (B1), High-dose Vitamin C, and Zinc bisglycinate.'
    }
  },

  'Impetigo': {
    category: 'Superficial Bacterial Pyoderma',
    severity: 'Infectious / Treatable',
    overview: 'Highly contagious superficial bacterial skin infection caused by Staphylococcus aureus or Streptococcus pyogenes, marked by honey-colored crusted erosions.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Gentle soaking of lesions with warm soapy water to gently soften and debride adherent honey-colored crusts',
        'Strict isolation of personal washcloths, towels, pillowcases, and bed linen with hot cycle laundering',
        'Frequent hand hygiene with antibacterial soap or 70% alcohol hand rub; trim fingernails short to prevent autoinoculation'
      ],
      prescriptionTopicals: [
        'Topical Mupirocin 2% ointment applied 3 times daily for 5-7 days',
        'Topical Retapamulin 1% ointment applied twice daily for 5 days',
        'Topical Ozenoxacin 1% cream applied twice daily for 5 days'
      ],
      systemicTherapies: [
        'Oral Antibiotics for bullous impetigo or widespread lesions: Cephalexin (250-500 mg qid) or Amoxicillin-clavulanate',
        'Oral Clindamycin or Trimethoprim-sulfamethoxazole (TMP-SMX) if Methicillin-Resistant S. aureus (MRSA) is suspected'
      ],
      specialistCriteria: 'Physician visit required for prescription antibiotic ointment; seek urgent pediatric review if widespread bullae develop.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Raw organic garlic (crushed to activate allicin) and oregano oil to support internal antibacterial defense',
        'Foods high in Vitamin A (beta-carotene): roasted sweet potatoes, carrots, spinach for rapid epithelial re-epithelialization',
        'Zinc-packed pumpkin seeds, grass-fed beef, and lentils to facilitate wound healing and leukocyte mobilization',
        'Medicinal grade Manuka honey (MGO 400+) applied sparingly topically or consumed for antimicrobial support'
      ],
      foodsToAvoid: [
        'Refined sugars, sweet baked goods, and syrups that impair white blood cell chemotaxis',
        'Dairy products if excessive mucus or systemic inflammatory sluggishness is experienced',
        'Greasy processed fast foods containing pro-inflammatory trans fats'
      ],
      dietaryHabits: [
        'Consume minimum 2 liters of pure filtered water daily to flush bacterial toxins',
        'Incorporate warm bone broths and herbal thyme and chamomile teas'
      ],
      micronutrientSupport: 'Zinc picolinate (25mg), Vitamin C with bioflavonoids, Vitamin A, and Probiotics (separated 2h from oral antibiotics).'
    }
  },

  'Alopecia Areata': {
    category: 'Autoimmune Hair Follicle Attack',
    severity: 'Manageable / Chronic',
    overview: 'Organ-specific autoimmune disorder characterized by T-cell attack on the immune-privileged hair follicle bulb, leading to smooth, well-demarcated patches of non-scarring alopecia.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Intralesional corticosteroid injections (Triamcinolone acetonide 5-10 mg/mL) spaced every 4-6 weeks directly into bare scalp patches',
        'Platelet-Rich Plasma (PRP) scalp therapy as adjuvant regenerative stimulation',
        'Topical contact immunotherapy with Diphenylcyclopropenone (DPCP) for extensive patchy hair loss'
      ],
      prescriptionTopicals: [
        'Ultra-high potency topical corticosteroids (Clobetasol propionate 0.05% foam, lotion, or ointment)',
        'Topical Minoxidil 5% solution or foam applied twice daily to stimulate anagen growth phase',
        'Topical Anthralin (0.5% - 1% short-contact therapy) to induce mild irritant immune diversion'
      ],
      systemicTherapies: [
        'Oral JAK inhibitors: Baricitinib (Olumiant 2-4mg daily) or Ritlecitinib (Litfulo 50mg daily) for severe alopecia areata',
        'Short-course oral pulse corticosteroids to arrest rapidly progressive acute hair shedding'
      ],
      specialistCriteria: 'Early dermatology evaluation for trichoscopic dermoscopy (exclamation-mark hairs, yellow dots) and intralesional injection protocol.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Iron and ferritin-supportive foods: pasture-raised egg yolks, grass-fed meats, dark spinach, black lentils',
        'Biotin and B-complex rich foods: nutritional yeast, avocados, almonds, sunflower seeds',
        'Wild cold-water fish delivering anti-inflammatory omega-3 fats to quiet autoimmune follicular micro-inflammation',
        'Bone broth and marine collagen peptides to supply essential proline, glycine, and lysine keratin building blocks'
      ],
      foodsToAvoid: [
        'Pro-inflammatory refined white flours, gluten, and packaged convenience bakery items',
        'Ultra-pasteurized cow dairy if autoimmune molecular mimicry is suspected',
        'Excessive refined sugars that stimulate systemic inflammatory cytokine cascades',
        'Artificial sweeteners and hydrogenated trans fats'
      ],
      dietaryHabits: [
        'Test serum ferritin, iron saturation, 25-OH Vitamin D, and thyroid function (TSH/T4) panels',
        'Follow an Autoimmune Protocol (AIP) anti-inflammatory diet rich in organic whole plants and clean proteins',
        'Drink 2.5 liters of clean water daily and manage physiological stress via breathwork and mindfulness'
      ],
      micronutrientSupport: 'Biotin (5000 mcg), Iron bisglycinate (if ferritin <50), Vitamin D3 (5000 IU), Zinc, and Marine Collagen Peptides.'
    }
  },

  'Contact Dermatitis': {
    category: 'Allergic / Irritant Dermatosis',
    severity: 'Manageable / Acute Inflammatory',
    overview: 'Acute or subacute cutaneous hypersensitivity and barrier breakdown provoked by direct exposure to exogenous allergens or chemical irritants.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Comprehensive patch testing (thin-layer rapid use epicutaneous test) to identify culprit contactants',
        'Cool wet Domeboro (aluminum acetate) compresses for 15 minutes three times daily to dry weeping vesicles',
        'Barrier repair therapy with high-lipid dimethicone/ceramide formulation'
      ],
      prescriptionTopicals: [
        'High-potency topical corticosteroids (Clobetasol propionate 0.05% or Triamcinolone 0.1%) for 1-2 weeks',
        'Topical calcineurin inhibitors (Tacrolimus 0.1% ointment, Pimecrolimus 1% cream) for facial or intertriginous involvement'
      ],
      systemicTherapies: [
        'Short-taper oral Prednisone (40-60mg tapering over 14-21 days) for extensive (>20% BSA) severe allergic contact dermatitis',
        'Non-sedating daytime antihistamines (Fexofenadine, Cetirizine) and nighttime sedating antihistamines (Hydroxyzine)'
      ],
      specialistCriteria: 'Referral for patch testing if eruption recurs persistently or occupational allergen exposure is suspected.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Quercetin-rich whole foods: red onions, capers, organic apples, and dark buckwheat to inhibit mast cell histamine degranulation',
        'Wild Alaskan salmon and flaxseeds providing anti-inflammatory omega-3 fatty acids (EPA/DHA)',
        'Ginger and turmeric root teas containing curcuminoids to suppress NF-kB inflammatory cascades',
        'Steamed dark leafy greens (bok choy, kale, Swiss chard) providing magnesium and bioflavonoids'
      ],
      foodsToAvoid: [
        'High-histamine and histamine-liberating foods during acute flare: aged cheeses, wine, fermented sausages, canned fish',
        'Nickel-rich foods if nickel allergy is confirmed by patch test (dark chocolate, cashews, soy products)',
        'Refined sugars, artificial food dyes, and sodium benzoate preservatives',
        'Spicy peppers and hot alcoholic beverages that promote peripheral microvascular vasodilation'
      ],
      dietaryHabits: [
        'Maintain a detailed 14-day food and environmental exposure diary alongside flare journaling',
        'Hydrate with minimum 2.5 liters of filtered mineralized water daily to flush metabolic inflammatory byproducts',
        'Consume organic bone broths rich in proline and glycine to accelerate epithelial cell restoration'
      ],
      micronutrientSupport: 'Quercetin with Bromelain (500mg twice daily), Liposomal Vitamin C (1000mg), Zinc carnosine, and Omega-3 EPA/DHA.'
    }
  },

  'Seborrheic Dermatitis': {
    category: 'Sebaceous Inflammatory Dermatosis',
    severity: 'Manageable / Chronic',
    overview: 'Chronic, relapsing inflammatory condition driven by host immunological hyper-reactivity to Malassezia yeast metabolites in sebaceous-rich anatomical regions.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Scalp keratolytic de-scaling with warm mineral oil or coconut oil wraps prior to therapeutic shampooing',
        'Narrowband UVB phototherapy for extensive trunk or generalized sebopsoriasis',
        'Gentle non-stripping facial cleansing routines with syndet soap-free bars'
      ],
      prescriptionTopicals: [
        'Ketoconazole 2% shampoo or Ciclopirox 1% shampoo twice weekly (leave on scalp 5-10 minutes)',
        'Topical Ketoconazole 2% cream applied twice daily to facial erythema for 2-4 weeks',
        'Low-potency topical corticosteroid (Desonide 0.05% or Hydrocortisone 1%) for acute inflammatory flare arrest',
        'Topical calcineurin inhibitors (Pimecrolimus 1% cream) for long-term steroid-sparing facial maintenance'
      ],
      systemicTherapies: [
        'Oral Itraconazole (200mg daily for 7 days) for severe, recalcitrant, or widespread refractory cases',
        'Oral low-dose Isotretinoin under strict dermatologist monitoring for severe sebum hyper-excretion'
      ],
      specialistCriteria: 'Dermatology review if scalp scaling produces significant hair breakage, facial erythema persists past 6 weeks, or psoriatic overlap is suspected.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Antifungal whole foods: raw crushed garlic (allicin), extra virgin coconut oil (caprylic acid), and oregano oil drops',
        'Zinc-rich foods: pumpkin seeds, pasture-raised poultry, and steamed oysters to modulate epidermal sebum production',
        'Fermented unsweetened probiotic kefir and sauerkraut to nurture beneficial intestinal microbiome diversity',
        'Fiber-rich low-glycemic vegetables: broccoli, asparagus, cucumbers, and zucchini'
      ],
      foodsToAvoid: [
        'Refined high-glycemic carbohydrates and bakeries that feed fungal Malassezia yeast proliferation',
        'Beer, brewer’s yeast, baker’s yeast, and fermented malt beverages',
        'Ultra-pasteurized dairy products high in IGF-1 which stimulates sebaceous gland hyper-secretion',
        'Saturated trans-fats and processed seed oils that heighten cutaneous oxidative stress'
      ],
      dietaryHabits: [
        'Adopt an anti-candida, low-glycemic Mediterranean dietary template with zero added sugars',
        'Avoid scalding hot water during facial cleansing; use lukewarm water to prevent reflex sebum overproduction',
        'Consume minimum 2.5 liters of filtered water daily infused with lemon or cucumber'
      ],
      micronutrientSupport: 'Zinc picolinate (30mg daily), Vitamin B-Complex (emphasizing Biotin and B6), Caprylic acid, and Spore-based Probiotics.'
    }
  },

  'Folliculitis': {
    category: 'Infectious Follicular Disorder',
    severity: 'Infectious / Treatable',
    overview: 'Inflammation of cutaneous hair follicles triggered by Staphylococcus aureus bacterial colonization, Malassezia fungal overgrowth, or mechanical razor friction.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Warm moist compresses for 15-20 minutes 3-4 times daily to facilitate spontaneous follicular drainage',
        'Bacterial and fungal culture with antimicrobial sensitivity testing for recurrent pustules',
        'Laser hair reduction (Nd:YAG 1064nm) for chronic refractory pseudofolliculitis barbae'
      ],
      prescriptionTopicals: [
        'Topical Mupirocin 2% ointment applied to follicular pustules three times daily for 7-10 days',
        'Benzoyl peroxide 5%-10% wash or Clindamycin 1% topical solution once or twice daily',
        'Topical Ketoconazole 2% shampoo or cream if fungal Pityrosporum folliculitis is confirmed'
      ],
      systemicTherapies: [
        'Oral Dicloxacillin, Cephalexin, or Doxycycline for extensive or deep-seated staphylococcal furunculosis',
        'Oral Fluconazole (100-200mg daily for 14-21 days) for widespread Malassezia folliculitis'
      ],
      specialistCriteria: 'Dermatology consultation if pustules progress to confluent carbuncles, recurrent MRSA is suspected, or systemic fever arises.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Natural antimicrobial foods: raw crushed garlic, raw Manuka honey, and fresh thyme and rosemary infusions',
        'Cruciferous vegetables (broccoli sprouts, cauliflower, cabbage) supporting hepatic phase-2 detoxification',
        'Antioxidant-dense berries (raspberries, wild blueberries) providing bioflavonoids for capillary integrity',
        'Grass-fed organic meats and pasture-raised eggs supplying complete proteins for tissue repair'
      ],
      foodsToAvoid: [
        'Whey protein powders and high-glycemic dairy products that spike IGF-1 and provoke follicular plugging',
        'Deep-fried fast foods and oxidized industrial vegetable oils (corn, canola, cottonseed)',
        'Refined candies, pastries, and sweetened beverages that impair neutrophil phagocytic function',
        'Excessive alcohol which dehydrates epidermis and compromises host antimicrobial defense'
      ],
      dietaryHabits: [
        'Discontinue sharing razor blades, towels, and workout garments; wash athletic clothing after each wear',
        'Drink 2.5 to 3 liters of filtered water daily to facilitate lymphatic drainage of cellular debris',
        'Shave exclusively in the direction of hair growth using single-blade razors and antibacterial shaving gel'
      ],
      micronutrientSupport: 'Zinc glycinate (30mg daily), Berberine HCl (500mg), Vitamin C (1000mg), and Allicin garlic extract.'
    }
  },

  'Lichen Planus': {
    category: 'Autoimmune Mucocutaneous Dermatosis',
    severity: 'Manageable / Inflammatory',
    overview: 'T-cell-mediated autoimmune dermatosis characterized by polygonal violaceous pruritic papules on the skin and lace-like Wickham striae on mucous membranes.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Skin punch biopsy with direct immunofluorescence (DIF) to confirm lichenoid tissue reaction pattern',
        'Narrowband UVB (NB-UVB) phototherapy administered 2-3 times weekly for generalized cutaneous involvement',
        'Intralesional triamcinolone acetonide (5-10 mg/mL) injections for thick hypertrophic verrucous plaques'
      ],
      prescriptionTopicals: [
        'Superpotent topical corticosteroids (Clobetasol propionate 0.05% ointment) applied under occlusion',
        'Topical Tacrolimus 0.1% ointment applied twice daily, especially for oral mucosal or intertriginous lesions'
      ],
      systemicTherapies: [
        'Short-course oral Prednisone (30-60mg daily tapered over 4-6 weeks) for rapid symptomatic relief of acute generalized disease',
        'Oral Acitretin (25-30mg daily) or Methotrexate for severe, recalcitrant, or hypertrophic lichen planus'
      ],
      specialistCriteria: 'Dermatological biopsy and periodic mucosal screening to evaluate for oral or genital lichen planus.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Anti-inflammatory cold-water wild fish (wild salmon, sardines, black cod) high in EPA/DHA fatty acids',
        'Dark leafy greens (spinach, kale, arugula) providing folate, lutein, and magnesium to quiet autoimmune reactivity',
        'Green tea (matcha) providing epigallocatechin gallate (EGCG) to inhibit T-cell-mediated keratinocyte apoptosis',
        'Bone broth and gelatin delivering glycine and glutamine to support gut mucosal barrier integrity'
      ],
      foodsToAvoid: [
        'Sharp, crunchy, acidic (citrus, vinegar), or spicy foods that irritate and ulcerate sensitive oral mucosa',
        'Gluten and modern wheat hybridized grains that exacerbate intestinal permeability and autoimmune cross-reactivity',
        'Refined seed oils, trans fats, and deep-fried foods high in pro-inflammatory arachidonic acid metabolites',
        'Alcohol and carbonated caffeinated beverages that dehydrate mucous membranes'
      ],
      dietaryHabits: [
        'Follow an Autoimmune Protocol (AIP) anti-inflammatory diet emphasizing whole, unprocessed, nutrient-dense foods',
        'Use soft-bristled non-SLS toothpastes; avoid sodium lauryl sulfate in all personal oral hygiene products',
        'Maintain daily hydration with 2.5 liters of filtered water and herbal marshmallow root or chamomile teas'
      ],
      micronutrientSupport: 'Curcumin phytosome (1000mg daily), Omega-3 Fish Oil (2000mg EPA/DHA), Vitamin D3 with K2, and Zinc l-carnosine.'
    }
  },

  'Actinic Keratosis': {
    category: 'Precancerous Keratinocytic Dysplasia',
    severity: 'Concerning / Precancerous',
    overview: 'Precancerous epidermal lesion induced by chronic ultraviolet radiation. Characterized by gritty, sandpaper-like scaly macules with a recognized risk of malignant transformation into invasive Squamous Cell Carcinoma.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Cryosurgery with liquid nitrogen (10-15 second freeze-thaw cycles)',
        'Photodynamic Therapy (PDT with 5-ALA or MAL) for field cancerization',
        'Curettage and shave biopsy for thick, hyperkeratotic lesions to rule out SCC'
      ],
      prescriptionTopicals: [
        'Topical 5-Fluorouracil (5-FU 5% or 0.5%) cream applied twice daily for 2 to 4 weeks',
        'Topical Imiquimod (5% or 3.75%) cream stimulating local interferon immune response',
        'Topical Tirbanibulin 1% ointment applied daily for 5 consecutive days'
      ],
      systemicTherapies: [
        'Oral Nicotinamide (Vitamin B3 500mg twice daily) to enhance UV-damaged DNA repair'
      ],
      specialistCriteria: 'Annual full-body dermatological skin cancer surveillance exams.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Tomato paste and cooked tomatoes rich in bioavailable lycopene (natural UV photoprotectant)',
        'Carrots, sweet potatoes, and apricots providing beta-carotene and provitamin A carotenoids',
        'Green tea (epigallocatechin-3-gallate) providing powerful protection against UV oxidative stress'
      ],
      foodsToAvoid: [
        'Deep-fried and charred foods containing toxic advanced glycation end-products (AGEs)',
        'Excessive alcohol intake which impairs enzymatic cellular DNA repair mechanisms'
      ],
      dietaryHabits: [
        'Incorporate broad-spectrum SPF 50+ mineral sunscreens into the morning routine 365 days a year',
        'Maintain a carotenoid- and polyphenol-dense whole-food Mediterranean diet'
      ],
      micronutrientSupport: 'Oral Nicotinamide (500mg BID), Polypodium leucotomos extract, Astaxanthin, and Vitamin C/E.'
    }
  },

  'Contact Dermatitis': {
    category: 'Acute/Subacute Cutaneous Hypersensitivity',
    severity: 'Manageable / Acute Inflammatory',
    overview: 'Inflammatory eczematous skin reaction provoked either by direct toxic chemical cellular disruption (irritant) or a delayed Type IV cell-mediated allergic hypersensitivity (e.g., poison ivy urushiol, nickel, fragrances).',
    recommendedTreatments: {
      clinicalProcedures: [
        'Diagnostic patch testing (T.R.U.E. test panel) to definitively identify causative contact allergens',
        'Cool dilute aluminum acetate (Domeboro) or saline compresses for 15-20 minutes'
      ],
      prescriptionTopicals: [
        'High-potency topical corticosteroids (Clobetasol propionate or Triamcinolone 0.1% cream)',
        'Topical Calcineurin Inhibitors (Tacrolimus 0.1% or Pimecrolimus 1%) for thin-skinned facial and eyelid dermatitis'
      ],
      systemicTherapies: [
        'Oral Prednisone taper (40-60mg tapered over 14-21 days) for extensive poison ivy/urushiol reactions'
      ],
      specialistCriteria: 'Referral for patch testing if facial or occupational dermatitis fails to resolve within 3 weeks.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Flaxseeds, chia seeds, and wild cold-water salmon rich in anti-inflammatory alpha-linolenic acid (ALA)',
        'Quercetin-rich red onions, capers, and apples acting as natural mast-cell membrane stabilizers'
      ],
      foodsToAvoid: [
        'Systemic nickel-rich foods (chocolate, canned foods, cashews, soy) in patch-test confirmed nickel allergy',
        'High-histamine aged cheeses, cured sausages, wine, and fermented foods during acute flare-ups'
      ],
      dietaryHabits: [
        'Switch strictly to 100% fragrance-free, dye-free hypoallergenic laundry detergents and cleansers'
      ],
      micronutrientSupport: 'Quercetin with Bromelain (500mg BID), Vitamin C, Omega-3 Fish Oil, and Zinc picolinate.'
    }
  },

  'Seborrheic Dermatitis': {
    category: 'Chronic Superficial Erythematosquamous Dermatosis',
    severity: 'Manageable / Chronic',
    overview: 'Common chronic relapsing dermatitis affecting sebaceous-rich areas (scalp, nasolabial folds, eyebrows, central chest). Driven by Malassezia yeast lipase activity releasing irritating free fatty acids on an altered lipid mantle.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Medicated scalp clarifying treatments and gentle mechanical descaling with mineral oil'
      ],
      prescriptionTopicals: [
        'Topical Ketoconazole 2% shampoo/cream, Ciclopirox 1% shampoo/gel, or Zinc Pyrithione 2%',
        'Low-potency topical corticosteroids (Desonide 0.05% cream) or topical Tacrolimus 0.1% ointment for facial flares'
      ],
      systemicTherapies: [
        'Short-course oral Itraconazole (200mg daily for 7 days) for severe, generalized, treatment-resistant flares'
      ],
      specialistCriteria: 'Dermatology consultation if unresponsive to OTC shampoos or if erythroderma develops.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Foods rich in B-complex vitamins (nutritional yeast, cage-free pasture eggs, sunflower seeds)',
        'Fermented unsweetened coconut kefir and probiotic-rich plain yogurt to foster a diverse microbiome'
      ],
      foodsToAvoid: [
        'Refined baker\'s yeasts, refined white flour products, beer, and high-glycemic sugars',
        'Heavy dairy products high in IGF-1 that overstimulate sebaceous gland lipid production'
      ],
      dietaryHabits: [
        'Adopt daily stress mitigation practices; psychological cortisol surges directly exacerbate seborrhea flares'
      ],
      micronutrientSupport: 'Zinc gluconate (30mg daily), Biotin, Vitamin B6, and standardized Oregano oil.'
    }
  },

  'Folliculitis': {
    category: 'Superficial Pyogenic / Fungal Follicular Infection',
    severity: 'Infectious / Treatable',
    overview: 'Inflammation or pyogenic infection of one or more hair follicles, most commonly triggered by Staphylococcus aureus colonization, Pseudomonas aeruginosa ("hot tub folliculitis"), or Pityrosporum (Malassezia) yeast.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Microbial bacterial culture and sensitivity testing with Gram stain from active pustule aspirate'
      ],
      prescriptionTopicals: [
        'Topical Clindamycin 1% gel/lotion or Mupirocin 2% ointment applied twice daily for 7-10 days',
        'Benzoyl peroxide 5-10% cleansing wash or Chlorhexidine gluconate 4% body wash'
      ],
      systemicTherapies: [
        'Oral Cephalexin (500mg QID for 7-10 days) for extensive staphylococcal folliculitis',
        'Oral Fluconazole (150-200mg weekly for 2-4 weeks) for Malassezia / Pityrosporum folliculitis'
      ],
      specialistCriteria: 'Consult if lesions progress into deep painful furuncles/carbuncles or recurrent outbreaks occur.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Crushed raw garlic (allicin) and raw ginger offering proven broad-spectrum antimicrobial phytonutrients',
        'Fiber-rich prebiotic asparagus, leeks, and Jerusalem artichokes supporting gut-skin immune integrity'
      ],
      foodsToAvoid: [
        'Whey protein powders and high-glycemic milk shakes that spike insulin and follicular sebum plugging'
      ],
      dietaryHabits: [
        'Shower immediately after vigorous sweating with antibacterial wash; avoid rewearing damp workout clothes'
      ],
      micronutrientSupport: 'Zinc picolinate (30mg daily), Vitamin A, Berberine, and Oregano extract.'
    }
  },

  'Warts (Verruca)': {
    category: 'Infectious Viral Cutaneous Proliferation',
    severity: 'Infectious / Benign HPV',
    overview: 'Benign intraepidermal epithelial proliferations caused by Human Papillomavirus (HPV) genotypes (1, 2, 4, 27, 57). Characterized by hyperkeratotic, exophytic papules with pathognomonic thrombosed black capillary dots.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Clinical Cryosurgery (liquid nitrogen spray for 10-20 seconds repeated every 2-3 weeks)',
        'Paring/debridement of hyperkeratotic stratum corneum prior to topical application',
        'Intralesional Candida antigen injection or pulsed-dye laser for stubborn recalcitrant plantar lesions'
      ],
      prescriptionTopicals: [
        'High-potency Salicylic acid (17% to 40% plaster/gel) applied daily under occlusion',
        'Topical Imiquimod 5% cream or topical 5-Fluorouracil (5-FU) applied at bedtime'
      ],
      systemicTherapies: [
        'Oral Cimetidine (high-dose 30-40 mg/kg/day) or oral Zinc sulfate (10 mg/kg/day) for extensive pediatric warts'
      ],
      specialistCriteria: 'Dermatology consultation for facial, periungual, genital, or treatment-resistant plantar warts.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Vitamin C-dense citrus fruits, kiwi, bell peppers, and camu camu to boost cytotoxic lymphocyte activity',
        'Cruciferous vegetables (broccoli, cabbage, Brussels sprouts) containing Indole-3-carbinol (I3C) to inhibit HPV cellular proliferation',
        'Shiitake and Maitake medicinal mushrooms rich in immune-modulating beta-glucans'
      ],
      foodsToAvoid: [
        'Excess refined sugars and sweetened sodas which temporarily suppress neutrophil phagocytosis and immune response'
      ],
      dietaryHabits: [
        'Never pick, chew, or cut warts with nail clippers; sanitize bathroom floors and wear shower flip-flops in public pools'
      ],
      micronutrientSupport: 'Zinc glycinate (30-50mg daily), Vitamin A, Vitamin C with bioflavonoids, and Elderberry extract.'
    }
  },

  'Scabies': {
    category: 'Parasitic Cutaneous Infestation',
    severity: 'Infectious / Contagious Parasitic',
    overview: 'Intensely pruritic, highly contagious parasitic infestation of the epidermis by the microscopic human itch mite Sarcoptes scabiei var. hominis. Manifests with hallmark nocturnal pruritus and serpiginous burrows in interdigital web spaces.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Mineral oil skin scraping and microscopic direct visualization of mites, ova, or fecal pellets (scybala)'
      ],
      prescriptionTopicals: [
        'First-line Permethrin 5% cream: Apply from neck to soles of feet, leave on for 8-14 hours, rinse off, repeat in 7-14 days',
        'Precipitated sulfur 5-10% in petrolatum applied for 3 consecutive nights for infants under 2 months or pregnant women'
      ],
      systemicTherapies: [
        'Oral Ivermectin (200 mcg/kg single oral dose repeated in 7-14 days) for institutional outbreaks or crusted scabies'
      ],
      specialistCriteria: 'Mandatory clinical evaluation for simultaneous diagnosis and treatment of ALL household contacts.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Fresh turmeric with black pepper (curcumin) to quiet intense systemic mast-cell allergic inflammation',
        'Anti-inflammatory herbal chamomile, peppermint, and rooibos teas to soothe nervous system agitation'
      ],
      foodsToAvoid: [
        'Spicy peppers, hot alcoholic beverages, and boiling hot showers which cause reflex cutaneous vasodilation and aggravate nocturnal itching'
      ],
      dietaryHabits: [
        'Hot water machine wash (60°C/140°F) and hot tumble dry all clothing, sheets, and towels used within the last 4 days'
      ],
      micronutrientSupport: 'Oral non-drowsy antihistamines (Cetirizine/Loratadine), Zinc, and soothing topical Calamine lotion.'
    }
  },

  "Athlete's Foot (Tinea Pedis)": {
    category: 'Superficial Dermatophytic Fungal Infection',
    severity: 'Infectious / Treatable Fungal',
    overview: 'Prevalent dermatophyte fungal infection of the feet caused primarily by Trichophyton rubrum. Features interdigital white maceration, painful stinging fissures between toe web spaces, or diffuse moccasin-type scaling.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Direct Potassium Hydroxide (KOH) microscopic mount demonstrating fungal septate branching hyphae'
      ],
      prescriptionTopicals: [
        'Topical Terbinafine 1% cream, Clotrimazole 1%, Ketoconazole 2%, or Ciclopirox 0.77% applied twice daily for 2-4 weeks',
        'Antifungal medicated dusting powders (Tolnaftate or Miconazole) applied inside socks and athletic footwear'
      ],
      systemicTherapies: [
        'Oral Terbinafine (250mg once daily for 2-4 weeks) or Itraconazole (100mg daily) for chronic moccasin-type disease'
      ],
      specialistCriteria: 'Urgent evaluation if secondary bacterial cellulitis (expanding redness, heat, lymphangitis) supervenes.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Crushed fresh garlic (allicin) and extra virgin organic coconut oil (caprylic acid) providing proven natural antifungal properties',
        'Fermented sour pickles, unsweetened water kefir, and kimchi providing beneficial Lactobacillus species'
      ],
      foodsToAvoid: [
        'Sweet pastries, refined candies, and sweetened syrups that feed fungal overgrowth and promote skin dysbiosis'
      ],
      dietaryHabits: [
        'Dry thoroughly between toes after showering; change socks immediately if damp and wear breathable leather or mesh shoes'
      ],
      micronutrientSupport: 'Caprylic acid, Oil of oregano, Grapefruit seed extract, and broad-spectrum Probiotics.'
    }
  },

  'Nail Fungus (Onychomycosis)': {
    category: 'Chronic Onychomycotic Fungal Infection',
    severity: 'Infectious / Chronic Fungal',
    overview: 'Chronic, progressive fungal infection of the nail bed and plate caused by dermatophytes (Trichophyton rubrum). Leads to thick, friable, subungually hyperkeratotic yellow-brown onycholytic nail plates.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Nail clipping Periodic Acid-Schiff (PAS) histopathology or fungal PCR culture before systemic therapy',
        'Mechanical debridement and ultrasonic chemical nail thinning with 40% Urea cream'
      ],
      prescriptionTopicals: [
        'Topical Ciclopirox 8% nail lacquer, Efinaconazole 10% solution, or Tavaborole 5% solution applied daily for 48 weeks'
      ],
      systemicTherapies: [
        'Oral Terbinafine (250mg daily for 12 weeks for toenails, 6 weeks for fingernails) with baseline and mid-treatment liver function monitoring',
        'Oral Itraconazole pulse therapy (200mg BID for 1 week/month for 3 consecutive months)'
      ],
      specialistCriteria: 'Podiatrist or dermatologist consultation, particularly for individuals with diabetes or peripheral neuropathy.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Collagen peptides and bone broth supplying proline, glycine, and hydroxyproline for healthy keratin matrix synthesis',
        'Pumpkin seeds and oysters providing dietary zinc necessary for robust nail plate turnover'
      ],
      foodsToAvoid: [
        'Excess refined carbohydrates and bakery goods that spike blood sugar levels and feed fungal colonization'
      ],
      dietaryHabits: [
        'Trim nails straight across without rounding borders; sanitize clippers with isopropyl alcohol after each use'
      ],
      micronutrientSupport: 'Biotin (5000 mcg daily), MSM (Methylsulfonylmethane), Silica from Horsetail extract, and Zinc.'
    }
  },

  'Cellulitis': {
    category: 'Acute Spreading Bacterial Dermis & Subcutaneous Infection',
    severity: 'Concerning / Acute Bacterial Emergency',
    overview: 'Acute, rapidly advancing bacterial infection of the deep dermis and subcutaneous tissues, most commonly caused by Streptococcus pyogenes or Staphylococcus aureus. Presents with severe warmth, spreading erythema, and tender edema.',
    recommendedTreatments: {
      clinicalProcedures: [
        'Urgent surgical skin marking with indelible ink to monitor whether erythema is advancing or regressing',
        'Bed rest with affected limb elevated significantly above heart level to reduce painful interstitial edema'
      ],
      prescriptionTopicals: [
        'Topicals are NOT effective for deep subcutaneous cellulitis; systemic antimicrobials are strictly required'
      ],
      systemicTherapies: [
        'First-line oral antibiotics for uncomplicated cellulitis: Cephalexin (500mg QID) or Amoxicillin-Clavulanate for 5-10 days',
        'Add Doxycycline or Trimethoprim-Sulfamethoxazole (TMP-SMX) if MRSA is suspected',
        'Intravenous Cefazolin, Ceftriaxone, or Vancomycin for hospitalized patients with systemic toxicity or rapid spread'
      ],
      specialistCriteria: 'EMERGENCY: Immediate emergency medical evaluation required if high fever, chills, bullae, or confusion arise.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Bone broths, pure electrolyte broths, and high-hydration fluids (minimum 3 liters daily) to support renal filtration of bacterial toxins',
        'High-antioxidant blueberries, pomegranate juice, and leafy green vegetables to accelerate tissue repair'
      ],
      foodsToAvoid: [
        'High-sodium cured snacks and processed chips that exacerbate lower extremity edema and tissue swelling'
      ],
      dietaryHabits: [
        'Strictly complete the entire course of prescribed antibiotics even if symptoms rapidly improve within 48 hours'
      ],
      micronutrientSupport: 'High-potency Probiotics (taken 2-3 hours apart from oral antibiotics), Vitamin C, and Zinc.'
    }
  },

  'Chickenpox (Varicella)': {
    category: 'Acute Contagious Systemic Viral Exanthem',
    severity: 'Infectious / Acute Contagious Viral',
    overview: 'Acute, highly contagious primary infection caused by Varicella-Zoster Virus (VZV). Characterized by a generalized pruritic exanthem with lesions in all simultaneous stages of development ("dewdrops on a rose petal").',
    recommendedTreatments: {
      clinicalProcedures: [
        'Strict home isolation until every single vesicle has completely crusted over (typically 5 to 7 days from onset)'
      ],
      prescriptionTopicals: [
        'Calamine lotion applied topically to soothe intensely pruritic eruptions',
        'Cool colloidal oatmeal baths (Aveeno) prepared with lukewarm water 2-3 times daily'
      ],
      systemicTherapies: [
        'Oral Acyclovir (800mg 5 times daily for 5-7 days) or Valacyclovir (1000mg TID) if initiated within 24 hours of rash onset in adolescents/adults',
        'Acetaminophen for fever control — NEVER administer Aspirin due to the life-threatening risk of Reye\'s Syndrome'
      ],
      specialistCriteria: 'Urgent evaluation if shortness of breath, persistent fever, lethargy, confusion, or pregnancy exposure occurs.'
    },
    foodRemedies: {
      beneficialFoods: [
        'Cooling hydration: coconut water, electrolyte ice pops, chilled watermelon, and unsweetened applesauce',
        'Lysine-rich foods (free-range chicken, pasture eggs, wild fish) to help counteract viral arginine replication'
      ],
      foodsToAvoid: [
        'Hot, spicy, salty, or citrus-acidic foods that painfully irritate vesicles erupting inside the oral cavity',
        'Chocolate, peanuts, and gelatin high in L-arginine which fuels herpesvirus replication'
      ],
      dietaryHabits: [
        'Keep fingernails trimmed close and wear clean cotton mitts at night to prevent deep excoriations and scarring'
      ],
      micronutrientSupport: 'L-Lysine (1000-2000mg daily), Vitamin C, Vitamin A, Zinc, and oral non-drowsy antihistamines.'
    }
  }
};

/**
 * Helper to retrieve normalized guidance for any condition string
 */
export const getClinicalGuidance = (diseaseName = '') => {
  if (!diseaseName) return CLINICAL_DISEASE_GUIDANCE['Melanoma'];
  
  // Exact match
  if (CLINICAL_DISEASE_GUIDANCE[diseaseName]) {
    return CLINICAL_DISEASE_GUIDANCE[diseaseName];
  }

  // Substring or fuzzy match
  const lower = diseaseName.toLowerCase();
  for (const [key, data] of Object.entries(CLINICAL_DISEASE_GUIDANCE)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return data;
    }
  }

  // Common aliases
  if (lower.includes('bcc') || lower.includes('basal')) return CLINICAL_DISEASE_GUIDANCE['Basal Cell Carcinoma'];
  if (lower.includes('scc') || lower.includes('squamous')) return CLINICAL_DISEASE_GUIDANCE['Squamous Cell Carcinoma'];
  if (lower.includes('mole') || lower.includes('melanocytic')) return CLINICAL_DISEASE_GUIDANCE['Nevus'];
  if (lower.includes('athlete') || lower.includes('pedis')) return CLINICAL_DISEASE_GUIDANCE["Athlete's Foot (Tinea Pedis)"];
  if (lower.includes('ringworm') || lower.includes('tinea')) return CLINICAL_DISEASE_GUIDANCE['Tinea (Ringworm)'];
  if (lower.includes('hives') || lower.includes('urticaria')) return CLINICAL_DISEASE_GUIDANCE['Urticaria (Hives)'];
  if (lower.includes('shingles') || lower.includes('zoster')) return CLINICAL_DISEASE_GUIDANCE['Shingles (Herpes Zoster)'];
  if (lower.includes('alopecia') || lower.includes('hair')) return CLINICAL_DISEASE_GUIDANCE['Alopecia Areata'];
  if (lower.includes('vascular') || lower.includes('angioma')) return CLINICAL_DISEASE_GUIDANCE['Vascular Lesion'];
  if (lower.includes('keratosis') && lower.includes('actinic')) return CLINICAL_DISEASE_GUIDANCE['Actinic Keratosis'];
  if (lower.includes('keratosis')) return CLINICAL_DISEASE_GUIDANCE['Benign Keratosis'];
  if (lower.includes('contact')) return CLINICAL_DISEASE_GUIDANCE['Contact Dermatitis'];
  if (lower.includes('seborrheic') || lower.includes('dandruff')) return CLINICAL_DISEASE_GUIDANCE['Seborrheic Dermatitis'];
  if (lower.includes('folliculitis')) return CLINICAL_DISEASE_GUIDANCE['Folliculitis'];
  if (lower.includes('lichen')) return CLINICAL_DISEASE_GUIDANCE['Lichen Planus'];
  if (lower.includes('wart') || lower.includes('verruca')) return CLINICAL_DISEASE_GUIDANCE['Warts (Verruca)'];
  if (lower.includes('scabies') || lower.includes('itch mite')) return CLINICAL_DISEASE_GUIDANCE['Scabies'];
  if (lower.includes('nail') || lower.includes('onychomycosis')) return CLINICAL_DISEASE_GUIDANCE['Nail Fungus (Onychomycosis)'];
  if (lower.includes('cellulitis')) return CLINICAL_DISEASE_GUIDANCE['Cellulitis'];
  if (lower.includes('chickenpox') || lower.includes('varicella')) return CLINICAL_DISEASE_GUIDANCE['Chickenpox (Varicella)'];

  // Default fallback
  return CLINICAL_DISEASE_GUIDANCE['Melanoma'];
};

