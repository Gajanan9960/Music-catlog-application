import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '20px' }}>Register</h2>
      {error && <div style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Register</button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
}
