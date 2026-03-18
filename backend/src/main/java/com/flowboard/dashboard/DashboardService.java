package com.flowboard.dashboard;

import com.flowboard.board.Board;
import com.flowboard.board.BoardRepository;
import com.flowboard.boardlist.BoardListRepository;
import com.flowboard.card.CardRepository;
import com.flowboard.security.CurrentUserService;
import com.flowboard.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public List<CardsPerDayResponse> getCardsCreatedPerDay() {

        User user = currentUserService.getCurrentUser();

        List<Object[]> results = cardRepository.findCardsCreatedPerDay(user.getId());

        Map<LocalDate, Long> dataMap = results.stream()
                .collect(Collectors.toMap(
                        row -> ((java.sql.Date) row[0]).toLocalDate(),
                        row -> ((Number) row[1]).longValue()
                ));

        List<CardsPerDayResponse> finalResult = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);

            long count = dataMap.getOrDefault(date, 0L);

            finalResult.add(new CardsPerDayResponse(date, count));
        }

        return finalResult;
    }
}
