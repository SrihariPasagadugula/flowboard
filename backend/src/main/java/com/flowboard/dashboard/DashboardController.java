package com.flowboard.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/api/dashboard/metrics")
    public DashboardMetricsResponse getMetrics() {
        return dashboardService.getMetrics();
    }
}