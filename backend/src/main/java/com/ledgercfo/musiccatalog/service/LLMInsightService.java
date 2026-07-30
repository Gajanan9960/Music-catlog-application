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
        if ("mock-key-if-not-provided".equals(apiKey)) {
            return Mono.just("Your library is a vibrant mix of genres, reflecting a diverse and eclectic taste. You seem to favor late 2000s rock and recent pop hits.");
        }

        String prompt = "Based on the following aggregated stats of a user's music album library, give one short, insightful, and natural-language paragraph summarizing their music taste and trends: " + 
                        analytics.toString() + ". Keep it under 3 sentences.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));

        return webClient.post()
                .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey)
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
                });
    }
}
