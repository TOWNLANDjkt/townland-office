import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function PMAutocomplete({ value, onChange, inputStyle }) {
  const [pmList, setPmList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    supabase.from('project_managers').select('kode, nama').order('kode').then(({ data }) => {
      setPmList(data || [])
    })
    // Click outside to close
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleInput(e) {
    const val = e.target.value.toUpperCase()
    onChange(val)
    if (val.length === 0) {
      setFiltered(pmList)
    } else {
      setFiltered(pmList.filter(pm =>
        pm.kode.includes(val) || pm.nama.toUpperCase().includes(val)
      ))
    }
    setOpen(true)
  }

  function selectPm(kode) {
    onChange(kode)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={handleInput}
        onFocus={() => {
          setFiltered(value ? pmList.filter(pm => pm.kode.includes(value) || pm.nama.toUpperCase().includes(value)) : pmList)
          setOpen(true)
        }}
        placeholder="Ketik kode PM..."
        autoComplete="off"
        style={inputStyle}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '0.5px solid #ddd',
          borderRadius: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          zIndex: 999,
          maxHeight: 180,
          overflowY: 'auto',
          marginTop: 2,
        }}>
          {filtered.map(pm => (
            <div
              key={pm.kode}
              onMouseDown={() => selectPm(pm.kode)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                borderBottom: '0.5px solid #f5f5f5',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9f9f7'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 11,
                fontWeight: 600,
                background: '#FCEBEB',
                color: '#791F1F',
                padding: '1px 7px',
                borderRadius: 3,
                minWidth: 44,
                textAlign: 'center',
              }}>{pm.kode}</span>
              <span style={{ color: '#555' }}>{pm.nama}</span>
            </div>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && value.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '0.5px solid #ddd', borderRadius: 6,
          padding: '10px 12px', fontSize: 12, color: '#aaa',
          zIndex: 999, marginTop: 2,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
          Kode PM tidak ditemukan
        </div>
      )}
    </div>
  )
}
