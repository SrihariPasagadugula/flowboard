package com.flowboard.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BoardEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publish(Long boardId, BoardEvent event) {
        messagingTemplate.convertAndSend("/topic/boards/" + boardId, event);
    }
}
