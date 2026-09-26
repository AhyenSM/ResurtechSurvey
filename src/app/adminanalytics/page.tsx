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

export default function AdminAnalytics() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: '#06362A', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>📊 Survey Analytics</h1>
            <p style={{ color: '#637A6D', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>survey.resurtech.co — Live Dashboard</p>
          </div>
          <button onClick={() => { setAuthed(false); setPw(''); }} style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid rgba(6,54,42,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#637A6D', fontSize: '0.85rem', fontFamily: 'inherit' }}>
            Sign Out
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#637A6D', textAlign: 'center', marginTop: '4rem' }}>Loading data...</p>
        ) : (
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

            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: '1px solid rgba(6,54,42,0.1)', padding: '1.5rem', boxShadow: '0 4px 20px rgba(6,54,42,0.06)', overflowX: 'auto' }}>
              <h2 style={{ color: '#06362A', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>📋 Recent Submissions (Latest 20)</h2>
              {data.length === 0 ? <p style={{ color: '#637A6D', textAlign: 'center', padding: '2rem 0' }}>No submissions yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(6,54,42,0.1)' }}>
                      {['Date', 'Name', 'Email', 'Role', 'Country', 'City'].map(h => (
                        <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#637A6D', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 20).map((row, i) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid rgba(6,54,42,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(6,54,42,0.02)' }}>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#637A6D', whiteSpace: 'nowrap' }}>{row.created_at?.slice(0, 10)}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{row.full_name || '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#1FBE9A' }}>{row.email || '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{row.primary_role ? row.primary_role.split('/')[0].trim() : '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{row.country || '—'}</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>{row.city || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
