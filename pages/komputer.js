import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Calendar from '../components/Calendar'
import Modal from '../components/Modal'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function KomputerPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [form, setForm] = useState({ kode_pm: '', nama_project: '', tanggal: '', estimasi_selesai: '' })
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data } = await supabase.from('komputer_bookings').select('*').order('tanggal', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  function openNew(day) {
    setEditItem(null)
    setForm({ kode_pm: '', nama_project: '', tanggal: day ? format(day, 'yyyy-MM-dd') : '', estimasi_selesai: '' })
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditItem(item)
    setForm({ kode_pm: item.kode_pm, nama_project: item.nama_project, tanggal: item.tanggal, estimasi_selesai: item.estimasi_selesai || '' })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.kode_pm || !form.tanggal) return alert('Kode PM dan tanggal wajib diisi')
    setSaving(true)
    if (editItem) {
      await supabase.from('komputer_bookings').update(form).eq('id', editItem.id)
    } else {
      await supabase.from('komputer_bookings').insert(form)
    }
    setSaving(false)
    setModalOpen(false)
    fetchBookings()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus booking ini?')) return
    await supabase.from('komputer_bookings').delete().eq('id', id)
    fetchBookings()
  }

  const events = bookings.map(b => ({
    date: b.tanggal, type: 'komputer',
    label: `${b.kode_pm} — ${b.nama_project || 'No project'}`,
  }))

  const filtered = bookings.filter(b =>
    b.kode_pm.toLowerCase().includes(query.toLowerCase()) ||
    (b.nama_project || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Layout title="Komputer 3D">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Calendar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#888' }}>Klik tanggal untuk booking baru</p>
            <button onClick={() => openNew(null)} style={redBtn}>+ Booking Baru</button>
          </div>
          <Calendar events={events} onDayClick={openNew} />
        </div>

        {/* List */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #eee' }}>
            <div style={sectionTitle}>Semua Booking</div>
            <input
              placeholder="Cari kode PM atau project..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={searchInput}
            />
          </div>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {loading ? (
              <div style={emptyMsg}>Memuat...</div>
            ) : filtered.length === 0 ? (
              <div style={emptyMsg}>Belum ada booking</div>
            ) : (
              filtered.map(b => (
                <div key={b.id} style={listRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={codeTag}>{b.kode_pm}</span>
                      <span style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>{b.nama_project || '—'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>
                      {b.tanggal}
                      {b.estimasi_selesai ? ` · selesai ~${b.estimasi_selesai}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(b)} style={iconBtn}>✎</button>
                    <button onClick={() => handleDelete(b.id)} style={{ ...iconBtn, color: '#cc0000' }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Booking' : 'Booking Komputer 3D'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
              placeholder="contoh: Thamrin Blok B"
              value={form.nama_project}
              onChange={e => setForm({ ...form, nama_project: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <Field label="Tanggal *">
            <input
              type="date"
              value={form.tanggal}
              onChange={e => setForm({ ...form, tanggal: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <Field label="Estimasi Selesai (jam)">
            <input
              type="time"
              value={form.estimasi_selesai}
              onChange={e => setForm({ ...form, estimasi_selesai: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={() => setModalOpen(false)} style={cancelBtn}>Batal</button>
            <button onClick={handleSave} disabled={saving} style={redBtn}>
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

const redBtn = { background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }
const cancelBtn = { background: '#f5f5f5', color: '#555', border: '0.5px solid #ddd', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer', flex: 1 }
const inputStyle = { width: '100%', border: '0.5px solid #ddd', borderRadius: 6, padding: '8px 10px', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif' }
const searchInput = { width: '100%', marginTop: 8, border: '0.5px solid #eee', borderRadius: 6, padding: '7px 10px', fontSize: 12, outline: 'none', background: '#fafafa' }
const sectionTitle = { fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }
const emptyMsg = { padding: '24px 16px', fontSize: 13, color: '#bbb', textAlign: 'center', fontStyle: 'italic' }
const listRow = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '0.5px solid #f5f5f5' }
const codeTag = { background: '#FCEBEB', color: '#791F1F', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3, fontFamily: 'DM Mono, monospace' }
const iconBtn = { background: 'none', border: '0.5px solid #eee', borderRadius: 4, padding: '3px 7px', cursor: 'pointer', fontSize: 12, color: '#888' }
