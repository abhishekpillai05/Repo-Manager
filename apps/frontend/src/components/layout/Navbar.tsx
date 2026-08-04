export function Navbar() {
  return (
    <header className="surface card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#64748b' }}>PT Repo Manager</div>
        <h1 className="section-title">Lifecycle control for candidate repositories</h1>
      </div>
      <div className="muted">GitHub Org connected</div>
    </header>
  );
}
