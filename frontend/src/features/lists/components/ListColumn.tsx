import type { List } from "../types/list.types";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { fetchCards, createCardThunk } from "../../cards/store/cardsSlice";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CardItem from "../../cards/components/CardItem";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  list: List;
}

const ListColumn = ({ list }: Props) => {
  const dispatch = useAppDispatch();
  const cards = useAppSelector((state) => state.cards.cards[list.id] || []);

  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
    data: {
      type: "list",
      listId: list.id,
    },
  });

  useEffect(() => {
    dispatch(fetchCards(list.id));
  }, [dispatch, list.id]);

  return (
    <div
      ref={setNodeRef}
      className="bg-white w-72 rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{list.title}</h3>

      <SortableContext
        items={cards.map((card) => `card-${card.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} cardListId={list.id} />
          ))}
        </div>
      </SortableContext>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          + Add Card
        </button>
      ) : (
        <div className="mt-3">
          <input
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="Card title..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
          />

          <textarea
            value={cardDescription}
            onChange={(e) => setCardDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!cardTitle.trim()) return;

                dispatch(
                  createCardThunk({
                    listId: list.id,
                    title: cardTitle.trim(),
                    description: cardDescription.trim() || undefined,
                  }),
                );

                setCardTitle("");
                setCardDescription("");
                setIsAdding(false);
              }}
              className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg"
            >
              Add
            </button>

            <button
              onClick={() => {
                setIsAdding(false);
                setCardTitle("");
                setCardDescription("");
              }}
              className="text-xs text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListColumn;
