import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns'
import { id } from 'date-fns/locale'

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function Calendar({ events = [], onDayClick }) {
  const [current, setCurrent] = useState(new Date())

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (d) =>
    events.filter(e => isSameDay(new Date(e.date), d))

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setCurrent(subMonths(current, 1))} style={btnStyle}>‹</button>
        <span style={{ fontSize: 15, fontWeight: 500, minWidth: 130, textAlign: 'center' }}>
          {format(current, 'MMMM yyyy', { locale: id })}
        </span>
        <button onClick={() => addMonths(current, 0) && setCurrent(addMonths(current, 1))} style={btnStyle}>›</button>
        <button onClick={() => setCurrent(new Date())} style={{ ...btnStyle, marginLeft: 4, fontSize: 11, color: '#888' }}>
          Hari ini
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        background: '#e5e5e5',
        border: '0.5px solid #e5e5e5',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        {/* Headers */}
        {DAYS.map(d => (
          <div key={d} style={{
            background: '#f9f9f7',
            textAlign: 'center',
            fontSize: 11,
            color: '#888',
            padding: '8px 0',
            fontWeight: 500,
          }}>{d}</div>
        ))}

        {/* Days */}
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(d)
          const inMonth = isSameMonth(d, current)
          const today = isToday(d)
          return (
            <div
              key={i}
              onClick={() => onDayClick && onDayClick(d)}
              style={{
                background: inMonth ? '#fff' : '#f9f9f7',
                minHeight: 80,
                padding: '6px 6px 4px',
                cursor: onDayClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (inMonth) e.currentTarget.style.background = '#fafaf8' }}
              onMouseLeave={e => { if (inMonth) e.currentTarget.style.background = inMonth ? '#fff' : '#f9f9f7' }}
            >
              <div style={{
                width: 22, height: 22,
                borderRadius: '50%',
                background: today ? 'var(--red)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
                fontWeight: today ? 600 : 400,
                color: today ? '#fff' : inMonth ? '#333' : '#bbb',
                marginBottom: 3,
              }}>
                {format(d, 'd')}
              </div>
              {dayEvents.slice(0, 3).map((ev, idx) => (
                <div key={idx} style={{
                  borderRadius: 3,
                  padding: '1px 5px',
                  fontSize: 10,
                  marginBottom: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: ev.type === 'komputer' ? '#FCEBEB' : '#E1F5EE',
                  color: ev.type === 'komputer' ? '#791F1F' : '#085041',
                }}>
                  {ev.label}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div style={{ fontSize: 9, color: '#aaa' }}>+{dayEvents.length - 3} lagi</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <LegendDot color="#FCEBEB" border="#f09595" textColor="#791F1F" label="Komputer 3D" />
        <LegendDot color="#E1F5EE" border="#5DCAA5" textColor="#085041" label="Assistant" />
      </div>
    </div>
  )
}

function LegendDot({ color, border, textColor, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: `0.5px solid ${border}` }} />
      <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
    </div>
  )
}

const btnStyle = {
  background: 'none',
  border: '0.5px solid #ddd',
  borderRadius: 5,
  padding: '3px 10px',
  cursor: 'pointer',
  fontSize: 14,
  color: '#555',
}
