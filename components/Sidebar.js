import Link from 'next/link'
import { useRouter } from 'next/router'

const nav = [
  {
    section: 'Utama',
    items: [
      { href: '/', label: 'Kalender', icon: CalIcon },
      { href: '/komputer', label: 'Komputer 3D', icon: PcIcon },
      { href: '/assistant', label: 'Assistant', icon: TeamIcon },
    ],
  },
  {
    section: 'Lainnya',
    items: [
      { href: '/riwayat', label: 'Riwayat', icon: ClockIcon },
    ],
  },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '0.5px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <img src="/logo.png" alt="Townland" style={{ width: 30, height: 30, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Townland JKT</div>
          <div style={{ fontSize: 10, color: '#666' }}>Office Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {nav.map(group => (
          <div key={group.section}>
            <div style={{ fontSize: 9, color: '#444', padding: '12px 16px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {group.section}
            </div>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = router.pathname === href
              return (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 16px',
                    fontSize: 13,
                    color: active ? '#fff' : '#888',
                    fontWeight: active ? 500 : 400,
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    borderLeft: active ? '2px solid var(--red)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    <Icon color={active ? '#fff' : '#666'} />
                    {label}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '0.5px solid #2a2a2a', fontSize: 10, color: '#444' }}>
        v1.0 · Townland JKT
      </div>
    </aside>
  )
}

function CalIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="11" rx="2" stroke={color} strokeWidth="1.2"/>
      <path d="M5 1v4M11 1v4M1 7h14" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function PcIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="10" rx="1.5" stroke={color} strokeWidth="1.2"/>
      <path d="M5 14h6M8 12v2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function TeamIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="3" stroke={color} strokeWidth="1.2"/>
      <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="1.2"/>
      <path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 8c1.657 0 3 1.343 3 3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function ClockIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2"/>
      <path d="M8 5v3l2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
