package com.flowboard.board;

import com.flowboard.exception.AccessDeniedException;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.user.User;
import com.flowboard.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public BoardResponse createBoard(BoardRequest request) {
        User currentUser = getCurrentUser();

        Board board = Board.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        Board saved = boardRepository.save(board);

        return mapToResponse(saved);
    }

    public List<BoardResponse> getMyBoards() {
        User currentUser = getCurrentUser();

        return boardRepository.findByOwnerId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BoardResponse getBoardById(Long boardId) {
        User currentUser = getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return mapToResponse(board);
    }

    public BoardResponse updateBoard(Long boardId, BoardRequest request) {
        User currentUser = getCurrentUser();

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
        User currentUser = getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only owner can delete board");
        }

        boardRepository.delete(board);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
