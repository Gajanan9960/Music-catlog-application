package com.ledgercfo.musiccatalog.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LLMInsightService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper mapper = new ObjectMapper();

    public LLMInsightService(@Value("${gemini.api-key}") String apiKey) {
        this.webClient = WebClient.builder().baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = apiKey;
    }

    public Mono<String> generateInsight(Map<String, Object> analytics) {
        if ("mock-key-if-not-provided".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return Mono.fromCallable(() -> generateDynamicMockInsight(analytics));
        }

        String prompt = "Based on the following aggregated stats of a user's music album library, give one short, insightful, and natural-language paragraph summarizing their music taste and trends: " + 
                        analytics.toString() + ". Keep it under 3 sentences.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));

        return webClient.post()
                .uri("/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        Map<String, Object> resMap = mapper.readValue(response, Map.class);
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) resMap.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                return (String) parts.get(0).get("text");
                            }
                        }
                    } catch (Exception e) {
                        return "Failed to parse AI response.";
                    }
                    return "Could not generate insight.";
                })
                .onErrorResume(e -> Mono.just("Failed to generate insight due to an API error. Please try again later."));
    }

    private String generateDynamicMockInsight(Map<String, Object> analytics) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Long> genreCounts = (Map<String, Long>) analytics.getOrDefault("genreCounts", new HashMap<>());
            @SuppressWarnings("unchecked")
            Map<String, Long> releaseYearCounts = (Map<String, Long>) analytics.getOrDefault("releaseYearCounts", new HashMap<>());
            @SuppressWarnings("unchecked")
            Map<String, Long> topArtists = (Map<String, Long>) analytics.getOrDefault("topArtists", new HashMap<>());

            String topGenre = genreCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("various genres");

            String topYear = releaseYearCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("different eras");
                
            String topArtist = topArtists.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("many different artists");

            return String.format("Your library shows a strong affinity for %s music, particularly from %s. " +
                "You seem to be a dedicated fan of %s, with their work standing out in your collection.", 
                topGenre, topYear, topArtist);
        } catch (Exception e) {
            return "Your library is a vibrant mix of genres, reflecting a diverse and eclectic taste.";
        }
    }
}
