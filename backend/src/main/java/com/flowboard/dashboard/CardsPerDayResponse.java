package com.flowboard.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CardsPerDayResponse {

    private LocalDate date;
    private long count;
}