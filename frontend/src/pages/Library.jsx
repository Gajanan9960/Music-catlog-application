import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import AlbumCard from '../components/AlbumCard';
import { Library, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LibraryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/library?page=${page}&size=12`)
      .then(res => {
        setAlbums(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this album?")) {
      await api.delete(`/library/${id}`);
      setAlbums(prev => prev.filter(a => a.id !== id));
    }
  };

  if (loading && albums.length === 0) return <div>Loading...</div>;

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
        <>
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
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '16px' }}>
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', color: page === 0 ? 'var(--text-secondary)' : 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <span style={{ color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages}</span>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', color: page >= totalPages - 1 ? 'var(--text-secondary)' : 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
