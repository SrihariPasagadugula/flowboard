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
import { clearCards } from "../../cards/store/cardsSlice";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBoard, loading, error } = useAppSelector(
    (state) => state.boards,
  );
  const { lists } = useAppSelector((state) => state.lists);

  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");

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
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
