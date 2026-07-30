import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import AlbumCard from '../components/AlbumCard';
import { Library } from 'lucide-react';

export default function LibraryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/library')
      .then(res => setAlbums(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this album?")) {
      await api.delete(`/library/${id}`);
      setAlbums(prev => prev.filter(a => a.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Your Library</h2>
      
      {albums.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
          <Library size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <h2>Your library is empty</h2>
          <p style={{ marginTop: '10px' }}><Link to="/search">Go search for something you like</Link></p>
        </div>
      ) : (
        <div className="album-grid">
          {albums.map(album => (
            <AlbumCard 
              key={album.id} 
              album={album} 
              onRemove={handleRemove}
              inLibrary={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
