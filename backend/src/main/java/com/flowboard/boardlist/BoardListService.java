package com.flowboard.boardlist;

import com.flowboard.board.Board;
import com.flowboard.board.BoardRepository;
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
public class BoardListService {

    private final BoardListRepository boardListRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public BoardListResponse createList(Long boardId, BoardListRequest request) {
        User currentUser = getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only owner can modify board");
        }

        long count = boardListRepository.countByBoardId(boardId);

        BoardList list = BoardList.builder()
                .title(request.getTitle())
                .position((int) count)
                .board(board)
                .build();

        BoardList saved = boardListRepository.save(list);

        return mapToResponse(saved);
    }

    public List<BoardListResponse> getListsByBoard(Long boardId) {
        User currentUser = getCurrentUser();

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return boardListRepository.findByBoardIdOrderByPositionAsc(boardId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private BoardListResponse mapToResponse(BoardList list) {
        return BoardListResponse.builder()
                .id(list.getId())
                .title(list.getTitle())
                .position(list.getPosition())
                .build();
    }
}
