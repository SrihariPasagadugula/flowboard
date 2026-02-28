import type { List } from "../types/list.types";

interface Props {
  list: List;
}

const ListColumn = ({ list }: Props) => {
  return (
    <div className="bg-white w-72 rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{list.title}</h3>

      <div className="text-xs text-gray-400">Cards will go here</div>
    </div>
  );
};

export default ListColumn;
