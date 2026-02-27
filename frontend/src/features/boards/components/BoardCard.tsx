import type { Board } from "../types/board.types";

interface Props {
  board: Board;
}

const BoardCard = ({ board }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800">{board.title}</h3>
      {board.description && (
        <p className="text-sm text-gray-500 mt-2">{board.description}</p>
      )}
    </div>
  );
};

export default BoardCard;
