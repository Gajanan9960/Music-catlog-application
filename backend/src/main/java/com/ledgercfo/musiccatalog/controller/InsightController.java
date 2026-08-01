package com.ledgercfo.musiccatalog.controller;

import com.ledgercfo.musiccatalog.dto.InsightResponseDTO;
import com.ledgercfo.musiccatalog.model.User;
import com.ledgercfo.musiccatalog.service.LLMInsightService;
import com.ledgercfo.musiccatalog.service.LibraryService;
import com.ledgercfo.musiccatalog.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.Map;

@RestController
@RequestMapping("/api/library/insight")
public class InsightController {

    private final LLMInsightService llmInsightService;
    private final LibraryService libraryService;
    private final UserService userService;

    public InsightController(LLMInsightService llmInsightService, LibraryService libraryService, UserService userService) {
        this.llmInsightService = llmInsightService;
        this.libraryService = libraryService;
        this.userService = userService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(email);
    }

    @GetMapping
    public InsightResponseDTO getInsight() {
        User user = getCurrentUser();
        Map<String, Object> analytics = libraryService.getAnalytics(user.getId());
        return llmInsightService.generateInsight(analytics)
                .map(InsightResponseDTO::new)
                .block();
    }
}
