import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Search, Library, PieChart, Headphones } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <nav className="navbar fade-up">
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          <Headphones size={24} strokeWidth={2.5} color="var(--accent-color)" />
          Pure Sonic
        </div>
        
        {token && (
          <div className="nav-links">
            <NavLink to="/search" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Search size={18}/> Search</NavLink>
            <NavLink to="/library" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Library size={18}/> Library</NavLink>
            <NavLink to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PieChart size={18}/> Analytics</NavLink>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
              {email && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{email}</span>}
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}>
                <LogOut size={18}/> Logout
              </button>
            </div>
          </div>
        )}
        {!token && (
          <div className="nav-links">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
