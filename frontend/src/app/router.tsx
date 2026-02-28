import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { PublicOnlyRoute } from "../shared/components/PublicOnlyRoute";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import BoardsPage from "../features/boards/pages/BoardsPage";
import BoardDetailPage from "../features/boards/pages/BoardDetailPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/boards",
        element: (
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/boards/:boardId",
        element: (
          <ProtectedRoute>
            <BoardDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
