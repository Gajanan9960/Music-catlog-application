import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';

export default function AlbumCard({ album, onSave, onRemove, savedList, inLibrary }) {
  const [rating, setRating] = useState(album.userRating || 0);
  const [notes, setNotes] = useState(album.userNotes || '');
  const [saving, setSaving] = useState(false);

  const isSaved = inLibrary || (savedList && savedList.some(a => a.appleCatalogId === album.appleCatalogId));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(album);
    } finally {
      setSaving(false);
    }
  };

  const updateLibraryInfo = async (newRating, newNotes) => {
    if (!inLibrary) return;
    try {
      await api.put(`/library/${album.id}`, { userRating: newRating, userNotes: newNotes });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRating = (r) => {
    setRating(r);
    updateLibraryInfo(r, notes);
  };

  const handleNotesBlur = () => {
    updateLibraryInfo(rating, notes);
  };

  return (
    <div className="album-card">
      <img src={album.artworkUrl?.replace('100x100bb', '300x300bb')} alt="Artwork" />
      <div className="album-title" title={album.title}>{album.title}</div>
      <div className="album-artist">{album.artistName}</div>
      <div className="album-meta">
        {album.genre} • {album.releaseDate?.substring(0,4) || 'Unknown'} • {album.trackCount} tracks
      </div>
      
      {!inLibrary && (
        <button 
          onClick={handleSave} 
          disabled={isSaved || saving}
          style={{ marginTop: 'auto' }}
        >
          {isSaved ? 'Saved ✓' : 'Save'}
        </button>
      )}

      {inLibrary && (
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[1,2,3,4,5].map(star => (
              <Star 
                key={star} 
                size={20} 
                onClick={() => handleRating(star)}
                fill={star <= rating ? 'var(--accent-color)' : 'none'}
                color={star <= rating ? 'var(--accent-color)' : 'var(--text-secondary)'}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <textarea 
            placeholder="Add notes..." 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            rows={2}
            style={{ fontSize: '0.85rem' }}
          />
          <button 
            onClick={() => onRemove(album.id)}
            style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
