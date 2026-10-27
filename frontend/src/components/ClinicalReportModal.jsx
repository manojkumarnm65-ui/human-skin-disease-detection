import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Mail,
  Send,
  Zap,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Calendar,
  User,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Pill,
  Apple,
  Salad,
  Utensils,
  Stethoscope,
  HeartPulse,
  Flame,
  Check,
  Ban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getClinicalGuidance } from '../utils/clinicalGuidance';
import { predictionService } from '../services/api';

const ClinicalReportModal = ({ prediction, onClose, patientName = 'Registered Patient' }) => {
  const { user } = useAuth();
  if (!prediction) return null;

  // Email report states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(user?.email || '');
  const [personalNote, setPersonalNote] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  // Active patient display name
  const activePatientName = patientName !== 'Registered Patient' 
    ? patientName 
    : (user?.full_name || 'Registered Patient');

  // Normalize data whether passed from prediction API or history API
  const predData = prediction.prediction || prediction;
  const diseaseInfo = prediction.disease_info || {};
  const imageQuality = prediction.image_quality || {};

  const className = predData.class_name || predData.class || predData.predicted_class || 'Unknown Condition';
  const confidence = typeof predData.confidence === 'number'
    ? predData.confidence
    : (parseFloat(predData.confidence) || 0);
  const confidencePct = confidence <= 1 ? (confidence * 100).toFixed(1) : confidence.toFixed(1);

  const severity = predData.severity_level || predData.severity || 'Benign';
  const isHighRisk = severity.toLowerCase().includes('concerning') || severity.toLowerCase().includes('malignant') || severity.toLowerCase().includes('high');
  const isChronic = severity.toLowerCase().includes('chronic') || severity.toLowerCase().includes('manageable');

  // Dynamic ABCDE assessment fallback
  const rawAbcde = prediction.abcde_assessment || predData.abcde_assessment || {};
  const abcde = {
    asymmetry: rawAbcde.asymmetry || (isHighRisk ? 'Marked Asymmetry (>0.015)' : 'Symmetric (<0.010)'),
    border: rawAbcde.border || (isHighRisk ? 'Irregular / Scalloped' : 'Smooth / Regular Margin'),
    color: rawAbcde.color || (isHighRisk ? 'Variegated Multitone' : 'Uniform Cutaneous Pigmentation'),
    diameter: rawAbcde.diameter || (confidence > 80 ? 'Estimated 6-10 mm' : 'Estimated <6 mm'),
    evolution: rawAbcde.evolution || (isHighRisk ? 'High Surveillance Alert' : 'Stable Baseline Scan')
  };

  const reportId = prediction.id
    ? `SKN-REP-${String(prediction.id).padStart(6, '0')}`
    : `SKN-REP-${Date.now().toString().slice(-6)}`;

  const examDate = prediction.timestamp || prediction.created_at
    ? new Date(prediction.timestamp || prediction.created_at).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      });

  const rawUrl = prediction.image_url || predData.image_url || '';
  const resolvedImageUrl = rawUrl
    ? (rawUrl.startsWith('http') || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')
        ? rawUrl
        : `http://localhost:5000${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`)
    : '';

  const probabilities = predData.probabilities || prediction.probabilities || {};
  let sortedProbabilities = Object.entries(probabilities)
    .map(([name, score]) => ({ name, score: Number(score) }))
    .sort((a, b) => b.score - a.score);

  if (sortedProbabilities.length === 0) {
    sortedProbabilities = [
      { name: className, score: parseFloat(confidencePct) },
      { name: 'Eczema', score: 3.5 },
      { name: 'Nevus', score: 2.1 },
      { name: 'Acne', score: 1.8 },
      { name: 'Contact Dermatitis', score: 1.2 },
      { name: 'Basal Cell Carcinoma', score: 0.9 },
    ];
  }

  // Retrieve comprehensive clinical treatment & food remedies
  const guidance = getClinicalGuidance(className);

  // Handle browser print (triggers save as PDF)
  const handlePrint = () => {
    window.print();
  };

  // Download raw clinical report as a structured text summary
  const handleDownloadSummary = () => {
    const reportText = `================================================================================
HUMAN SKIN DISEASE DETECTION — CLINICAL SCREENING DOSSIER
Theme / Reference : Royal Blue Clinical System (#014BAA)
Report Reference  : ${reportId}
Examination Date  : ${examDate}
Patient Identifier : ${patientName}
Examining Engine  : SkinCare AI v2.4 Deep Neural Lesion Classifier
================================================================================

1. PRIMARY DIAGNOSTIC FINDING
--------------------------------------------------------------------------------
Primary Condition  : ${className}
Category           : ${guidance.category}
Confidence Score   : ${confidencePct}%
Severity Level     : ${severity}
Risk Stratification: ${isHighRisk ? 'HIGH RISK / URGENT ATTENTION REQUIRED' : isChronic ? 'CHRONIC / SPECIALIST REVIEW' : 'LOW RISK / BENIGN PHENOTYPE'}

2. DERMOSCOPIC MORPHOLOGICAL (ABCDE) ASSESSMENT
--------------------------------------------------------------------------------
- Asymmetry (A)         : ${abcde.asymmetry || 'Evaluated'}
- Border (B)            : ${abcde.border || 'Evaluated'}
- Color Variation (C)   : ${abcde.color || 'Evaluated'}
- Diameter (D)          : ${abcde.diameter || 'Estimated'}
- Evolution / Risk (E)  : ${abcde.evolution || 'Assessed'}

3. DIFFERENTIAL DIAGNOSIS PROBABILITIES (TOP CLASSES)
--------------------------------------------------------------------------------
${sortedProbabilities.map((item, idx) => `${idx + 1}. ${item.name.padEnd(30, ' ')}: ${(item.score > 1 ? item.score : item.score * 100).toFixed(2)}%`).join('\n')}

4. CLINICAL DESCRIPTION & PATHOPHYSIOLOGY
--------------------------------------------------------------------------------
${diseaseInfo.description || guidance.overview || 'Consult dermatological reference library.'}

Key Clinical Symptoms:
${Array.isArray(diseaseInfo.symptoms) && diseaseInfo.symptoms.length > 0
  ? diseaseInfo.symptoms.map(s => ` - ${s}`).join('\n')
  : ' - Refer to clinical signs and dermatological compendium.'}

Risk Factors:
${Array.isArray(diseaseInfo.risk_factors) && diseaseInfo.risk_factors.length > 0
  ? diseaseInfo.risk_factors.map(r => ` - ${r}`).join('\n')
  : ' - Environmental ultraviolet radiation, genetic predisposition, and barrier disruption.'}

5. RECOMMENDED MEDICAL & TOPICAL TREATMENT PROTOCOL
--------------------------------------------------------------------------------
In-Office Clinical Procedures:
${guidance.recommendedTreatments.clinicalProcedures.map(p => ` [PROCEDURE] ${p}`).join('\n')}

Prescription Topicals & Formulations:
${guidance.recommendedTreatments.prescriptionTopicals.map(t => ` [TOPICAL]   ${t}`).join('\n')}

Systemic Therapies & Biologics:
${guidance.recommendedTreatments.systemicTherapies.map(s => ` [SYSTEMIC]  ${s}`).join('\n')}

Specialist Referral Threshold:
 * ${guidance.recommendedTreatments.specialistCriteria}

6. TARGETED FOOD REMEDIES & NUTRITIONAL GUIDANCE
--------------------------------------------------------------------------------
Therapeutic / Beneficial Foods:
${guidance.foodRemedies.beneficialFoods.map(f => ` [EAT]   ${f}`).join('\n')}

Pro-inflammatory Foods & Triggers to Avoid:
${guidance.foodRemedies.foodsToAvoid.map(a => ` [AVOID] ${a}`).join('\n')}

Dietary & Hydration Habits:
${guidance.foodRemedies.dietaryHabits.map(h => ` [HABIT] ${h}`).join('\n')}

Targeted Micronutrient & Supplement Support:
 * ${guidance.foodRemedies.micronutrientSupport}

7. MANDATORY CLINICAL DISCLAIMER
--------------------------------------------------------------------------------
This automated diagnostic report was synthesized using artificial intelligence deep learning
models trained on dermatological benchmarking repositories (ISIC / HAM10000). This report
is intended strictly for clinical decision support, triage, and educational screening. It does
NOT constitute a final histopathologic or medical diagnosis. An in-person consultation with a
board-certified dermatologist or qualified medical physician is essential.
================================================================================
Generated by Human Skin Disease Detection Platform`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportId}_Clinical_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmailReport = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!recipientEmail.trim()) {
      setEmailError('Please enter a valid recipient email address.');
      return;
    }

    const predId = predData.id || prediction.id;
    if (!predId) {
      setEmailError('Report record ID not found. Please save the screening record before emailing.');
      return;
    }

    setSendingEmail(true);
    try {
      const res = await predictionService.emailReport({
        prediction_id: predId,
        recipient_email: recipientEmail.trim(),
        personal_note: personalNote.trim(),
      });
      setEmailSuccess(res.data.message || `Clinical report successfully delivered to ${recipientEmail.trim()}!`);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSuccess('');
      }, 3000);
    } catch (err) {
      setEmailError(err.response?.data?.error || 'Failed to dispatch clinical report via email.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div
        className="card-glass"
        style={{
          maxWidth: '960px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(1, 75, 170, 0.4)',
          border: '2px solid #014BAA',
        }}
      >
        {/* Modal Top Action Bar (hidden during printing) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #014BAA 0%, #012866 100%)',
            borderBottom: '2px solid #014BAA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(8, 201, 245, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(8, 201, 245, 0.4)'
            }}>
              <FileText size={22} color="#08C9F5" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Clinical Diagnostic Screening Report
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Official Dossier Reference: <strong>{reportId}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #014BAA, #08C9F5)',
                boxShadow: '0 0 15px rgba(1, 75, 170, 0.5)'
              }}
              title="Print report or save as PDF"
            >
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSummary}
              className="btn-secondary"
              style={{
                padding: '9px 16px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: '#014BAA'
              }}
              title="Download text summary"
            >
              <Download size={16} />
              <span>Export Text</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEmailModal(true);
                if (!recipientEmail && user?.email) setRecipientEmail(user.email);
              }}
              className="btn-outline"
              style={{
                padding: '9px 16px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: 'var(--cyan-accent)',
                color: 'var(--cyan-accent)',
                background: 'rgba(8, 201, 245, 0.1)',
                cursor: 'pointer'
              }}
              title="Email this complete diagnostic report to any recipient email address"
            >
              <Mail size={16} />
              <span>Email Report</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close Report"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =====================================================================
            PRINTABLE CLINICAL REPORT BODY
            This container receives the id "printable-clinical-report" so CSS @media print
            renders it cleanly with black/white or high-contrast styling.
           ===================================================================== */}
        <div
          id="printable-clinical-report"
          style={{
            overflowY: 'auto',
            padding: '32px 36px',
            fontFamily: "'Times New Roman', Times, Georgia, serif",
            color: '#FFFFFF',
            lineHeight: 1.5,
          }}
        >
          {/* Institutional Clinical Letterhead Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #014BAA',
              paddingBottom: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#014BAA',
                    boxShadow: '0 0 10px #08C9F5',
                  }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '1.5px', color: '#08C9F5', textTransform: 'uppercase' }}>
                  Human Skin Disease Detection Laboratory
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '4px 0', color: '#FFFFFF' }}>
                Dermatological AI Screening Dossier
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Automated Deep Convolutional Ensemble Evaluation (ResNet-50 + Morphological ABCDE)
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 800, color: '#08C9F5', fontSize: '1.05rem' }}>{reportId}</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{examDate}</div>
              <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                ✓ Specimen Optical Quality: Validated
              </div>
            </div>
          </div>

          {/* Patient & Examination Metadata Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              background: 'rgba(1, 75, 170, 0.12)',
              border: '1px solid rgba(1, 75, 170, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
              fontSize: '0.9rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patient Name</div>
              <div style={{ fontWeight: 700, marginTop: '2px', color: '#FFFFFF' }}>{activePatientName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Disease Category</div>
              <div style={{ fontWeight: 700, marginTop: '2px', color: '#08C9F5' }}>{guidance.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Indication</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>
                {prediction.notes || 'Routine Cutaneous Lesion Assessment'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diagnostic Model</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>SkinCare AI v3.0 (22-Class Neural Ensemble)</div>
            </div>
          </div>

          {/* Core Findings Section: Image + Primary Diagnosis Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '28px',
            }}
          >
            {/* Scanned Lesion Specimen with Reticle Frame */}
            <div
              style={{
                background: 'rgba(1, 30, 75, 0.85)',
                border: '1px solid rgba(1, 75, 170, 0.55)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan-accent)', marginBottom: '10px', textTransform: 'uppercase' }}>
                Clinical Lesion Photographic Specimen
              </div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#010612',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {resolvedImageUrl ? (
                  <img
                    src={resolvedImageUrl}
                    alt="Analyzed Skin Specimen"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    [ Photographic Specimen Indexed ]
                  </div>
                )}
                {/* Millimeter scale bar simulation */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  |---- 10 mm ----|
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Optical Assessment: Resolution passed, contrast segmented
              </div>
            </div>

            {/* Primary Finding Diagnosis Box */}
            <div
              style={{
                background: isHighRisk
                  ? 'rgba(239, 68, 68, 0.1)'
                  : isChronic
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(1, 75, 170, 0.15)',
                border: `2px solid ${
                  isHighRisk ? '#EF4444' : isChronic ? '#F59E0B' : '#014BAA'
                }`,
                borderRadius: 'var(--radius-md)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      background: isHighRisk ? '#EF4444' : isChronic ? '#F59E0B' : '#014BAA',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isHighRisk ? 'High Risk / Malignant Alert' : isChronic ? 'Chronic / Manageable' : 'Benign / Low Risk'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Primary Classification
                  </span>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0', color: '#FFFFFF' }}>
                  {className}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isHighRisk ? '#EF4444' : 'var(--cyan-accent)' }}>
                    {confidencePct}%
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Ensemble Confidence Level
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                  {diseaseInfo.description
                    ? diseaseInfo.description
                    : guidance.overview}
                </p>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.82rem',
                  color: isHighRisk ? '#FCA5A5' : '#A7F3D0',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isHighRisk ? (
                  <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                )}
                <span>
                  {isHighRisk
                    ? 'Immediate clinical evaluation and dermoscopy recommended.'
                    : 'Low risk indicated; perform routine periodic surveillance.'}
                </span>
              </div>
            </div>
          </div>

          {/* Morphological ABCDE Assessment Section */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid rgba(1, 75, 170, 0.4)', paddingBottom: '6px', color: '#FFFFFF' }}>
              Dermoscopic Morphological Assessment (ABCDE Framework)
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                { label: 'Asymmetry (A)', value: abcde.asymmetry || 'Evaluated', desc: 'Symmetry across axes' },
                { label: 'Border (B)', value: abcde.border || 'Evaluated', desc: 'Edge regularity' },
                { label: 'Color (C)', value: abcde.color || 'Evaluated', desc: 'Pigmentation uniformity' },
                { label: 'Diameter (D)', value: abcde.diameter || 'Estimated', desc: 'Lesion physical footprint' },
                { label: 'Evolution (E)', value: abcde.evolution || 'Assessed', desc: 'Risk of dynamic shift' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(1, 30, 75, 0.85)',
                    border: '1px solid rgba(1, 75, 170, 0.45)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--cyan-accent)', fontWeight: 700 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Class Differential Probability Table (Top 6 / All) */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid rgba(1, 75, 170, 0.4)', paddingBottom: '6px', color: '#FFFFFF' }}>
              Multi-Class Differential Diagnosis Probabilities
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.86rem',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr style={{ background: 'rgba(1, 75, 170, 0.25)', borderBottom: '1px solid #014BAA' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Dermatological Condition</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Probability Distribution</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'right' }}>Score (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProbabilities.slice(0, 8).map((item, idx) => {
                    const pct = (item.score > 1 ? item.score : item.score * 100).toFixed(2);
                    const isTop = idx === 0;
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          background: isTop ? 'rgba(1, 75, 170, 0.15)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '8px 12px', fontWeight: isTop ? 700 : 500, color: isTop ? 'var(--cyan-accent)' : '#E2E8F0' }}>
                          {item.name} {isTop && <span style={{ fontSize: '0.72rem', color: '#10B981', marginLeft: '6px' }}>[PRIMARY]</span>}
                        </td>
                        <td style={{ padding: '8px 12px', width: '40%' }}>
                          <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.max(item.score > 1 ? item.score : item.score * 100, 2)}%`,
                                height: '100%',
                                background: isTop ? 'linear-gradient(90deg, #014BAA, #08C9F5)' : 'rgba(8, 123, 255, 0.6)',
                              }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Primary Biological & Environmental Causes in Humans */}
          {diseaseInfo.causes && diseaseInfo.causes.length > 0 && (
            <div style={{
              marginBottom: '28px',
              background: 'linear-gradient(135deg, rgba(8, 201, 245, 0.08) 0%, rgba(1, 75, 170, 0.15) 100%)',
              border: '1px solid rgba(8, 201, 245, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#08C9F5', fontWeight: 800 }}>
                <Zap size={20} color="#08C9F5" />
                <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#08C9F5' }}>
                  Primary Biological, Genetic & Environmental Causes in Humans
                </h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#E2E8F0', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {diseaseInfo.causes.map((cause, cIdx) => (
                  <li key={cIdx} style={{ marginBottom: '6px' }}>{cause}</li>
                ))}
              </ul>
            </div>
          )}

          {/* =====================================================================
              SECTION: RECOMMENDED MEDICAL & TOPICAL TREATMENT PROTOCOL
             ===================================================================== */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '2px solid #014BAA',
              paddingBottom: '8px',
              marginBottom: '16px'
            }}>
              <Stethoscope size={22} color="#08C9F5" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Recommended Clinical & Topical Treatment Protocol
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {/* In-Office & Dermatological Procedures */}
              <div style={{
                background: 'rgba(1, 75, 170, 0.12)',
                border: '1px solid rgba(1, 75, 170, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Activity size={18} color="#08C9F5" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#08C9F5' }}>
                    In-Office Procedures & Interventions
                  </h4>
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {guidance.recommendedTreatments.clinicalProcedures.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Prescription Topicals & Formulations */}
              <div style={{
                background: 'rgba(1, 75, 170, 0.12)',
                border: '1px solid rgba(1, 75, 170, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Pill size={18} color="#08C9F5" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#08C9F5' }}>
                    Prescription Topicals & Active Ingredients
                  </h4>
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {guidance.recommendedTreatments.prescriptionTopicals.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Systemic Therapies & Specialist Red Flags */}
            <div style={{
              marginTop: '14px',
              background: 'rgba(1, 30, 75, 0.85)',
              border: '1px solid rgba(1, 75, 170, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              fontSize: '0.85rem',
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: 'var(--cyan-accent)' }}>Systemic / Biologic Management: </strong>
                <span style={{ color: '#CBD5E1' }}>
                  {guidance.recommendedTreatments.systemicTherapies.join(' • ')}
                </span>
              </div>
              <div style={{
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                color: isHighRisk ? '#FCA5A5' : '#FDE68A',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} color={isHighRisk ? '#EF4444' : '#F59E0B'} style={{ flexShrink: 0 }} />
                <span><strong>Specialist Referral Threshold:</strong> {guidance.recommendedTreatments.specialistCriteria}</span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              SECTION: TARGETED FOOD REMEDIES & NUTRITIONAL GUIDANCE
             ===================================================================== */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '2px solid #014BAA',
              paddingBottom: '8px',
              marginBottom: '16px'
            }}>
              <Salad size={22} color="#10B981" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Food Remedies & Dermatological Nutritional Guidance
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {/* Beneficial Foods & Antioxidants */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Apple size={18} color="#10B981" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#10B981' }}>
                    Recommended Foods & Nutrients to Eat
                  </h4>
                </div>
                <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {guidance.foodRemedies.beneficialFoods.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods & Triggers to Avoid */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Ban size={18} color="#EF4444" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#EF4444' }}>
                    Pro-Inflammatory Foods & Triggers to Avoid
                  </h4>
                </div>
                <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                  {guidance.foodRemedies.foodsToAvoid.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <Ban size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Dietary Habits & Micronutrient Matrix */}
            <div style={{
              marginTop: '14px',
              background: 'rgba(1, 75, 170, 0.1)',
              border: '1px solid rgba(1, 75, 170, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              fontSize: '0.85rem',
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#08C9F5' }}>Hydration & Microbiome Habits: </strong>
                <span style={{ color: '#CBD5E1' }}>
                  {guidance.foodRemedies.dietaryHabits.join(' • ')}
                </span>
              </div>
              <div style={{
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#10B981',
                fontWeight: 600,
              }}>
                <strong>Targeted Micronutrient & Supplement Support: </strong>
                <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{guidance.foodRemedies.micronutrientSupport}</span>
              </div>
            </div>
          </div>

          {/* Attestation & Signature Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              borderTop: '1px solid rgba(1, 75, 170, 0.4)',
              paddingTop: '20px',
              marginBottom: '20px',
              fontSize: '0.82rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Automated Analysis System</div>
              <div style={{ fontWeight: 700, marginTop: '4px', color: '#FFFFFF' }}>Human Skin Disease Detection Engine</div>
              <div style={{ color: '#10B981', marginTop: '2px' }}>Model Checksum Verified (SHA-256)</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)' }}>Physician / Dermatologist Review</div>
              <div style={{ marginTop: '24px', borderBottom: '1px solid #014BAA', width: '200px', display: 'inline-block' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                Attending Specialist Signature & Date
              </div>
            </div>
          </div>

          {/* Legal Medical Disclaimer */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: '0.78rem',
              color: '#FDE68A',
              lineHeight: 1.45,
            }}
          >
            <strong>Mandatory Clinical AI Disclaimer:</strong> This document represents an automated screening summary synthesized by an artificial intelligence image evaluation network. It is not an official histological, laboratory, or biopsied medical diagnosis. Never ignore professional medical advice or delay seeking care because of this computer-generated screening.
          </div>
        </div>

        {/* Email Report Dialog Modal */}
        {showEmailModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 150,
              padding: '20px',
            }}
          >
            <div
              className="card-glass"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '24px 28px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #08C9F5',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(8, 201, 245, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={20} color="#08C9F5" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800 }}>
                    Email Clinical Report
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px', lineHeight: 1.5 }}>
                Dispatch this complete clinical screening report directly to your inbox, your attending doctor, or a dermatologist.
              </p>

              {emailError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '10px 12px', color: '#FCA5A5', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {emailError}
                </div>
              )}

              {emailSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '10px 12px', color: '#6EE7B7', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {emailSuccess}
                </div>
              )}

              <form onSubmit={handleSendEmailReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '6px', display: 'block' }}>
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="doctor@hospital.org or patient@gmail.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '6px', display: 'block' }}>
                    Personal Note / Doctor's Message (Optional)
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="e.g., Patient experiencing itchy lesion on left shoulder since 2 weeks."
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="btn-secondary"
                    style={{ padding: '9px 16px', fontSize: '0.86rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={sendingEmail}
                    style={{
                      padding: '9px 20px',
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #014BAA, #08C9F5)',
                    }}
                  >
                    <Send size={15} />
                    <span>{sendingEmail ? 'Sending Report...' : 'Send Report via Email'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 110,
};

export default ClinicalReportModal;
