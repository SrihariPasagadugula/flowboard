import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../types/card.types";

interface Props {
  card: Card;
  cardListId: number;
}

const CardItem = ({ card, cardListId }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `card-${card.id}`,
      data: {
        type: "card",
        listId: cardListId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium">{card.title}</p>
      {card.description && (
        <p className="text-xs text-gray-500 mt-1">{card.description}</p>
      )}
    </div>
  );
};

export default CardItem;
