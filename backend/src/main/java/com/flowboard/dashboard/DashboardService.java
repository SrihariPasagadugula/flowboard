package com.flowboard.dashboard;

import com.flowboard.board.Board;
import com.flowboard.board.BoardRepository;
import com.flowboard.boardlist.BoardListRepository;
import com.flowboard.card.CardRepository;
import com.flowboard.security.CurrentUserService;
import com.flowboard.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;
    private final CardRepository cardRepository;
    private final CurrentUserService currentUserService;

    public DashboardMetricsResponse getMetrics() {

        User user = currentUserService.getCurrentUser();

        // Boards owned by user
        List<Long> boardIds = boardRepository
                .findByOwnerId(user.getId())
                .stream()
                .map(Board::getId)
                .toList();

        long totalBoards = boardIds.size();

        long totalLists = 0;
        long totalCards = 0;

        for (Long boardId : boardIds) {

            long listCount = boardListRepository.countByBoardId(boardId);
            totalLists += listCount;

            var lists = boardListRepository.findByBoardIdOrderByPositionAsc(boardId);

            for (var list : lists) {
                totalCards += cardRepository.countByBoardListId(list.getId());
            }
        }

        return DashboardMetricsResponse.builder()
                .totalBoards(totalBoards)
                .totalLists(totalLists)
                .totalCards(totalCards)
                .build();
    }
}
