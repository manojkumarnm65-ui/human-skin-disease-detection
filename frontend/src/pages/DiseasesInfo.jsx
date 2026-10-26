import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  Activity,
  HeartPulse,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { diseaseService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DiseasesInfo = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    document.title = 'Human Skin Disease Detection — Disease Library';
    const fetchDiseases = async () => {
      try {
        const res = await diseaseService.getDiseases();
        setDiseases(res.data.diseases || []);
        if (res.data.diseases?.length > 0) {
          setExpandedId(res.data.diseases[0].id); // Expand first condition by default
        }
      } catch (err) {
        console.error('Error fetching disease library:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    let matchesCategory = categoryFilter === 'All';
    if (!matchesCategory) {
      if (categoryFilter === 'Infectious') {
        const cat = d.category.toLowerCase();
        matchesCategory = cat.includes('infection') || cat.includes('fungal') || cat.includes('viral') || cat.includes('bacterial');
      } else {
        matchesCategory = d.category.toLowerCase().includes(categoryFilter.toLowerCase());
      }
    }
    return matchesSearch && matchesCategory;
  });

  const getSeverityBadgeClass = (severity) => {
    if (severity.toLowerCase().includes('concerning') || severity.toLowerCase().includes('high') || severity.toLowerCase().includes('malignant')) {
      return 'badge-concerning';
    }
    if (severity.toLowerCase().includes('chronic') || severity.toLowerCase().includes('manageable')) {
      return 'badge-chronic';
    }
    return 'badge-benign';
  };

  if (loading) {
    return <LoadingSpinner message="Loading medical knowledge library..." subtext="Retrieving peer-reviewed clinical summaries across 18 conditions" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Page Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Clinical Reference</span>
          <span className="badge badge-benign">18 Pathologies Indexed</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Dermatological Disease Library (18 Conditions)</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Evidence-based educational compendium covering benign, inflammatory, infectious, and malignant skin conditions.
        </p>
      </div>

      {/* Search & Filter Header */}
      <div className="card-glass" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px', fontSize: '0.9rem' }}
              placeholder="Search diseases, symptoms, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Malignant', 'Benign', 'Inflammatory', 'Autoimmune', 'Infectious'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: categoryFilter === cat ? '1px solid var(--cyan-accent)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: categoryFilter === cat ? 'rgba(8, 201, 245, 0.15)' : 'rgba(1, 30, 75, 0.7)',
                  color: categoryFilter === cat ? 'var(--cyan-accent)' : 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Cards Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredDiseases.map((d) => {
          const isExpanded = expandedId === d.id;
          return (
            <div
              key={d.id}
              className="card-glass"
              style={{
                overflow: 'hidden',
                border: isExpanded ? '1px solid rgba(8, 201, 245, 0.4)' : '1px solid var(--border-color)',
                boxShadow: isExpanded ? 'var(--shadow-glow)' : 'var(--shadow-md)',
              }}
            >
              {/* Card Header (Clickable to toggle accordion) */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
                style={{
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(8, 123, 255, 0.08)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Disease Image Thumbnail */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(8, 201, 245, 0.4)',
                    boxShadow: '0 0 15px rgba(8, 201, 245, 0.25)',
                    flexShrink: 0,
                    position: 'relative',
                    background: 'rgba(1, 30, 75, 0.9)'
                  }}>
                    <img
                      src={d.image_url || '/samples/sample_melanoma.jpg'}
                      alt={d.name}
                      className="lesion-img-hover"
                      onError={(e) => { e.target.src = '/samples/sample_melanoma.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>{d.name}</h3>
                      <span className={`badge ${getSeverityBadgeClass(d.severity)}`}>
                        {d.severity}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                      {d.category}
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-accent)',
                }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Card Body */}
              {isExpanded && (
                <div style={{ padding: '0 28px 28px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  {/* Visual Specimen & Overview Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                    marginTop: '20px',
                    alignItems: 'center'
                  }}>
                    {/* Clinical Reference Specimen Image */}
                    <div style={{
                      position: 'relative',
                      height: '220px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '2px solid rgba(8, 201, 245, 0.35)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(8, 201, 245, 0.25)',
                      background: 'rgba(1, 30, 75, 0.9)'
                    }}>
                      <img
                        src={d.image_url || '/samples/sample_melanoma.jpg'}
                        alt={`${d.name} clinical specimen`}
                        className="lesion-img-hover"
                        onError={(e) => { e.target.src = '/samples/sample_melanoma.jpg'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Animated Scanning Line */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #08C9F5, #FFFFFF, #08C9F5, transparent)',
                        boxShadow: '0 0 10px #08C9F5, 0 0 20px #08C9F5',
                        animation: 'laserScan 3.5s ease-in-out infinite',
                        zIndex: 5,
                      }} />
                      {/* HUD Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(1, 35, 90, 0.95)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.74rem',
                        color: 'var(--cyan-accent)',
                        border: '1px solid rgba(8, 201, 245, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 6,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                      }}>
                        <Sparkles size={12} />
                        <span>Clinical Reference Specimen</span>
                      </div>
                    </div>

                    {/* Overview & Pathophysiology */}
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                        Overview & Pathophysiology
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>
                        {d.description}
                      </p>
                    </div>
                  </div>

                  {/* 2-Column Grid: Symptoms & Risk Factors */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginTop: '24px',
                  }}>
                    {/* Symptoms */}
                    <div style={{ background: 'rgba(1, 30, 75, 0.75)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(1, 75, 170, 0.45)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700, marginBottom: '14px' }}>
                        <Activity size={18} color="var(--cyan-accent)" />
                        <span>Common Signs & Symptoms</span>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {d.symptoms.map((sym, sIdx) => (
                          <li key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                            <CheckCircle2 size={16} color="var(--cyan-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{sym}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Factors */}
                    <div style={{ background: 'rgba(1, 30, 75, 0.75)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(1, 75, 170, 0.45)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700, marginBottom: '14px' }}>
                        <AlertCircle size={18} color="#F59E0B" />
                        <span>General Risk Factors</span>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {d.risk_factors.map((rf, rIdx) => (
                          <li key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0, marginTop: '8px' }} />
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention & Skin-Care Guidance */}
                  <div style={{ marginTop: '24px', background: 'rgba(8, 123, 255, 0.08)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(8, 201, 245, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                      <HeartPulse size={18} color="var(--cyan-accent)" />
                      <span>Prevention & Dermatological Care Guidance</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                      {d.care_guidance.map((cg, cIdx) => (
                        <div key={cIdx} style={{ fontSize: '0.86rem', color: '#E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: 'var(--cyan-accent)', fontWeight: 700 }}>•</span>
                          <span>{cg}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical References */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Peer-Reviewed Medical Citations & References
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {d.medical_references.map((ref, refIdx) => (
                        <div
                          key={refIdx}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(1, 30, 75, 0.85)',
                            border: '1px solid rgba(1, 75, 170, 0.45)',
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {ref}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiseasesInfo;
