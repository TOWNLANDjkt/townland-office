import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function RiwayatPage() {
  const [komputer, setKomputer] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('komputer')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: k } = await supabase.from('komputer_bookings').select('*').order('tanggal', { ascending: false })
    const { data: a } = await supabase.from('assistant_assignments').select('*, assistants(nama)').order('tanggal', { ascending: false })
    setKomputer(k || [])
    setAssignments(a || [])
    setLoading(false)
  }

  return (
    <Layout title="Riwayat">
      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 10, overflow: 'hidden', maxWidth: 720 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid #eee' }}>
          {[['komputer', 'Komputer 3D'], ['assistant', 'Assistant']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === key ? 500 : 400,
              color: tab === key ? '#111' : '#aaa',
              borderBottom: tab === key ? '2px solid var(--red)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: 13 }}>Memuat...</div>
          ) : tab === 'komputer' ? (
            komputer.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: 13, fontStyle: 'italic' }}>Belum ada data</div>
            ) : (
              komputer.map(b => (
                <div key={b.id} style={rowStyle}>
                  <div style={{ minWidth: 90, fontSize: 11, color: '#aaa', fontFamily: 'DM Mono, monospace' }}>{b.tanggal}</div>
                  <span style={codeTag}>{b.kode_pm}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#333' }}>{b.nama_project || '—'}</div>
                    {b.estimasi_selesai && <div style={{ fontSize: 11, color: '#aaa' }}>Est. selesai: {b.estimasi_selesai}</div>}
                  </div>
                </div>
              ))
            )
          ) : (
            assignments.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: 13, fontStyle: 'italic' }}>Belum ada data</div>
            ) : (
              assignments.map(a => (
                <div key={a.id} style={rowStyle}>
                  <div style={{ minWidth: 90, fontSize: 11, color: '#aaa', fontFamily: 'DM Mono, monospace' }}>{a.tanggal}</div>
                  <span style={greenTag}>{a.assistants?.nama}</span>
                  <span style={codeTag}>{a.kode_pm}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#333' }}>{a.nama_project || '—'}</div>
                    {a.tanggal_selesai && <div style={{ fontSize: 11, color: '#aaa' }}>s/d {a.tanggal_selesai}</div>}
                    {a.catatan && <div style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>{a.catatan}</div>}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </Layout>
  )
}

const rowStyle = { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 16px', borderBottom: '0.5px solid #f5f5f5', flexWrap: 'wrap' }
const codeTag = { background: '#FCEBEB', color: '#791F1F', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3, fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }
const greenTag = { background: '#E1F5EE', color: '#085041', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap' }
