package com.flowboard.board;

import com.flowboard.exception.AccessDeniedException;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.security.CurrentUserService;
import com.flowboard.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final CurrentUserService currentUserService;

    public BoardResponse createBoard(BoardRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Board board = Board.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        Board saved = boardRepository.save(board);

        return mapToResponse(saved);
    }

    public List<BoardResponse> getMyBoards() {
        User currentUser = currentUserService.getCurrentUser();

        return boardRepository.findByOwnerId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BoardResponse getBoardById(Long boardId) {
        User currentUser = currentUserService.getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return mapToResponse(board);
    }

    public BoardResponse updateBoard(Long boardId, BoardRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only owner can update board");
        }

        board.setTitle(request.getTitle());
        board.setDescription(request.getDescription());

        Board updated = boardRepository.save(board);

        return mapToResponse(updated);
    }

    public void deleteBoard(Long boardId) {
        User currentUser = currentUserService.getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only owner can delete board");
        }

        boardRepository.delete(board);
    }

    private BoardResponse mapToResponse(Board board) {
        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .createdAt(board.getCreatedAt())
                .build();
    }
}
