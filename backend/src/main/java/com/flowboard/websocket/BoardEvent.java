package com.flowboard.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class BoardEvent {

    private String type;
    private Long boardId;
    private Object data;
}
