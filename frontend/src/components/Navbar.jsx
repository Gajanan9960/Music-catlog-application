import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Search, Library, PieChart, Headphones } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
        <Headphones size={24} strokeWidth={2.5} />
        Pure Sonic
      </div>
      
      {token && (
        <div className="nav-links">
          <NavLink to="/search" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Search size={18}/> Search</NavLink>
          <NavLink to="/library" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Library size={18}/> Library</NavLink>
          <NavLink to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PieChart size={18}/> Analytics</NavLink>
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}>
            <LogOut size={18}/> Logout
          </button>
        </div>
      )}
      {!token && (
        <div className="nav-links">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
      )}
    </nav>
  );
}
