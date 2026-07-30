package com.ledgercfo.musiccatalog.controller;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import com.ledgercfo.musiccatalog.dto.SaveAlbumRequest;
import com.ledgercfo.musiccatalog.model.User;
import com.ledgercfo.musiccatalog.service.LibraryService;
import com.ledgercfo.musiccatalog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;
    private final UserService userService;

    public LibraryController(LibraryService libraryService, UserService userService) {
        this.libraryService = libraryService;
        this.userService = userService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(email);
    }

    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getLibrary() {
        User user = getCurrentUser();
        return ResponseEntity.ok(libraryService.getUserLibrary(user.getId()));
    }

    @PostMapping
    public ResponseEntity<AlbumDTO> saveAlbum(@Valid @RequestBody SaveAlbumRequest request) {
        User user = getCurrentUser();
        AlbumDTO saved = libraryService.saveAlbum(user, request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumDTO> updateAlbum(@PathVariable UUID id, @RequestBody Map<String, Object> updates) {
        User user = getCurrentUser();
        Integer userRating = updates.containsKey("userRating") ? (Integer) updates.get("userRating") : null;
        String userNotes = updates.containsKey("userNotes") ? (String) updates.get("userNotes") : null;
        
        AlbumDTO updated = libraryService.updateAlbum(user.getId(), id, userRating, userNotes);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAlbum(@PathVariable UUID id) {
        User user = getCurrentUser();
        libraryService.removeAlbum(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        User user = getCurrentUser();
        return ResponseEntity.ok(libraryService.getAnalytics(user.getId()));
    }
}
