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
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>Build Your Music Library</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Find albums you love, save them to your collection, and explore insights about your taste.</p>
      </div>

      <div style={{ position: 'relative', margin: '0 auto 60px auto', maxWidth: '680px' }}>
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
        <div className="fade-up" style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
          <SearchIcon size={48} style={{ marginBottom: '15px', opacity: 0.5, color: 'var(--accent-color)' }} />
          <h2 style={{ color: 'var(--text-primary)' }}>Search for an album to get started</h2>
          <p style={{ marginTop: '10px' }}>Browse millions of albums from the iTunes catalog and save your favorites.</p>
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
