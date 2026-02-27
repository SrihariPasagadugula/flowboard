import { useState } from "react";
import CreateBoardModal from "../../boards/components/CreateBoardModal";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Track your boards and productivity in one place.
            </p>
          </div>

          <button
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Board
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Boards</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-800">0</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Cards</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-800">0</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Completed Tasks</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-800">0</h2>
          </div>
        </div>

        {/* Empty State Section */}
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <h3 className="text-lg font-medium text-gray-700">No boards yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            Create your first board to start organizing your workflow.
          </p>
          <button
            className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Create First Board
          </button>
        </div>
      </div>
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
