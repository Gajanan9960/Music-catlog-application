package com.ledgercfo.musiccatalog.controller;

import com.ledgercfo.musiccatalog.dto.AlbumDTO;
import com.ledgercfo.musiccatalog.service.ITunesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ITunesService iTunesService;

    public SearchController(ITunesService iTunesService) {
        this.iTunesService = iTunesService;
    }

    @GetMapping
    public List<AlbumDTO> search(@RequestParam String query, @RequestParam(defaultValue = "album") String type) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Query cannot be empty");
        }
        return iTunesService.searchAlbums(query).block();
    }
}
