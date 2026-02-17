package com.flowboard.boardlist;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardListResponse {

    private Long id;
    private String title;
    private Integer position;
}
