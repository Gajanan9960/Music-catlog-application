import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Search, Library, PieChart } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Music Catalog</div>
      
      {token && (
        <div className="nav-links">
          <Link to="/search"><Search size={18} style={{verticalAlign: 'text-bottom'}}/> Search</Link>
          <Link to="/library"><Library size={18} style={{verticalAlign: 'text-bottom'}}/> Library</Link>
          <Link to="/analytics"><PieChart size={18} style={{verticalAlign: 'text-bottom'}}/> Analytics</Link>
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0 }}>
            <LogOut size={18} style={{verticalAlign: 'text-bottom'}}/> Logout
          </button>
        </div>
      )}
      {!token && (
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
