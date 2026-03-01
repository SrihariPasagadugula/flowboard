export interface Card {
  id: number;
  title: string;
  description?: string;
  position: number;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
}

export interface MoveCardRequest {
  sourceListId: number;
  destinationListId: number;
  newPosition: number;
}
