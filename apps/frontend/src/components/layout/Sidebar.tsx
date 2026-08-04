const items = ['Dashboard', 'Settings', 'Audit Log', 'Login'];

export function Sidebar() {
  return (
    <aside className="surface" style={{ padding: '28px', display: 'grid', gap: '20px', alignContent: 'start' }}>
      <div>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#64748b' }}>Control Panel</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.35rem' }}>Repo lifecycle</div>
      </div>
      <nav className="stack">
        {items.map((item) => (
          <a key={item} href="#" style={{ textDecoration: 'none', padding: '0.875rem 1rem', borderRadius: 16, background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(148,163,184,0.18)' }}>
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}
