package com.flowboard.card;

import com.flowboard.board.Board;
import com.flowboard.boardlist.BoardList;
import com.flowboard.boardlist.BoardListRepository;
import com.flowboard.exception.AccessDeniedException;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.user.User;
import com.flowboard.user.UserRepository;
import com.flowboard.websocket.BoardEvent;
import com.flowboard.websocket.BoardEventPublisher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final BoardListRepository boardListRepository;
    private final UserRepository userRepository;
    private final BoardEventPublisher eventPublisher;

    public CardResponse createCard(Long listId, CardRequest request) {
        User currentUser = getCurrentUser();

        BoardList list = boardListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List not found"));

        validateOwnership(list, currentUser);

        long count = cardRepository.countByBoardListId(listId);

        Card card = Card.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .position((int) count)
                .boardList(list)
                .build();

        Card saved = cardRepository.save(card);

        return mapToResponse(saved);
    }

    public List<CardResponse> getCardsByList(Long listId) {
        User currentUser = getCurrentUser();

        BoardList list = boardListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List not found"));

        validateOwnership(list, currentUser);

        return cardRepository.findByBoardListIdOrderByPositionAsc(listId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void moveCard(Long cardId, MoveCardRequest request) {

        User currentUser = getCurrentUser();

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));

        BoardList sourceList = boardListRepository.findById(request.getSourceListId())
                .orElseThrow(() -> new ResourceNotFoundException("Source list not found"));

        BoardList destinationList = boardListRepository.findById(request.getDestinationListId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination list not found"));

        validateOwnership(sourceList, currentUser);
        validateOwnership(destinationList, currentUser);

        if (!card.getBoardList().getId().equals(sourceList.getId())) {
            throw new AccessDeniedException("Card does not belong to source list");
        }

        // SAME LIST MOVE
        if (sourceList.getId().equals(destinationList.getId())) {

            List<Card> cards = cardRepository
                    .findByBoardListIdOrderByPositionAsc(sourceList.getId());

            cards.removeIf(c -> c.getId().equals(cardId));

            int newPosition = request.getNewPosition();
            if (newPosition < 0) newPosition = 0;
            if (newPosition > cards.size()) newPosition = cards.size();

            cards.add(newPosition, card);

            for (int i = 0; i < cards.size(); i++) {
                cards.get(i).setPosition(i);
            }

            cardRepository.saveAll(cards);
        } else {
            // DIFFERENT LIST MOVE
            List<Card> sourceCards = cardRepository
                    .findByBoardListIdOrderByPositionAsc(sourceList.getId());

            sourceCards.removeIf(c -> c.getId().equals(cardId));

            for (int i = 0; i < sourceCards.size(); i++) {
                sourceCards.get(i).setPosition(i);
            }

            cardRepository.saveAll(sourceCards);

            List<Card> destinationCards = cardRepository
                    .findByBoardListIdOrderByPositionAsc(destinationList.getId());

            int newPosition = request.getNewPosition();
            if (newPosition < 0) newPosition = 0;
            if (newPosition > destinationCards.size()) newPosition = destinationCards.size();

            card.setBoardList(destinationList);
            destinationCards.add(newPosition, card);

            for (int i = 0; i < destinationCards.size(); i++) {
                destinationCards.get(i).setPosition(i);
            }

            cardRepository.saveAll(destinationCards);
        }

        BoardEvent event = BoardEvent.builder()
                .type("CARD_MOVED")
                .boardId(destinationList.getBoard().getId())
                .data(Map.of(
                        "cardId", card.getId(),
                        "sourceListId", request.getSourceListId(),
                        "destinationListId", request.getDestinationListId(),
                        "newPosition", request.getNewPosition()
                ))
                .build();
        eventPublisher.publish(destinationList.getBoard().getId(), event);
    }

    private void validateOwnership(BoardList list, User user) {
        Board board = list.getBoard();

        if (!board.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private CardResponse mapToResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .title(card.getTitle())
                .description(card.getDescription())
                .position(card.getPosition())
                .build();
    }
}
