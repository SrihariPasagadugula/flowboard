import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { clearSelectedBoard, fetchBoardById } from "../store/boardsSlice";
import { useEffect, useState } from "react";
import {
  clearLists,
  createListThunk,
  fetchLists,
} from "../../lists/store/listsSlice";
import ListColumn from "../../lists/components/ListColumn";
import {
  clearCards,
  reorderCardsInList,
  moveCardBetweenLists,
  moveCardThunk,
} from "../../cards/store/cardsSlice";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBoard, loading, error } = useAppSelector(
    (state) => state.boards,
  );
  const { lists } = useAppSelector((state) => state.lists);
  const cardsState = useAppSelector((state) => state.cards.cards);

  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [activeCard, setActiveCard] = useState<{
    id: number;
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    if (boardId) {
      const id = Number(boardId);
      dispatch(fetchBoardById(id));
      dispatch(fetchLists(id));
    }

    return () => {
      dispatch(clearLists());
      dispatch(clearCards());
      dispatch(clearSelectedBoard());
    };
  }, [dispatch, boardId]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const activeData = active.data.current;
    if (!activeData || activeData.type !== "card") return;

    const cardId = Number(active.id.toString().replace("card-", ""));
    const listId = activeData.listId;

    const cards = cardsState[listId] || [];
    const card = cards.find((c) => c.id === cardId);

    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || activeData.type !== "card") return;

    const sourceListId = activeData.listId;
    const draggedCardId = Number(active.id.toString().replace("card-", ""));

    const sourceCards = cardsState[sourceListId] || [];
    const fromIndex = sourceCards.findIndex(
      (card) => card.id === draggedCardId,
    );

    if (overData?.type === "card") {
      const destinationListId = overData.listId;
      const targetCardId = Number(over.id.toString().replace("card-", ""));

      const destinationCards = cardsState[destinationListId] || [];

      const toIndex = destinationCards.findIndex(
        (card) => card.id === targetCardId,
      );

      if (sourceListId === destinationListId) {
        dispatch(
          reorderCardsInList({
            listId: sourceListId,
            fromIndex,
            toIndex,
          }),
        );

        dispatch(
          moveCardThunk({
            cardId: draggedCardId,
            sourceListId,
            destinationListId: sourceListId,
            newPosition: toIndex,
          }),
        );
      } else {
        dispatch(
          moveCardBetweenLists({
            sourceListId,
            destinationListId,
            fromIndex,
            toIndex,
          }),
        );

        dispatch(
          moveCardThunk({
            cardId: draggedCardId,
            sourceListId,
            destinationListId,
            newPosition: toIndex,
          }),
        );
      }
    }

    if (overData?.type === "list") {
      const destinationListId = overData.listId;

      if (sourceListId === destinationListId) return;

      const destinationCards = cardsState[destinationListId] || [];
      const toIndex = destinationCards.length;

      dispatch(
        moveCardBetweenLists({
          sourceListId,
          destinationListId,
          fromIndex,
          toIndex,
        }),
      );

      dispatch(
        moveCardThunk({
          cardId: draggedCardId,
          sourceListId,
          destinationListId,
          newPosition: toIndex,
        }),
      );
    }

    setActiveCard(null);
  };

  if (loading) return <p>Loading board...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedBoard) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">
          {selectedBoard.title}
        </h1>

        {selectedBoard.description && (
          <p className="text-gray-500 mt-2">{selectedBoard.description}</p>
        )}

        <div className="mt-10 overflow-x-auto">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-max">
              {lists.map((list) => (
                <ListColumn key={list.id} list={list} />
              ))}

              <div className="w-72 flex-shrink-0">
                {!isAddingList ? (
                  <button
                    onClick={() => setIsAddingList(true)}
                    className="w-full h-12 bg-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-300 transition"
                  >
                    + Add List
                  </button>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <input
                      type="text"
                      placeholder="Enter list title..."
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                      autoFocus
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!listTitle.trim() || !boardId) return;

                          dispatch(
                            createListThunk({
                              boardId: Number(boardId),
                              title: listTitle.trim(),
                            }),
                          );

                          setListTitle("");
                          setIsAddingList(false);
                        }}
                        className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg"
                      >
                        Add
                      </button>

                      <button
                        onClick={() => {
                          setIsAddingList(false);
                          setListTitle("");
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-lg">
                  <p className="font-medium">{activeCard.title}</p>
                  {activeCard.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activeCard.description}
                    </p>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
