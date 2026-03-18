import { api } from "../../../lib/axios";

export interface DashboardMetrics {
  totalBoards: number;
  totalLists: number;
  totalCards: number;
}

export interface CardsPerDay {
  date: string;
  count: number;
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get("/dashboard/metrics");
  return response.data;
};

export const fetchCardsPerDay = async (): Promise<CardsPerDay[]> => {
  const response = await api.get("/dashboard/cards-per-day");
  return response.data;
};
