package com.flowboard.card;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/api/lists/{listId}/cards")
    public ResponseEntity<CardResponse> createCard(@PathVariable Long listId, @Valid @RequestBody CardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.createCard(listId, request));
    }

    @GetMapping("/api/lists/{listId}/cards")
    public ResponseEntity<List<CardResponse>> getCards(@PathVariable Long listId) {
        return ResponseEntity.ok(cardService.getCardsByList(listId));
    }

    @PutMapping("/api/cards/{cardId}/move")
    public ResponseEntity<Void> moveCard(@PathVariable Long cardId, @Valid @RequestBody MoveCardRequest request) {
        cardService.moveCard(cardId, request);
        return ResponseEntity.noContent().build();
    }
}
