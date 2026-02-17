package com.flowboard.card;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByBoardListIdOrderByPositionAsc(Long listId);

    long countByBoardListId(Long listId);
}
