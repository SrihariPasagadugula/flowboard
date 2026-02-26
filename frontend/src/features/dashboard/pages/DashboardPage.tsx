const DashboardPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Welcome back. Let’s build something productive.
          </p>
        </div>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-700">
              Boards Overview
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Your boards will appear here once created.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-700">Activity</h2>
            <p className="text-sm text-gray-500 mt-2">
              Recent activity will be displayed here.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-700">Analytics</h2>
            <p className="text-sm text-gray-500 mt-2">
              Insights will appear once data is available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
