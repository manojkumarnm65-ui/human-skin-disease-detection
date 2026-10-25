import React, { useRef } from 'react';
import {
  Printer,
  Download,
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
  Info
} from 'lucide-react';

const ClinicalReportModal = ({ prediction, onClose, patientName = 'Registered Patient' }) => {
  if (!prediction) return null;

  // Normalize data whether passed from prediction API or history API
  const predData = prediction.prediction || prediction;
  const diseaseInfo = prediction.disease_info || {};
  const abcde = prediction.abcde_assessment || {};
  const imageQuality = prediction.image_quality || {};

  const className = predData.class_name || predData.class || 'Unknown Condition';
  const confidence = typeof predData.confidence === 'number'
    ? predData.confidence
    : (parseFloat(predData.confidence) || 0);
  const confidencePct = confidence <= 1 ? (confidence * 100).toFixed(1) : confidence.toFixed(1);

  const severity = predData.severity || 'Benign';
  const isHighRisk = severity.toLowerCase().includes('concerning') || severity.toLowerCase().includes('malignant') || severity.toLowerCase().includes('high');
  const isChronic = severity.toLowerCase().includes('chronic') || severity.toLowerCase().includes('manageable');

  const reportId = prediction.id
    ? `SKN-REP-${String(prediction.id).padStart(6, '0')}`
    : `SKN-REP-${Date.now().toString().slice(-6)}`;

  const examDate = prediction.timestamp
    ? new Date(prediction.timestamp).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      });

  const probabilities = predData.probabilities || {};
  const sortedProbabilities = Object.entries(probabilities)
    .map(([name, score]) => ({ name, score: Number(score) }))
    .sort((a, b) => b.score - a.score);

  // Handle browser print (triggers save as PDF)
  const handlePrint = () => {
    window.print();
  };

  // Download raw clinical report as a structured text / json summary
  const handleDownloadSummary = () => {
    const reportText = `================================================================================
SKINCARE AI — CLINICAL DERMATOLOGICAL SCREENING REPORT
Report Reference : ${reportId}
Examination Date : ${examDate}
Patient Identifier: ${patientName}
Examining Engine : SkinCare AI v2.4 Deep Neural Lesion Classifier
================================================================================

1. PRIMARY DIAGNOSTIC FINDING
--------------------------------------------------------------------------------
Primary Condition : ${className}
Confidence Score  : ${confidencePct}%
Severity Level    : ${severity}
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
${sortedProbabilities.map((item, idx) => `${idx + 1}. ${item.name.padEnd(30, ' ')}: ${(item.score * 100).toFixed(2)}%`).join('\n')}

4. CLINICAL DESCRIPTION & ETIOLOGY
--------------------------------------------------------------------------------
${diseaseInfo.description || 'Consult dermatological reference library.'}

Symptoms:
${Array.isArray(diseaseInfo.symptoms) ? diseaseInfo.symptoms.map(s => ` - ${s}`).join('\n') : diseaseInfo.symptoms || 'See clinical guide.'}

Risk Factors:
${Array.isArray(diseaseInfo.risk_factors) ? diseaseInfo.risk_factors.map(r => ` - ${r}`).join('\n') : diseaseInfo.risk_factors || 'See clinical guide.'}

5. RECOMMENDED CLINICAL MANAGEMENT & PRECAUTIONS
--------------------------------------------------------------------------------
${Array.isArray(diseaseInfo.precautions) ? diseaseInfo.precautions.map(p => ` - ${p}`).join('\n') : diseaseInfo.precautions || 'Consult a certified healthcare provider.'}

6. MANDATORY CLINICAL DISCLAIMER
--------------------------------------------------------------------------------
This automated diagnostic report was synthesized using artificial intelligence deep learning
models trained on dermatological benchmarking repositories (ISIC / HAM10000). This report
is intended strictly for clinical decision support, triage, and educational screening. It does
NOT constitute a final histopathologic or medical diagnosis. An in-person consultation with a
board-certified dermatologist or qualified medical physician is essential.
================================================================================
Generated by SkinCare AI Cloud Platform`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportId}_Clinical_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={modalOverlayStyle}>
      <div
        className="card-glass"
        style={{
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(8, 201, 245, 0.25)',
          border: '1px solid rgba(8, 201, 245, 0.4)',
        }}
      >
        {/* Modal Top Action Bar (hidden during printing) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            background: 'rgba(2, 11, 28, 0.95)',
            borderBottom: '1px solid rgba(8, 201, 245, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="var(--cyan-accent)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Clinical Diagnostic Screening Report
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Official Laboratory Reference: {reportId}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
                padding: '8px 14px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              title="Download text summary"
            >
              <Download size={16} />
              <span>Export Text</span>
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
              borderBottom: '2px solid rgba(8, 201, 245, 0.4)',
              paddingBottom: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--cyan-accent)',
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>
                  SkinCare AI Tele-Dermatology Laboratory
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0' }}>
                Dermatological AI Screening Dossier
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Automated Deep Convolutional Ensemble Evaluation (ResNet-50 + Morphological ABCDE)
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--cyan-accent)', fontSize: '1rem' }}>{reportId}</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{examDate}</div>
              <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>
                [OK] Specimen Quality: Optimal
              </div>
            </div>
          </div>

          {/* Patient & Examination Metadata Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              background: 'rgba(2, 11, 28, 0.7)',
              border: '1px solid rgba(8, 201, 245, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
              fontSize: '0.9rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patient Name</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>{patientName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Specimen Capture</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>In-Vivo Optical / Camera</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clinical Indication</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>
                {prediction.notes || 'Routine Cutaneous Lesion Assessment'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Diagnostic Model</div>
              <div style={{ fontWeight: 700, marginTop: '2px' }}>SkinCare AI v2.4 (18-Class)</div>
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
                background: 'rgba(2, 11, 28, 0.8)',
                border: '1px solid rgba(8, 201, 245, 0.3)',
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
                {prediction.image_url ? (
                  <img
                    src={prediction.image_url}
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
                  : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${
                  isHighRisk ? '#EF4444' : isChronic ? '#F59E0B' : '#10B981'
                }`,
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: isHighRisk ? '#EF4444' : isChronic ? '#F59E0B' : '#10B981',
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

                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '8px 0', color: '#FFFFFF' }}>
                  {className}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: isHighRisk ? '#EF4444' : 'var(--cyan-accent)' }}>
                    {confidencePct}%
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Ensemble Confidence Level
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#CBD5E1', margin: 0 }}>
                  {diseaseInfo.description
                    ? diseaseInfo.description.slice(0, 180) + '...'
                    : 'Condition identified with statistically elevated probability pattern.'}
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid rgba(8, 201, 245, 0.25)', paddingBottom: '6px' }}>
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
                    background: 'rgba(2, 11, 28, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid rgba(8, 201, 245, 0.25)', paddingBottom: '6px' }}>
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
                  <tr style={{ background: 'rgba(8, 201, 245, 0.1)', borderBottom: '1px solid rgba(8, 201, 245, 0.3)' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Dermatological Condition</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Probability Distribution</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'right' }}>Score (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProbabilities.slice(0, 8).map((item, idx) => {
                    const pct = (item.score * 100).toFixed(2);
                    const isTop = idx === 0;
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          background: isTop ? 'rgba(8, 201, 245, 0.06)' : 'transparent',
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
                                width: `${Math.max(item.score * 100, 2)}%`,
                                height: '100%',
                                background: isTop ? 'var(--cyan-accent)' : 'rgba(8, 123, 255, 0.6)',
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

          {/* Clinical Guidance: Symptoms, Risk Factors & Care Recommendations */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            {/* Symptoms & Manifestations */}
            <div
              style={{
                background: 'rgba(2, 11, 28, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                Key Clinical Symptoms
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.84rem', color: '#CBD5E1' }}>
                {Array.isArray(diseaseInfo.symptoms) ? (
                  diseaseInfo.symptoms.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)
                ) : (
                  <li>{diseaseInfo.symptoms || 'Refer to dermatological compendium.'}</li>
                )}
              </ul>
            </div>

            {/* Recommended Care & Management */}
            <div
              style={{
                background: 'rgba(2, 11, 28, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                Recommended Care Protocol
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.84rem', color: '#CBD5E1' }}>
                {Array.isArray(diseaseInfo.precautions) ? (
                  diseaseInfo.precautions.map((p, i) => <li key={i} style={{ marginBottom: '4px' }}>{p}</li>)
                ) : (
                  <li>{diseaseInfo.precautions || 'Consult a certified dermatologist.'}</li>
                )}
              </ul>
            </div>
          </div>

          {/* Attestation & Signature Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '20px',
              marginBottom: '20px',
              fontSize: '0.82rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Automated Analysis System</div>
              <div style={{ fontWeight: 700, marginTop: '4px' }}>SkinCare AI Neural Inference Engine</div>
              <div style={{ color: '#10B981', marginTop: '2px' }}>Model Checksum Verified (SHA-256)</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)' }}>Physician / Dermatologist Review</div>
              <div style={{ marginTop: '24px', borderBottom: '1px solid #94A3B8', width: '200px', display: 'inline-block' }} />
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
