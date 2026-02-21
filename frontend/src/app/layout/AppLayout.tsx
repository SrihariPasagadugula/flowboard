import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="h-14 bg-white border-b border-border px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">FlowBoard</h1>

        <div className="text-sm text-gray-500">SaaS Productivity System</div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
