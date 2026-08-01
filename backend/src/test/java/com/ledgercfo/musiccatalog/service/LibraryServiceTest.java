package com.ledgercfo.musiccatalog.service;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import com.ledgercfo.musiccatalog.dto.SaveAlbumRequest;
import com.ledgercfo.musiccatalog.model.Album;
import com.ledgercfo.musiccatalog.model.User;
import com.ledgercfo.musiccatalog.repository.AlbumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @InjectMocks
    private LibraryService libraryService;

    private User testUser;
    private Album testAlbum;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@test.com");

        testAlbum = new Album();
        testAlbum.setId(UUID.randomUUID());
        testAlbum.setAppleCatalogId(12345L);
        testAlbum.setTitle("Test Album");
        testAlbum.setArtistName("Test Artist");
        testAlbum.setUser(testUser);
    }

    @Test
    void getUserLibrary_ShouldReturnList() {
        when(albumRepository.findByUserId(testUser.getId())).thenReturn(List.of(testAlbum));

        List<AlbumDTO> result = libraryService.getUserLibrary(testUser.getId());

        assertEquals(1, result.size());
        assertEquals("Test Album", result.get(0).getTitle());
    }

    @Test
    void getUserLibraryPaginated_ShouldReturnPage() {
        PageRequest pageRequest = PageRequest.of(0, 10);
        when(albumRepository.findByUserId(testUser.getId(), pageRequest))
                .thenReturn(new PageImpl<>(List.of(testAlbum)));

        Page<AlbumDTO> result = libraryService.getUserLibraryPaginated(testUser.getId(), pageRequest);

        assertEquals(1, result.getTotalElements());
        assertEquals("Test Album", result.getContent().get(0).getTitle());
    }

    @Test
    void saveAlbum_ShouldSaveAndReturnDTO() {
        SaveAlbumRequest request = new SaveAlbumRequest();
        request.setAppleCatalogId(12345L);
        request.setTitle("New Album");

        when(albumRepository.existsByAppleCatalogIdAndUserId(12345L, testUser.getId())).thenReturn(false);
        when(albumRepository.save(any(Album.class))).thenAnswer(i -> i.getArguments()[0]);

        AlbumDTO result = libraryService.saveAlbum(testUser, request);

        assertEquals("New Album", result.getTitle());
        verify(albumRepository).save(any(Album.class));
    }

    @Test
    void saveAlbum_ShouldThrowIfAlreadyExists() {
        SaveAlbumRequest request = new SaveAlbumRequest();
        request.setAppleCatalogId(12345L);

        when(albumRepository.existsByAppleCatalogIdAndUserId(12345L, testUser.getId())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> libraryService.saveAlbum(testUser, request));
        verify(albumRepository, never()).save(any(Album.class));
    }

    @Test
    void removeAlbum_ShouldDelete() {
        when(albumRepository.findByIdAndUserId(testAlbum.getId(), testUser.getId()))
                .thenReturn(Optional.of(testAlbum));

        libraryService.removeAlbum(testUser.getId(), testAlbum.getId());

        verify(albumRepository).delete(testAlbum);
    }
}
