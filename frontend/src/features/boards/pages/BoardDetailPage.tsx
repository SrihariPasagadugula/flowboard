import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { fetchBoardById } from "../store/boardsSlice";
import { useEffect } from "react";
import { clearLists, fetchLists } from "../../lists/store/listsSlice";
import ListColumn from "../../lists/components/ListColumn";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBoard, loading, error } = useAppSelector(
    (state) => state.boards,
  );
  const { lists } = useAppSelector((state) => state.lists);

  useEffect(() => {
    if (boardId) {
      const id = Number(boardId);
      dispatch(fetchBoardById(id));
      dispatch(fetchLists(id));
    }

    return () => {
      dispatch(clearLists());
    };
  }, [dispatch, boardId]);

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
          <div className="flex gap-6 min-w-max">
            {lists.map((list) => (
              <ListColumn key={list.id} list={list} />
            ))}

            {/* Add List Placeholder */}
            <div className="w-72 flex-shrink-0">
              <button className="w-full h-12 bg-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-300 transition">
                + Add List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
