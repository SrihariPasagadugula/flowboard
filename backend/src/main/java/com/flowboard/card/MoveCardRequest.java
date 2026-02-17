package com.flowboard.card;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MoveCardRequest {

    @NotNull
    private Long sourceListId;

    @NotNull
    private Long destinationListId;

    @NotNull
    private Integer newPosition;
}
