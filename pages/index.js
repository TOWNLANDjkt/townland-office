import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Calendar from '../components/Calendar'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllEvents()
  }, [])

  async function fetchAllEvents() {
    setLoading(true)
    // Fetch komputer bookings
    const { data: komp } = await supabase
      .from('komputer_bookings')
      .select('*')

    // Fetch assistant assignments
    const { data: asst } = await supabase
      .from('assistant_assignments')
      .select('*, assistants(nama)')

    const kompEvents = (komp || []).map(b => ({
      date: b.tanggal,
      type: 'komputer',
      label: `${b.kode_pm} — Komp. 3D`,
      raw: b,
    }))

    const asstEvents = (asst || []).map(a => ({
      date: a.tanggal,
      type: 'assistant',
      label: `${a.kode_pm} — Asst. ${a.assistants?.nama || '?'}`,
      raw: a,
    }))

    setEvents([...kompEvents, ...asstEvents])
    setLoading(false)
  }

  // Today's summary
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayEvents = events.filter(e => e.date === todayStr)
  const kompToday = todayEvents.filter(e => e.type === 'komputer')
  const asstToday = todayEvents.filter(e => e.type === 'assistant')

  return (
    <Layout title="Kalender">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'start' }}>
        {/* Calendar */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 13 }}>Memuat data...</div>
          ) : (
            <Calendar events={events} />
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Komputer today */}
          <div style={cardStyle}>
            <div style={cardTitle}>Komputer 3D — Hari ini</div>
            {kompToday.length === 0 ? (
              <div style={emptyStyle}>Tidak ada booking</div>
            ) : (
              kompToday.map((e, i) => (
                <div key={i} style={eventRowStyle}>
                  <span style={badgeRed}>{e.raw.kode_pm}</span>
                  <span style={{ fontSize: 12, color: '#555' }}>{e.raw.nama_project}</span>
                  {e.raw.estimasi_selesai && (
                    <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto' }}>s/d {e.raw.estimasi_selesai}</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Assistant today */}
          <div style={cardStyle}>
            <div style={cardTitle}>Assistant — Hari ini</div>
            {asstToday.length === 0 ? (
              <div style={emptyStyle}>Tidak ada assignment</div>
            ) : (
              asstToday.map((e, i) => (
                <div key={i} style={eventRowStyle}>
                  <span style={badgeGreen}>{e.raw.assistants?.nama}</span>
                  <span style={{ fontSize: 12, color: '#555' }}>{e.raw.kode_pm}</span>
                </div>
              ))
            )}
          </div>

          {/* Quick links */}
          <div style={cardStyle}>
            <div style={cardTitle}>Booking Cepat</div>
            <a href="/komputer" style={quickBtn}>+ Booking Komputer 3D</a>
            <a href="/assistant" style={{ ...quickBtn, marginTop: 6, background: '#E1F5EE', color: '#085041', borderColor: '#5DCAA5' }}>
              + Assign Assistant
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const cardStyle = {
  background: '#fff',
  border: '0.5px solid #e5e5e5',
  borderRadius: 10,
  padding: '14px 16px',
}
const cardTitle = {
  fontSize: 11,
  fontWeight: 500,
  color: '#999',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 10,
}
const emptyStyle = {
  fontSize: 12,
  color: '#bbb',
  fontStyle: 'italic',
}
const eventRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  marginBottom: 6,
  flexWrap: 'wrap',
}
const badgeRed = {
  background: '#FCEBEB',
  color: '#791F1F',
  fontSize: 10,
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 3,
  fontFamily: 'DM Mono, monospace',
}
const badgeGreen = {
  background: '#E1F5EE',
  color: '#085041',
  fontSize: 10,
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 3,
}
const quickBtn = {
  display: 'block',
  textDecoration: 'none',
  textAlign: 'center',
  background: '#FCEBEB',
  color: '#791F1F',
  border: '0.5px solid #f09595',
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
}
