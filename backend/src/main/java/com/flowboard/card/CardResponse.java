package com.flowboard.card;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardResponse {

    private Long id;
    private String title;
    private String description;
    private Integer position;
}
