import { useEffect } from "react";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { fetchBoards } from "../store/boardsSlice";
import BoardCard from "../components/BoardCard";

const BoardsPage = () => {
  const dispatch = useAppDispatch();
  const { boards, loading, error } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  if (loading) {
    return <p>Loading boards...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (boards.length === 0) {
    return <p className="text-gray-500">No boards found.</p>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Your Boards
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
