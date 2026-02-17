package com.flowboard.boardlist;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards/{boardId}/lists")
@RequiredArgsConstructor
public class BoardListController {

    private final BoardListService boardListService;

    @PostMapping
    public ResponseEntity<BoardListResponse> createList(@PathVariable Long boardId, @Valid @RequestBody BoardListRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardListService.createList(boardId, request));
    }

    @GetMapping
    public ResponseEntity<List<BoardListResponse>> getLists(@PathVariable Long boardId) {
        return ResponseEntity.ok(boardListService.getListsByBoard(boardId));
    }
}
