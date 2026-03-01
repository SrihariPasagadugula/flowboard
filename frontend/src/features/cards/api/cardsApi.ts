import { api } from "../../../lib/axios";
import type { Card, CreateCardRequest } from "../types/card.types";

export const getCardsByList = async (listId: number): Promise<Card[]> => {
  const response = await api.get(`/lists/${listId}/cards`);
  return response.data;
};

export const createCard = async (
  listId: number,
  payload: CreateCardRequest,
): Promise<Card> => {
  const response = await api.post(`/lists/${listId}/cards`, payload);
  return response.data;
};
