import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/links`, authHeaders);
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchLinks();
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post(`${API_BASE}/auth/${authMode}`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setLinks([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/shorten`, { originalUrl: url }, authHeaders);
      setUrl('');
      await fetchLinks();
    } catch (err) {
      alert('Something went wrong. Check the console.');
      console.error(err);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="app-shell">
        <div className="auth-wrap">
         <div className="topbar">
            <div className="brand" style={{ marginBottom: 0 }}>
              <div className="brand-mark">/l</div>
              <h1>LinkTrack</h1>
            </div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
             {theme === 'light' ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)}
            </button>
          </div>
          <div className="auth-card">
            <h2>{authMode === 'login' ? 'Log in to your account' : 'Create an account'}</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {authError && <p className="error-text">{authError}</p>}
              <button type="submit" className="btn" style={{ width: '100%', marginTop: 6 }}>
                {authMode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <p className="switch-line">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <a onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand" style={{ marginBottom: 0 }}>
          <div className="brand-mark">/l</div>
          <h1>LinkTrack</h1>
        </div>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)}
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          placeholder="Paste a long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      <p className="section-label">Your Links</p>

      {links.length === 0 ? (
        <div className="empty-state">No links yet — paste a URL above to create your first tag.</div>
      ) : (
        <div>
          {links.map((link) => (
            <div className="link-row" key={link.id}>
              <div className="link-info">
                <div className="link-url">{link.originalUrl}</div>
              </div>        
            <a className="tag-chip" href={`${API_BASE}/${link.shortCode}`} target="_blank" rel="noreferrer">
                {link.shortCode}
              </a>
              <div className="click-count">{link.clicks}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;