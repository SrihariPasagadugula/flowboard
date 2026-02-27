export interface Board {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}
