'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_PASSWORD = 'Ardemsiunrtech@';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)' }}>
      <p style={{ color: '#637A6D', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>{label}</p>
      <p style={{ color: '#06362A', fontSize: '2rem', fontWeight: 700, margin: 0 }}>{value}</p>
      {sub && <p style={{ color: '#1FBE9A', fontSize: '0.8rem', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function BarChart({ data, maxVal, color }: { data: { label: string; count: number }[]; maxVal: number; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {data.map(({ label, count }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ minWidth: '160px', fontSize: '0.82rem', color: '#050807', textAlign: 'right', lineHeight: 1.3, flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, background: 'rgba(6,54,42,0.06)', borderRadius: '6px', height: '28px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '6px', width: maxVal > 0 ? `${Math.max(4, (count / maxVal) * 100)}%` : '4%', background: color, transition: 'width 0.6s ease', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
              <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResponseModal({ row, onClose }: { row: any; onClose: () => void }) {
  const fields = [
    { label: 'Submitted', value: row.created_at?.slice(0, 19).replace('T', ' ') },
    { label: 'Full Name', value: row.full_name },
    { label: 'Email', value: row.email },
    { label: 'Opt-in Beta', value: row.opt_in_beta ? 'Yes' : 'No' },
    { label: '---', value: '' },
    { label: 'Country', value: row.country },
    { label: 'Region', value: row.region },
    { label: 'City', value: row.city },
    { label: '---', value: '' },
    { label: 'Primary Role', value: row.primary_role },
    { label: 'Familiarity (1-5)', value: row.familiarity_3d_printing },
    { label: 'Active CAD User', value: row.is_active_cad_user === true ? 'Yes' : row.is_active_cad_user === false ? 'No' : '—' },
    { label: 'CAD Tools Used', value: Array.isArray(row.cad_tools) ? row.cad_tools.join(', ') : row.cad_tools },
    { label: 'Avg Design Time', value: row.avg_design_time },
    { label: 'Uses AI Tools', value: row.uses_ai_tools },
    { label: 'AI Tools Details', value: row.ai_tools_details },
    { label: 'Main Pain Points', value: row.main_pain_points },
    { label: '---', value: '' },
    { label: 'Prompt-to-STL Score', value: row.feat_prompt_to_stl_score },
    { label: 'Prompt-to-STL Solves', value: row.feat_prompt_to_stl_solves },
    { label: 'Prompt-to-STL Notes', value: row.feat_prompt_to_stl_notes },
    { label: 'Localized Edit Score', value: row.feat_localized_edit_score },
    { label: 'Localized Edit Solves', value: row.feat_localized_edit_solves },
    { label: 'Localized Edit Notes', value: row.feat_localized_edit_notes },
    { label: 'File Converter Score', value: row.feat_file_converter_score },
    { label: 'File Converter Solves', value: row.feat_file_converter_solves },
    { label: 'File Converter Notes', value: row.feat_file_converter_notes },
    { label: 'Material Calc Score', value: row.feat_material_calc_score },
    { label: 'Material Calc Solves', value: row.feat_material_calc_solves },
    { label: 'Material Calc Notes', value: row.feat_material_calc_notes },
    { label: 'Multilingual Score', value: row.feat_multilingual_score },
    { label: 'Multilingual Solves', value: row.feat_multilingual_solves },
    { label: 'Multilingual Notes', value: row.feat_multilingual_notes },
    { label: 'Additional Features Wished', value: row.additional_wished_features },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,7,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(5,8,7,0.3)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#06362A', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>📋 Full Response — {row.full_name || row.email || 'Anonymous'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#637A6D', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {fields.map(({ label, value }, i) => {
            if (label === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(6,54,42,0.08)', margin: '0.5rem 0' }} />;
            if (!value && value !== 0) return null;
            return (
              <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(6,54,42,0.04)' }}>
                <span style={{ minWidth: '180px', color: '#637A6D', fontSize: '0.82rem', flexShrink: 0, fontWeight: 500 }}>{label}</span>
                <span style={{ color: '#050807', fontSize: '0.82rem', flex: 1 }}>{String(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function exportToCSV(data: any[]) {
  if (!data.length) return;
  const cols = [
    'id', 'created_at', 'full_name', 'email', 'opt_in_beta',
    'country', 'region', 'city',
    'primary_role', 'familiarity_3d_printing', 'is_active_cad_user', 'cad_tools',
    'avg_design_time', 'uses_ai_tools', 'ai_tools_details', 'main_pain_points',
    'feat_prompt_to_stl_score', 'feat_prompt_to_stl_solves', 'feat_prompt_to_stl_notes',
    'feat_localized_edit_score', 'feat_localized_edit_solves', 'feat_localized_edit_notes',
    'feat_file_converter_score', 'feat_file_converter_solves', 'feat_file_converter_notes',
    'feat_material_calc_score', 'feat_material_calc_solves', 'feat_material_calc_notes',
    'feat_multilingual_score', 'feat_multilingual_solves', 'feat_multilingual_notes',
    'additional_wished_features'
  ];
  const escape = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = Array.isArray(v) ? v.join('; ') : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = cols.join(',');
  const rows = data.map(r => cols.map(c => escape(r[c])).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resurtech-survey-responses-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAnalytics() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses'>('overview');

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); }
    else { setPwError('Incorrect password. Access denied.'); }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase.from('survey_responses').select('*').order('created_at', { ascending: false })
      .then(({ data: rows }) => { setData(rows || []); setLoading(false); });
  }, [authed]);

  const total = data.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = data.filter(r => r.created_at?.slice(0, 10) === today).length;

  const last14: { label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last14.push({ label: key.slice(5), count: data.filter(r => r.created_at?.slice(0, 10) === key).length });
  }
  const maxDay = Math.max(...last14.map(d => d.count), 1);

  const countryMap: Record<string, number> = {};
  data.forEach(r => { const c = r.country || 'Unknown'; countryMap[c] = (countryMap[c] || 0) + 1; });
  const countries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, count]) => ({ label, count }));
  const maxCountry = Math.max(...countries.map(c => c.count), 1);

  const roleMap: Record<string, number> = {};
  data.forEach(r => { if (r.primary_role) { roleMap[r.primary_role] = (roleMap[r.primary_role] || 0) + 1; } });
  const roles = Object.entries(roleMap).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  const maxRole = Math.max(...roles.map(r => r.count), 1);

  const featureKeys = [
    { key: 'feat_prompt_to_stl_score', label: 'Prompt-to-STL' },
    { key: 'feat_localized_edit_score', label: 'Localized Edit' },
    { key: 'feat_file_converter_score', label: 'File Converter' },
    { key: 'feat_material_calc_score', label: 'Material Calc' },
    { key: 'feat_multilingual_score', label: 'Multilingual' },
  ];
  const featureAvgs = featureKeys.map(({ key, label }) => {
    const vals = data.map(r => r[key]).filter((v: any): v is number => typeof v === 'number');
    const avg = vals.length ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
    return { label, count: parseFloat(avg.toFixed(2)) };
  });

  const tabStyle = (active: boolean) => ({
    padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
    fontSize: '0.9rem', border: 'none', fontFamily: 'inherit',
    background: active ? '#06362A' : 'transparent',
    color: active ? '#39FF14' : '#637A6D',
    transition: 'all 0.2s ease'
  });

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#E8FFF2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(6,54,42,0.14)', border: '1px solid rgba(6,54,42,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#06362A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>🔐</div>
            <h1 style={{ color: '#06362A', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Admin Analytics</h1>
            <p style={{ color: '#637A6D', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>Resurtech Survey Dashboard</p>
          </div>
          <input type="password" placeholder="Enter admin password" value={pw}
            onChange={e => { setPw(e.target.value); setPwError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '10px', border: `1px solid ${pwError ? '#ff6b6b' : 'rgba(6,54,42,0.15)'}`, fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '0.75rem', display: 'block' }}
          />
          {pwError && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{pwError}</p>}
          <button onClick={handleLogin} style={{ width: '100%', padding: '0.9rem', background: '#06362A', color: '#39FF14', border: '1px solid #39FF14', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Access Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#E8FFF2', fontFamily: "'Poppins', sans-serif", padding: '2rem' }}>
      {selectedRow && <ResponseModal row={selectedRow} onClose={() => setSelectedRow(null)} />}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: '#06362A', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📊 Survey Analytics</h1>
            <p style={{ color: '#637A6D', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>survey.resurtech.co — Live Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => exportToCSV(data)} style={{ padding: '0.5rem 1.25rem', background: '#06362A', color: '#39FF14', border: '1px solid #39FF14', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 600 }}>
              ⬇ Export CSV ({total})
            </button>
            <button onClick={() => { setAuthed(false); setPw(''); }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(6,54,42,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#637A6D', fontSize: '0.85rem', fontFamily: 'inherit' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '0.4rem', width: 'fit-content', marginBottom: '1.5rem' }}>
          <button style={tabStyle(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button style={tabStyle(activeTab === 'responses')} onClick={() => setActiveTab('responses')}>📋 All Responses</button>
        </div>

        {loading ? (
          <p style={{ color: '#637A6D', textAlign: 'center', marginTop: '4rem' }}>Loading data...</p>
        ) : activeTab === 'overview' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard label="Total Submissions" value={total} />
              <StatCard label="Submitted Today" value={todayCount} />
              <StatCard label="Countries Reached" value={Object.keys(countryMap).filter(k => k !== 'Unknown').length} />
              <StatCard label="Active CAD Users" value={data.filter(r => r.is_active_cad_user === true).length}
                sub={total > 0 ? `${Math.round(data.filter(r => r.is_active_cad_user === true).length / total * 100)}% of respondents` : undefined} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)' }}>
              <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>📅 Submissions — Last 14 Days</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px' }}>
                {last14.map(({ label, count }) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: count > 0 ? '#06362A' : 'rgba(6,54,42,0.08)', height: `${Math.max(4, (count / maxDay) * 90)}px`, transition: 'height 0.5s ease' }} title={`${label}: ${count}`} />
                    <span style={{ fontSize: '0.55rem', color: '#637A6D', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '30px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)' }}>
                <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>🌍 Responses by Country</h2>
                <p style={{ color: '#637A6D', fontSize: '0.75rem', margin: '-0.75rem 0 1rem' }}>Auto-detected from respondent IP address</p>
                {countries.length === 0 ? <p style={{ color: '#637A6D', fontSize: '0.9rem' }}>No location data yet.</p> : <BarChart data={countries} maxVal={maxCountry} color="#1FBE9A" />}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)' }}>
                <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>👤 Respondent Roles</h2>
                {roles.length === 0 ? <p style={{ color: '#637A6D', fontSize: '0.9rem' }}>No role data yet.</p> : <BarChart data={roles} maxVal={maxRole} color="#0B4A38" />}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)' }}>
              <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>⭐ Feature Interest — Average Score (out of 5)</h2>
              <p style={{ color: '#637A6D', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Based on respondents who completed the feature evaluation section.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {featureAvgs.map(({ label, count }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ minWidth: '140px', fontSize: '0.85rem', color: '#050807', textAlign: 'right', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, background: 'rgba(6,54,42,0.06)', borderRadius: '6px', height: '28px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '6px', width: `${(count / 5) * 100}%`, background: 'linear-gradient(90deg, #06362A, #39FF14)', display: 'flex', alignItems: 'center', paddingLeft: '8px', transition: 'width 0.6s ease' }}>
                        <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{count > 0 ? count : '—'}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#637A6D', minWidth: '28px' }}>/5</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* All Responses Tab */
          <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, margin: 0 }}>All {total} Responses — Click any row to see full details</h2>
              <button onClick={() => exportToCSV(data)} style={{ padding: '0.4rem 1rem', background: '#06362A', color: '#39FF14', border: '1px solid #39FF14', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 600 }}>
                ⬇ Export CSV
              </button>
            </div>
            {data.length === 0 ? (
              <p style={{ color: '#637A6D', textAlign: 'center', padding: '2rem 0' }}>No submissions yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(6,54,42,0.1)' }}>
                    {['Date', 'Name', 'Email', 'Role', 'Familiarity', 'CAD User', 'Country', 'City', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#637A6D', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={row.id}
                      onClick={() => setSelectedRow(row)}
                      style={{ borderBottom: '1px solid rgba(6,54,42,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(6,54,42,0.02)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,54,42,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(6,54,42,0.02)')}
                    >
                      <td style={{ padding: '0.5rem 0.75rem', color: '#637A6D', whiteSpace: 'nowrap' }}>{row.created_at?.slice(0, 10)}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{row.full_name || '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: '#1FBE9A' }}>{row.email || '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{row.primary_role ? row.primary_role.split('/')[0].trim() : '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{row.familiarity_3d_printing ?? '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: row.is_active_cad_user === true ? 'rgba(31,190,154,0.15)' : 'rgba(99,122,109,0.1)', color: row.is_active_cad_user === true ? '#1FBE9A' : '#637A6D' }}>
                          {row.is_active_cad_user === true ? 'Yes' : row.is_active_cad_user === false ? 'No' : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{row.country || '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{row.city || '—'}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <button onClick={e => { e.stopPropagation(); setSelectedRow(row); }} style={{ padding: '0.25rem 0.6rem', background: '#06362A', color: '#39FF14', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
