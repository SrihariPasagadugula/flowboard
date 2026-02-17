package com.flowboard.card;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CardRequest {

    @NotBlank
    private String title;

    private String description;
}
