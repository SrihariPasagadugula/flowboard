import { api } from "../../../lib/axios";
import type { CreateListRequest, List } from "../types/list.types";

export const getListsByBoard = async (boardId: number): Promise<List[]> => {
  const response = await api.get<List[]>(`/boards/${boardId}/lists`);
  return response.data;
};

export const createList = async (
  boardId: number,
  payload: CreateListRequest,
): Promise<List> => {
  const response = await api.post<List>(`/boards/${boardId}/lists`, payload);
  return response.data;
};
