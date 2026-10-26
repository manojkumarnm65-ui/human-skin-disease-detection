import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Camera,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  RotateCcw,
  BookOpen,
  History,
  X,
  Zap,
  ShieldAlert,
  Info,
  Sparkles,
  RefreshCw,
  Sun,
  Video,
  VideoOff,
  Printer,
  Stethoscope,
  Pill,
  Apple,
  Salad,
  Check,
  Ban
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { predictionService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ClinicalReportModal from '../components/ClinicalReportModal';
import { getClinicalGuidance } from '../utils/clinicalGuidance';
import { useAuth } from '../context/AuthContext';

// All 22 Dermatological Conditions Supported by SkinCare AI
const sampleImages = [
  { name: 'Melanoma', class: 'Melanoma', path: '/samples/sample_melanoma.jpg' },
  { name: 'Basal Cell Carcinoma', class: 'Basal Cell Carcinoma', path: '/samples/sample_bcc.jpg' },
  { name: 'Squamous Cell Carcinoma', class: 'Squamous Cell Carcinoma', path: '/samples/sample_squamous_cell_carcinoma.jpg' },
  { name: 'Actinic Keratosis', class: 'Actinic Keratosis', path: '/samples/sample_actinic_keratosis.jpg' },
  { name: 'Nevus (Normal Mole)', class: 'Nevus', path: '/samples/sample_nevus.jpg' },
  { name: 'Benign Keratosis', class: 'Benign Keratosis', path: '/samples/sample_benign_keratosis.jpg' },
  { name: 'Dermatofibroma', class: 'Dermatofibroma', path: '/samples/sample_dermatofibroma.jpg' },
  { name: 'Vascular Lesion', class: 'Vascular Lesion', path: '/samples/sample_vascular.jpg' },
  { name: 'Eczema (Dermatitis)', class: 'Eczema', path: '/samples/sample_eczema.jpg' },
  { name: 'Psoriasis', class: 'Psoriasis', path: '/samples/sample_psoriasis.jpg' },
  { name: 'Acne Vulgaris', class: 'Acne', path: '/samples/sample_acne.jpg' },
  { name: 'Rosacea', class: 'Rosacea', path: '/samples/sample_rosacea.jpg' },
  { name: 'Vitiligo', class: 'Vitiligo', path: '/samples/sample_vitiligo.jpg' },
  { name: 'Tinea (Ringworm)', class: 'Tinea (Ringworm)', path: '/samples/sample_tinea.jpg' },
  { name: 'Urticaria (Hives)', class: 'Urticaria (Hives)', path: '/samples/sample_urticaria_hives.jpg' },
  { name: 'Shingles (Herpes Zoster)', class: 'Shingles (Herpes Zoster)', path: '/samples/sample_shingles_herpes_zoster.jpg' },
  { name: 'Impetigo', class: 'Impetigo', path: '/samples/sample_impetigo.jpg' },
  { name: 'Alopecia Areata', class: 'Alopecia Areata', path: '/samples/sample_alopecia_areata.jpg' },
  { name: 'Contact Dermatitis', class: 'Contact Dermatitis', path: '/samples/sample_contact_dermatitis.jpg' },
  { name: 'Seborrheic Dermatitis', class: 'Seborrheic Dermatitis', path: '/samples/sample_seborrheic_dermatitis.jpg' },
  { name: 'Folliculitis', class: 'Folliculitis', path: '/samples/sample_folliculitis.jpg' },
  { name: 'Lichen Planus', class: 'Lichen Planus', path: '/samples/sample_lichen_planus.jpg' },
];

const UploadImage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Active Input Mode: 'camera' (Visible Live Camera) vs 'upload' (File Dropzone / Samples)
  const [inputMode, setInputMode] = useState('camera');

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNotes, setUserNotes] = useState('');

  // Status states
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Live Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState('');

  // Clinical Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);

  // Auto-start camera when in 'camera' mode and no image selected yet
  useEffect(() => {
    if (inputMode === 'camera' && !selectedFile) {
      startCamera();
    } else if (inputMode !== 'camera') {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [inputMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async (facing = cameraFacing) => {
    stopCamera();
    setCameraLoading(true);
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access or camera permissions are blocked.');
      }

      let constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // Fallback to generic video if facingMode constraint fails
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access your device camera. Please check camera permissions in your browser.');
    } finally {
      setCameraLoading(false);
    }
  };

  // Explicit "Take Photo" action (not snapshot)
  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError('Failed to capture photo from camera.');
        return;
      }
      const capturedFile = new File([blob], `camera_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      handleFile(capturedFile);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const handleRetakePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setInputMode('camera');
    startCamera();
  };

  // File selection handler
  const handleFile = (file) => {
    setErrorMsg('');
    setAnalysisResult(null);

    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5 MB. Please choose a smaller photo.');
      return;
    }

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setErrorMsg('Invalid format. Only JPG, PNG, and WEBP formats are supported.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Sample image loader (18 conditions)
  const handleSelectSample = async (sample) => {
    setErrorMsg('');
    setAnalysisResult(null);
    try {
      const response = await fetch(sample.path);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${sample.class.toLowerCase().replace(/[^a-z0-9]/g, '_')}_sample.jpg`,
        { type: 'image/jpeg' }
      );
      setSelectedFile(file);
      setPreviewUrl(sample.path);
      stopCamera();
    } catch (err) {
      setErrorMsg('Failed to load sample image.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMsg('');
    setUserNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (inputMode === 'camera') {
      startCamera();
    }
  };

  // Execute Analysis
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select or capture an image first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    if (userNotes.trim()) {
      formData.append('notes', userNotes.trim());
    }

    try {
      const res = await predictionService.analyzeImage(formData);
      setAnalysisResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Please verify the image file and retry.';
      setErrorMsg(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  // Probability chart preparation
  const getProbabilityData = () => {
    if (!analysisResult?.prediction?.probabilities) return [];
    return Object.entries(analysisResult.prediction.probabilities).map(([name, score]) => ({
      name,
      score: Number(score),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Neural Inference Studio</span>
          <span className="badge badge-benign">Live Visible Camera & 18 Disease Models</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Upload & Skin Camera Diagnosis</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Capture directly using the visible live camera or upload a skin lesion image for instant AI evaluation and clinical report generation.
        </p>
      </div>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.92rem',
        }}>
          <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================================
          TWO-CARD LAYOUT
         ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'stretch',
      }}>
        {/* =====================================================================
            LEFT CARD — VISIBLE LIVE CAMERA / FILE UPLOAD & SAMPLES
           ===================================================================== */}
        <div className="card-glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Mode Switcher Tabs: Live Camera vs File Upload */}
            <div style={{
              display: 'flex',
              background: 'rgba(1, 30, 75, 0.85)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(1, 75, 170, 0.5)',
              marginBottom: '20px',
              gap: '6px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setInputMode('camera');
                  if (selectedFile) setSelectedFile(null);
                  startCamera();
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: inputMode === 'camera' ? 'linear-gradient(135deg, #087BFF, #08C9F5)' : 'transparent',
                  color: inputMode === 'camera' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: inputMode === 'camera' ? '0 0 15px rgba(8, 201, 245, 0.35)' : 'none',
                }}
              >
                <Camera size={18} />
                <span>Live Camera (Visible)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode('upload');
                  stopCamera();
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: inputMode === 'upload' ? 'linear-gradient(135deg, #087BFF, #08C9F5)' : 'transparent',
                  color: inputMode === 'upload' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: inputMode === 'upload' ? '0 0 15px rgba(8, 201, 245, 0.35)' : 'none',
                }}
              >
                <UploadCloud size={18} />
                <span>Upload File & Samples</span>
              </button>
            </div>

            {/* TAB 1: VISIBLE LIVE CAMERA VIEW */}
            {inputMode === 'camera' && (
              <div>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: '#010612',
                  border: '2px solid rgba(8, 201, 245, 0.4)',
                  boxShadow: '0 0 25px rgba(8, 201, 245, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {cameraError ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#FCA5A5' }}>
                      <AlertTriangle size={36} color="#EF4444" style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontWeight: 700, marginBottom: '6px' }}>Camera Access Required</div>
                      <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{cameraError}</p>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => startCamera()}
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'none',
                        }}
                      />

                      {/* Circular Dermatological Reticle Overlay */}
                      <div style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        border: '2px dashed var(--cyan-accent)',
                        boxShadow: '0 0 25px rgba(8, 201, 245, 0.5), inset 0 0 25px rgba(8, 201, 245, 0.2)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{ width: '14px', height: '2px', background: 'var(--cyan-accent)', position: 'absolute', left: '-7px' }} />
                        <div style={{ width: '14px', height: '2px', background: 'var(--cyan-accent)', position: 'absolute', right: '-7px' }} />
                        <div style={{ width: '2px', height: '14px', background: 'var(--cyan-accent)', position: 'absolute', top: '-7px' }} />
                        <div style={{ width: '2px', height: '14px', background: 'var(--cyan-accent)', position: 'absolute', bottom: '-7px' }} />
                      </div>

                      {/* Optical Sensor Status Pill */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(1, 35, 90, 0.9)',
                        border: '1px solid rgba(1, 75, 170, 0.5)',
                        fontSize: '0.74rem',
                        color: 'var(--cyan-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 700
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span>CAMERA ACTIVE</span>
                      </div>

                      {/* Reticle Guide Banner */}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(1, 35, 90, 0.9)',
                        border: '1px solid rgba(1, 75, 170, 0.5)',
                        fontSize: '0.76rem',
                        color: '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <Sun size={14} color="var(--cyan-accent)" />
                        <span>Center lesion inside circle under good lighting</span>
                      </div>
                    </>
                  )}
                </div>

                {/* VISIBLE CAMERA CONTROLS: "Take Photo" & "Flip Camera" */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    className="btn-secondary"
                    style={{ padding: '12px 18px', fontSize: '0.9rem' }}
                    title="Switch between front and back camera"
                  >
                    <RefreshCw size={16} />
                    <span>Flip Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTakePhoto}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #10B981 0%, #08C9F5 100%)',
                      boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
                    }}
                  >
                    <Camera size={22} />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FILE UPLOAD DROPZONE & SAMPLES */}
            {inputMode === 'upload' && (
              <div>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: dragActive ? '2px dashed var(--cyan-accent)' : '2px dashed rgba(1, 75, 170, 0.5)',
                    background: dragActive ? 'rgba(1, 75, 170, 0.25)' : 'rgba(1, 30, 75, 0.8)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: dragActive ? '0 0 25px rgba(8, 201, 245, 0.3)' : 'none',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />

                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(8, 201, 245, 0.1)',
                    border: '1px solid rgba(8, 201, 245, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <UploadCloud size={28} color="var(--cyan-accent)" />
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {selectedFile ? selectedFile.name : 'Drag & drop skin photo here'}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto 14px' }}>
                    Supports PNG, JPG, JPEG, or WEBP up to 5 MB.
                  </p>

                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose Image File
                  </button>
                </div>

                {/* Sample Image Gallery (Expanded to All 18 Conditions) */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Sparkles size={16} color="var(--cyan-accent)" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Or Test With All 18 Dermatological Samples:
                    </span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(76px, 1fr))',
                    gap: '8px',
                    maxHeight: '190px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}>
                    {sampleImages.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSample(s)}
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          border: '1px solid rgba(1, 75, 170, 0.45)',
                          cursor: 'pointer',
                          background: 'rgba(1, 30, 75, 0.85)',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cyan-accent)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(8, 201, 245, 0.25)';
                          e.currentTarget.style.transform = 'none';
                        }}
                        title={`Test with ${s.name}`}
                      >
                        <img
                          src={s.path}
                          alt={s.name}
                          onError={(e) => { e.target.src = '/samples/sample_melanoma.jpg'; }}
                          style={{ width: '100%', height: '42px', objectFit: 'cover' }}
                        />
                        <div style={{
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          padding: '3px 2px',
                          color: '#CBD5E1',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {s.class}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Optional Notes Input */}
            <div style={{ marginTop: '18px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem' }}>
                Clinical Notes / Anatomic Location (Optional)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Left forearm, itchiness for 2 weeks, irregular border"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                style={{ fontSize: '0.88rem', padding: '10px 14px' }}
              />
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '14px',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} color="var(--cyan-accent)" style={{ flexShrink: 0 }} />
            <span>Encrypted optical capture & private in-memory neural evaluation.</span>
          </div>
        </div>

        {/* =====================================================================
            RIGHT CARD — IMAGE PREVIEW AND PREDICTION RESULT
           ===================================================================== */}
        <div className="card-glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(8, 123, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Activity size={20} color="var(--electric-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Preview & Analysis</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deep Neural Network Inference</span>
                </div>
              </div>

              {previewUrl && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    title="Retake photo using visible camera"
                  >
                    <RotateCcw size={14} />
                    <span>Retake</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F87171',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Target Lesion Display Window */}
            {previewUrl ? (
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: '260px',
                height: '240px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '2px solid rgba(8, 201, 245, 0.4)',
                boxShadow: '0 0 25px rgba(8, 201, 245, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#010612',
                marginBottom: '20px',
              }}>
                <img
                  src={previewUrl}
                  alt="Lesion target preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {/* Animated Scanning Laser Line during analysis */}
                {analyzing && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--cyan-accent), #FFFFFF, var(--cyan-accent), transparent)',
                    boxShadow: '0 0 15px var(--cyan-accent), 0 0 30px var(--cyan-accent)',
                    animation: 'laserScan 2s ease-in-out infinite',
                    zIndex: 10,
                  }} />
                )}

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  border: '1px solid rgba(8, 201, 245, 0.2)',
                }} />
              </div>
            ) : (
              <div style={{
                height: '220px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(1, 30, 75, 0.8)',
                border: '1px dashed rgba(1, 75, 170, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '20px',
                textAlign: 'center',
                padding: '20px',
              }}>
                <Camera size={42} color="rgba(8, 201, 245, 0.4)" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                  No photo captured yet
                </div>
                <p style={{ fontSize: '0.84rem', marginTop: '4px', maxWidth: '280px' }}>
                  Point your camera at the lesion and click <strong style={{ color: 'var(--cyan-accent)' }}>"Take Photo"</strong> to start screening.
                </p>
              </div>
            )}

            {/* During Analysis Loading State */}
            {analyzing && (
              <div style={{ padding: '20px 0' }}>
                <LoadingSpinner
                  message="Analyzing image..."
                  subtext="Evaluating features across 18 dermatological disease classes"
                />
              </div>
            )}

            {/* Before Analysis Action CTA */}
            {!analyzing && !analysisResult && selectedFile && (
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  <Zap size={20} />
                  <span>Analyze Lesion with AI</span>
                </button>
              </div>
            )}

            {/* AFTER ANALYSIS: Full Results Suite & Report Generation CTA */}
            {!analyzing && analysisResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Result Header Badge & Score */}
                <div style={{
                  background: 'rgba(1, 35, 90, 0.9)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Predicted Condition
                    </span>
                    <span className={`badge ${analysisResult.prediction.severity_level?.toLowerCase().includes('concerning') || analysisResult.prediction.severity_level?.toLowerCase().includes('high') ? 'badge-concerning' : 'badge-benign'}`}>
                      {analysisResult.prediction.severity_level || 'Evaluated'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {analysisResult.prediction.predicted_class}
                    </h2>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cyan-accent)' }}>
                        {analysisResult.prediction.confidence}%
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence</div>
                    </div>
                  </div>
                </div>

                {/* EXTRA FEATURE: PROMINENT CLINICAL REPORT GENERATION CTA */}
                <div style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(1, 75, 170, 0.4) 0%, rgba(8, 201, 245, 0.2) 100%)',
                  border: '2px solid #014BAA',
                  boxShadow: '0 0 25px rgba(1, 75, 170, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.02rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={20} color="#08C9F5" />
                      <span>Clinical Screening Report Generated</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '3px' }}>
                      Complete laboratory dossier containing disease etiology, recommended treatments, food remedies & PDF export.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="btn-primary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #014BAA, #08C9F5)',
                      boxShadow: '0 0 20px rgba(1, 75, 170, 0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Printer size={16} />
                    <span>View / Print Full Report</span>
                  </button>
                </div>

                {/* Probability Distribution Chart (Top 6 Classes) */}
                <div style={{
                  background: 'rgba(1, 30, 75, 0.85)',
                  border: '1px solid rgba(1, 75, 170, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Differential Diagnosis Probabilities (%)
                  </div>
                  <div style={{ width: '100%', height: '170px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getProbabilityData()
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 6)}
                        layout="vertical"
                        margin={{ top: 0, right: 20, left: 35, bottom: 0 }}
                      >
                        <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={10} />
                        <YAxis dataKey="name" type="category" stroke="#CBD5E1" fontSize={10} width={90} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg-card)',
                            borderColor: '#014BAA',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontFamily: "'Times New Roman', Times, serif"
                          }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                          {getProbabilityData().slice(0, 6).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.name === 'Melanoma' || entry.name === 'Basal Cell Carcinoma' || entry.name === 'Squamous Cell Carcinoma' ? '#EF4444' : entry.name === analysisResult.prediction.predicted_class ? '#08C9F5' : '#014BAA'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Post-Analysis Clinical Guidance: Recommended Treatment & Food Remedies Cards */}
                {(() => {
                  const guidance = getClinicalGuidance(analysisResult.prediction.predicted_class);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                      {/* Recommended Treatment Card */}
                      <div style={{
                        background: 'rgba(1, 75, 170, 0.12)',
                        border: '1px solid rgba(1, 75, 170, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Stethoscope size={18} color="#08C9F5" />
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#08C9F5' }}>
                            Recommended Treatment
                          </h4>
                        </div>
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                          {guidance.recommendedTreatments.clinicalProcedures.slice(0, 2).map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                          ))}
                          <li style={{ color: '#93C5FD' }}>
                            <strong>Topical: </strong>
                            {guidance.recommendedTreatments.prescriptionTopicals[0] || 'See full clinical report'}
                          </li>
                        </ul>
                      </div>

                      {/* Food Remedies Card */}
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Salad size={18} color="#10B981" />
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#10B981' }}>
                            Food Remedies & Diet
                          </h4>
                        </div>
                        <div style={{ fontSize: '0.78rem', marginBottom: '6px', color: '#A7F3D0' }}>
                          <strong>Foods to Eat: </strong>
                          {guidance.foodRemedies.beneficialFoods.slice(0, 2).join('; ')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>
                          <strong>Foods to Avoid: </strong>
                          {guidance.foodRemedies.foodsToAvoid.slice(0, 2).join('; ')}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Educational disease snippet */}
                {analysisResult.disease_info && (
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(1, 75, 170, 0.08)',
                    border: '1px solid rgba(1, 75, 170, 0.25)',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                      Pathology Profile — {analysisResult.disease_info.name}:
                    </div>
                    {analysisResult.disease_info.description?.slice(0, 200)}...
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link
                        to="/diseases"
                        style={{ color: 'var(--cyan-accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem' }}
                      >
                        View Full Medical Overview & Guidance →
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowReportModal(true)}
                        style={{ background: 'transparent', border: 'none', color: '#10B981', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                      >
                        Open Clinical Dossier ↗
                      </button>
                    </div>
                  </div>
                )}

                {/* Prominent Medical Safety Disclaimer */}
                <div className="disclaimer-banner" style={{ padding: '12px 14px', fontSize: '0.8rem' }}>
                  <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Educational screening notice:</strong> This prediction is an AI screening result and does not replace in-person histopathological diagnosis.
                  </div>
                </div>

                {/* Post-Analysis Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-primary"
                    style={{ padding: '10px 14px', fontSize: '0.88rem' }}
                  >
                    Scan Another Lesion
                  </button>
                  <Link
                    to="/diseases"
                    className="btn-secondary"
                    style={{ padding: '10px 14px', fontSize: '0.88rem', justifyContent: 'center' }}
                  >
                    <BookOpen size={16} />
                    <span>Disease Library</span>
                  </Link>
                  <Link
                    to="/history"
                    className="btn-outline"
                    style={{ padding: '10px 14px', fontSize: '0.88rem', justifyContent: 'center' }}
                  >
                    <History size={16} />
                    <span>History Log</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CLINICAL REPORT MODAL (EXTRA FEATURE)
         ========================================================================= */}
      {showReportModal && analysisResult && (
        <ClinicalReportModal
          prediction={{
            ...analysisResult,
            image_url: previewUrl,
            timestamp: new Date().toISOString(),
          }}
          patientName={user?.full_name}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default UploadImage;
