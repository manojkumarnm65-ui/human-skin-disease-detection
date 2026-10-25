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

    samples = [
        ("sample_melanoma.jpg", mel_img),
        ("sample_bcc.jpg", bcc_img),
        ("sample_scc.jpg", scc_img),
        ("sample_ak.jpg", ak_img),
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
        ("sample_shingles.jpg", shn_img),
        ("sample_impetigo.jpg", imp_img),
        ("sample_alopecia.jpg", alo_img),
    ]

    for filename, img in samples:
        b_path = os.path.join(backend_samples, filename)
        f_path = os.path.join(frontend_samples, filename)
        img.save(b_path, "JPEG", quality=95)
        img.save(f_path, "JPEG", quality=95)
        print(f"[OK] Generated sample: {filename}")

if __name__ == '__main__':
    create_samples()
