import Sidebar from './Sidebar'

export default function Layout({ children, title }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Topbar */}
        <div style={{
          background: '#fff',
          borderBottom: '0.5px solid #e5e5e5',
          padding: '14px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: '#111', margin: 0 }}>{title}</h1>
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: '24px', maxWidth: 1100 }} className="fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
