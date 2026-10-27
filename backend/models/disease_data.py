import json

def get_initial_diseases():
    """
    Returns complete, peer-reviewed educational records for all 22 dermatological conditions,
    including detailed biological, genetic, microbiological, immunological, and environmental causes in humans.
    """
    return [
        {
            "name": "Melanoma",
            "slug": "melanoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / High Risk",
            "description": "Melanoma is the most aggressive form of skin cancer, originating from pigment-producing melanocytes. While accounting for ~1% of skin cancers, it causes over 75% of skin cancer deaths due to rapid vertical invasiveness and hematogenous metastasis if not excised during early horizontal radial growth.",
            "causes_json": json.dumps([
                "Ultraviolet Radiation: Intense episodic UVA/UVB radiation generating reactive oxygen species and direct DNA cyclobutane pyrimidine dimer mutations.",
                "Somatic Driver Oncogene Mutations: Acquired activating mutations in BRAF (predominantly V600E in ~50% of cutaneous melanomas), NRAS (~20%), NF1, and KIT.",
                "Germline Familial Predisposition: Inherited loss-of-function mutations in tumor suppressor genes CDKN2A (p16INK4a) and CDK4.",
                "Childhood Sun Exposure: History of severe, blistering sunburns in childhood and adolescence tripling lifetime relative risk.",
                "Dysplastic Mole Burden: High total mole count (>50 melanocytic nevi) or familial atypical mole syndrome exhibiting genomic instability.",
                "Immunocompromised Status: Impaired T-cell tumor surveillance following organ transplantation, lymphoma, or immunosuppressive therapy."
            ]),
            "symptoms_json": json.dumps([
                "Asymmetry: The two halves of the lesion do not match in outline, contour, or topography.",
                "Border: Irregular, scalloped, jagged, notched, or poorly circumscribed margins.",
                "Color: Striking variegation featuring shades of jet black, deep brown, tan, blue, red, or depigmented white.",
                "Diameter: Frequently exceeds 6 mm (pencil eraser size), though amelanotic or early melanomas can be smaller.",
                "Evolving: Any dynamic change in diameter, elevation, surface texture, onset of persistent pruritus, bleeding, or ulceration."
            ]),
            "risk_factors_json": json.dumps([
                "Fair skin (Fitzpatrick phototypes I and II), red or blond hair, blue eyes, and tendency to burn rather than tan.",
                "History of indoor tanning bed usage, emitting high-intensity UVA radiation.",
                "Personal or first-degree family history of invasive cutaneous melanoma.",
                "Presence of giant congenital melanocytic nevi (>20 cm projected adult size)."
            ]),
            "care_guidance_json": json.dumps([
                "Apply broad-spectrum water-resistant sunscreen (SPF 50+) 15 minutes before UV exposure, reapplying every 2 hours.",
                "Wear UV-protective clothing (UPF 50+), broad-brimmed hats, and wrap-around UV400 sunglasses.",
                "Conduct monthly full-body skin self-examinations utilizing full-length and handheld mirrors to inspect hidden areas.",
                "Schedule annual total cutaneous examinations with a board-certified dermatologist using dermoscopy."
            ]),
            "when_to_see_doctor": "Consult a dermatologist or surgical oncologist immediately upon discovering any pigmented lesion displaying ABCDE warning criteria, a new dark spot in adulthood, or an 'ugly duckling' lesion visibly dissimilar to other moles.",
            "medical_references_json": json.dumps([
                "World Health Organization (WHO) - Global Skin Cancer Statistics & Prevention Guidelines",
                "American Academy of Dermatology (AAD) - Melanoma Clinical Practice & Dermoscopy Guidelines",
                "National Comprehensive Cancer Network (NCCN) - Cutaneous Melanoma Clinical Guidelines"
            ])
        },
        {
            "name": "Basal Cell Carcinoma",
            "slug": "basal-cell-carcinoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / Moderate Risk",
            "description": "Basal Cell Carcinoma (BCC) is the single most common human malignancy worldwide, arising from pluripotential basal cells of the interfollicular epidermis. While BCC has minimal metastatic capability (<0.1%), untreated tumors infiltrate locally into subcutaneous adipose tissue, cartilage, nerve sheaths, and bone, producing severe functional and cosmetic morbidity.",
            "causes_json": json.dumps([
                "Sonic Hedgehog Pathway Aberration: Inactivating mutations in PTCH1 (protein patched homolog 1) tumor suppressor or activating mutations in SMO (Smoothened).",
                "Direct UVB DNA Damage: Signature C->T and CC->TT transition mutations in the TP53 tumor suppressor gene from solar exposure.",
                "Cumulative Solar Radiation: Chronic lifetime cumulative sun exposure, particularly on chronically sun-exposed areas (nose, forehead, ears, neck).",
                "Ionizing Radiation Exposure: History of radiation therapy for childhood malignancies or occupational ionizing radiation.",
                "Arsenic Ingestion: Historical exposure to arsenic in contaminated well water, pesticides, or industrial manufacturing.",
                "Genetic Syndromes: Gorlin-Goltz Syndrome (Nevoid Basal Cell Carcinoma Syndrome) with germline PTCH1 defects."
            ]),
            "symptoms_json": json.dumps([
                "Pearly, translucent or waxy pink papule or nodule, commonly displaying visible branching telangiectasias (tiny blood vessels).",
                "Central ulceration with raised, rolled, rounded borders resembling a crater ('rodent ulcer').",
                "Non-healing friable lesion that bleeds with minor mechanical friction, crusts over, and recurrently ulcerates.",
                "Flat, firm, indurated scar-like yellowish or white plaque with indistinct margins (morpheaform/infiltrative BCC)."
            ]),
            "risk_factors_json": json.dumps([
                "Age older than 50 years with light skin complexion, light eyes, and extensive sun exposure history.",
                "Prior personal diagnosis of basal cell or squamous cell carcinoma.",
                "Chronic medical immunosuppression in renal, cardiac, or liver transplant recipients."
            ]),
            "care_guidance_json": json.dumps([
                "Strict daily photoprotection with broad-spectrum physical block (zinc oxide or titanium dioxide).",
                "Wear wide-brimmed hats and protective clothing during peak UV index hours (10:00 AM to 4:00 PM).",
                "Avoid picking or applying caustic home salves/creams to recurrently bleeding facial nodules."
            ]),
            "when_to_see_doctor": "Arrange clinical dermatological evaluation and diagnostic shave or punch biopsy for any persistent facial pimple, scab, or bump that bleeds, crusts, or fails to resolve completely within 3 to 4 weeks.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Guidelines of Care for the Management of Basal Cell Carcinoma",
                "Skin Cancer Foundation - Basal Cell Carcinoma Pathophysiology and Treatment Modalities",
                "Journal of the National Comprehensive Cancer Network (NCCN) - Basal Cell Skin Cancer Guidelines"
            ])
        },
        {
            "name": "Squamous Cell Carcinoma",
            "slug": "squamous-cell-carcinoma",
            "category": "Malignant Skin Neoplasm",
            "severity": "Concerning / High Risk",
            "description": "Squamous Cell Carcinoma (SCC) is the second most common form of cutaneous malignancy, originating from atypical proliferating keratinocytes of the stratum spinosum. Unlike BCC, cutaneous SCC carries significant potential for perineural invasion, deep dermal infiltration, and regional lymph node metastasis (2-5% in immunocompetent patients, up to 20% in immunosuppressed patients).",
            "causes_json": json.dumps([
                "Cumulative Lifetime Ultraviolet Exposure: Extensive aggregate solar damage in outdoor laborers and sunbathers causing biallelic TP53 inactivation.",
                "Malignant Progression of Precursor Lesions: Evolution of pre-existing untreated Actinic Keratoses (10-20% progression rate over years).",
                "Therapeutic Immunosuppression: Solid organ transplant recipients on calcineurin inhibitors have up to a 65- to 100-fold elevated incidence of aggressive SCC.",
                "Chronic Skin Damage & Scarring: Arising in chronic cutaneous ulcers, burn scars (Marjolin ulcer), chronic venous stasis, or radiation dermatitis.",
                "Human Papillomavirus Infection: High-risk mucosal and periungual HPV genotypes (HPV-16, 18, 31, 33) disrupting retinoblastoma (Rb) tumor suppressor pathways."
            ]),
            "symptoms_json": json.dumps([
                "Persistent, firm, hyperkeratotic erythematous papule, plaque, or nodule with rough sandpaper-like scale.",
                "Cutaneous horn: Firm conical hyperkeratotic projection growing outwards from an indurated, erythematous base.",
                "Deep-seated, tender ulcerated crater with elevated everted edges that bleeds spontaneously.",
                "Pain, localized tenderness, or radiating electric sensations suggestive of perineural nerve invasion."
            ]),
            "risk_factors_json": json.dumps([
                "Advancing age, male sex, Fitzpatrick skin phototypes I-II, and extensive history of outdoor occupation.",
                "Chronic lymphocytic leukemia (CLL) or non-Hodgkin lymphoma.",
                "Long-term systemic PUVA (psoralen plus ultraviolet A) photochemotherapy for severe psoriasis."
            ]),
            "care_guidance_json": json.dumps([
                "Apply daily broad-spectrum SPF 50+ sunscreen, with special attention to sun-exposed ears, bald scalp, and lower lip.",
                "Undergo complete skin surveillance every 3 to 6 months if previously treated for cutaneous SCC or if immunosuppressed.",
                "Never scratch, pull off, or file down emerging cutaneous horns or keratotic facial nodules."
            ]),
            "when_to_see_doctor": "Promptly consult a dermatologist for dermatoscopic assessment and biopsy of any rapidly enlarging, tender, bleeding, or hyperkeratotic bump on sun-exposed skin, scalp, ears, or lips.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Management of Cutaneous Squamous Cell Carcinoma",
                "European Dermatology Forum (EDF) - Guidelines for Cutaneous Squamous Cell Carcinoma",
                "NCCN Clinical Practice Guidelines in Oncology: Squamous Cell Skin Cancer"
            ])
        },
        {
            "name": "Actinic Keratosis",
            "slug": "actinic-keratosis",
            "category": "Precancerous Epidermal Lesion",
            "severity": "Concerning / Precancerous",
            "description": "Actinic Keratosis (AK), also known as solar keratosis, is a common intraepidermal neoplasm composed of atypical, dysplastic keratinocytes restricted to the lower portions of the epidermis. AKs are considered pre-malignant lesions with recognized potential to transform into invasive Squamous Cell Carcinoma if left untreated.",
            "causes_json": json.dumps([
                "UVB Radiation-Induced DNA Damage: Sunlight-induced cyclobutane pyrimidine dimers causing TP53 tumor suppressor gene mutations in basal keratinocytes.",
                "Cumulative Solar Lifetime Exposure: Aggregate outdoor exposure exceeding the skin's biological DNA repair threshold.",
                "Epidermal Photoaging: Chronic degradation of dermal elastic fibers (solar elastosis) and loss of cutaneous immune surveillance.",
                "Cutaneous Genetic Susceptibility: Fitzpatrick skin phototypes I and II with low eumelanin and high pheomelanin ratio providing minimal natural UV filtration."
            ]),
            "symptoms_json": json.dumps([
                "Rough, gritty, sandpaper-like texture that is often felt on palpation before it is visually noticeable.",
                "Dry, scaly, adherent pink, red, or yellowish crust overlying a mildly erythematous patch.",
                "Mild stinging, tenderness, or pricking sensation when touched or exposed to sunlight.",
                "Typical distribution: Forehead, balding scalp, tops of ears, nose, forearms, and dorsal hands."
            ]),
            "risk_factors_json": json.dumps([
                "Age >40 years with light hair, blue/green eyes, and heavy past solar exposure.",
                "Living in geographical regions with high ambient ultraviolet index (e.g., Australia, Southern United States).",
                "Immunosuppression following chemotherapy or solid organ transplantation."
            ]),
            "care_guidance_json": json.dumps([
                "Rigorous daily UV protection with broad-spectrum physical mineral sunscreen.",
                "Wear wide-brimmed protective hats during all outdoor leisure and work activities.",
                "Dermatological field therapy (e.g., topical 5-Fluorouracil, Imiquimod, or Photodynamic Therapy PDT) to eradicate subclinical lesions."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if an actinic keratosis becomes markedly thickened, tender, inflamed, bleeds easily, or fails to resolve with liquid nitrogen cryotherapy.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Actinic Keratosis Diagnosis & Field Cancerization",
                "British Association of Dermatologists (BAD) - Guidelines for the Care of Patients with Actinic Keratoses"
            ])
        },
        {
            "name": "Melanocytic Nevus",
            "slug": "nevus",
            "category": "Benign Melanocytic Neoplasm",
            "severity": "Benign / Low Risk",
            "description": "A Melanocytic Nevus (commonly referred to as a mole) is a benign, localized proliferation of melanocytes (nevus cells). Nevi may be congenital or acquired throughout life, and can be junctional (confined to dermo-epidermal junction), compound (involving both epidermis and dermis), or intradermal (confined to the dermis).",
            "causes_json": json.dumps([
                "Benign Clonal Proliferation: Controlled proliferation of melanocytes followed by rapid, permanent oncogene-induced cellular senescence (OIS).",
                "Somatic BRAF V600E Mutations: Up to 80% of acquired nevi harbor somatic BRAF mutations that trigger initial clonal proliferation before p16 senescence arrest.",
                "Polygenic Heritability: Strong genetic regulation governing total mole count, typical morphology, and anatomical distribution across family lineages.",
                "Early Sun Exposure: Periodic intense childhood sun exposure activating epidermal melanocyte clustering."
            ]),
            "symptoms_json": json.dumps([
                "Symmetric round or oval shape with well-defined, smooth, regular margins.",
                "Uniform coloration: Monochromatic tan, medium brown, or dark brown hue throughout.",
                "Small diameter: Typically less than 6 mm (smaller than a pencil eraser).",
                "Stable morphology: Remains stable in size, shape, and pigment distribution over months and years."
            ]),
            "risk_factors_json": json.dumps([
                "Very high total nevus count (>50-100 total moles) confers a statistically higher statistical risk for melanoma elsewhere on the skin.",
                "Intermittent recreational sun exposure and childhood history of severe sunburns.",
                "Hormonal surges during puberty or pregnancy causing mild generalized nevus darkening."
            ]),
            "care_guidance_json": json.dumps([
                "Perform monthly skin self-checks tracking moles using the ABCDE rubric.",
                "Photographic baseline documentation (mole mapping) for individuals with high mole counts.",
                "Apply daily broad-spectrum SPF 30+ sunscreen on all exposed nevus-bearing skin."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if a mole develops asymmetry, scalloped borders, multiple colors (black, blue, red), rapid enlargement, spontaneous bleeding, or persistent itching.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Moles: Signs, Types and Treatment Overview",
                "International Dermoscopy Society (IDS) - Dermoscopic Criteria for Melanocytic Nevi"
            ])
        },
        {
            "name": "Benign Keratosis",
            "slug": "benign-keratosis",
            "category": "Benign Epidermal Tumor",
            "severity": "Benign / Low Risk",
            "description": "Seborrheic Keratosis is one of the most common non-cancerous skin tumors in aging adults. Arising from mature keratinocytes, these lesions present as sharply demarcated, verrucous or waxy, 'stuck-on' papules and plaques ranging from flesh-colored to deep black. They harbor zero malignant potential.",
            "causes_json": json.dumps([
                "Mature Keratinocyte Proliferation: Benign clonal proliferation of epidermal keratinocytes without cellular atypia.",
                "Activating Oncogene Mutations: High prevalence of somatic activating mutations in FGFR3 (fibroblast growth factor receptor 3) and PIK3CA.",
                "Age-Dependent Cutaneous Accumulation: Intrinsic skin senescence and reduced apoptotic clearance in individuals >50 years.",
                "Genetic Predisposition: Autosomal dominant familial inheritance pattern in patients with numerous eruptive lesions."
            ]),
            "symptoms_json": json.dumps([
                "Distinct 'stuck-on' appearance as though a drop of warm candle wax or dried raisin was adhered to the skin surface.",
                "Surface texture ranges from smooth and velvety in early lesions to dull, dry, verrucous, crusted, and crumbly in mature lesions.",
                "Color variability: Ranges from pale yellow and tan to dark brown and coal black.",
                "Horn pseudocysts: Small microscopic keratin plugs visible on dermoscopy across the lesion surface."
            ]),
            "risk_factors_json": json.dumps([
                "Advancing chronological age (>50 years).",
                "Genetic family history of extensive seborrheic keratoses.",
                "Sun-exposed anatomical sites (face, neck, upper chest, back)."
            ]),
            "care_guidance_json": json.dumps([
                "Reassurance: Lesions are completely benign and do not require removal unless mechanically irritated by clothing, seatbelts, or jewelry.",
                "Avoid scratching, cutting, or picking at lesions to prevent secondary bacterial infection.",
                "If removal is desired for cosmetic or comfort reasons, dermatologists can perform cryotherapy, curettage, or shave excision."
            ]),
            "when_to_see_doctor": "Seek clinical evaluation if a lesion rapidly darkens, develops asymmetric borders, bleeds unexpectedly, or if dozens of new lesions erupt suddenly (Sign of Leser-Trélat, which may indicate an internal malignancy).",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Seborrheic Keratoses Clinical Characteristics",
                "Mayo Clinic - Seborrheic Keratosis Diagnosis and Management Protocols"
            ])
        },
        {
            "name": "Dermatofibroma",
            "slug": "dermatofibroma",
            "category": "Benign Dermal Neoplasm",
            "severity": "Benign / Low Risk",
            "description": "Dermatofibroma (benign fibrous histiocytoma) is a common indolent dermal mesenchymal growth composed of a mixture of fibroblasts, myofibroblasts, and histiocytes. It characteristically presents as a firm, solitary nodule, most often on the lower extremities of young to middle-aged adults.",
            "causes_json": json.dumps([
                "Reactive Dermal Reparative Process: Considered an aberrant, prolonged fibrohistiocytic inflammatory response to minor trauma.",
                "Cutaneous Micro-Trauma: Frequently triggered by arthropod/mosquito bites, accidental razor nicks, rose thorn punctures, or ruptured folliculitis.",
                "Cytokine Upregulation: Localized hyper-expression of Transforming Growth Factor-beta (TGF-beta) promoting excessive focal collagen synthesis.",
                "Clonal Proliferation: Some subsets exhibit clonal cytogenetic rearrangements involving PRKCD and other protein kinase genes."
            ]),
            "symptoms_json": json.dumps([
                "Firm, hard button-like or pea-sized dermal nodule attached directly to the overlying skin.",
                "Pathognomonic 'Fitzpatrick Pinch Sign' (Dimple Sign): Lateral compression between thumb and forefinger causes the nodule to dimple inward below skin level.",
                "Color: Dull pink, tan, dusky red, or light brown, frequently surrounded by a delicate halo of peripheral hyperpigmentation.",
                "Usually completely asymptomatic, but may be mildly pruritic or tender upon direct external pressure."
            ]),
            "risk_factors_json": json.dumps([
                "Female gender (twice as common in women as in men).",
                "Age between 20 and 45 years.",
                "Predilection for lower extremities (shins, calves) and arms."
            ]),
            "care_guidance_json": json.dumps([
                "Reassurance: Lesions are non-cancerous and typically persist indefinitely without complication.",
                "Take care when shaving over lower legs to avoid nicking the firm raised nodule.",
                "Surgical excision requires cutting deep into the subcutaneous fat and leaves a surgical scar larger than the original bump."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if a presumed dermatofibroma changes rapidly, grows larger than 1.5 cm, ulcerates, or if multiple eruptive dermatofibromas appear simultaneously (which can accompany lupus or HIV).",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Dermatofibroma Diagnosis & Dimple Sign",
                "British Journal of Dermatology - Clinical and Dermoscopic Spectrum of Dermatofibromas"
            ])
        },
        {
            "name": "Vascular Lesion",
            "slug": "vascular-lesion",
            "category": "Benign Vascular Proliferation",
            "severity": "Benign / Low Risk",
            "description": "Cutaneous vascular lesions encompass a diverse spectrum of benign endothelial proliferations and microvascular ectasias, most notably Cherry Angiomas (Campbell de Morgan spots), Pyogenic Granulomas, and infantile Hemangiomas. They are characterized by dilated superficial capillaries and venules.",
            "causes_json": json.dumps([
                "Capillary Endothelial Ectasia: Dilation and proliferation of mature microvascular post-capillary venules in the superficial papillary dermis.",
                "Angiogenic Factor Overexpression: Localized upregulation of Vascular Endothelial Growth Factor (VEGF) and basic Fibroblast Growth Factor (bFGF).",
                "Age-Related Microvascular Senescence: Progressive weakening of capillary wall support structures and pericytes with advancing age.",
                "Hormonal Influences: Pregnancy and estrogen elevation can trigger eruptive cherry angiomas or pyogenic granulomas.",
                "Somatic Genetic Mutations: Clonal activating mutations in GNAQ and GNA11 genes in specific vascular malformations."
            ]),
            "symptoms_json": json.dumps([
                "Bright cherry-red, purple, or violaceous dome-shaped papule or small macule ranging from 1 to 5 mm.",
                "Blanching response: Partial or complete blanching under diascopy (pressure applied with a glass slide).",
                "Smooth, shiny surface that may occasionally bleed briskly following minor friction or scratching.",
                "Predilection for the trunk, chest, abdomen, shoulders, and proximal extremities."
            ]),
            "risk_factors_json": json.dumps([
                "Age >30 years, with prevalence approaching 75% in individuals over 70 years old.",
                "Genetic family predisposition.",
                "Pregnancy, liver cirrhosis, or exposure to certain industrial chemicals (bromides)."
            ]),
            "care_guidance_json": json.dumps([
                "Reassurance: Cherry angiomas are entirely benign and do not possess malignant potential.",
                "Avoid scratching, piercing, or picking with needles, which can induce profuse venous bleeding.",
                "Elective cosmetic removal can be performed safely via pulsed-dye laser (PDL), electrodesiccation, or cryotherapy."
            ]),
            "when_to_see_doctor": "Consult a physician if a red lesion bleeds repeatedly, grows rapidly over days (raising suspicion for pyogenic granuloma or amelanotic melanoma), or turns jet black (thrombosed hemangioma).",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Vascular Skin Lesions and Cherry Angiomas",
                "Journal of the American Academy of Dermatology - Clinical Characteristics of Cutaneous Angiomas"
            ])
        },
        {
            "name": "Eczema",
            "slug": "eczema",
            "category": "Chronic Inflammatory Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Atopic Dermatitis (Eczema) is a chronic, relapsing, highly pruritic inflammatory dermatosis characterized by immune dysregulation, epidermal skin barrier disruption, and persistent xerosis. It frequently forms part of the 'atopic triad' alongside asthma and allergic rhinitis.",
            "causes_json": json.dumps([
                "Skin Barrier Genetic Defects: Loss-of-function mutations in the Filaggrin (*FLG*) gene causing structural breakdown of the stratum corneum and depletion of natural moisturizing factors.",
                "Elevated Transepidermal Water Loss: Disruption of epidermal intercellular lipid lamellae (ceramides, free fatty acids) leading to profound dry skin.",
                "Th2 Immune Skewing: Hyperactive T-helper 2 immune signaling driving elevated transcription of interleukins IL-4, IL-13, and IL-31 (the primary neuro-immune itch mediator).",
                "Microbiome Dysbiosis: Overgrowth and colonization by *Staphylococcus aureus* (>90% of eczema flares) producing superantigens and biofilm that worsen inflammation.",
                "Environmental Triggers: Synthetic surfactants, harsh soaps, chlorinated pools, wool clothing, dry winter air, pet dander, and psychological stress."
            ]),
            "symptoms_json": json.dumps([
                "Intense, debilitating pruritus (the 'itch that rashes') that severely disrupts sleep quality.",
                "Erythematous, ill-defined edematous patches and plaques with microvesiculation and serous exudation ('weeping').",
                "Lichenification: Accentuated skin markings, leathery thickening, and hyperpigmentation from chronic vigorous scratching.",
                "Flexural predilection: Classically involves antecubital and popliteal fossae, neck, wrists, ankles, and periorbital skin."
            ]),
            "risk_factors_json": json.dumps([
                "Family history of atopic diseases (eczema, asthma, seasonal allergies).",
                "Living in urban environments with low humidity and high air pollution.",
                "Frequent hot water bathing and exposure to alkaline detergents."
            ]),
            "care_guidance_json": json.dumps([
                "The 'Soak and Seal' method: Bathe in lukewarm water for 10 minutes, pat skin lightly, and apply thick ceramide-rich ointment within 3 minutes.",
                "Use fragrance-free, soap-free synthetic detergent (syndet) cleansers with an acidic pH (~5.5).",
                "Topical anti-inflammatory medications: Low-to-mid potency topical corticosteroids or steroid-sparing topical calcineurin inhibitors (Tacrolimus).",
                "Wear breathable 100% loose-fitting cotton clothing and keep fingernails trimmed short."
            ]),
            "when_to_see_doctor": "Consult a healthcare provider if eczema patches develop honey-colored crusts (secondary impetigo), painful grouped punched-out blisters (eczema herpeticum, a medical emergency), or if itching prevents sleep.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Guidelines of Care for the Management of Atopic Dermatitis",
                "National Eczema Association (NEA) - Comprehensive Clinical Treatment Standards",
                "New England Journal of Medicine - Pathogenesis and Targeted Biologics in Atopic Dermatitis"
            ])
        },
        {
            "name": "Psoriasis",
            "slug": "psoriasis",
            "category": "Autoimmune Inflammatory Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Psoriasis is a chronic, immune-mediated, systemic inflammatory disease driven by an overactive IL-23/IL-17 cytokine axis that triggers accelerated keratinocyte proliferation. It classically presents as sharply demarcated, erythematous plaques covered by silvery-white micaceous scales.",
            "causes_json": json.dumps([
                "IL-23 / Th17 Autoimmune Axis: Dendritic cells secrete IL-23, activating Th17 lymphocytes to release massive quantities of IL-17A, IL-17F, and IL-22.",
                "Accelerated Keratinocyte Transit: Inflammatory cytokines reduce normal epidermal differentiation transit time from 28-30 days down to just 3 to 5 days.",
                "Genetic Susceptibility: Strong association with human leukocyte antigen HLA-Cw6 (the *PSORS1* locus on chromosome 6p21).",
                "Infectious & Drug Triggers: Streptococcal pharyngitis (triggers acute guttate psoriasis), sudden withdrawal of systemic steroids, lithium, and beta-blockers.",
                "Koebner Phenomenon: Development of new psoriatic plaques along lines of physical skin trauma, scratching, surgery, or sunburns.",
                "Systemic Metabolic Inflammation: Obesity, smoking, and chronic psychological stress drive systemic pro-inflammatory cytokine release."
            ]),
            "symptoms_json": json.dumps([
                "Sharply circumscribed, elevated erythematous plaques covered by coarse, layered silvery-white scales.",
                "Extensor distribution: Classically affects elbows, knees, lumbosacral region, scalp, and umbilicus.",
                "Auspitz Sign: Pinpoint bleeding points appear when overlying micaceous scale is gently detached.",
                "Psoriatic nail changes: Subungual hyperkeratosis, pitting ('thimble nails'), and 'oil-drop' reddish discoloration.",
                "Psoriatic Arthritis: Concurrent inflammatory joint stiffness, dactylitis ('sausage digits'), and enthesitis in ~30% of patients."
            ]),
            "risk_factors_json": json.dumps([
                "First-degree family history of plaque psoriasis.",
                "High systemic BMI, metabolic syndrome, and cigarette smoking.",
                "Streptococcal upper respiratory infections in pediatric and young adult populations."
            ]),
            "care_guidance_json": json.dumps([
                "Topical therapy: High-potency topical corticosteroids combined with topical Vitamin D analogues (Calcipotriene).",
                "Keratolytic agents: Salicylic acid 3-6% or coal tar preparations to soften and remove dense adherent scales.",
                "Phototherapy: Narrowband UVB (NB-UVB) 3 times weekly.",
                "Systemic biologics: Targeted monoclonal antibodies (anti-IL-17, anti-IL-23, anti-TNF) for moderate-to-severe disease."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if plaques cover large body surface areas, if joint pain/swelling develops in the morning, or if generalized pustules/erythroderma emerge (medical emergencies).",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - National Psoriasis Foundation Clinical Guidelines",
                "Journal of the European Academy of Dermatology and Venereology (JEADV) - Psoriasis Consensus",
                "The Lancet - Psoriasis Pathogenesis, Clinical Subtypes, and Targeted Immunotherapies"
            ])
        },
        {
            "name": "Acne",
            "slug": "acne",
            "category": "Pilosebaceous Follicular Disorder",
            "severity": "Benign / Treatable",
            "description": "Acne Vulgaris is a chronic inflammatory disorder of the pilosebaceous unit affecting more than 85% of adolescents and young adults. It is characterized by non-inflammatory comedones (blackheads and whiteheads) and inflammatory papules, pustules, nodules, and cysts.",
            "causes_json": json.dumps([
                "Androgen-Driven Seborrhea: Circulating and local dihydrotestosterone (DHT) hyper-stimulates sebaceous gland proliferation and excessive sebum output.",
                "Follicular Hyperkeratinization: Dysregulated desquamation of follicular infundibular corneocytes causes retention hyperkeratosis (microcomedo obstruction).",
                "Cutibacterium acnes Colonization: Proliferation of anaerobic *C. acnes* (phylotypes IA1) inside sebum-rich occluded follicles with biofilm formation.",
                "Innate Immune Cascade: Bacterial lipase enzymes break triglycerides into free fatty acids, triggering Toll-like receptor 2 (TLR-2) and NLRP3 inflammasome activation.",
                "High-Glycemic & Dairy Diet: Elevated insulin and Insulin-like Growth Factor 1 (IGF-1) activating the mTORC1 pathway, amplifying lipogenesis and follicular occlusion."
            ]),
            "symptoms_json": json.dumps([
                "Open comedones ('blackheads'): Dilated follicular orifices containing oxidized melanin and compacted keratin lipids.",
                "Closed comedones ('whiteheads'): Small, flesh-colored dome papules without a visible follicular opening.",
                "Inflammatory papules and pustules: Tender red elevations topped with purulent yellow exudate.",
                "Deep nodules and pseudocysts: Painful, fluctuant subcutaneous lesions prone to healing with atrophic (ice-pick, boxcar) or hypertrophic scarring."
            ]),
            "risk_factors_json": json.dumps([
                "Adolescence and puberty, though adult female acne is increasingly prevalent due to hormonal fluctuations.",
                "Polycystic Ovary Syndrome (PCOS) presenting with hirsutism, irregular menses, and androgen excess.",
                "Use of comedogenic cosmetics, heavy occlusive hair pomades, and anabolic steroids."
            ]),
            "care_guidance_json": json.dumps([
                "Topical retinoids (Adapalene, Tretinoin): First-line therapy to normalize follicular desquamation and prevent new microcomedones.",
                "Benzoyl Peroxide 2.5-5%: Powerful bactericidal agent that generates free oxygen radicals without inducing bacterial resistance.",
                "Topical clindamycin in fixed combination with benzoyl peroxide, or oral doxycycline for inflammatory papulopustular acne.",
                "Oral Isotretinoin (13-cis-retinoic acid): The definitive disease-modifying treatment for severe, recalcitrant, or nodulocystic scarring acne."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if over-the-counter benzoyl peroxide and adapalene fail after 8 weeks, if painful deep nodules are present, or if lesions begin leaving permanent physical scars or hyperpigmentation.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Guidelines of Care for the Management of Acne Vulgaris",
                "European Academy of Dermatology and Venereology (EADV) - European Evidence-based Guidelines for Acne"
            ])
        },
        {
            "name": "Rosacea",
            "slug": "rosacea",
            "category": "Neurovascular & Inflammatory Facial Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Rosacea is a chronic inflammatory and neurovascular dermatosis primarily involving the central face (convexities of cheeks, nose, chin, and forehead). It is characterized by recurrent flushing, non-transient erythema, inflammatory papules, pustules, telangiectasias, and potentially phymatous tissue hypertrophy.",
            "causes_json": json.dumps([
                "Neurovascular Dysregulation: Heightened density and hyper-reactivity of transient receptor potential (TRPV1, TRPA1) ion channels on facial cutaneous sensory nerves.",
                "Abnormal Innate Immunity: Hyper-expression of epidermal kallikrein-5 serine protease cleaving cathelicidin into pro-inflammatory LL-37 peptide fragments.",
                "Demodex Mite Hyper-Colonization: Excessive density of follicular *Demodex folliculorum* mites carrying endosymbiotic *Bacillus oleronius* bacteria that trigger delayed-type hypersensitivity.",
                "Vascular Hyper-Permeability: Repeated episodes of thermal and chemical facial flushing causing permanent capillary ectasia and post-inflammatory dermal edema.",
                "Vasodilation Triggers: Ultraviolet radiation, hot thermal beverages, capsicum-spicy foods, alcohol (especially red wine), and intense emotional distress."
            ]),
            "symptoms_json": json.dumps([
                "Persistent non-transient central facial erythema resembling an exaggerated sunburn across nose and cheeks.",
                "Visible branching telangiectatic blood vessels across the nasal alae and malar eminences.",
                "Dome-shaped inflammatory erythematous papules and tiny pustules (distinguished from acne by the absence of comedones).",
                "Ocular rosacea: Gritty foreign-body sensation, conjunctival injection, blepharitis, and styes in over 50% of patients.",
                "Rhinophyma: Progressive sebaceous hyperplasia and fibrosis of the nasal soft tissues, almost exclusively in males."
            ]),
            "risk_factors_json": json.dumps([
                "Fair skin (Fitzpatrick types I and II), Celtic, or Northern European ancestry ('Curse of the Celts').",
                "Age between 30 and 60 years, with higher prevalence in females (though rhinophyma predominates in men).",
                "Chronic sun damage and compromised stratum corneum barrier."
            ]),
            "care_guidance_json": json.dumps([
                "Strict trigger avoidance: Keep a daily journal tracking spicy foods, alcohol, hot showers, and sun exposure.",
                "Topical Ivermectin 1% cream: Eliminates Demodex mite density and provides strong anti-inflammatory activity.",
                "Topical Azelaic Acid 15% gel or Metronidazole 0.75%: Reduces inflammatory papules and inhibits cathelicidin cleavage.",
                "Low-dose anti-inflammatory Doxycycline (40 mg sub-antimicrobial modified-release) for systemic flare suppression.",
                "Pulsed-dye laser (PDL) or Intense Pulsed Light (IPL) for permanent elimination of disfiguring telangiectasias."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if eye irritation, grittiness, or photophobia emerges (ocular rosacea can cause corneal ulceration), or if facial redness fails to respond to gentle barrier creams.",
            "medical_references_json": json.dumps([
                "National Rosacea Society (NRS) - Standard Classification & Diagnostic Criteria of Rosacea",
                "American Academy of Dermatology (AAD) - Management Options for Patients with Rosacea"
            ])
        },
        {
            "name": "Vitiligo",
            "slug": "vitiligo",
            "category": "Autoimmune Depigmenting Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Vitiligo is an acquired, chronic autoimmune disorder characterized by progressive destruction of epidermal melanocytes, resulting in sharply circumscribed, porcelain-white depigmented macules and patches across the skin and mucous membranes.",
            "causes_json": json.dumps([
                "Cytotoxic Autoimmune Destruction: Autoreactive CD8+ cytotoxic T lymphocytes target and lyse functional melanocytes along the basal epidermis.",
                "IFN-Gamma / CXCL10 Signaling Axis: Pro-inflammatory interferon-gamma secretion drives robust CXCL9 and CXCL10 chemokine production, recruiting additional autoreactive T cells.",
                "Melanocyte Intrinsic Oxidative Stress: Accumulation of intracellular reactive oxygen species (ROS) and defective catalase/Nrf2 antioxidant defenses triggering melanocyte detachment (melanorrhagy).",
                "Polygenic Genetic Susceptibility: More than 50 susceptibility loci identified, heavily concentrated in human leukocyte antigen (HLA-A2, HLA-DR4) and immune-regulatory genes (*PTPN22*, *NLRP1*).",
                "Koebner Isomorphic Phenomenon: Cutaneous mechanical friction (waistbands, watch straps, shoe friction) precipitating localized depigmentation."
            ]),
            "symptoms_json": json.dumps([
                "Completely depigmented, chalk-white or porcelain-white macules and patches with sharp, convex margins.",
                "Poliosis: Premature whitening or depigmentation of eyelashes, eyebrows, beard, or scalp hair within affected patches.",
                "Non-segmental (generalized) vitiligo: Symmetric distribution classically affecting acrofacial sites (fingertips, toes, perioral, periocular) and extensor surfaces.",
                "Absence of scaling, erythema, or structural cutaneous atrophy (skin texture remains entirely smooth and normal)."
            ]),
            "risk_factors_json": json.dumps([
                "Personal or family history of comorbid autoimmune disorders (Hashimoto thyroiditis, Graves disease, Type 1 Diabetes, Alopecia Areata).",
                "Repeated mechanical friction or occupational chemical exposure to monobenzyl ether of hydroquinone.",
                "Severe emotional stress or systemic illness triggering initial active flare."
            ]),
            "care_guidance_json": json.dumps([
                "Topical JAK Inhibitors (Ruxolitinib 1.5% cream): Reverses IFN-gamma signaling and facilitates melanocyte repigmentation.",
                "Narrowband UVB (NB-UVB) phototherapy: Stimulates dormant melanocyte stem cells residing inside hair follicle sheaths.",
                "Potent topical corticosteroids (e.g., Clobetasol) or topical calcineurin inhibitors for localized facial involvement.",
                "Strict daily broad-spectrum SPF 50+ sunscreen application to prevent sunburn in depigmented zones and reduce contrast."
            ]),
            "when_to_see_doctor": "Consult a dermatologist early when white spots first emerge. Rapidly progressive vitiligo responds significantly better to prompt topical and phototherapy stabilization than longstanding depigmented patches.",
            "medical_references_json": json.dumps([
                "Vitiligo Global Issues Consensus Conference (VGICC) - Classification and Disease Staging",
                "American Academy of Dermatology (AAD) - Vitiligo Assessment, Biologics & Phototherapy Guidelines"
            ])
        },
        {
            "name": "Tinea (Ringworm)",
            "slug": "tinea-ringworm",
            "category": "Superficial Dermatophyte Fungal Infection",
            "severity": "Infectious / Treatable",
            "description": "Tinea (Dermatophytosis) is a superficial fungal infection of keratinized tissues (stratum corneum, hair, nails) caused by specialized filamentous fungi known as dermatophytes. Clinically known as Tinea Corporis (body ringworm), Tinea Pedis (athlete's foot), Tinea Cruris (jock itch), or Tinea Capitis (scalp).",
            "causes_json": json.dumps([
                "Dermatophyte Fungal Inoculation: Pathogenic filamentous fungi of the genera *Trichophyton* (most commonly *Trichophyton rubrum* and *Trichophyton mentagrophytes*), *Microsporum*, or *Epidermophyton*.",
                "Keratinase Enzyme Secretion: Fungal hyphae synthesize specialized alkaline serine and metallo-proteases (keratinases) that enzymatically digest keratin.",
                "Direct & Fomite Transmission: Spread via direct skin-to-skin contact with infected humans (anthropophilic), animals/pets (zoophilic *Microsporum canis*), or contaminated fomites (gym mats, towels, locker room floors).",
                "Warm & Moisture Microenvironment: Occlusive footwear, excessive sweating (hyperhidrosis), and skin fold friction allowing fungal spores to germinate and colonize the stratum corneum."
            ]),
            "symptoms_json": json.dumps([
                "Annular (ring-shaped), sharply circumscribed erythematous plaque with central clearing ('ring' pattern).",
                "Active, elevated, scaly, advancing border that may feature tiny vesicles or pustules.",
                "Moderate to severe cutaneous pruritus (itching) and localized burning sensation.",
                "Macerated, peeling, white fissured skin between the toes in Tinea Pedis."
            ]),
            "risk_factors_json": json.dumps([
                "Athletic participation in contact sports (wrestling - Tinea Corporis Gladitorum).",
                "Using communal gym showers and pool locker rooms without protective footwear.",
                "Diabetes mellitus, obesity, peripheral vascular disease, and impaired cell-mediated immunity."
            ]),
            "care_guidance_json": json.dumps([
                "Topical allylamine antifungals: Terbinafine 1% cream applied once or twice daily for 2 to 4 weeks.",
                "Topical azole antifungals: Clotrimazole, Ketoconazole, or Miconazole applied 2 cm beyond the active advancing margin.",
                "Keep infected skin meticulously clean and dry; thoroughly towel dry skin folds after showering.",
                "Avoid topical corticosteroid monotherapy, which suppresses local immunity and causes 'Tinea Incognito' (disguised, invasive fungal spread)."
            ]),
            "when_to_see_doctor": "Consult a healthcare provider if ringworm affects the scalp or beard (which requires oral antifungal therapy like Griseofulvin or Terbinafine), if widespread across the body, or if lesions fail to improve after 2 weeks of topical care.",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Fungal Diseases: Ringworm / Tinea",
                "Infectious Diseases Society of America (IDSA) - Practice Guidelines for the Diagnosis of Dermatophytosis"
            ])
        },
        {
            "name": "Urticaria (Hives)",
            "slug": "urticaria",
            "category": "Mast Cell-Mediated Cutaneous Reaction",
            "severity": "Manageable / Acute or Chronic",
            "description": "Urticaria (Hives) is a common dermatological condition mediated by sudden mast cell degranulation in the superficial dermis, resulting in the rapid appearance of transient, intensely pruritic, edematous erythematous wheals and flares.",
            "causes_json": json.dumps([
                "Mast Cell Degranulation: Immediate release of pre-formed vasoactive histamine and protease enzymes, accompanied by de novo synthesis of leukotrienes and prostaglandins.",
                "Type I IgE-Mediated Hypersensitivity: Specific allergen binding to surface IgE cross-linking high-affinity FcεRI receptors on mast cells (food allergies, beta-lactam antibiotics, hymenoptera stings).",
                "Autoimmune Chronic Urticaria: Circulating IgG autoantibodies directed against the alpha subunit of FcεRI (in ~35-40% of chronic spontaneous urticaria) or anti-IgE antibodies.",
                "Viral Infection Trigger: Common viral upper respiratory infections, Epstein-Barr virus, and viral hepatitis in acute urticaria.",
                "Non-Immunologic Pseudoallergens: Direct non-IgE degranulation induced by radiocontrast media, opiates, or cyclooxygenase-1 (COX-1) inhibition by aspirin and NSAIDs."
            ]),
            "symptoms_json": json.dumps([
                "Pruritic, raised, blanchable erythematous wheals (plaques) with central pallor surrounded by an inflammatory flare.",
                "Fugacious / Transient nature: Individual wheals typically arise, peak, and completely disappear within 2 to 24 hours without leaving residual bruising or scars.",
                "Intense, persistent itching that tends to worsen in evening and night hours.",
                "Concurrent Angioedema: Deep-tissue swelling of the lips, eyelids, tongue, larynx, hands, or genitalia in up to 40% of cases."
            ]),
            "risk_factors_json": json.dumps([
                "Atopic diathesis and underlying autoimmune thyroid disease (Hashimoto thyroiditis).",
                "Recent viral or bacterial infection.",
                "Physical urticaria triggers: Scratching (dermographism), cold immersion, localized pressure, or elevated core body temperature (cholinergic urticaria)."
            ]),
            "care_guidance_json": json.dumps([
                "Second-generation non-sedating H1-antihistamines (Cetirizine, Fexofenadine, Loratadine, Bilastine) as the primary first-line therapy (can be titrated up to 4x standard dosage).",
                "Apply cool damp compresses and soothing pramoxine or calamine lotions to alleviate cutaneous burning.",
                "Avoid known triggering foods, NSAIDs, tight occlusive clothing, and hot showers during acute flares.",
                "Biologic therapy (Omalizumab - anti-IgE monoclonal antibody) for refractory chronic spontaneous urticaria."
            ]),
            "when_to_see_doctor": "Seek emergency medical care immediately (call 911 / emergency services) if hives are accompanied by lip/tongue swelling, difficulty swallowing, wheezing, throat tightness, or lightheadedness (signs of life-threatening Anaphylaxis).",
            "medical_references_json": json.dumps([
                "World Allergy Organization (WAO) - Global Guidelines for the Definition, Diagnosis and Management of Urticaria",
                "American Academy of Allergy, Asthma & Immunology (AAAAI) - Urticaria and Angioedema Practice Parameters"
            ])
        },
        {
            "name": "Shingles (Herpes Zoster)",
            "slug": "shingles",
            "category": "Neurocutaneous Viral Infection",
            "severity": "Concerning / Acute Viral",
            "description": "Herpes Zoster (Shingles) is an acute, neurocutaneous viral disease caused by reactivation of latent Varicella-Zoster Virus (VZV) in cranial nerve or dorsal root sensory ganglia. It presents as an intensely painful, unilateral, dermatomal vesicular eruption.",
            "causes_json": json.dumps([
                "Reactivation of Latent Varicella-Zoster Virus: Reactivation of VZV that has remained dormant inside sensory neuronal ganglia since childhood chickenpox.",
                "Age-Related Immunosenescence: Progressive, natural decline in VZV-specific cell-mediated immunity (CD4+ memory T lymphocytes) occurring past age 50.",
                "Iatrogenic Immunosuppression: Systemic chemotherapy, corticosteroid therapy, solid organ or bone marrow transplant anti-rejection regimens.",
                "Immunocompromising Illnesses: Human Immunodeficiency Virus (HIV) infection, Hodgkin lymphoma, and other hematologic malignancies.",
                "Physical & Psychological Distress: Severe emotional distress, acute physical trauma, or surgical interventions precipitating viral reactivation along the sensory nerve axon."
            ]),
            "symptoms_json": json.dumps([
                "Pre-eruptive prodrome (2-3 days prior): Unilateral burning, tingling, stabbing pain, or hyperesthesia in a single dermatome.",
                "Erythematous macules and papules rapidly progressing into grouped, fluid-filled umbilicated vesicles on an erythematous base.",
                "Strict unilateral dermatomal distribution: Sharply cut off at the anatomical midline (most commonly thoracic, lumbar, or ophthalmic V1 dermatomes).",
                "Post-Herpetic Neuralgia (PHN): Severe, debilitating burning neuropathic pain persisting for months or years after cutaneous lesions heal."
            ]),
            "risk_factors_json": json.dumps([
                "Age older than 50 years (risk increases dramatically after age 60).",
                "History of primary varicella (chickenpox) infection.",
                "Immunosuppressive conditions and medications."
            ]),
            "care_guidance_json": json.dumps([
                "Early oral antiviral therapy: Valacyclovir (1000 mg 3x daily) or Famciclovir initiated within 72 hours of rash onset to accelerate healing and reduce PHN risk.",
                "Analgesic pain management: Acetaminophen, NSAIDs, gabapentin, or pregabalin for acute neuropathic pain.",
                "Keep the rash clean and loosely covered with sterile non-stick dressings to prevent viral transmission and secondary bacterial infection.",
                "Vaccination prevention: The recombinant zoster vaccine (Shingrix) provides >90% efficacy in preventing shingles and PHN in adults >=50."
            ]),
            "when_to_see_doctor": "Seek urgent medical attention within 72 hours for prompt antiviral prescription. If lesions appear near the eye, forehead, or tip of the nose (Hutchinson's sign), an urgent ophthalmology consult is required to prevent corneal necrosis and permanent vision loss.",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Shingles (Herpes Zoster) Clinical Overview & Shingrix Guidelines",
                "American Academy of Dermatology (AAD) - Herpes Zoster Diagnosis and Management Guidelines"
            ])
        },
        {
            "name": "Impetigo",
            "slug": "impetigo",
            "category": "Superficial Bacterial Pyoderma",
            "severity": "Infectious / Treatable",
            "description": "Impetigo is a highly contagious, superficial bacterial skin infection most prevalent in young children. It occurs in two primary clinical presentations: Non-bullous impetigo (characterized by classic honey-colored crusts) and Bullous impetigo (characterized by flaccid fluid-filled bullae).",
            "causes_json": json.dumps([
                "Bacterial Infection: Primarily caused by *Staphylococcus aureus* (in 80-90% of cases) and/or *Streptococcus pyogenes* (Group A beta-hemolytic Streptococcus).",
                "Bacterial Exfoliative Toxins: In bullous impetigo, *S. aureus* produces exfoliative toxins A and B that cleave desmoglein-1, disrupting granular cell adhesion.",
                "Cutaneous Inoculation: Bacteria enter the epidermis through minor skin breaks, abrasions, thermal burns, insect bites, or scratched eczema patches.",
                "Close Contact Transmission: Highly contagious spread via direct physical contact in daycare centers, schools, and contact sports (impetigo contagiosa).",
                "Environmental Factors: Hot, humid tropical climates and suboptimal personal hygiene facilitating bacterial skin colonization."
            ]),
            "symptoms_json": json.dumps([
                "Transient thin-walled vesicles that quickly rupture, leaving moist red erosions that ooze serous yellow exudate.",
                "Hallmark golden 'honey-colored' stuck-on crusts over an erythematous base.",
                "Facial predilection: Classically clustered around the perioral and perinasal areas, as well as exposed extremities.",
                "Mild localized pruritus; patients may auto-inoculate bacteria to other skin sites through scratching."
            ]),
            "risk_factors_json": json.dumps([
                "Age between 2 and 6 years.",
                "Pre-existing itchy skin conditions (atopic dermatitis, head lice, scabies, chickenpox).",
                "Warm, humid summer months and crowded living conditions."
            ]),
            "care_guidance_json": json.dumps([
                "Topical prescription antibiotic ointment: Mupirocin 2% or Retapamulin 1% applied 2 to 3 times daily for 5 to 7 days for localized lesions.",
                "Gently soak off thick golden crusts with warm saline compresses before applying topical antibiotics.",
                "Oral systemic antibiotics (Cephalexin, Amoxicillin-Clavulanate, or Clindamycin) for extensive, bullous, or widespread impetigo.",
                "Maintain strict hygiene: Wash towels, bed linens, and clothing separately in hot water; keep child home from school until 24-48 hours after starting antibiotics."
            ]),
            "when_to_see_doctor": "Consult a physician promptly for prescription antibacterial therapy, or if the child develops fever, swelling, red streaks (cellulitis), or dark tea-colored urine (a rare sign of post-streptococcal glomerulonephritis).",
            "medical_references_json": json.dumps([
                "Infectious Diseases Society of America (IDSA) - Practice Guidelines for Skin and Soft Tissue Infections",
                "American Academy of Pediatrics (AAP) - Impetigo Diagnosis, Treatment and School Exclusion Protocols"
            ])
        },
        {
            "name": "Alopecia Areata",
            "slug": "alopecia-areata",
            "category": "Autoimmune Follicular Disorder",
            "severity": "Manageable / Chronic",
            "description": "Alopecia Areata is an autoimmune, non-scarring form of hair loss characterized by targeted immune privilege collapse of the hair follicle bulb. It presents as smooth, round, or oval bald patches on the scalp or beard, and may progress to complete scalp loss (Alopecia Totalis) or total body hair loss (Alopecia Universalis).",
            "causes_json": json.dumps([
                "Hair Follicle Immune Privilege Collapse: Loss of normal physiological immune privilege of the anagen hair follicle bulb with ectopic expression of MHC class I and II molecules.",
                "Autoimmune Cytotoxic T-Cell Infiltration: Autoreactive CD8+NKG2D+ T lymphocytes infiltrate the peri-bulbar sheath ('swarm of bees' histopathology).",
                "JAK-STAT Signaling Hyper-Activation: Interleukin-15 (IL-15) and Interferon-gamma (IFN-gamma) signaling through the Janus kinase (JAK1/JAK2/JAK3) pathway drives follicular arrest.",
                "Polygenic Heritability: Strong genetic linkage to HLA-DRB1, *MICA*, *ULBP*, and immune-checkpoint genes.",
                "Autoimmune Comorbidities: Frequent co-occurrence with Hashimoto thyroiditis, vitiligo, celiac disease, and atopic dermatitis.",
                "Neuro-Endocrine Triggers: Severe acute psychological shock, emotional grief, or viral infections precipitating immune attack."
            ]),
            "symptoms_json": json.dumps([
                "Smooth, round or oval patches of completely non-scarring hair loss with normal, healthy-looking scalp skin underneath.",
                "'Exclamation mark hairs': Short (2-4 mm) broken hairs around patch borders that are narrow and depigmented at the base and darker at the tip.",
                "Positive hair pull test along patch margins indicating active, expanding disease.",
                "Nail involvement: Geometric stippled nail pitting, trachyonychia (sandpaper nails), and red-spotted lunulae in ~20% of patients."
            ]),
            "risk_factors_json": json.dumps([
                "First-degree family history of alopecia areata (in ~20% of cases).",
                "Coexisting autoimmune diseases, especially autoimmune thyroiditis.",
                "Age under 30 years at initial symptom presentation."
            ]),
            "care_guidance_json": json.dumps([
                "Intralesional corticosteroid injections (Triamcinolone acetonide 5-10 mg/mL) spaced 4 to 6 weeks apart for limited patchy scalp disease.",
                "Oral Janus Kinase (JAK) Inhibitors (Baricitinib, Ritlecitinib): FDA-approved systemic biologics that inhibit the downstream inflammatory cascade in severe alopecia areata.",
                "Super-potent topical corticosteroids (Clobetasol propionate 0.05% foam or solution) under occlusion.",
                "Topical Minoxidil 5% solution as adjunctive therapy to prolong the anagen growth phase once inflammation is suppressed."
            ]),
            "when_to_see_doctor": "Consult a dermatologist early upon discovering circular bald patches. Early diagnosis allows prompt intralesional anti-inflammatory intervention before follicles undergo prolonged miniaturization.",
            "medical_references_json": json.dumps([
                "National Alopecia Areata Foundation (NAAF) - Clinical Standards and Patient Resources",
                "American Academy of Dermatology (AAD) - Alopecia Areata Assessment & JAK-Inhibitor Guidelines",
                "The New England Journal of Medicine - Two Phase 3 Trials of Baricitinib for Alopecia Areata"
            ])
        },
        {
            "name": "Contact Dermatitis",
            "slug": "contact-dermatitis",
            "category": "Allergic & Irritant Eczematous Dermatosis",
            "severity": "Manageable / Acute Inflammatory",
            "description": "Contact Dermatitis is an acute or chronic inflammatory skin condition provoked by cutaneous contact with an external agent. It encompasses two primary pathogenic subtypes: Irritant Contact Dermatitis (ICD, ~80% of cases) caused by direct non-allergic chemical/physical damage, and Allergic Contact Dermatitis (ACD, ~20%) mediated by a Type IV delayed hypersensitivity response.",
            "causes_json": json.dumps([
                "Allergic Contact Dermatitis (ACD): Type IV cell-mediated delayed-type hypersensitivity reaction. Environmental haptens bind to epidermal proteins, are captured by Langerhans cells, and prime CD4+/CD8+ memory T lymphocytes.",
                "Common Allergenic Triggers: Nickel sulfate (jewelry, belt buckles, cellphones), urushiol resin (poison ivy, poison oak, poison sumac), fragrance mixes, paraphenylenediamine (PPD hair dyes), and topical neomycin.",
                "Irritant Contact Dermatitis (ICD): Direct non-immunologic physical or chemical cytotoxicity disrupting stratum corneum lipids and denaturing keratin proteins.",
                "Common Irritant Triggers: Industrial cleaning solvents, alkaline soaps, bleaches, hydrochloric/sulfuric acids, repetitive wet work, hand sanitizer alcohols, and fiberglass.",
                "Impaired Epidermal Barrier: Pre-existing atopic skin diathesis rendering the stratum corneum exponentially more permeable to irritants and sensitizers."
            ]),
            "symptoms_json": json.dumps([
                "Erythematous, intensely pruritic or burning rash with sharp geometric, linear, or demarcated borders matching the shape of the offending contact item (e.g., watchband, buckle, linear plant streaks).",
                "Acute phase: Edema, tiny grouped vesicles, oozing, and serous crusting.",
                "Chronic phase: Persistent dry scaling, painful fissures, cutaneous lichenification, and peeling.",
                "Severe burning or stinging pain predominates in Irritant Contact Dermatitis, whereas intense itching predominates in Allergic Contact Dermatitis."
            ]),
            "risk_factors_json": json.dumps([
                "High-risk occupational sectors: Healthcare workers, hairdressers, machinists, cleaners, construction workers, and food service personnel.",
                "Frequent repetitive wet-work (>2 hours of daily water exposure).",
                "Outdoor enthusiasts, landscapers, and gardeners exposed to toxicodendron plants."
            ]),
            "care_guidance_json": json.dumps([
                "Strict allergen and irritant identification and complete avoidance.",
                "Diagnostic Patch Testing (standard TRUE Test series) conducted by a dermatologist to pinpoint exact causal contact allergens.",
                "Mid-to-high potency topical corticosteroids (Triamcinolone 0.1% or Clobetasol 0.05%) applied twice daily for 2 to 3 weeks.",
                "Frequent application of barrier repair creams rich in dimethicone, petrolatum, and ceramides; wear nitrile gloves during chemical handling."
            ]),
            "when_to_see_doctor": "Consult a physician if contact dermatitis affects the eyes, face, or genitalia, if widespread across >25% of the body, if secondary yellow crusting infection develops, or if the causative trigger remains unidentified.",
            "medical_references_json": json.dumps([
                "American Contact Dermatitis Society (ACDS) - Core Allergen Series & Diagnostic Patch Testing",
                "American Academy of Dermatology (AAD) - Contact Dermatitis Diagnosis & Barrier Repair"
            ])
        },
        {
            "name": "Seborrheic Dermatitis",
            "slug": "seborrheic-dermatitis",
            "category": "Chronic Inflammatory Sebum-Linked Dermatosis",
            "severity": "Manageable / Chronic",
            "description": "Seborrheic Dermatitis is a common, chronic, relapsing inflammatory skin disorder that predominantly affects sebum-rich areas of the body, including the scalp, central face (eyebrows, glabella, nasolabial folds), ears, and upper chest. In infants, it presents as benign 'cradle cap'.",
            "causes_json": json.dumps([
                "Malassezia Yeast Proliferation: Commensal lipophilic yeasts (*Malassezia globosa* and *Malassezia restricta*) colonize sebum-rich hair follicles and sebaceous glands.",
                "Sebum Triglyceride Degradation: *Malassezia* fungal lipases metabolize host sebum triglycerides, releasing irritating free fatty acids (particularly oleic and arachidonic acid).",
                "Stratum Corneum Disruption: Free fatty acids penetrate the epidermal barrier, triggering keratinocyte parakeratosis and microvascular inflammation.",
                "Sebaceous Gland Hyperactivity: Abundant androgenic sebum production creating an ideal lipid-rich growth environment.",
                "Neurological & Immunological Associations: Strikingly elevated incidence and severe presentations in Parkinson's disease, facial nerve palsy, traumatic brain injury, mood disorders, and HIV infection.",
                "Environmental Exacerbations: Cold, dry winter weather, low indoor humidity, emotional stress, and infrequent hair washing."
            ]),
            "symptoms_json": json.dumps([
                "Greasy, yellowish, waxy scales overlying patchy or diffuse erythematous plaques.",
                "Scalp involvement: Severe flaking ('dandruff' / pityriasis capitis) accompanied by burning or itching sensation.",
                "Facial distribution: Symmetric involvement of eyebrows, glabella, nasolabial folds, retroauricular sulci, and external auditory canals.",
                "Infantile Cradle Cap: Thick, greasy, adherent yellowish crusts across the vertex of the newborn scalp without significant discomfort."
            ]),
            "risk_factors_json": json.dumps([
                "Male sex and peak incidence in young adulthood (30-40s) and older age (>50s).",
                "Underlying neurological conditions (Parkinson's disease, stroke).",
                "Immunosuppressive conditions (HIV, post-transplant)."
            ]),
            "care_guidance_json": json.dumps([
                "Topical antifungal shampoos: Ketoconazole 2%, Zinc Pyrithione, Selenium Sulfide 2.5%, or Ciclopirox used 2 to 3 times weekly.",
                "Lather antifungal shampoo onto scalp and affected facial areas, allowing it to sit for 5 full minutes before rinsing thoroughly.",
                "Low-potency topical corticosteroids (Desonide 0.05% or Hydrocortisone 1%) or topical calcineurin inhibitors for acute facial flare-ups.",
                "Keratolytic shampoos containing salicylic acid or tar to dissolve thick scalp crusts."
            ]),
            "when_to_see_doctor": "Consult a dermatologist if over-the-counter medicated shampoos fail after 4 weeks, if widespread erythematous plaques appear across the chest, or if skin becomes painfully inflamed, cracked, or infected.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Seborrheic Dermatitis: Overview & Therapeutic Regimens",
                "Cochrane Database of Systematic Reviews - Topical Antifungals for Seborrhoeic Dermatitis"
            ])
        },
        {
            "name": "Folliculitis",
            "slug": "folliculitis",
            "category": "Infectious Follicular Disorder",
            "severity": "Infectious / Treatable",
            "description": "Folliculitis is an acute or chronic inflammation of the superficial hair follicle, most commonly triggered by bacterial or fungal colonization, chemical irritation, or physical friction. It presents as small, discrete, erythematous follicular papules and pustules pierced centrally by a hair shaft.",
            "causes_json": json.dumps([
                "Bacterial Infection: Primarily caused by *Staphylococcus aureus* invading the superficial follicular infundibulum (Bockhart's impetigo).",
                "Hot Tub Pseudomonas Folliculitis: Infection by *Pseudomonas aeruginosa* contracted from poorly chlorinated, heated whirlpools and hot tubs.",
                "Fungal / Malassezia Folliculitis (Pityrosporum Folliculitis): Fungal overgrowth of *Malassezia* yeasts inside follicular canals, classically presenting as itchy acneiform bumps on upper back and chest.",
                "Mechanical Friction & Shaving: Close razor shaving, waxing, or tight occlusive synthetic athletic sportswear causing mechanical follicular micro-trauma.",
                "Pseudofolliculitis Barbae: Foreign-body inflammatory response triggered by tightly curled beard hairs curving back and penetrating interfollicular skin after shaving.",
                "Long-Term Oral Antibiotics: Prolonged systemic tetracycline therapy for acne predisposing to Gram-negative folliculitis (*Klebsiella*, *Enterobacter*)."
            ]),
            "symptoms_json": json.dumps([
                "Discrete 1 to 3 mm dome-shaped erythematous papules and yellow pustules pierced centrally by a hair shaft.",
                "Surrounding halo of inflammatory erythema; mild tenderness, pruritus, or cutaneous burning.",
                "Crusting and excoriation following pustule rupture.",
                "Predilection for beard area, scalp, neck, thighs, buttocks, and upper back."
            ]),
            "risk_factors_json": json.dumps([
                "Frequent wet close shaving, especially against the natural grain of hair growth.",
                "Soaking in heated hot tubs, heated pools, or wearing sweaty occlusive athletic gear for extended periods.",
                "Diabetes mellitus, obesity, immunosuppression, and living in warm humid climates."
            ]),
            "care_guidance_json": json.dumps([
                "Apply warm saline or dilute antibacterial compresses for 15 minutes 3 to 4 times daily to promote spontaneous drainage.",
                "Cleanse skin with antiseptic washes: Benzoyl peroxide 5-10% wash or Chlorhexidine gluconate 4%.",
                "Topical prescription antibiotic lotions: Clindamycin 1% or Mupirocin 2% applied twice daily.",
                "Topical or oral antifungals (Fluconazole or Ketoconazole shampoo) if Pityrosporum folliculitis is diagnosed.",
                "Adopt razor-free depilatory methods, electric trimmers, or shave strictly in the direction of hair growth using generous lubricating shave gel."
            ]),
            "when_to_see_doctor": "Consult a healthcare provider if follicular bumps coalesce into painful deep boils (furuncles/carbuncles), if fever or spreading redness develops, or if lesions fail to clear within 10 days.",
            "medical_references_json": json.dumps([
                "Infectious Diseases Society of America (IDSA) - Guidelines for the Management of Follicular Infections",
                "American Academy of Dermatology (AAD) - Folliculitis: Signs, Causes & Medical Treatments"
            ])
        },
        {
            "name": "Lichen Planus",
            "slug": "lichen-planus",
            "category": "Autoimmune Mucocutaneous Dermatosis",
            "severity": "Manageable / Inflammatory",
            "description": "Lichen Planus is a chronic autoimmune, mucocutaneous inflammatory disease mediated by cytotoxic T cells targeting basal keratinocytes. It classically presents with the hallmark '6 Ps': Purple, Polygonal, Pruritic, Planar (flat-topped), Papules, and Plaques, characteristically crisscrossed by fine reticular white lines known as Wickham's striae.",
            "causes_json": json.dumps([
                "Cytotoxic CD8+ T-Cell Autoimmunity: Autoreactive CD8+ T lymphocytes infiltrate the dermo-epidermal junction and trigger apoptotic death (colloid bodies) of basal keratinocytes.",
                "Strong Hepatitis C Virus (HCV) Link: Significant worldwide epidemiological association with chronic Hepatitis C infection; viral antigens may trigger cutaneous cross-reactive autoimmunity.",
                "Drug-Induced Lichenoid Reactions: Eruptions clinically identical to lichen planus provoked by beta-blockers, ACE inhibitors, antimalarials, thiazide diuretics, and NSAIDs.",
                "Contact Mucosal Hypersensitivity: Dental amalgam restorations (mercury, copper, silver) inducing localized oral lichenoid mucosal reactions.",
                "Genetic Susceptibility: Significantly elevated frequency of HLA-DR1, HLA-DQ1, and HLA-B7 human leukocyte antigen alleles."
            ]),
            "symptoms_json": json.dumps([
                "Classic '6 Ps': Purple (violaceous), Polygonal, Pruritic, Planar (flat-topped), Papules, and Plaques.",
                "Wickham's Striae: Delicate, lacy, white reticular lines visible across the surface of mature violaceous papules.",
                "Koebner Isomorphic Response: Eruption of new linear lichenoid papules along scratches or surgical incisions.",
                "Oral mucosal involvement (~50% of patients): White, asymptomatic reticular lacy plaques along bilateral buccal mucosa or painful erosions.",
                "Nail dystrophy: Longitudinal ridging, thinning, and pathognomonic dorsal pterygium formation."
            ]),
            "risk_factors_json": json.dumps([
                "Age between 30 and 60 years.",
                "Chronic Hepatitis C viral seropositivity.",
                "History of severe psychological stress or concurrent autoimmune disorders (vitiligo, ulcerative colitis)."
            ]),
            "care_guidance_json": json.dumps([
                "High-potency topical corticosteroids (Clobetasol propionate 0.05% ointment or Betamethasone dipropionate) under occlusion.",
                "Intralesional Triamcinolone acetonide injections for thick, recalcitrant hypertrophic plaques on the shins.",
                "Narrowband UVB (NB-UVB) phototherapy administered 2 to 3 times weekly for generalized cutaneous eruptions.",
                "Oral retinoids (Acitretin) or systemic corticosteroids for severe, generalized, or erosive disease.",
                "Undergo clinical screening for Hepatitis C viral antibodies and routine oral cavity examinations."
            ]),
            "when_to_see_doctor": "Consult a dermatologist for punch biopsy confirmation. Patients with erosive oral or genital lichen planus require long-term clinical monitoring due to a recognized risk (~1-2%) of malignant transformation into Squamous Cell Carcinoma.",
            "medical_references_json": json.dumps([
                "British Association of Dermatologists (BAD) - Guidelines for the Management of Lichen Planus",
                "American Academy of Dermatology (AAD) - Lichen Planus Clinical Presentation, Biopsy & Therapy"
            ])
        },
        {
            "name": "Warts (Verruca)",
            "slug": "warts",
            "category": "Infectious Viral Cutaneous Proliferation",
            "severity": "Infectious / Benign HPV",
            "description": "Cutaneous warts (Verruca vulgaris, plantaris, plana) are benign intraepidermal proliferations caused by infection of basal keratinocytes with low-risk Human Papillomavirus (HPV) genotypes. They present as firm, hyperkeratotic, exophytic papules with a rough, verrucous surface containing pathognomonic thrombosed dilated capillary loops ('black dots').",
            "causes_json": json.dumps([
                "Human Papillomavirus (HPV) Infection: Direct inoculation of low-risk cutaneous HPV genotypes (primarily HPV-1 for deep myrmecial plantar warts, HPV-2, 4, 27, 57 for common verruca vulgaris, and HPV-3, 10 for flat verruca plana) into micro-traumatized epidermal skin.",
                "Epithelial Micro-abrasions: Microscopic breaks in the stratum corneum barrier from cuticle picking, hand washing, shaving, or walking barefoot on abrasive surfaces.",
                "Impaired Cell-Mediated Immunity: Genetic or acquired deficiency in CD4+/CD8+ cytotoxic T-lymphocytes preventing spontaneous viral clearance, common in organ transplant recipients or HIV.",
                "Direct and Indirect Contact Transmission: Skin-to-skin touch, communal shower floor exposure, moist towel sharing, or gym equipment contact.",
                "Autoinoculation: Self-spreading of viral particles to contiguous skin regions via nail biting (periungual warts), scratching, or wet razor blade shaving."
            ]),
            "symptoms_json": json.dumps([
                "Firm, circumscribed, flesh-colored to grayish-brown hyperkeratotic exophytic papules with a rough, sandpaper-like or cauliflower texture.",
                "Pathognomonic Pinpoint Black Dots: Thrombosed, dilated dermal papillary capillaries visible when the superficial keratin is pared down.",
                "Interruption of Natural Skin Cleavage Lines (Dermatoglyphics): Natural skin lines circumvent around verrucous lesions rather than passing through them.",
                "Pain with Lateral Compression: Plantar warts elicit sharp tenderness when pinched laterally between fingers, in contrast to calluses which hurt upon direct perpendicular pressure.",
                "Locations: Fingers, periungual folds, dorsum of hands, knees, and weight-bearing soles of feet."
            ]),
            "risk_factors_json": json.dumps([
                "Children and young adults (peak incidence between ages 9 and 16 years).",
                "Frequent use of public swimming pools, communal locker rooms, and shared athletic mats.",
                "Habitual onychophagia (nail biting) and cuticle picking.",
                "Occupations with frequent water immersion and meat/poultry handling ('butcher's warts').",
                "Therapeutic immunosuppression (calcineurin inhibitors, biologics, chemotherapy)."
            ]),
            "care_guidance_json": json.dumps([
                "High-potency topical Salicylic acid (17% to 40% plaster/gel) applied daily after soaking in warm water and gently debriding dead hyperkeratosis with an emery board.",
                "Clinical Cryotherapy: Controlled liquid nitrogen spray or cotton-tipped applicator for 10-20 seconds every 2 to 3 weeks until clinical clearance.",
                "Topical Imiquimod 5% cream or topical 5-Fluorouracil (5-FU) under occlusion for recalcitrant or flat facial warts.",
                "Intralesional immunotherapy: Candida albicans antigen or Bleomycin injection administered by a certified dermatologist for stubborn multi-lesional plantar warts.",
                "Do not pick, cut, or bite warts; sanitize clippers and wear protective footwear in communal locker areas."
            ]),
            "when_to_see_doctor": "Consult a physician if warts occur on the face, genital or perianal regions, if they are painful, bleeding, rapidly spreading, immunocompromised, or fail to respond to 12 weeks of non-prescription salicylic acid therapy.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Warts: Causes, Types, and Evidence-Based Treatments",
                "Cochrane Database of Systematic Reviews - Topical Treatments for Cutaneous Warts"
            ])
        },
        {
            "name": "Scabies",
            "slug": "scabies",
            "category": "Parasitic Cutaneous Infestation",
            "severity": "Infectious / Contagious Parasitic",
            "description": "Scabies is an intensely pruritic, highly contagious parasitic infestation of the epidermis caused by the microscopic human itch mite, Sarcoptes scabiei var. hominis. Female mites burrow into the stratum corneum to deposit eggs and scybala (feces), triggering an intense delayed Type IV hypersensitivity immune response characterized by severe nocturnal itch.",
            "causes_json": json.dumps([
                "Sarcoptes scabiei var. hominis Parasitic Invasion: Female itch mites (0.3-0.4 mm) burrow through the stratum corneum at 1 to 5 mm per day using proteolytic enzymes, depositing eggs and digestive feces.",
                "Type IV Delayed Hypersensitivity: Allergic sensitization against mite proteins, saliva, and scybala that manifests 3 to 6 weeks after primary infestation (or 24-48 hours upon re-infestation).",
                "Prolonged Direct Skin-to-Skin Contact: Intimate contact or sustained direct skin-to-skin touch lasting at least 10 to 15 minutes with an infested individual.",
                "Fomite Transmission (Severe or Crusted Scabies): Viable mites transferring through contaminated bedding, sleeping bags, unwashed clothing, and upholstered furniture.",
                "High Population Density: Rapid spread in crowded living environments, student dormitories, nursing care facilities, and preschools."
            ]),
            "symptoms_json": json.dumps([
                "Intense, Intractable Nocturnal Pruritus: Severe generalized itching that worsens markedly at night in bed, frequently disturbing sleep.",
                "Serpiginous Burrows: Pathognomonic thin, wavy, thread-like grayish-white or flesh-colored linear ridges (2-10 mm) often terminating in a tiny vesicular mite track.",
                "Predilection Sites: Interdigital web spaces of fingers, flexor creases of wrists, elbows, anterior axillary folds, peri-umbilical skin, waistline, buttocks, male genitalia (pruritic chancriform nodules), and under breasts.",
                "Excoriated Inflammatory Papules: Widespread small, erythematous follicular papules and vesicles, secondary excoriations, and crusting from aggressive scratching.",
                "Absence of Head/Neck Involvement in Adults: Face and scalp are characteristically spared in healthy adults, but may be heavily involved in infants, elderly, and crusted scabies."
            ]),
            "risk_factors_json": json.dumps([
                "Living in institutional settings (nursing homes, residential dormitories, correctional facilities).",
                "Crowded living quarters and shared beds.",
                "Compromised immune systems, cognitive impairment, or neurological debilitation (increasing risk of hyperkeratotic Crusted/Norwegian scabies).",
                "Healthcare professionals and daycare workers providing direct physical patient handling."
            ]),
            "care_guidance_json": json.dumps([
                "First-line Topical Permethrin 5% cream: Apply thoroughly from neck to soles of feet (including under fingernails), leave on for 8 to 14 hours overnight, then rinse off. Repeat after 7 to 14 days to eradicate newly hatched nymphs.",
                "Oral Ivermectin (200 mcg/kg single oral dose): Repeat dose on day 8-14 for institutional outbreaks, severe cases, or non-responders to topical agents.",
                "Simultaneous Household Treatment: ALL household members, cohabitants, and sexual partners must receive simultaneous synchronized treatment, even if currently asymptomatic.",
                "Decontamination of Textiles: Machine wash and hot tumble dry (minimum 60°C/140°F for 30 minutes) all clothes, bedding, and towels used in the preceding 4 days, or isolate in sealed plastic bags for 72 hours.",
                "Post-Scabetic Itch Management: Topical mid-potency corticosteroids and oral non-drowsy antihistamines may be used for 2-4 weeks after mite eradication while the allergic hypersensitivity subsides."
            ]),
            "when_to_see_doctor": "Consult a healthcare provider immediately upon suspicion of scabies for microscopic mineral oil skin scraping. Seek emergency evaluation if crusted hyperkeratotic scales develop or if secondary honey-crusted bacterial impetiginization / cellulitis arises.",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Clinical Guidelines for Scabies Management",
                "World Health Organization (WHO) - Scabies and Other Ectoparasitic Control Guidelines"
            ])
        },
        {
            "name": "Athlete's Foot (Tinea Pedis)",
            "slug": "athletes-foot",
            "category": "Superficial Dermatophytic Fungal Infection",
            "severity": "Infectious / Treatable Fungal",
            "description": "Athlete's Foot (Tinea Pedis) is the most prevalent superficial dermatophyte fungal infection of the feet. It primarily targets the keratinized interdigital web spaces, soles, and lateral margins of the feet, presenting as macerated, peeling, pruritic fissures (interdigital type) or chronic diffuse powdery scaling (moccasin distribution).",
            "causes_json": json.dumps([
                "Dermatophyte Colonization: Anthropophilic dermatophytic filamentous fungi, predominantly Trichophyton rubrum (most common worldwide), Trichophyton mentagrophytes var. interdigitale, and Epidermophyton floccosum.",
                "Keratinolytic Enzymatic Degradation: Fungal hyphae secrete keratinases and fungal proteases that digest and hydrolyze stratum corneum cornified keratinocytes.",
                "Warm, Moist, Occlusive Microclimate: Prolonged wearing of tight, non-breathable synthetic shoes and damp athletic footwear creating an optimal tropical environment (hyperhidrosis) for fungal spore germination.",
                "Communal Reservoirs: Walking barefoot on contaminated communal surfaces (pool decks, public locker rooms, gym showers, hotel bathroom rugs).",
                "Defective Skin Barrier: Micro-cracks, interdigital moisture maceration, or skin maceration permitting hyphal tissue invasion."
            ]),
            "symptoms_json": json.dumps([
                "Interdigital Maceration & Fissuring: Soft, moist, white, macerated epidermal peeling with painful stinging fissures between the 4th and 5th (or 3rd and 4th) toe web spaces.",
                "Intense Pruritus & Stinging: Sharp itching and burning sensation across interdigital spaces, especially upon removing shoes and socks at the end of the day.",
                "Moccasin-Type Distribution: Chronic, fine, silvery-white powdery hyperkeratosis and erythematous scaling covering the entire plantar surface and lateral borders of the foot.",
                "Vesiculobullous Eruption: Intensely itchy, deep-seated vesicles and bullae erupting along the medial instep, accompanied by secondary bacterial foul odor.",
                "Two Feet-One Hand Syndrome: Unilateral palm tinea manuum accompanying bilateral tinea pedis due to chronic scratching of feet with the dominant hand."
            ]),
            "risk_factors_json": json.dumps([
                "Athletes and marathon runners wearing closed athletic shoes for prolonged durations.",
                "Excessive foot perspiration (plantar hyperhidrosis).",
                "Wearing occlusive synthetic or rubberized safety footwear (construction, military boots).",
                "Diabetes mellitus, peripheral vascular disease, and immunosuppression.",
                "Co-existing fungal nail infection (onychomycosis) serving as a continuous fungal reinfection reservoir."
            ]),
            "care_guidance_json": json.dumps([
                "First-line Topical Antifungals: Terbinafine 1% cream, Clotrimazole 1%, Ketoconazole 2%, or Miconazole applied twice daily to clean, dry feet, extending 2 cm beyond the lesion borders, continued for 1-2 weeks after symptoms resolve.",
                "Oral Antifungal Therapy (Oral Terbinafine 250mg daily for 2-4 weeks or Itraconazole) for extensive moccasin-type disease or diabetic patients.",
                "Thorough Drying: Thoroughly towel-dry interdigital spaces after every shower; apply absorbent antifungal talc powder containing Miconazole or Tolnaftate.",
                "Footwear Hygiene: Wear moisture-wicking natural cotton or wool-blend socks, change socks twice daily when damp, and rotate shoes every 24 hours to ensure complete interior drying.",
                "Wear protective shower sandals in communal locker rooms, athletic clubs, and public pools."
            ]),
            "when_to_see_doctor": "Consult a healthcare professional if signs of secondary bacterial cellulitis appear (increasing warmth, spreading erythema, swelling, pus drainage, fever), or if you have diabetes mellitus or neuropathy.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Athlete's Foot Diagnosis, Prevention & Treatment",
                "Cochrane Skin Group - Interventions for Athlete's Foot and Dermatophytoses of the Foot"
            ])
        },
        {
            "name": "Nail Fungus (Onychomycosis)",
            "slug": "nail-fungus",
            "category": "Chronic Onychomycotic Fungal Infection",
            "severity": "Infectious / Chronic Fungal",
            "description": "Nail Fungus (Onychomycosis / Tinea unguium) is a chronic fungal infection of the nail bed, matrix, and plate, accounting for 50% of all onychopathies. It predominantly affects toenails, resulting in thick, friable, subungually hyperkeratotic, yellowish-brown discolored nail plates that separate from the underlying nail bed (onycholysis).",
            "causes_json": json.dumps([
                "Dermatophyte Nail Bed Invasion: Trichophyton rubrum (~80-90% of cases) and Trichophyton mentagrophytes entering through distal/lateral nail grooves and embedding within the ventral nail plate.",
                "Non-Dermatophyte Molds & Yeasts: Fusarium, Scopulariopsis brevicaulis, and Candida albicans (common in immunocompromised individuals and chronic paronychia).",
                "Nail Micro-trauma: Repeated micro-injuries from athletic activity, ill-fitting footwear pressing against nail tips, aggressive manicure filing, or nail crushing injuries.",
                "Underlying Untreated Tinea Pedis: Spreading of dermatophyte fungal hyphae from chronic interdigital or moccasin athlete's foot directly into adjacent hyponychial tissue.",
                "Compromised Peripheral Microcirculation: Decreased capillary perfusion in elderly patients, peripheral arterial disease, or diabetic microangiopathy impairing immune surveillance."
            ]),
            "symptoms_json": json.dumps([
                "Distal Lateral Subungual Onychomycosis (DLSO): Yellow, white, or brownish-black discoloration starting at the free distal corner of the nail plate.",
                "Subungual Hyperkeratosis: Thick, chalky, crumbly keratinaceous debris accumulating beneath the nail bed, lifting the nail plate (onycholysis).",
                "Onychodystrophy & Plate Thickening: Progressive thickening, fragility, ragged splitting, and crumbling of the nail plate edge.",
                "Pain & Discomfort: Pain, pressure, and difficulty wearing closed-toed shoes or walking due to extreme nail plate thickness and curvature.",
                "Foul Odor: Pungent, cheesy odor beneath the nail caused by anaerobic decomposition of trapped keratin debris."
            ]),
            "risk_factors_json": json.dumps([
                "Advanced age (>60 years) due to slowed nail growth rates and decreased vascular circulation.",
                "Pre-existing athlete's foot (tinea pedis) and excessive foot perspiration.",
                "Diabetes mellitus, diabetic peripheral neuropathy, and immunosuppressive conditions.",
                "Frequent salon manicures/pedicures using inadequately sterilized instruments.",
                "Psoriasis, peripheral vascular disease, and history of traumatic nail injury."
            ]),
            "care_guidance_json": json.dumps([
                "First-line Oral Antifungal Therapy: Oral Terbinafine 250mg once daily for 12 weeks for toenails (6 weeks for fingernails), achieving complete mycological cure rates of 70-80%. Requires baseline liver function monitoring.",
                "Oral Itraconazole pulse therapy (200mg twice daily for 1 week per month for 3-4 months) as an alternative for mixed dermatophyte/candida infections.",
                "Topical Antifungal Lacquers: Ciclopirox 8% lacquer, Efinaconazole 10% solution, or Tavaborole 5% solution applied daily for 48 weeks for superficial or mild-to-moderate distal involvement.",
                "Mechanical Chemical Debridement: Urea 40% cream application to soften and pare down hyperkeratotic nail plates before applying topical lacquers.",
                "Keep nails trimmed straight across, file thick edges thin, wear breathable wide-toed shoes, and treat concurrent tinea pedis promptly."
            ]),
            "when_to_see_doctor": "Consult a podiatrist or dermatologist for nail clipping fungal culture or KOH prep before initiating oral therapies. Individuals with diabetes, neuropathy, or poor circulation must seek medical care promptly to prevent diabetic foot ulcers and cellulitis.",
            "medical_references_json": json.dumps([
                "American Academy of Dermatology (AAD) - Onychomycosis: Evidence-Based Clinical Practice Guidelines",
                "Journal of the American Podiatric Medical Association (JAPMA) - Treatment of Onychomycosis"
            ])
        },
        {
            "name": "Cellulitis",
            "slug": "cellulitis",
            "category": "Acute Spreading Bacterial Dermis & Subcutaneous Infection",
            "severity": "Concerning / Acute Bacterial Emergency",
            "description": "Cellulitis is an acute, rapidly progressive, non-necrotizing bacterial infection of the deep dermis and subcutaneous adipose tissue. It typically affects the lower extremities, presenting with cardinal clinical signs of inflammation: poorly demarcated spreading erythema, significant localized warmth, tender swelling, and taut, glossy skin.",
            "causes_json": json.dumps([
                "Bacterial Pathogen Entry: Primary causative agents are Streptococcus pyogenes (Group A Beta-Hemolytic Streptococcus, GABS) in ~70-80% of cases and Staphylococcus aureus (including community-acquired MRSA).",
                "Disruption of the Cutaneous Integument: Microscopic portals of entry including tinea pedis toe-web fissures, ulcerations, traumatic abrasions, animal or insect bites, surgical incisions, or excoriated eczema.",
                "Underlying Lymphatic Impairment (Lymphedema): Prior lymph node dissection, saphenous vein harvesting, or chronic venous insufficiency reducing tissue lymphatic fluid clearance and host defense.",
                "Extracellular Bacterial Toxins: Bacterial hyaluronidases, streptokinases, and pyrogenic exotoxins that break down subcutaneous connective tissue ground substance, promoting rapid lateral spread.",
                "Systemic Immunocompromise: Uncontrolled diabetes mellitus, chronic renal disease, cirrhosis, and immunosuppressive medications."
            ]),
            "symptoms_json": json.dumps([
                "Spreading, Ill-Defined Erythema: Rapidly expanding, confluent, bright red skin plaque without clear, raised borders (differentiating it from erysipelas).",
                "Marked Localized Warmth & Caloric Heat: Affected cutaneous area feels dramatically warmer to the touch than surrounding unaffected skin.",
                "Tender Edema (Peau d'Orange): Painful induration and swollen pitting edema; skin surface appears taut, stretched, and pitted resembling an orange peel.",
                "Systemic Constitutional Symptoms: Chills, fevers, tachycardia, fatigue, headache, and leukocytosis indicating systemic inflammatory response.",
                "Ascending Lymphangitic Streaking & Lymphadenopathy: Linear red streaks traveling up the extremity toward tender regional lymph nodes (groin/axilla)."
            ]),
            "risk_factors_json": json.dumps([
                "History of prior cellulitis episodes (recurrence rate ~25-30% within 3 years).",
                "Chronic venous insufficiency, stasis dermatitis, and lower extremity peripheral edema.",
                "Untreated interdigital tinea pedis providing a chronic occult bacterial portal.",
                "Obesity (BMI >30 kg/m²), diabetes mellitus, and lymphedema.",
                "Intravenous drug use and chronic immunosuppressive therapies."
            ]),
            "care_guidance_json": json.dumps([
                "Immediate Oral or Intravenous Antibiotics: First-line oral agents for uncomplicated streptococcal/MSSA cellulitis: Cephalexin 500mg QID, Amoxicillin-Clavulanate, or Cefazolin/Ceftriaxone IV for 5 to 10 days.",
                "Empiric MRSA Coverage: Add Doxycycline, Trimethoprim-Sulfamethoxazole (TMP-SMX), or Vancomycin/Daptomycin if purulent drainage, abscess, or high community MRSA prevalence is present.",
                "Extremity Elevation: Elevate the infected limb significantly above the level of the heart to promote gravitational lymphatic drainage and reduce edema and tension.",
                "Surgical Skin Marking: Mark the leading advancing red border with an indelible pen upon initial evaluation to track clinical progression or regression over the first 24-48 hours.",
                "Treat the Portal of Entry: Treat underlying tinea pedis, eczema, or venous stasis dermatitis aggressively with topical antifungals and compression therapy to prevent recurrences."
            ]),
            "when_to_see_doctor": "EMERGENCY: Seek immediate medical or emergency department evaluation immediately. Rapidly spreading erythema, high fever, bullae, skin crepitus (subcutaneous gas), numbness, or severe out-of-proportion pain requires emergent assessment to rule out life-threatening necrotizing fasciitis.",
            "medical_references_json": json.dumps([
                "Infectious Diseases Society of America (IDSA) - Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections",
                "American Family Physician (AFP) - Cellulitis: Diagnosis, Risk Factors, and Antimicrobial Therapy"
            ])
        },
        {
            "name": "Chickenpox (Varicella)",
            "slug": "chickenpox",
            "category": "Acute Contagious Systemic Viral Exanthem",
            "severity": "Infectious / Acute Contagious Viral",
            "description": "Chickenpox (Varicella) is an acute, extremely contagious primary systemic infection caused by the neurotropic Varicella-Zoster Virus (VZV / Human Alphaherpesvirus 3). It classically presents with a generalized, intensely pruritic, pleomorphic cutaneous eruption described as 'dewdrops on a rose petal'—characterized by lesions in all stages of simultaneous development (macules, papules, clear vesicles, pustules, and crusted scabs).",
            "causes_json": json.dumps([
                "Primary Varicella-Zoster Virus (VZV) Infection: Inhalation of aerosolized infectious respiratory droplets or direct contact with fluid from active vesicular cutaneous lesions.",
                "Upper Respiratory Mucosal Replication: Primary viral replication in the nasopharynx and regional lymph nodes followed by primary and secondary viremia disseminating virus to capillary endothelial cells of the dermis.",
                "Keratinocyte Ballooning Degeneration: VZV infects basal keratinocytes, causing cell swelling, acantholysis, and intraepidermal unilocular blister formation.",
                "Neurotropic Latency: Following resolution of primary varicella, viral genomes retrogradely migrate along sensory axons to establish lifelong dormant latency in dorsal root and cranial sensory ganglia (reactivating decades later as Shingles).",
                "Lack of Active or Passive Immunity: Unvaccinated pediatric or adult individuals lacking antibodies against VZV."
            ]),
            "symptoms_json": json.dumps([
                "Pleomorphic Eruption ('Dewdrops on a Rose Petal'): Thin-walled, teardrop-shaped clear vesicles resting on a bright erythematous base.",
                "Simultaneous Multiple Stages of Evolution: Pathognomonic hallmark of lesions present in all stages concurrently (red macules, papules, tense clear vesicles, cloudy pustules, and dry crusts) on the same anatomic area.",
                "Centripetal Distribution: Rash begins on the scalp, face, and trunk before spreading centripetally to extremities, frequently involving mucosal membranes (palate, conjunctiva).",
                "Intense Generalized Pruritus: Severe, distressing itching leading to involuntary scratching and secondary bacterial excoriations.",
                "Viral Prodrome: Mild fever, malaise, anorexia, headache, and mild cough occurring 24 to 48 hours before the appearance of cutaneous eruptions."
            ]),
            "risk_factors_json": json.dumps([
                "Unvaccinated children, adolescents, and adults.",
                "Household exposure to an infected family member (secondary transmission rate >85-90%).",
                "Pregnant women (risk of congenital varicella syndrome or maternal varicella pneumonia).",
                "Adults, neonates, and immunocompromised patients who experience significantly higher rates of severe systemic complications (VZV pneumonia, encephalitis)."
            ]),
            "care_guidance_json": json.dumps([
                "Symptomatic Relief: Cool colloidal oatmeal baths (Aveeno), Calamine lotion, and oral non-drowsy antihistamines to relieve distressing itch.",
                "Antiviral Therapy: Oral Acyclovir (800mg 5 times daily) or Valacyclovir (1000mg TID) started within 24 hours of rash onset for adults, adolescents, or complicated pediatric cases to reduce duration and severity.",
                "CRITICAL WARNING - AVOID ASPIRIN: Never administer aspirin or salicylate-containing medications to children or adolescents with chickenpox due to the life-threatening risk of Reye's Syndrome (acute encephalopathy and fatty liver failure). Use Acetaminophen for fever control.",
                "Strict Isolation: Strict home quarantine until ALL cutaneous lesions have completely crusted and dried (usually 5 to 7 days from onset) to prevent transmission to susceptible individuals.",
                "Nail Hygiene: Keep fingernails closely trimmed and wear clean cotton gloves at night to prevent aggressive scratching and secondary Staphylococcal skin infections."
            ]),
            "when_to_see_doctor": "Seek emergency medical evaluation if breathing difficulties, persistent high fever, chest pain, confusion, extreme drowsiness, ataxia, or secondary bacterial infection (expanding redness, pus, tenderness around blisters) develop, or if chickenpox occurs during pregnancy.",
            "medical_references_json": json.dumps([
                "Centers for Disease Control and Prevention (CDC) - Varicella Clinical Information and Prevention Guidelines",
                "American Academy of Pediatrics (AAP) - Red Book: Varicella-Zoster Virus Infections"
            ])
        }
    ]

