import { api } from "../../../lib/axios";
import type {
  Card,
  CreateCardRequest,
  MoveCardRequest,
} from "../types/card.types";

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

export const moveCard = async (
  cardId: number,
  payload: MoveCardRequest,
): Promise<void> => {
  await api.put(`/cards/${cardId}/move`, payload);
};
