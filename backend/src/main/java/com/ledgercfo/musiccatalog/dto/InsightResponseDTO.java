package com.ledgercfo.musiccatalog.dto;

public class InsightResponseDTO {
    private String insight;

    public InsightResponseDTO(String insight) {
        this.insight = insight;
    }

    public String getInsight() { return insight; }
    public void setInsight(String insight) { this.insight = insight; }
}
