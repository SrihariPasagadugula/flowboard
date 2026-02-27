import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { fetchBoards } from "../store/boardsSlice";
import BoardCard from "../components/BoardCard";
import CreateBoardModal from "../components/CreateBoardModal";

const BoardsPage = () => {
  const dispatch = useAppDispatch();
  const { boards, loading, error } = useAppSelector((state) => state.boards);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Your Boards</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
          >
            + Create Board
          </button>
        </div>

        {loading && <p>Loading boards...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && boards.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-lg font-medium text-gray-700">No boards yet</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Create First Board
            </button>
          </div>
        )}

        {!loading && !error && boards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </div>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BoardsPage;
