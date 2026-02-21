import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

interface Props {
  children: React.ReactNode;
}

export const PublicOnlyRoute = ({ children }: Props) => {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
