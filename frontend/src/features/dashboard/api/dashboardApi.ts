import { api } from "../../../lib/axios";

export interface DashboardMetrics {
  totalBoards: number;
  totalLists: number;
  totalCards: number;
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get("/dashboard/metrics");
  return response.data;
};
