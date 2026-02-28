import { api } from "../../../lib/axios";
import type { Board, CreateBoardRequest } from "../types/board.types";

export const getBoards = async (): Promise<Board[]> => {
  const response = await api.get<Board[]>("/boards");
  return response.data;
};

export const createBoard = async (
  payload: CreateBoardRequest,
): Promise<Board> => {
  const response = await api.post<Board>("/boards", payload);
  return response.data;
};

export const getBoardById = async (id: number): Promise<Board> => {
  const response = await api.get<Board>(`/boards/${id}`);
  return response.data;
};
