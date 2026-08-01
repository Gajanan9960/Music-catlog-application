package com.ledgercfo.musiccatalog.repository;

import com.ledgercfo.musiccatalog.model.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlbumRepository extends JpaRepository<Album, UUID> {
    List<Album> findByUserId(UUID userId);
    Page<Album> findByUserId(UUID userId, Pageable pageable);
    Optional<Album> findByIdAndUserId(UUID id, UUID userId);
    boolean existsByAppleCatalogIdAndUserId(Long appleCatalogId, UUID userId);
}
