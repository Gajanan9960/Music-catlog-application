package com.ledgercfo.musiccatalog.service;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ITunesService {

    private final WebClient webClient;

    public ITunesService() {
        this.webClient = WebClient.builder().baseUrl("https://itunes.apple.com").build();
    }

    @org.springframework.cache.annotation.Cacheable("itunesSearch")
    public Mono<List<AlbumDTO>> searchAlbums(String query) {
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("term", query)
                        .queryParam("entity", "album")
                        .queryParam("limit", 25)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .map(responseStr -> {
                    Map<String, Object> response;
                    try {
                        response = new com.fasterxml.jackson.databind.ObjectMapper().readValue(responseStr, Map.class);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse iTunes response", e);
                    }
                    List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                    List<AlbumDTO> albums = new ArrayList<>();
                    if (results != null) {
                        for (Map<String, Object> item : results) {
                            AlbumDTO dto = new AlbumDTO();
                            if (item.get("collectionId") != null) {
                                dto.setAppleCatalogId(((Number) item.get("collectionId")).longValue());
                            }
                            dto.setTitle((String) item.get("collectionName"));
                            dto.setArtistName((String) item.get("artistName"));
                            dto.setGenre((String) item.get("primaryGenreName"));
                            
                            if (item.get("trackCount") != null) {
                                dto.setTrackCount(((Number) item.get("trackCount")).intValue());
                            }
                            
                            dto.setArtworkUrl((String) item.get("artworkUrl100"));
                            
                            String releaseDateStr = (String) item.get("releaseDate");
                            if (releaseDateStr != null && releaseDateStr.length() >= 10) {
                                try {
                                    dto.setReleaseDate(LocalDate.parse(releaseDateStr.substring(0, 10)));
                                } catch (DateTimeParseException e) {
                                    // ignore or log
                                }
                            }
                            
                            if (dto.getAppleCatalogId() != null && dto.getTitle() != null && dto.getArtistName() != null) {
                                albums.add(dto);
                            }
                        }
                    }
                    return albums;
                })
                .cache(); // Cache the Mono result so subscribers don't trigger the HTTP call again
    }
}
