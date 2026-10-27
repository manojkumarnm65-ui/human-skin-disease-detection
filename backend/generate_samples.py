import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_samples():
    backend_samples = os.path.join(os.path.dirname(__file__), 'samples')
    frontend_samples = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'samples'))
    
    os.makedirs(backend_samples, exist_ok=True)
    os.makedirs(frontend_samples, exist_ok=True)

    def make_skin_base(tone=(238, 206, 179)):
        arr = np.zeros((300, 300, 3), dtype=np.uint8)
        noise = np.random.normal(0, 4, (300, 300, 3))
        for c in range(3):
            arr[:, :, c] = np.clip(tone[c] + noise[:, :, c], 0, 255)
        return Image.fromarray(arr)

    # 1. Melanoma
    mel_img = make_skin_base()
    draw = ImageDraw.Draw(mel_img, 'RGBA')
    points = [(110, 100), (160, 90), (200, 120), (220, 160), (190, 210), (140, 220), (100, 180), (90, 130)]
    draw.polygon(points, fill=(65, 35, 30, 210))
    points2 = [(130, 120), (180, 110), (195, 150), (160, 180), (120, 160)]
    draw.polygon(points2, fill=(25, 18, 18, 240))
    draw.ellipse((85, 115, 125, 155), fill=(180, 60, 50, 120))
    mel_img = mel_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 2. Basal Cell Carcinoma
    bcc_img = make_skin_base((235, 205, 185))
    draw = ImageDraw.Draw(bcc_img, 'RGBA')
    draw.ellipse((100, 100, 200, 200), fill=(245, 225, 215, 240))
    draw.ellipse((120, 120, 180, 180), fill=(210, 140, 130, 150))
    draw.line([(110, 145), (140, 150), (170, 140), (190, 160)], fill=(200, 40, 40, 200), width=2)
    draw.line([(140, 150), (150, 175), (165, 190)], fill=(190, 30, 30, 180), width=1)
    bcc_img = bcc_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 3. Squamous Cell Carcinoma (Hyperkeratotic, ulcerated crusted nodule)
    scc_img = make_skin_base((235, 200, 180))
    draw = ImageDraw.Draw(scc_img, 'RGBA')
    draw.ellipse((95, 95, 205, 205), fill=(215, 80, 75, 220)) # inflamed base
    draw.ellipse((115, 115, 185, 185), fill=(240, 220, 200, 230)) # hyperkeratotic scale
    draw.ellipse((130, 130, 170, 170), fill=(120, 35, 30, 240)) # central ulceration
    scc_img = scc_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 4. Actinic Keratosis (Sandpaper rough gritty pink macule)
    ak_img = make_skin_base((235, 200, 180))
    draw = ImageDraw.Draw(ak_img, 'RGBA')
    draw.ellipse((100, 100, 200, 200), fill=(230, 120, 115, 180))
    for p in [(120, 120), (140, 160), (160, 130), (150, 170), (130, 145), (170, 150)]:
        draw.ellipse((p[0]-3, p[1]-3, p[0]+3, p[1]+3), fill=(255, 245, 230, 220))
    ak_img = ak_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 5. Nevus
    nev_img = make_skin_base()
    draw = ImageDraw.Draw(nev_img, 'RGBA')
    draw.ellipse((105, 105, 195, 195), fill=(95, 55, 35, 230))
    draw.ellipse((118, 118, 182, 182), fill=(75, 42, 25, 250))
    nev_img = nev_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 6. Benign Keratosis
    sk_img = make_skin_base((230, 195, 170))
    draw = ImageDraw.Draw(sk_img, 'RGBA')
    draw.ellipse((95, 90, 205, 210), fill=(110, 80, 50, 240))
    draw.ellipse((110, 105, 190, 195), fill=(130, 95, 60, 220))
    for spot in [(125, 125), (145, 160), (165, 135), (170, 170), (135, 145)]:
        draw.ellipse((spot[0]-4, spot[1]-4, spot[0]+4, spot[1]+4), fill=(220, 205, 170, 240))
    sk_img = sk_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 7. Dermatofibroma
    df_img = make_skin_base((225, 190, 165))
    draw = ImageDraw.Draw(df_img, 'RGBA')
    draw.ellipse((110, 110, 190, 190), fill=(140, 90, 65, 220))
    draw.ellipse((125, 125, 175, 175), fill=(105, 65, 45, 240))
    df_img = df_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 8. Vascular Lesion
    vas_img = make_skin_base((235, 205, 185))
    draw = ImageDraw.Draw(vas_img, 'RGBA')
    draw.ellipse((120, 120, 180, 180), fill=(210, 20, 50, 240))
    draw.ellipse((135, 135, 165, 165), fill=(160, 10, 40, 250))
    draw.ellipse((130, 128, 142, 140), fill=(255, 180, 190, 200))
    vas_img = vas_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 9. Eczema
    ecz_img = make_skin_base((230, 195, 175))
    draw = ImageDraw.Draw(ecz_img, 'RGBA')
    draw.ellipse((80, 80, 220, 220), fill=(210, 90, 85, 140))
    draw.ellipse((100, 110, 200, 190), fill=(225, 75, 70, 160))
    ecz_img = ecz_img.filter(ImageFilter.GaussianBlur(radius=8))

    # 10. Psoriasis
    pso_img = make_skin_base((235, 200, 180))
    draw = ImageDraw.Draw(pso_img, 'RGBA')
    draw.ellipse((90, 85, 210, 215), fill=(205, 65, 75, 200))
    draw.ellipse((110, 105, 190, 195), fill=(245, 240, 235, 150))
    draw.ellipse((125, 120, 175, 180), fill=(255, 250, 245, 180))
    pso_img = pso_img.filter(ImageFilter.GaussianBlur(radius=4))

    # 11. Acne
    acn_img = make_skin_base((240, 210, 185))
    draw = ImageDraw.Draw(acn_img, 'RGBA')
    spots = [
        ((140, 140, 170, 170), (220, 60, 50, 220), (150, 150, 160, 160), (255, 255, 220, 240)),
        ((95, 115, 120, 140), (210, 70, 60, 200), (104, 124, 111, 131), (250, 250, 230, 230)),
        ((180, 180, 210, 210), (215, 65, 55, 210), (192, 192, 198, 198), (255, 255, 230, 230)),
        ((185, 100, 205, 120), (200, 80, 70, 180), None, None)
    ]
    for outer_box, outer_col, inner_box, inner_col in spots:
        draw.ellipse(outer_box, fill=outer_col)
        if inner_box:
            draw.ellipse(inner_box, fill=inner_col)
    acn_img = acn_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 12. Rosacea
    ros_img = make_skin_base((240, 205, 185))
    draw = ImageDraw.Draw(ros_img, 'RGBA')
    draw.ellipse((60, 70, 240, 230), fill=(225, 80, 95, 150))
    draw.ellipse((90, 100, 210, 200), fill=(235, 60, 80, 160))
    draw.line([(120, 130), (145, 145), (175, 135)], fill=(195, 35, 45, 160), width=1)
    ros_img = ros_img.filter(ImageFilter.GaussianBlur(radius=6))

    # 13. Vitiligo
    vit_img = make_skin_base((195, 150, 120))
    draw = ImageDraw.Draw(vit_img, 'RGBA')
    vit_points = [(100, 110), (150, 95), (190, 115), (220, 160), (180, 210), (130, 190), (95, 150)]
    draw.polygon(vit_points, fill=(250, 248, 245, 240))
    draw.ellipse((110, 115, 190, 185), fill=(255, 255, 255, 255))
    vit_img = vit_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 14. Tinea (Ringworm)
    tin_img = make_skin_base((235, 205, 180))
    draw = ImageDraw.Draw(tin_img, 'RGBA')
    draw.ellipse((80, 80, 220, 220), outline=(210, 75, 65, 230), width=14)
    draw.ellipse((96, 96, 204, 204), fill=(235, 205, 180, 180))
    draw.ellipse((82, 82, 218, 218), outline=(245, 235, 225, 140), width=4)
    tin_img = tin_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 15. Urticaria (Hives - raised edematous wheal with pale center)
    urt_img = make_skin_base((238, 205, 185))
    draw = ImageDraw.Draw(urt_img, 'RGBA')
    draw.ellipse((90, 90, 210, 210), fill=(235, 110, 120, 190))
    draw.ellipse((110, 110, 190, 190), fill=(248, 225, 220, 230)) # pale wheal center
    urt_img = urt_img.filter(ImageFilter.GaussianBlur(radius=5))

    # 16. Shingles (Herpes Zoster - dermatomal cluster of clear fluid vesicles on red base)
    shn_img = make_skin_base((235, 195, 180))
    draw = ImageDraw.Draw(shn_img, 'RGBA')
    draw.polygon([(70, 110), (130, 90), (220, 140), (230, 200), (160, 220), (80, 170)], fill=(225, 65, 65, 160))
    for v in [(110, 130), (125, 145), (140, 135), (155, 155), (170, 145), (185, 165), (135, 165), (150, 185)]:
        draw.ellipse((v[0]-8, v[1]-8, v[0]+8, v[1]+8), fill=(255, 245, 235, 230), outline=(240, 100, 100, 200))
    shn_img = shn_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 17. Impetigo (Honey-colored golden crusts on erythematous base)
    imp_img = make_skin_base((235, 200, 180))
    draw = ImageDraw.Draw(imp_img, 'RGBA')
    draw.ellipse((85, 85, 215, 215), fill=(225, 75, 65, 180))
    # Golden honey crusts
    for c in [(115, 115), (150, 110), (170, 145), (135, 155), (120, 175), (160, 170)]:
        draw.ellipse((c[0]-14, c[1]-14, c[0]+14, c[1]+14), fill=(220, 170, 60, 240), outline=(180, 130, 30, 220))
    imp_img = imp_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 18. Alopecia Areata (Smooth oval non-scarring patch of scalp hair loss)
    alo_img = Image.new('RGB', (300, 300), (45, 30, 25)) # Dark scalp hair
    draw = ImageDraw.Draw(alo_img, 'RGBA')
    # Hair texture lines
    for i in range(0, 300, 4):
        draw.line([(0, i), (300, i+10)], fill=(30, 20, 15), width=2)
    # Smooth flesh-colored hair loss patch
    draw.ellipse((90, 80, 210, 220), fill=(238, 206, 179, 255))
    alo_img = alo_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 19. Contact Dermatitis (Geometric demarcated erythematous patch with microvesicles)
    cd_img = make_skin_base((235, 200, 180))
    draw = ImageDraw.Draw(cd_img, 'RGBA')
    # Sharply demarcated rectangular/geometric band (e.g. watch strap / tape boundary)
    draw.rectangle([(80, 100), (220, 200)], fill=(235, 70, 70, 190))
    for v in [(95, 120), (120, 140), (150, 125), (180, 160), (140, 175), (200, 130), (105, 165)]:
        draw.ellipse((v[0]-4, v[1]-4, v[0]+4, v[1]+4), fill=(255, 235, 220, 220), outline=(220, 50, 50, 200))
    cd_img = cd_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 20. Seborrheic Dermatitis (Greasy yellowish waxy scales over patchy erythema)
    seb_img = make_skin_base((238, 205, 180))
    draw = ImageDraw.Draw(seb_img, 'RGBA')
    draw.ellipse((80, 80, 220, 220), fill=(230, 110, 90, 170))
    for s in [(100, 110), (140, 100), (170, 130), (120, 160), (160, 170), (135, 135), (185, 140), (105, 145)]:
        draw.ellipse((s[0]-8, s[1]-6, s[0]+8, s[1]+6), fill=(235, 205, 110, 230), outline=(200, 165, 70, 220))
    seb_img = seb_img.filter(ImageFilter.GaussianBlur(radius=3))

    # 21. Folliculitis (Discrete follicular pustules pierced by central hair shafts)
    fol_img = make_skin_base((235, 205, 185))
    draw = ImageDraw.Draw(fol_img, 'RGBA')
    follicles = [(100, 100), (170, 95), (130, 150), (200, 160), (90, 180), (160, 210)]
    for fx, fy in follicles:
        draw.ellipse((fx-16, fy-16, fx+16, fy+16), fill=(230, 60, 60, 190))
        draw.ellipse((fx-7, fy-7, fx+7, fy+7), fill=(255, 255, 210, 240))
        draw.line([(fx-8, fy-18), (fx+12, fy+22)], fill=(40, 25, 20, 240), width=2)
    fol_img = fol_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 22. Lichen Planus (Violaceous flat-topped polygonal papules with fine white Wickham striae)
    lp_img = make_skin_base((230, 195, 180))
    draw = ImageDraw.Draw(lp_img, 'RGBA')
    papules = [
        [(90, 100), (130, 90), (140, 125), (115, 145), (85, 125)],
        [(150, 140), (195, 130), (210, 165), (180, 190), (145, 170)],
        [(100, 160), (135, 155), (145, 190), (120, 210), (95, 195)]
    ]
    for poly in papules:
        draw.polygon(poly, fill=(160, 60, 150, 220))
    draw.line([(95, 110), (130, 120), (110, 135)], fill=(255, 255, 255, 190), width=1)
    draw.line([(155, 150), (190, 155), (175, 180)], fill=(255, 255, 255, 190), width=1)
    lp_img = lp_img.filter(ImageFilter.GaussianBlur(radius=2))

    # 23. Warts / Verruca (Hyperkeratotic exophytic papule with verrucous stippling and pinpoint thrombosed dots)
    wrt_img = make_skin_base((235, 205, 190))
    draw = ImageDraw.Draw(wrt_img, 'RGBA')
    draw.ellipse([80, 80, 220, 220], fill=(215, 185, 165, 240))
    draw.ellipse([95, 95, 205, 205], fill=(200, 175, 155, 250))
    # Stippled verrucous texture
    rng = np.random.RandomState(42)
    for _ in range(80):
        px = rng.randint(95, 205)
        py = rng.randint(95, 205)
        if (px - 150)**2 + (py - 150)**2 < 50**2:
            draw.ellipse([px-2, py-2, px+2, py+2], fill=(175, 150, 130, 220))
    # Pathognomonic pinpoint thrombosed capillaries (black/dark-red dots)
    for _ in range(12):
        bx = rng.randint(110, 190)
        by = rng.randint(110, 190)
        if (bx - 150)**2 + (by - 150)**2 < 40**2:
            draw.ellipse([bx-1, by-1, bx+2, by+2], fill=(30, 10, 10, 255))
    wrt_img = wrt_img.filter(ImageFilter.GaussianBlur(radius=1.5))

    # 24. Scabies (Serpiginous S-shaped intraepidermal burrows and excoriated erythematous papules)
    scab_img = make_skin_base((238, 208, 192))
    draw = ImageDraw.Draw(scab_img, 'RGBA')
    # Inflammatory background erythema
    draw.ellipse([60, 60, 240, 240], fill=(230, 160, 150, 120))
    # Serpiginous burrow tracks
    burrow_pts = [(90, 140), (110, 135), (130, 145), (150, 138), (175, 148), (200, 142)]
    for i in range(len(burrow_pts) - 1):
        draw.line([burrow_pts[i], burrow_pts[i+1]], fill=(190, 175, 165, 240), width=3)
        draw.line([burrow_pts[i], burrow_pts[i+1]], fill=(225, 220, 215, 200), width=1)
    # Tiny vesicle at burrow terminus (mite location)
    draw.ellipse([198, 140, 204, 146], fill=(255, 255, 255, 240))
    # Excoriated papules and scratch marks
    for px, py in [(105, 95), (145, 105), (175, 115), (120, 185), (160, 195), (85, 170)]:
        draw.ellipse([px-6, py-6, px+6, py+6], fill=(210, 60, 60, 220))
        draw.ellipse([px-2, py-2, px+2, py+2], fill=(130, 20, 20, 240))
    # Linear excoriation scratch line
    draw.line([(80, 120), (130, 110)], fill=(180, 40, 40, 180), width=2)
    scab_img = scab_img.filter(ImageFilter.GaussianBlur(radius=1.5))

    # 25. Athlete's Foot / Tinea Pedis (Macerated white skin, fissuring, and erythematous scaling)
    af_img = make_skin_base((232, 200, 185))
    draw = ImageDraw.Draw(af_img, 'RGBA')
    # Deep erythematous raw inflamed toe-web base
    draw.rectangle([70, 70, 230, 230], fill=(225, 110, 100, 170))
    # Soft white macerated peeling skin
    draw.ellipse([90, 80, 210, 160], fill=(245, 245, 240, 230))
    draw.ellipse([95, 140, 205, 210], fill=(240, 238, 235, 220))
    # Painful red linear fissures (cracks)
    draw.line([(100, 140), (150, 145), (190, 140)], fill=(160, 20, 20, 255), width=3)
    draw.line([(140, 110), (145, 170)], fill=(170, 25, 25, 255), width=2)
    # Surrounding fine peeling collarette scales
    for _ in range(40):
        sx = rng.randint(80, 220)
        sy = rng.randint(80, 220)
        draw.arc([sx, sy, sx+12, sy+8], start=30, end=200, fill=(255, 255, 255, 200), width=1)
    af_img = af_img.filter(ImageFilter.GaussianBlur(radius=1.8))

    # 26. Nail Fungus / Onychomycosis (Thickened yellowish-brown onycholytic nail plate with friable debris)
    nf_img = make_skin_base((235, 202, 188))
    draw = ImageDraw.Draw(nf_img, 'RGBA')
    # Nail bed contour
    draw.rounded_rectangle([70, 60, 230, 240], radius=35, fill=(215, 175, 150, 255))
    # Distal half yellow-brown dystrophic discoloration
    draw.rounded_rectangle([75, 120, 225, 235], radius=20, fill=(190, 145, 55, 245))
    draw.rounded_rectangle([85, 160, 215, 235], radius=15, fill=(150, 105, 35, 255))
    # Subungual hyperkeratotic friable white/chalky streaks
    for x in range(95, 210, 15):
        draw.line([(x, 130), (x + rng.randint(-5, 5), 230)], fill=(235, 225, 180, 220), width=3)
    # Rough crumbling free edge
    draw.line([(75, 232), (225, 232)], fill=(110, 75, 20, 255), width=5)
    nf_img = nf_img.filter(ImageFilter.GaussianBlur(radius=1.8))

    # 27. Cellulitis (Spreading, intense, poorly demarcated, warm, glossy erythematous plaque with edema)
    cel_img = make_skin_base((235, 205, 192))
    draw = ImageDraw.Draw(cel_img, 'RGBA')
    # Deep confluent advancing hot erythema (bright glossy crimson red)
    draw.ellipse([40, 40, 260, 260], fill=(225, 60, 55, 160))
    draw.ellipse([65, 65, 235, 235], fill=(215, 45, 45, 200))
    draw.ellipse([90, 90, 210, 210], fill=(205, 30, 35, 230))
    # Shiny skin gloss highlights
    draw.ellipse([110, 95, 190, 135], fill=(255, 170, 170, 110))
    # Peau d'orange follicle pitting dots
    for _ in range(70):
        px = rng.randint(70, 230)
        py = rng.randint(70, 230)
        draw.ellipse([px-1, py-1, px+1, py+1], fill=(160, 20, 20, 150))
    cel_img = cel_img.filter(ImageFilter.GaussianBlur(radius=3.5))

    # 28. Chickenpox / Varicella ("Dewdrop on a rose petal" pleomorphic vesicles, papules, and crusted scabs)
    cp_img = make_skin_base((236, 206, 192))
    draw = ImageDraw.Draw(cp_img, 'RGBA')
    # Multiple lesions in different developmental stages
    # Stage 1: Red papules
    for px, py in [(65, 80), (225, 95), (80, 215), (230, 205)]:
        draw.ellipse([px-10, py-10, px+10, py+10], fill=(220, 70, 70, 200))
    # Stage 2: Dewdrops on rose petals (clear vesicle on erythematous base)
    for vx, vy in [(115, 105), (185, 120), (135, 185), (195, 190)]:
        draw.ellipse([vx-16, vy-16, vx+16, vy+16], fill=(230, 65, 65, 220)) # Red halo base
        draw.ellipse([vx-8, vy-8, vx+8, vy+8], fill=(255, 255, 255, 230)) # Clear teardrop fluid
        draw.ellipse([vx-3, vy-3, vx, vy], fill=(255, 255, 255, 255)) # Glistening light reflection
    # Stage 3: Cloudy pustules
    for ux, uy in [(150, 140), (85, 155)]:
        draw.ellipse([ux-14, uy-14, ux+14, uy+14], fill=(225, 60, 60, 220))
        draw.ellipse([ux-7, uy-7, ux+7, uy+7], fill=(240, 235, 190, 240))
    # Stage 4: Crusted dark-brown scabs
    for cx, cy in [(110, 70), (210, 150), (165, 225)]:
        draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(120, 45, 30, 240))
    cp_img = cp_img.filter(ImageFilter.GaussianBlur(radius=1.8))

    samples = [
        ("sample_melanoma.jpg", mel_img),
        ("sample_bcc.jpg", bcc_img),
        ("sample_scc.jpg", scc_img),
        ("sample_squamous_cell_carcinoma.jpg", scc_img),
        ("sample_ak.jpg", ak_img),
        ("sample_actinic_keratosis.jpg", ak_img),
        ("sample_nevus.jpg", nev_img),
        ("sample_benign_keratosis.jpg", sk_img),
        ("sample_dermatofibroma.jpg", df_img),
        ("sample_vascular.jpg", vas_img),
        ("sample_eczema.jpg", ecz_img),
        ("sample_psoriasis.jpg", pso_img),
        ("sample_acne.jpg", acn_img),
        ("sample_rosacea.jpg", ros_img),
        ("sample_vitiligo.jpg", vit_img),
        ("sample_tinea.jpg", tin_img),
        ("sample_urticaria.jpg", urt_img),
        ("sample_urticaria_hives.jpg", urt_img),
        ("sample_shingles.jpg", shn_img),
        ("sample_shingles_herpes_zoster.jpg", shn_img),
        ("sample_impetigo.jpg", imp_img),
        ("sample_alopecia.jpg", alo_img),
        ("sample_alopecia_areata.jpg", alo_img),
        ("sample_contact_dermatitis.jpg", cd_img),
        ("sample_seborrheic_dermatitis.jpg", seb_img),
        ("sample_folliculitis.jpg", fol_img),
        ("sample_lichen_planus.jpg", lp_img),
        ("sample_warts.jpg", wrt_img),
        ("sample_scabies.jpg", scab_img),
        ("sample_athletes_foot.jpg", af_img),
        ("sample_nail_fungus.jpg", nf_img),
        ("sample_cellulitis.jpg", cel_img),
        ("sample_chickenpox.jpg", cp_img),
    ]

    for filename, img in samples:
        b_path = os.path.join(backend_samples, filename)
        f_path = os.path.join(frontend_samples, filename)
        img.save(b_path, "JPEG", quality=95)
        img.save(f_path, "JPEG", quality=95)
        print(f"[OK] Generated sample: {filename}")

if __name__ == '__main__':
    create_samples()
