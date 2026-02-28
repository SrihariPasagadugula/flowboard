import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { fetchBoardById } from "../store/boardsSlice";
import { useEffect } from "react";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBoard, loading, error } = useAppSelector(
    (state) => state.boards,
  );

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardById(Number(boardId)));
    }
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

        <div className="mt-10">
          <p className="text-gray-500">Lists will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
