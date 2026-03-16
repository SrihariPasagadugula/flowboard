package com.flowboard.dashboard;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardMetricsResponse {

    private long totalBoards;
    private long totalLists;
    private long totalCards;
}
