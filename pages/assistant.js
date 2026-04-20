import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Calendar from '../components/Calendar'
import Modal from '../components/Modal'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function AssistantPage() {
  const [assistants, setAssistants] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ assistant_id: '', kode_pm: '', nama_project: '', tanggal: '', tanggal_selesai: '', catatan: '' })
  const [saving, setSaving] = useState(false)
  const [filterAsst, setFilterAsst] = useState('all')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: assts } = await supabase.from('assistants').select('*').order('nama')
    const { data: assigns } = await supabase.from('assistant_assignments').select('*, assistants(nama, tipe)').order('tanggal', { ascending: false })
    setAssistants(assts || [])
    setAssignments(assigns || [])
    setLoading(false)
  }

  function openNew(day) {
    setEditItem(null)
    setForm({ assistant_id: '', kode_pm: '', nama_project: '', tanggal: day ? format(day, 'yyyy-MM-dd') : '', tanggal_selesai: '', catatan: '' })
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditItem(item)
    setForm({
      assistant_id: item.assistant_id,
      kode_pm: item.kode_pm,
      nama_project: item.nama_project || '',
      tanggal: item.tanggal,
      tanggal_selesai: item.tanggal_selesai || '',
      catatan: item.catatan || '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.assistant_id || !form.kode_pm || !form.tanggal) return alert('Assistant, Kode PM, dan tanggal wajib diisi')
    setSaving(true)
    if (editItem) {
      await supabase.from('assistant_assignments').update(form).eq('id', editItem.id)
    } else {
      await supabase.from('assistant_assignments').insert(form)
    }
    setSaving(false)
    setModalOpen(false)
    fetchAll()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus assignment ini?')) return
    await supabase.from('assistant_assignments').delete().eq('id', id)
    fetchAll()
  }

  const events = assignments.map(a => ({
    date: a.tanggal,
    type: 'assistant',
    label: `${a.kode_pm} — Asst. ${a.assistants?.nama || '?'}`,
  }))

  const filtered = filterAsst === 'all'
    ? assignments
    : assignments.filter(a => String(a.assistant_id) === filterAsst)

  // Status per assistant (today)
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  function getStatus(asstId) {
    const busy = assignments.find(a =>
      String(a.assistant_id) === String(asstId) &&
      a.tanggal <= todayStr &&
      (!a.tanggal_selesai || a.tanggal_selesai >= todayStr)
    )
    return busy || null
  }

  return (
    <Layout title="Assistant">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Calendar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#888' }}>Klik tanggal untuk assign assistant</p>
            <button onClick={() => openNew(null)} style={greenBtn}>+ Assign Assistant</button>
          </div>
          <Calendar events={events} onDayClick={openNew} />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status cards */}
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 10, padding: '14px 16px' }}>
            <div style={sectionTitle}>Status Hari Ini</div>
            {loading ? <div style={emptyMsg}>Memuat...</div> : assistants.map(a => {
              const status = getStatus(a.id)
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{a.nama}</span>
                    <span style={{ fontSize: 10, color: '#aaa', marginLeft: 6 }}>{a.tipe}</span>
                    {status && (
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                        {status.kode_pm} · {status.nama_project || '—'}
                      </div>
                    )}
                  </div>
                  <span style={status ? busyBadge : freeBadge}>
                    {status ? 'Sibuk' : 'Bebas'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Assignment list */}
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #eee' }}>
              <div style={sectionTitle}>Semua Assignment</div>
              <select value={filterAsst} onChange={e => setFilterAsst(e.target.value)} style={selectStyle}>
                <option value="all">Semua assistant</option>
                {assistants.map(a => (
                  <option key={a.id} value={String(a.id)}>{a.nama}</option>
                ))}
              </select>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {loading ? (
                <div style={emptyMsg}>Memuat...</div>
              ) : filtered.length === 0 ? (
                <div style={emptyMsg}>Belum ada data</div>
              ) : (
                filtered.map(a => (
                  <div key={a.id} style={listRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 2 }}>
                        <span style={greenTag}>{a.assistants?.nama}</span>
                        <span style={codeTag}>{a.kode_pm}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#555' }}>{a.nama_project || '—'}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>
                        {a.tanggal}{a.tanggal_selesai ? ` s/d ${a.tanggal_selesai}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => openEdit(a)} style={iconBtn}>✎</button>
                      <button onClick={() => handleDelete(a.id)} style={{ ...iconBtn, color: '#cc0000' }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Assignment' : 'Assign Assistant'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Assistant *">
            <select value={form.assistant_id} onChange={e => setForm({ ...form, assistant_id: e.target.value })} style={inputStyle}>
              <option value="">Pilih assistant...</option>
              {assistants.map(a => (
                <option key={a.id} value={a.id}>{a.nama} ({a.tipe})</option>
              ))}
            </select>
          </Field>
          <Field label="Kode PM *">
            <input
              placeholder="contoh: ARN"
              value={form.kode_pm}
              onChange={e => setForm({ ...form, kode_pm: e.target.value.toUpperCase() })}
              style={inputStyle}
            />
          </Field>
          <Field label="Nama Project">
            <input
              placeholder="contoh: BSD Cluster"
              value={form.nama_project}
              onChange={e => setForm({ ...form, nama_project: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Tanggal Mulai *">
              <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Tanggal Selesai">
              <input type="date" value={form.tanggal_selesai} onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} style={inputStyle} />
            </Field>
          </div>
          <Field label="Catatan">
            <textarea
              placeholder="Catatan tambahan..."
              value={form.catatan}
              onChange={e => setForm({ ...form, catatan: e.target.value })}
              style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
            />
          </Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={() => setModalOpen(false)} style={cancelBtn}>Batal</button>
            <button onClick={handleSave} disabled={saving} style={greenBtn}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

const greenBtn = { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }
const cancelBtn = { background: '#f5f5f5', color: '#555', border: '0.5px solid #ddd', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer', flex: 1 }
const inputStyle = { width: '100%', border: '0.5px solid #ddd', borderRadius: 6, padding: '8px 10px', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif' }
const selectStyle = { width: '100%', marginTop: 8, border: '0.5px solid #eee', borderRadius: 6, padding: '7px 10px', fontSize: 12, outline: 'none', background: '#fafafa' }
const sectionTitle = { fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }
const emptyMsg = { padding: '24px 16px', fontSize: 13, color: '#bbb', textAlign: 'center', fontStyle: 'italic' }
const listRow = { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 16px', borderBottom: '0.5px solid #f5f5f5' }
const codeTag = { background: '#FCEBEB', color: '#791F1F', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3, fontFamily: 'DM Mono, monospace' }
const greenTag = { background: '#E1F5EE', color: '#085041', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3 }
const iconBtn = { background: 'none', border: '0.5px solid #eee', borderRadius: 4, padding: '3px 7px', cursor: 'pointer', fontSize: 12, color: '#888' }
const busyBadge = { background: '#FCEBEB', color: '#791F1F', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3 }
const freeBadge = { background: '#EAF3DE', color: '#27500A', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3 }
