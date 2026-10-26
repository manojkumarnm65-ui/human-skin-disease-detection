import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Zap,
  Eye,
  BookOpen,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  Cpu,
  BarChart3,
  HeartPulse,
  Send,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Human Skin Disease Detection';
  }, []);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }, 5000);
    }
  };

  const supportedConditions = [
    {
      name: 'Melanoma',
      type: 'Malignant Neoplasm',
      severity: 'Concerning / High Risk',
      badgeClass: 'badge-concerning',
      desc: 'The most serious skin cancer originating from melanocytes. Early detection is paramount for successful excision.',
      img: '/samples/sample_melanoma.jpg'
    },
    {
      name: 'Basal Cell Carcinoma',
      type: 'Malignant Neoplasm',
      severity: 'Concerning / Moderate Risk',
      badgeClass: 'badge-concerning',
      desc: 'Most common human malignancy. Presents as a translucent pearly papule with fine branching telangiectasias.',
      img: '/samples/sample_bcc.jpg'
    },
    {
      name: 'Melanocytic Nevus',
      type: 'Benign Mole',
      severity: 'Benign / Low Risk',
      badgeClass: 'badge-benign',
      desc: 'Common harmless pigment proliferation. Typically uniform in shape and color, requiring routine monitoring.',
      img: '/samples/sample_nevus.jpg'
    },
    {
      name: 'Benign Keratosis',
      type: 'Benign Epidermal',
      severity: 'Benign / Low Risk',
      badgeClass: 'badge-benign',
      desc: 'Harmless warty stuck-on keratotic plaques common in adults, with zero malignant transformation potential.',
      img: '/samples/sample_benign_keratosis.jpg'
    },
    {
      name: 'Eczema',
      type: 'Atopic Dermatitis',
      severity: 'Manageable / Chronic',
      badgeClass: 'badge-chronic',
      desc: 'Chronic pruritic inflammatory dermatosis causing dry, erythematous, and sensitive skin patches.',
      img: '/samples/sample_eczema.jpg'
    },
    {
      name: 'Psoriasis',
      type: 'Autoimmune Dermatosis',
      severity: 'Manageable / Chronic',
      badgeClass: 'badge-chronic',
      desc: 'Rapid epidermal cell turnover resulting in elevated erythematous plaques with micaceous silvery scales.',
      img: '/samples/sample_psoriasis.jpg'
    },
    {
      name: 'Acne Vulgaris',
      type: 'Pilosebaceous Disorder',
      severity: 'Benign / Treatable',
      badgeClass: 'badge-benign',
      desc: 'Inflammatory follicular occlusion involving sebum hyperproduction and Cutibacterium acnes colonization.',
      img: '/samples/sample_acne.jpg'
    },
    {
      name: 'Rosacea',
      type: 'Vascular / Erythema',
      severity: 'Manageable / Chronic',
      badgeClass: 'badge-chronic',
      desc: 'Persistent central facial flushing, erythema, and telangiectasias triggered by sunlight, spice, and heat.',
      img: '/samples/sample_rosacea.jpg'
    },
    {
      name: 'Vitiligo',
      type: 'Autoimmune Pigmentary',
      severity: 'Manageable / Chronic',
      badgeClass: 'badge-chronic',
      desc: 'Targeted autoimmune destruction of melanocytes producing distinct milky-white cutaneous patches.',
      img: '/samples/sample_vitiligo.jpg'
    },
    {
      name: 'Tinea (Ringworm)',
      type: 'Fungal Infection',
      severity: 'Infectious / Treatable',
      badgeClass: 'badge-benign',
      desc: 'Superficial dermatophyte infection forming an annular circular erythematous plaque with active scaling borders.',
      img: '/samples/sample_tinea.jpg'
    },
    {
      name: 'Squamous Cell Carcinoma',
      type: 'Malignant Neoplasm',
      severity: 'Concerning / High Risk',
      badgeClass: 'badge-concerning',
      desc: 'Malignant keratinocyte tumor presenting as an indurated, hyperkeratotic papule or ulcerated nodule.',
      img: '/samples/sample_squamous_cell_carcinoma.jpg'
    },
    {
      name: 'Actinic Keratosis',
      type: 'Precancerous Dysplasia',
      severity: 'Concerning / Precancerous',
      badgeClass: 'badge-concerning',
      desc: 'Rough UV-induced erythematous sandpaper-like scaling patch capable of developing into squamous carcinoma.',
      img: '/samples/sample_actinic_keratosis.jpg'
    },
    {
      name: 'Dermatofibroma',
      type: 'Benign Fibrous Histiocytoma',
      severity: 'Benign / Low Risk',
      badgeClass: 'badge-benign',
      desc: 'Common harmless firm dermal nodule exhibiting a characteristic positive retraction/dimple sign upon lateral pinching.',
      img: '/samples/sample_dermatofibroma.jpg'
    },
    {
      name: 'Vascular Lesion',
      type: 'Benign Vascular Proliferation',
      severity: 'Benign / Low Risk',
      badgeClass: 'badge-benign',
      desc: 'Cherry angioma or pyogenic capillary cluster consisting of benign dilated microvascular ectasias.',
      img: '/samples/sample_vascular.jpg'
    },
    {
      name: 'Urticaria (Hives)',
      type: 'Allergic Dermatosis',
      severity: 'Acute / Manageable',
      badgeClass: 'badge-chronic',
      desc: 'Transient edematous erythematous wheals driven by mast cell degranulation and histamine release.',
      img: '/samples/sample_urticaria_hives.jpg'
    },
    {
      name: 'Shingles (Herpes Zoster)',
      type: 'Viral Dermatomal Infection',
      severity: 'Concerning / Urgent Antiviral',
      badgeClass: 'badge-concerning',
      desc: 'Unilateral painful dermatomal reactivation of the varicella-zoster virus with grouped vesicles.',
      img: '/samples/sample_shingles_herpes_zoster.jpg'
    },
    {
      name: 'Impetigo',
      type: 'Bacterial Pyoderma',
      severity: 'Infectious / Antibiotic Sensitive',
      badgeClass: 'badge-benign',
      desc: 'Superficial contagious bacterial infection featuring erythematous vesicles with diagnostic honey-colored crusts.',
      img: '/samples/sample_impetigo.jpg'
    },
    {
      name: 'Alopecia Areata',
      type: 'Autoimmune Folliculitis',
      severity: 'Manageable / Chronic',
      badgeClass: 'badge-chronic',
      desc: 'Non-scarring, patchy hair loss mediated by autoimmune T-cell attacks against anagen hair follicles.',
      img: '/samples/sample_alopecia_areata.jpg'
    }
  ];

  return (
    <div style={{ color: '#FFFFFF', overflowX: 'hidden', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* =========================================================================
          HERO SECTION (Matching Reference 4)
         ========================================================================= */}
      <section id="home" style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 24px',
        background: 'radial-gradient(ellipse at 70% 30%, rgba(1, 75, 170, 0.45) 0%, rgba(1, 26, 68, 0) 70%), var(--bg-primary)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* Left Content Column */}
            <div>
              {/* Badge */}
              <div
                className="animate-float"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  background: 'rgba(8, 201, 245, 0.12)',
                  border: '1px solid rgba(8, 201, 245, 0.35)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--cyan-accent)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  marginBottom: '20px',
                  boxShadow: '0 0 15px rgba(8, 201, 245, 0.25)',
                }}>
                <Zap size={14} />
                <span>AI POWERED DERMATOLOGY</span>
              </div>

              {/* Main Heading */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 4.8vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}>
                Human Skin Disease{' '}
                <span className="cyan-gradient-text" style={{ textShadow: '0 0 40px rgba(8, 201, 245, 0.5)' }}>
                  Detection
                </span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '560px',
                marginBottom: '32px',
              }}>
                Upload a skin image and receive an AI-assisted prediction of possible skin conditions.
                Our system uses deep-learning technology to support skin health awareness and early evaluation.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
                <Link
                  to={isAuthenticated ? '/upload' : '/register'}
                  className="btn-primary"
                  style={{ padding: '14px 32px', fontSize: '1.05rem' }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#about"
                  className="btn-secondary"
                  style={{ padding: '14px 28px', fontSize: '1.05rem' }}
                >
                  <span>Learn More</span>
                </a>
              </div>

              {/* Feature Indicators */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                maxWidth: '480px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                {[
                  { text: 'AI-Assisted Analysis', icon: Cpu },
                  { text: 'Fast Processing', icon: Zap },
                  { text: 'User-Friendly Interface', icon: Eye },
                  { text: 'Skin Health Awareness', icon: HeartPulse },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#CBD5E1', fontSize: '0.88rem' }}>
                      <CheckCircle size={16} color="var(--cyan-accent)" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Visual Graphic (Matching Reference 4: Lesion + Scanning Frame + Floating Result Card) */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Outer HUD ring */}
              <div style={{
                position: 'relative',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed rgba(8, 201, 245, 0.3)',
                boxShadow: '0 0 50px rgba(8, 123, 255, 0.25)',
              }}>
                {/* Secondary rotating accent border */}
                <div style={{
                  position: 'absolute',
                  inset: '-15px',
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: 'var(--cyan-accent)',
                  borderRightColor: 'var(--electric-blue)',
                  animation: 'hudRotate 20s linear infinite',
                }} />

                {/* Lesion image container */}
                <div style={{
                  position: 'relative',
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--cyan-accent)',
                  boxShadow: '0 0 30px rgba(8, 201, 245, 0.4)',
                }}>
                  <img
                    src="/samples/sample_nevus.jpg"
                    alt="Skin Lesion Scanning Target"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Animated Cyan Laser Scan Line */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--cyan-accent), #FFFFFF, var(--cyan-accent), transparent)',
                    boxShadow: '0 0 15px var(--cyan-accent), 0 0 30px var(--cyan-accent)',
                    animation: 'laserScan 3.2s ease-in-out infinite',
                    zIndex: 10,
                  }} />

                  {/* Scanning Crosshairs */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle, transparent 40%, rgba(1, 30, 75, 0.5) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      border: '1px solid rgba(8, 201, 245, 0.7)',
                      borderRadius: '50%',
                      boxShadow: '0 0 15px rgba(8, 201, 245, 0.4)',
                    }} />
                  </div>
                </div>

                {/* Floating Prediction Result Card (Demonstration Preview) */}
                <div
                  className="card-glass animate-float"
                  style={{
                    position: 'absolute',
                    bottom: '-30px',
                    right: '-20px',
                    width: '280px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(8, 201, 245, 0.4)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(8, 201, 245, 0.35)',
                    zIndex: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--cyan-accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Demonstration Preview
                    </span>
                    <span className="badge badge-benign" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Low Risk
                    </span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Melanocytic Nevus
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Score</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                      94.2%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '94.2%', height: '100%', background: 'linear-gradient(90deg, #087BFF, #08C9F5)', borderRadius: '3px' }} />
                  </div>

                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                    * Example demonstration preview.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ABOUT SKINCARE AI
         ========================================================================= */}
      <section id="about" style={{ padding: '90px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Pioneering Dermatological Screening
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              About SkinCare AI
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '16px' }}>
              Bridging modern computer vision with public health awareness to empower individuals with timely educational insights.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(8, 201, 245, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Cpu size={26} color="var(--cyan-accent)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Deep Neural Networks</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Our system utilizes state-of-the-art Convolutional Neural Networks (CNN) fine-tuned on benchmark dermatoscopic image repositories (such as the HAM10000 dataset), analyzing pigment patterns, border irregularities, and color distributions.
              </p>
            </div>

            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(8, 123, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Eye size={26} color="var(--electric-blue)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Early Awareness & Triage</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Skin diseases such as melanoma have a 99% 5-year survival rate when detected in early, localized stages. SkinCare AI promotes vigilance and helps users identify lesions that merit prompt examination by a certified dermatologist.
              </p>
            </div>

            <div className="card-glass" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Lock size={26} color="#10B981" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Privacy & Security First</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Images and predictions are secured with JWT authentication and randomized storage paths. All data is isolated to user accounts and never exposed or sold to third-party advertisers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HOW IT WORKS
         ========================================================================= */}
      <section style={{ padding: '90px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Seamless User Workflow
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '16px' }}>
              Simple 4-step pipeline from capturing your photo to receiving AI predictions and educational guidance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Upload Image',
                desc: 'Upload a clear, well-lit photo of the skin lesion or area of concern from your phone or computer.',
                icon: UploadCloud
              },
              {
                step: '02',
                title: 'Quality Verification',
                desc: 'Automated algorithms check lighting, sharpness, and focus to ensure the image meets analysis criteria.',
                icon: ShieldCheck
              },
              {
                step: '03',
                title: 'Deep Learning Scan',
                desc: 'The convolutional model processes pixel features to classify probabilities across known conditions.',
                icon: Cpu
              },
              {
                step: '04',
                title: 'Guidance & History',
                desc: 'Review model confidence, educational disease facts, self-care guidance, and consult recommendations.',
                icon: BarChart3
              }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="card-glass" style={{ padding: '28px 24px', position: 'relative' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(8, 201, 245, 0.25)',
                    marginBottom: '12px'
                  }}>
                    {st.step}
                  </div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(8, 123, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Icon size={22} color="var(--cyan-accent)" />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{st.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SUPPORTED CONDITIONS
         ========================================================================= */}
      <section style={{ padding: '90px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Classification Scope
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
                Supported Skin Conditions
              </h2>
            </div>
            <Link to="/diseases" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <BookOpen size={18} />
              <span>Explore Disease Library</span>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {supportedConditions.map((cond, idx) => (
              <div key={idx} className="card-glass interactive-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={cond.img}
                    alt={cond.name}
                    className="lesion-img-hover"
                    onError={(e) => { e.target.src = '/samples/sample_melanoma.jpg'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className={`badge ${cond.badgeClass}`}>{cond.severity}</span>
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--cyan-accent)', fontWeight: 600 }}>{cond.type}</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '4px', marginBottom: '8px' }}>{cond.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>{cond.desc}</p>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link
                      to="/diseases"
                      style={{ color: 'var(--cyan-accent)', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Read Medical Profile</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: KEY FEATURES
         ========================================================================= */}
      <section id="features" style={{ padding: '90px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Engineered For Clinical Education
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              Key System Features
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {[
              {
                title: 'Multi-Class Inference',
                desc: 'Evaluates 5 primary dermatological conditions with comprehensive softmax confidence distributions.',
                icon: Layers
              },
              {
                title: 'ABCDE Clinical Heuristics',
                desc: 'Incorporates dermatological criteria (Asymmetry, Border, Color, Diameter, Evolution) into quality evaluations.',
                icon: Activity
              },
              {
                title: 'Interactive Dashboard Analytics',
                desc: 'Monitor longitudinal screening statistics, normal vs concerning trends, and weekly detection overviews.',
                icon: BarChart3
              },
              {
                title: 'Dermatology Reference Library',
                desc: 'Curated library with signs, risk factors, home skin care, and citations from WHO, AAD, and Mayo Clinic.',
                icon: BookOpen
              },
              {
                title: 'Encrypted User Records',
                desc: 'Passwords hashed with PBKDF2/Werkzeug, token authentication with JWT, and SQL injection protection.',
                icon: Lock
              },
              {
                title: 'Responsive Cross-Device UI',
                desc: 'Engineered with clean CSS, dark navy aesthetics, and smooth usability on phones, tablets, and laptops.',
                icon: Zap
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card-glass" style={{ padding: '28px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.2), rgba(8, 201, 245, 0.1))',
                    border: '1px solid rgba(8, 201, 245, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    boxShadow: '0 0 15px rgba(8, 201, 245, 0.2)'
                  }}>
                    <Icon size={22} color="var(--cyan-accent)" />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PROMINENT MEDICAL DISCLAIMER
         ========================================================================= */}
      <section style={{ padding: '40px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="disclaimer-banner">
            <AlertTriangle size={32} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FBBF24', marginBottom: '6px' }}>
                Important Medical Safety Notice & Educational Disclaimer
              </div>
              <p style={{ color: '#FDE68A', lineHeight: 1.6, fontSize: '0.9rem' }}>
                SkinCare AI is an educational demonstration and engineering research tool designed to foster dermatological awareness.
                It is <strong>NOT a certified diagnostic medical device</strong> and should never be used as a standalone confirmation or exclusion
                of melanoma, skin cancer, or any other dermatological pathology. Any suspicious, evolving, bleeding, or concerning skin lesion
                must be clinically evaluated by a board-certified dermatologist or qualified healthcare practitioner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CONTACT FORM
         ========================================================================= */}
      <section id="contact" style={{ padding: '90px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Academic & Technical Inquiries
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em' }}>
              Contact Our Project Team
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '12px' }}>
              Have questions regarding our deep-learning architecture or dataset validation? Send us a message below.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '36px' }}>
            {contactSubmitted ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
              }}>
                <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '8px' }}>Thank You for Reaching Out!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Your inquiry has been received. Our research team will review your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Morgan"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="alex@university.edu"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Project Inquiry / Feedback"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="Describe your inquiry or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer style={{
        background: 'linear-gradient(180deg, #011E48 0%, #01122C 100%)',
        borderTop: '2px solid #014BAA',
        boxShadow: '0 -4px 25px rgba(1, 75, 170, 0.35)',
        padding: '50px 24px 30px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #087BFF, #08C9F5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Activity size={18} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Human Skin Disease <span style={{ color: 'var(--cyan-accent)' }}>Detection</span></span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                AI-Powered Skin Analysis for a Healthier Future. An educational deep-learning screening project.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#FFFFFF' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <li><a href="#home" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</a></li>
                <li><a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</a></li>
                <li><a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a></li>
                <li><Link to="/diseases" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Disease Library</Link></li>
                <li><a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#FFFFFF' }}>Medical Disclaimer</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                Not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}>
            <div>
              © 2026 Human Skin Disease Detection Using Deep Learning. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>College Final Year Project</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
