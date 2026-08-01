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
    <div>
      <div style={{ position: 'relative', margin: '40px auto 60px auto', maxWidth: '600px' }}>
        <SearchIcon style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--text-secondary)' }} size={24} />
        <input 
          type="text" 
          placeholder="Search albums, artists..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '18px 24px 18px 56px', fontSize: '1.25rem', borderRadius: '32px', background: '#FFFFFF', border: 'none', boxShadow: 'var(--ambient-shadow)', transition: 'box-shadow 0.3s' }}
          onFocus={(e) => e.target.style.boxShadow = 'var(--ambient-shadow-hover)'}
          onBlur={(e) => e.target.style.boxShadow = 'var(--ambient-shadow)'}
        />
      </div>

      {!query && results.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <SearchIcon size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <h2>Search for an album to get started</h2>
        </div>
      )}

      {loading && (
        <div className="album-grid">
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
