import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AlbumCard from '../components/AlbumCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAlbums, setSavedAlbums] = useState([]);

  useEffect(() => {
    // Fetch saved albums to know what to mark as saved
    api.get('/library').then(res => setSavedAlbums(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        api.get(`/search?query=${encodeURIComponent(query)}`)
          .then(res => setResults(res.data))
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSave = async (album) => {
    await api.post('/library', album);
    setSavedAlbums(prev => [...prev, album]);
  };

  return (
    <div className="fade-up">
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '52px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '20px' }}>Discover Albums</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Search the iTunes catalog and curate your personal library.</p>
      </div>

      <div style={{ position: 'relative', margin: '0 auto 40px auto', maxWidth: '680px' }}>
        <SearchIcon style={{ position: 'absolute', left: '24px', top: '22px', color: 'var(--text-secondary)' }} size={24} />
        <input 
          type="text" 
          placeholder="Search albums, artists..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '22px 24px 22px 64px', fontSize: '1.25rem', borderRadius: '40px', background: '#FFFFFF', border: '1px solid var(--border-color)', boxShadow: 'var(--ambient-shadow-strong)', transition: 'all 0.3s' }}
          onFocus={(e) => e.target.style.boxShadow = 'var(--ambient-shadow-hover)'}
          onBlur={(e) => e.target.style.boxShadow = 'var(--ambient-shadow-strong)'}
        />
      </div>

      {!query && results.length === 0 && (
        <div className="fade-up" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <SearchIcon size={32} style={{ marginBottom: '12px', opacity: 0.5, color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '30px', color: 'var(--text-primary)', marginBottom: '8px' }}>Start building your music library</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', opacity: 0.8 }}>Browse millions of albums from the iTunes catalog and save your favorites.</p>
        </div>
      )}

      {loading && (
        <div className="album-grid fade-up">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="album-card" style={{ height: '300px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="album-grid">
          {results.map(album => (
            <AlbumCard 
              key={album.appleCatalogId} 
              album={album} 
              onSave={handleSave} 
              savedList={savedAlbums}
              inLibrary={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
