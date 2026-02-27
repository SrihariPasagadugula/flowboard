import { useState } from "react";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { createBoardThunk } from "../store/boardsSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    const trimmedName = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) return;

    dispatch(
      createBoardThunk({
        title: trimmedName,
        description: trimmedDescription || undefined,
      }),
    );

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create Board</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Board Name</label>
          <input
            type="text"
            placeholder="e.g. Product Roadmap"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Description (optional)
          </label>
          <textarea
            placeholder="Short description about this board..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
