export interface List {
  id: number;
  title: string;
  position: number;
  boardId: number;
}

export interface CreateListRequest {
  title: string;
}
