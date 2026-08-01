package com.ledgercfo.musiccatalog.service;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import com.ledgercfo.musiccatalog.dto.SaveAlbumRequest;
import com.ledgercfo.musiccatalog.model.Album;
import com.ledgercfo.musiccatalog.model.User;
import com.ledgercfo.musiccatalog.repository.AlbumRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    private final AlbumRepository albumRepository;

    public LibraryService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    public List<AlbumDTO> getUserLibrary(UUID userId) {
        return albumRepository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Page<AlbumDTO> getUserLibraryPaginated(UUID userId, Pageable pageable) {
        return albumRepository.findByUserId(userId, pageable).map(this::toDTO);
    }

    public AlbumDTO saveAlbum(User user, SaveAlbumRequest request) {
        if (albumRepository.existsByAppleCatalogIdAndUserId(request.getAppleCatalogId(), user.getId())) {
            throw new IllegalArgumentException("Album already saved in your library");
        }
        
        Album album = new Album();
        album.setUser(user);
        album.setAppleCatalogId(request.getAppleCatalogId());
        album.setTitle(request.getTitle());
        album.setArtistName(request.getArtistName());
        album.setGenre(request.getGenre());
        album.setReleaseDate(request.getReleaseDate());
        album.setTrackCount(request.getTrackCount());
        album.setArtworkUrl(request.getArtworkUrl());
        
        Album saved = albumRepository.save(album);
        return toDTO(saved);
    }

    public AlbumDTO updateAlbum(UUID userId, UUID albumId, Integer userRating, String userNotes) {
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Album not found or not owned by user"));
        
        if (userRating != null) {
            if (userRating < 1 || userRating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }
            album.setUserRating(userRating);
        }
        if (userNotes != null) {
            album.setUserNotes(userNotes);
        }
        
        Album saved = albumRepository.save(album);
        return toDTO(saved);
    }

    public void removeAlbum(UUID userId, UUID albumId) {
        Album album = albumRepository.findByIdAndUserId(albumId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Album not found or not owned by user"));
        albumRepository.delete(album);
    }

    public Map<String, Object> getAnalytics(UUID userId) {
        List<Album> albums = albumRepository.findByUserId(userId);
        
        Map<String, Long> genreCounts = new HashMap<>();
        Map<String, Long> releaseYearCounts = new HashMap<>();
        Map<String, Long> trackCountBuckets = new HashMap<>();
        trackCountBuckets.put("1-5", 0L);
        trackCountBuckets.put("6-10", 0L);
        trackCountBuckets.put("11-15", 0L);
        trackCountBuckets.put("16+", 0L);
        
        Map<String, Long> topArtists = new HashMap<>();

        for (Album album : albums) {
            // Genre
            if (album.getGenre() != null) {
                genreCounts.put(album.getGenre(), genreCounts.getOrDefault(album.getGenre(), 0L) + 1);
            }
            
            // Release Year
            if (album.getReleaseDate() != null) {
                String year = String.valueOf(album.getReleaseDate().getYear());
                releaseYearCounts.put(year, releaseYearCounts.getOrDefault(year, 0L) + 1);
            }
            
            // Track count buckets
            if (album.getTrackCount() != null) {
                int count = album.getTrackCount();
                if (count <= 5) trackCountBuckets.put("1-5", trackCountBuckets.get("1-5") + 1);
                else if (count <= 10) trackCountBuckets.put("6-10", trackCountBuckets.get("6-10") + 1);
                else if (count <= 15) trackCountBuckets.put("11-15", trackCountBuckets.get("11-15") + 1);
                else trackCountBuckets.put("16+", trackCountBuckets.get("16+") + 1);
            }
            
            // Top artists
            if (album.getArtistName() != null) {
                topArtists.put(album.getArtistName(), topArtists.getOrDefault(album.getArtistName(), 0L) + 1);
            }
        }
        
        // Sort artists by count desc, take top 5
        List<Map.Entry<String, Long>> sortedArtists = new ArrayList<>(topArtists.entrySet());
        sortedArtists.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        
        Map<String, Long> top5Artists = new LinkedHashMap<>();
        for (int i = 0; i < Math.min(5, sortedArtists.size()); i++) {
            top5Artists.put(sortedArtists.get(i).getKey(), sortedArtists.get(i).getValue());
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("genreCounts", genreCounts);
        analytics.put("releaseYearCounts", releaseYearCounts);
        analytics.put("trackCountBuckets", trackCountBuckets);
        analytics.put("topArtists", top5Artists);
        
        return analytics;
    }

    private AlbumDTO toDTO(Album album) {
        AlbumDTO dto = new AlbumDTO();
        dto.setId(album.getId());
        dto.setAppleCatalogId(album.getAppleCatalogId());
        dto.setTitle(album.getTitle());
        dto.setArtistName(album.getArtistName());
        dto.setGenre(album.getGenre());
        dto.setReleaseDate(album.getReleaseDate());
        dto.setTrackCount(album.getTrackCount());
        dto.setArtworkUrl(album.getArtworkUrl());
        dto.setUserRating(album.getUserRating());
        dto.setUserNotes(album.getUserNotes());
        return dto;
    }
}
