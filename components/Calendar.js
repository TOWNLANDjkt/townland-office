import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday,
  parseISO, isWithinInterval,
} from 'date-fns'
import { id } from 'date-fns/locale'

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

// Expand range events: each event has date_start & date_end (or just date for single-day)
// Returns events that cover a given day d
function getEventsForDay(events, d) {
  return events.filter(e => {
    const start = parseISO(e.date_start || e.date)
    const end = parseISO(e.date_end || e.date_start || e.date)
    try {
      return isWithinInterval(d, { start, end })
    } catch {
      return isSameDay(start, d)
    }
  })
}

// Is this the first day of the event range?
function isRangeStart(ev, d) {
  return isSameDay(parseISO(ev.date_start || ev.date), d)
}

// Is this the last day of the event range?
function isRangeEnd(ev, d) {
  const end = parseISO(ev.date_end || ev.date_start || ev.date)
  return isSameDay(end, d)
}

// Is this a multi-day event?
function isMultiDay(ev) {
  if (!ev.date_end) return false
  return ev.date_end !== (ev.date_start || ev.date)
}

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

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setCurrent(subMonths(current, 1))} style={btnStyle}>‹</button>
        <span style={{ fontSize: 15, fontWeight: 500, minWidth: 130, textAlign: 'center' }}>
          {format(current, 'MMMM yyyy', { locale: id })}
        </span>
        <button onClick={() => setCurrent(addMonths(current, 1))} style={btnStyle}>›</button>
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
          const dayEvents = getEventsForDay(events, d)
          const inMonth = isSameMonth(d, current)
          const today = isToday(d)
          return (
            <div
              key={i}
              onClick={() => onDayClick && onDayClick(d)}
              style={{
                background: inMonth ? '#fff' : '#f9f9f7',
                minHeight: 80,
                padding: '6px 0 4px',
                cursor: onDayClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (inMonth) e.currentTarget.style.background = '#fafaf8' }}
              onMouseLeave={e => { e.currentTarget.style.background = inMonth ? '#fff' : '#f9f9f7' }}
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
                marginLeft: 6,
              }}>
                {format(d, 'd')}
              </div>

              {dayEvents.slice(0, 3).map((ev, idx) => {
                const multi = isMultiDay(ev)
                const start = multi && isRangeStart(ev, d)
                const end = multi && isRangeEnd(ev, d)
                const mid = multi && !start && !end
                const isKomp = ev.type === 'komputer'
                const bg = isKomp ? '#FCEBEB' : '#E1F5EE'
                const color = isKomp ? '#791F1F' : '#085041'

                return (
                  <div key={idx} style={{
                    fontSize: 10,
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    background: bg,
                    color,
                    // Range pill style
                    borderRadius: start ? '3px 0 0 3px' : end ? '0 3px 3px 0' : mid ? '0' : '3px',
                    marginLeft: start || !multi ? 4 : 0,
                    marginRight: end || !multi ? 4 : 0,
                    padding: start ? '1px 4px 1px 5px' : mid ? '1px 0' : '1px 5px 1px 4px',
                    // Mid segments: slightly dimmer background
                    opacity: mid ? 0.85 : 1,
                  }}>
                    {/* Only show label on the start day */}
                    {(start || !multi) ? ev.label : '\u00A0'}
                  </div>
                )
              })}
              {dayEvents.length > 3 && (
                <div style={{ fontSize: 9, color: '#aaa', paddingLeft: 6 }}>+{dayEvents.length - 3} lagi</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <LegendDot color="#FCEBEB" border="#f09595" label="Komputer 3D" />
        <LegendDot color="#E1F5EE" border="#5DCAA5" label="Assistant" />
      </div>
    </div>
  )
}

function LegendDot({ color, border, label }) {
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
