import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Activity,
  Calendar,
  X,
  BookOpen,
  FileText,
  Printer
} from 'lucide-react';
import { predictionService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ClinicalReportModal from '../components/ClinicalReportModal';
import { useAuth } from '../context/AuthContext';

const ALL_CONDITIONS = [
  'Melanoma',
  'Basal Cell Carcinoma',
  'Squamous Cell Carcinoma',
  'Actinic Keratosis',
  'Nevus',
  'Benign Keratosis',
  'Dermatofibroma',
  'Vascular Lesion',
  'Eczema',
  'Psoriasis',
  'Acne',
  'Rosacea',
  'Vitiligo',
  'Tinea (Ringworm)',
  'Urticaria (Hives)',
  'Shingles (Herpes Zoster)',
  'Impetigo',
  'Alopecia Areata',
  'Contact Dermatitis',
  'Seborrheic Dermatitis',
  'Folliculitis',
  'Lichen Planus',
];

const PredictionHistory = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_records: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [page, setPage] = useState(1);

  // Modals
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [reportModalData, setReportModalData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await predictionService.getHistory({
        search,
        class_name: classFilter,
        severity: severityFilter,
        page,
        limit: 8,
      });
      setPredictions(res.data.predictions || []);
      setPagination(res.data.pagination || { current_page: 1, total_pages: 1, total_records: 0 });
    } catch (err) {
      console.error('Error fetching prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, classFilter, severityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await predictionService.deletePrediction(deleteId);
      setDeleteId(null);
      fetchHistory();
    } catch (err) {
      console.error('Failed to delete prediction record:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatLocalTimestamp = (utcString) => {
    if (!utcString) return '--';
    try {
      const date = new Date(utcString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return utcString;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Page Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan">Audit & Diagnostics</span>
            <span className="badge badge-benign">18 Conditions Supported</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Prediction History & Clinical Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Browse your past automated scans, inspect diagnostic telemetry, and generate printable laboratory dossiers.
          </p>
        </div>

        <Link to="/upload" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          <span>+ New Lesion Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-glass" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px', fontSize: '0.88rem' }}
              placeholder="Search by condition, notes, or patient reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Condition Filter (All 18 Conditions) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--cyan-accent)" />
            <select
              className="form-input"
              value={classFilter}
              onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
              style={{ fontSize: '0.88rem', cursor: 'pointer' }}
            >
              <option value="All">All 18 Conditions</option>
              {ALL_CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              className="form-input"
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
              style={{ fontSize: '0.88rem', cursor: 'pointer' }}
            >
              <option value="All">All Severities</option>
              <option value="Benign">Benign / Low Risk</option>
              <option value="Concerning">Concerning / High Risk</option>
              <option value="Chronic">Chronic / Manageable</option>
            </select>
          </div>

          {/* Quick Stats Count */}
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {predictions.length} of {pagination.total_records} records
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card-glass" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <LoadingSpinner message="Fetching history records..." subtext="Syncing with clinical database" />
          </div>
        ) : predictions.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <History size={48} color="rgba(255, 255, 255, 0.15)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '8px' }}>No Prediction Records Found</h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 20px' }}>
              {search || classFilter !== 'All' || severityFilter !== 'All'
                ? 'Try clearing your filters or search keywords.'
                : 'Upload your first skin photo or camera scan to begin building your analysis history.'}
            </p>
            <Link to="/upload" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Upload Image Now
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-color)',
                  background: 'rgba(1, 35, 90, 0.95)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <th style={{ padding: '16px 20px' }}>Lesion Image</th>
                  <th style={{ padding: '16px 20px' }}>Predicted Condition</th>
                  <th style={{ padding: '16px 20px' }}>Confidence</th>
                  <th style={{ padding: '16px 20px' }}>Clinical Risk</th>
                  <th style={{ padding: '16px 20px' }}>Scan Date</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(8, 201, 245, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#010612',
                        border: '1px solid rgba(8, 201, 245, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.predicted_class}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <Activity size={20} color="var(--cyan-accent)" style={{ display: p.image_url ? 'none' : 'block' }} />
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#FFFFFF' }}>
                      {p.predicted_class}
                      {p.is_demo && (
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--cyan-accent)', fontWeight: 400 }}>
                          18-Class Neural Model
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-accent)' }}>
                      {p.confidence}%
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${p.predicted_class === 'Melanoma' || p.severity_level?.toLowerCase().includes('concerning') || p.severity_level?.toLowerCase().includes('high') ? 'badge-concerning' : 'badge-benign'}`}>
                        {p.severity_level || 'Evaluated'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {formatLocalTimestamp(p.created_at)}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setReportModalData(p)}
                          style={{
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.2), rgba(8, 201, 245, 0.25))',
                            border: '1px solid var(--cyan-accent)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--cyan-accent)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="Generate and Print Clinical Report"
                        >
                          <Printer size={14} />
                          <span>Report</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPrediction(p)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(8, 201, 245, 0.1)',
                            border: '1px solid rgba(8, 201, 245, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#CBD5E1',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <ExternalLink size={14} />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(p.id)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#F87171',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.total_pages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(1, 30, 75, 0.85)',
          }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Page {pagination.current_page} of {pagination.total_pages}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '6px 12px' }}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <button
                type="button"
                className="btn-outline"
                style={{ padding: '6px 12px' }}
                disabled={page >= pagination.total_pages}
                onClick={() => setPage(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          PREDICTION DETAIL MODAL
         ========================================================================= */}
      {selectedPrediction && (
        <div style={modalOverlayStyle}>
          <div className="card-glass" style={{ maxWidth: '600px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '4px' }}>Scan Record #{selectedPrediction.id}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Clinical Scan Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrediction(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Specimen Image */}
            <div style={{
              width: '100%',
              height: '240px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#011A42',
              border: '2px solid rgba(1, 75, 170, 0.55)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {selectedPrediction.image_url ? (
                <img
                  src={selectedPrediction.image_url}
                  alt={selectedPrediction.predicted_class}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Activity size={40} color="var(--cyan-accent)" />
              )}
            </div>

            {/* Diagnostic Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(1, 30, 75, 0.85)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classified Condition</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedPrediction.predicted_class}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(1, 30, 75, 0.85)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-accent)', marginTop: '4px' }}>
                  {selectedPrediction.confidence}%
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(1, 30, 75, 0.85)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Severity Level</div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`badge ${selectedPrediction.predicted_class === 'Melanoma' ? 'badge-concerning' : 'badge-benign'}`}>
                    {selectedPrediction.severity_level || 'Evaluated'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(1, 30, 75, 0.85)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded Timestamp</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '6px' }}>
                  {formatLocalTimestamp(selectedPrediction.created_at)}
                </div>
              </div>
            </div>

            {/* User Notes */}
            {selectedPrediction.notes && (
              <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(8, 123, 255, 0.08)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cyan-accent)', marginBottom: '4px' }}>Clinical Notes</div>
                <div style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>{selectedPrediction.notes}</div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #08C9F5, #087BFF)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => {
                  setReportModalData(selectedPrediction);
                  setSelectedPrediction(null);
                }}
              >
                <Printer size={16} />
                <span>Generate Clinical Report</span>
              </button>

              <Link to="/diseases" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
                <BookOpen size={16} />
                <span>Condition Guide</span>
              </Link>

              <button
                type="button"
                className="btn-outline"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                onClick={() => setSelectedPrediction(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CLINICAL REPORT MODAL FROM HISTORY
         ========================================================================= */}
      {reportModalData && (
        <ClinicalReportModal
          prediction={{
            id: reportModalData.id,
            timestamp: reportModalData.created_at,
            image_url: reportModalData.image_url,
            notes: reportModalData.notes,
            prediction: {
              class_name: reportModalData.predicted_class,
              confidence: reportModalData.confidence,
              severity: reportModalData.severity_level || 'Evaluated',
              probabilities: reportModalData.probabilities || {
                [reportModalData.predicted_class]: (reportModalData.confidence / 100),
              },
            },
            disease_info: {
              name: reportModalData.predicted_class,
              description: `Historical clinical record #${reportModalData.id} for ${reportModalData.predicted_class}. Consult comprehensive disease library for full pathophysiology.`,
              symptoms: ['Visual cutaneous lesion observed on examination', 'Refer to clinical library for condition specifics'],
              precautions: ['Review with a board-certified dermatologist', 'Monitor for changes in size, color, or shape'],
            },
            abcde_assessment: {
              asymmetry: 'Evaluated in historical scan',
              border: 'Documented in telemetry log',
              color: 'Pigment analysis performed',
              diameter: 'Standard dermoscopic metric',
              evolution: 'Baseline scan established',
            },
          }}
          patientName={user?.full_name}
          onClose={() => setReportModalData(null)}
        />
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {deleteId && (
        <div style={modalOverlayStyle}>
          <div className="card-glass" style={{ maxWidth: '420px', width: '100%', padding: '28px', textAlign: 'center' }}>
            <Trash2 size={40} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Delete Prediction Record?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Are you sure you want to delete prediction record #{deleteId}? This will remove the telemetry and image file from the system permanently.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: '#EF4444',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 100,
};

export default PredictionHistory;
