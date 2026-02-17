package com.flowboard.board;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BoardRequest {

    @NotBlank
    private String title;

    private String description;
}
