package com.flowboard.boardlist;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BoardListRequest {

    @NotBlank
    private String title;
}
