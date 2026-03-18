package com.flowboard.card;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByBoardListIdOrderByPositionAsc(Long listId);

    long countByBoardListId(Long listId);

    @Query(value = """
        SELECT DATE(c.created_at) as date, COUNT(*) as count
        FROM cards c
        JOIN board_lists bl ON c.list_id = bl.id
        JOIN boards b ON bl.board_id = b.id
        WHERE b.owner_id = :userId
          AND c.created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(c.created_at)
        ORDER BY DATE(c.created_at)
    """, nativeQuery = true)
    List<Object[]> findCardsCreatedPerDay(Long userId);
}
