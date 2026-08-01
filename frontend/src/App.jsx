import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Library from './pages/Library';
import Analytics from './pages/Analytics';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container fade-up">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/search" />} />
        </Routes>
      </div>
      <footer style={{ textAlign: 'center', padding: '20px 24px', color: 'var(--text-secondary)', opacity: 0.6, fontSize: '0.85rem', marginTop: '120px' }}>
        Powered by iTunes Search API • Built with React & Spring Boot
      </footer>
    </Router>
  );
}

export default App;
