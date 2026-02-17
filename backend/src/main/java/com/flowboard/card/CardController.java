package com.flowboard.card;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists/{listId}/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<CardResponse> createCard(@PathVariable Long listId, @Valid @RequestBody CardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cardService.createCard(listId, request));
    }

    @GetMapping
    public ResponseEntity<List<CardResponse>> getCards(@PathVariable Long listId) {
        return ResponseEntity.ok(cardService.getCardsByList(listId));
    }

    @PutMapping("/{cardId}/move")
    public ResponseEntity<Void> moveCard(@PathVariable Long listId, @PathVariable Long cardId, @Valid @RequestBody MoveCardRequest request) {
        cardService.moveCard(cardId, request);
        return ResponseEntity.noContent().build();
    }
}
