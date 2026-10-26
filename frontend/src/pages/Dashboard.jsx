import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Activity,
  ShieldCheck,
  AlertTriangle,
  History,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sun,
  Camera,
  Target,
  Sparkles,
  Users
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes, chartRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentPredictions(5),
          dashboardService.getChartData(),
        ]);
        setStats(statsRes.data);
        setRecentPredictions(recentRes.data.recent_predictions || []);
        setChartData(chartRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard telemetry..." subtext="Retrieving patient screening statistics" />;
  }

  const commonConditions = [
    { name: 'Melanoma', type: 'Concerning / Neoplasm', color: '#EF4444', desc: 'Malignant melanocyte proliferation requiring urgent clinical review.' },
    { name: 'Basal Cell Carcinoma', type: 'Concerning / Neoplasm', color: '#F87171', desc: 'Pearly papule with telangiectasia; most common non-melanoma malignancy.' },
    { name: 'Squamous Cell Carcinoma', type: 'Concerning / Neoplasm', color: '#DC2626', desc: 'Hyperkeratotic scaling lesion with potential for regional spread.' },
    { name: 'Actinic Keratosis', type: 'Precancerous Dysplasia', color: '#F97316', desc: 'Rough UV-induced erythematous patch with malignant progression potential.' },
    { name: 'Nevus', type: 'Benign Mole', color: '#10B981', desc: 'Harmonious pigment distribution, regular border morphology.' },
    { name: 'Benign Keratosis', type: 'Benign Epidermal', color: '#10B981', desc: 'Common stuck-on warty plaque without malignant potential.' },
    { name: 'Dermatofibroma', type: 'Benign Fibrous', color: '#10B981', desc: 'Firm dermal nodule exhibiting positive dimple sign.' },
    { name: 'Vascular Lesion', type: 'Benign Vascular', color: '#38BDF8', desc: 'Angioma or ectatic capillary cluster with low oncologic risk.' },
    { name: 'Eczema', type: 'Chronic Dermatosis', color: '#F59E0B', desc: 'Pruritic, dry, inflammatory epidermal reaction.' },
    { name: 'Psoriasis', type: 'Autoimmune', color: '#8B5CF6', desc: 'Hyperproliferative keratinocytes forming silvery plaques.' },
    { name: 'Acne', type: 'Pilosebaceous', color: '#08C9F5', desc: 'Sebum retention, bacterial colonization, follicular papules.' },
    { name: 'Rosacea', type: 'Vascular / Erythema', color: '#F43F5E', desc: 'Persistent facial erythema, flushing, and telangiectasias.' },
    { name: 'Vitiligo', type: 'Autoimmune Pigmentary', color: '#38BDF8', desc: 'Loss of functional melanocytes causing depigmented patches.' },
    { name: 'Tinea (Ringworm)', type: 'Fungal Dermatophyte', color: '#F59E0B', desc: 'Annular erythematous scaly ring with active leading edge.' },
    { name: 'Urticaria (Hives)', type: 'Allergic / Histaminic', color: '#F43F5E', desc: 'Transient pruritic wheals mediated by mast-cell degranulation.' },
    { name: 'Shingles (Herpes Zoster)', type: 'Viral Infection', color: '#EF4444', desc: 'Dermatomal reactivation of varicella virus with clustered vesicles.' },
    { name: 'Impetigo', type: 'Bacterial Infection', color: '#F59E0B', desc: 'Contagious honey-colored crusted erosions from staph/strep.' },
    { name: 'Alopecia Areata', type: 'Autoimmune Follicular', color: '#8B5CF6', desc: 'Well-circumscribed patchy scalp hair loss driven by T-lymphocytes.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* =========================================================================
          WELCOME SECTION
         ========================================================================= */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(8, 123, 255, 0.15) 0%, rgba(6, 23, 45, 0.8) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-cyan">Clinical Screening Session</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 800 }}>
            Welcome Back, <span className="cyan-gradient-text">{user?.full_name || 'Patient'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '6px' }}>
            Upload a skin image to get an AI-assisted prediction of possible skin conditions.
          </p>
        </div>

        <Link to="/upload" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
          <UploadCloud size={20} />
          <span>New Image Analysis</span>
        </Link>
      </div>

      {/* =========================================================================
          STATISTICS CARDS (From Real Database Records)
         ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        <StatCard
          title="Total Predictions"
          value={stats?.total_predictions ?? 0}
          subtitle="Screening tests conducted"
          icon={Activity}
          color="cyan"
          badgeText="All Time"
        />
        <StatCard
          title="Normal / Benign"
          value={stats?.normal_results ?? 0}
          subtitle="Low clinical risk profile"
          icon={ShieldCheck}
          color="green"
          badgeText="Stable"
        />
        <StatCard
          title="Concerning Results"
          value={stats?.concerning_results ?? 0}
          subtitle="Requires dermatologist visit"
          icon={AlertTriangle}
          color="red"
          badgeText="Evaluate"
        />
        {stats?.is_admin ? (
          <StatCard
            title="Registered Users"
            value={stats?.registered_users ?? 1}
            subtitle="Admin portal database records"
            icon={Users}
            color="blue"
            badgeText="Admin"
          />
        ) : (
          <StatCard
            title="Chronic / Inflammatory"
            value={stats?.chronic_results ?? 0}
            subtitle="Eczema / Psoriasis findings"
            icon={TrendingUp}
            color="amber"
            badgeText="Manageable"
          />
        )}
      </div>

      {/* =========================================================================
          SECTION A & B: QUICK UPLOAD + RECENT PREDICTIONS
         ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
      }}>
        {/* Quick Upload Skin Image Card */}
        <div className="card-glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(8, 201, 245, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <UploadCloud size={20} color="var(--cyan-accent)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upload Skin Image</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick AI-Assisted Triage</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('/upload')}
              style={{
                border: '2px dashed rgba(8, 201, 245, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(1, 30, 75, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan-accent)';
                e.currentTarget.style.background = 'rgba(1, 75, 170, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(1, 75, 170, 0.45)';
                e.currentTarget.style.background = 'rgba(1, 30, 75, 0.8)';
              }}
            >
              <UploadCloud size={44} color="var(--cyan-accent)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
                Drag and drop your skin image here
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Supported formats: PNG, JPG, JPEG, WEBP (Max 5 MB)
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Choose Image File
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '12px'
          }}>
            <Sparkles size={14} color="var(--cyan-accent)" />
            <span>Includes 5 pre-packaged clinical demonstration lesions for immediate testing.</span>
          </div>
        </div>

        {/* Recent Predictions List */}
        <div className="card-glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
                <History size={20} color="var(--electric-blue)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Predictions</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest screening telemetry</span>
              </div>
            </div>
            <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--cyan-accent)', textDecoration: 'none', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {recentPredictions.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px 10px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}>
              <Activity size={36} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No predictions recorded yet</div>
              <p style={{ fontSize: '0.82rem', marginTop: '4px', maxWidth: '280px' }}>
                Upload your first skin photo to generate an AI evaluation and start your history log.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentPredictions.map((pred) => (
                <div
                  key={pred.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(1, 30, 75, 0.8)',
                    border: '1px solid rgba(1, 75, 170, 0.45)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#0B2545',
                      flexShrink: 0,
                      border: '1px solid rgba(8, 201, 245, 0.2)',
                    }}>
                      <img
                        src={`http://localhost:5000${pred.image_url}`}
                        alt={pred.predicted_class}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/samples/sample_nevus.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {pred.predicted_class}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(pred.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--cyan-accent)', fontFamily: 'var(--font-mono)' }}>
                        {pred.confidence}%
                      </div>
                      <span className={`badge ${pred.predicted_class === 'Melanoma' ? 'badge-concerning' : 'badge-benign'}`} style={{ fontSize: '0.65rem' }}>
                        {pred.severity_level || 'Evaluated'}
                      </span>
                    </div>
                    <Link
                      to={`/history`}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: 'rgba(8, 201, 245, 0.1)',
                        color: 'var(--cyan-accent)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Inspect Details"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION D: DETECTION OVERVIEW CHART (Recharts)
         ========================================================================= */}
      <div className="card-glass" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Detection Overview & Weekly Telemetry</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Classification trends over time from your screening history
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-cyan">Weekly Activity</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData?.weekly_trend || [
                { date: 'Mon', total: 0, benign: 0, concerning: 0 },
                { date: 'Tue', total: 0, benign: 0, concerning: 0 },
                { date: 'Wed', total: 0, benign: 0, concerning: 0 },
                { date: 'Thu', total: 0, benign: 0, concerning: 0 },
                { date: 'Fri', total: 0, benign: 0, concerning: 0 },
                { date: 'Sat', total: 0, benign: 0, concerning: 0 },
                { date: 'Sun', total: 0, benign: 0, concerning: 0 }
              ]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--cyan-accent)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="benign" name="Benign / Low Risk" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="concerning" name="Potentially Concerning" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================================
          SECTION C & E: COMMON CONDITIONS + TIPS FOR BETTER QUALITY
         ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {/* Common Skin Conditions Card */}
        <div className="card-glass" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(8, 201, 245, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BookOpen size={20} color="var(--cyan-accent)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Common Skin Conditions</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported classification categories</span>
              </div>
            </div>
            <Link to="/diseases" style={{ fontSize: '0.85rem', color: 'var(--cyan-accent)', textDecoration: 'none', fontWeight: 600 }}>
              Library
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {commonConditions.map((cond, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(1, 30, 75, 0.8)',
                  border: '1px solid rgba(1, 75, 170, 0.45)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cond.color }} />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>{cond.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {cond.type}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {cond.desc}
                  </div>
                </div>
                <Link
                  to="/diseases"
                  style={{ color: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', padding: '6px' }}
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Tips for Better Image Quality Card */}
        <div className="card-glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Camera size={20} color="var(--color-warning)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tips for Better Image Quality</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Optimize deep-learning accuracy</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Use Good Lighting', desc: 'Ensure diffuse, even daylight or bright indoor light without cast shadows or strong flashlight glare.', icon: Sun },
                { title: 'Capture a Clear Image', desc: 'Ensure high resolution (at least 200×200 px) and keep your camera clean and steady.', icon: Camera },
                { title: 'Focus on Affected Area', desc: 'Center the skin lesion in the frame, filling 50-70% of the photograph for optimal feature segmentation.', icon: Target },
                { title: 'Avoid Blurry Images', desc: 'Tap your smartphone screen on the lesion to lock focal distance before taking the picture.', icon: Activity },
              ].map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(8, 201, 245, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <Icon size={16} color="var(--cyan-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{tip.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                        {tip.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
