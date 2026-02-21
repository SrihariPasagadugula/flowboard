import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <div className="bg-white rounded-xl shadow-sm border border-border p-8">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to FlowBoard
            </h2>
            <p className="text-gray-600">
              Your full-stack Kanban productivity system.
            </p>
          </div>
        ),
      },
    ],
  },
]);
