import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "../app/store";
import { applyCardMovedFromSocket } from "../features/cards/store/cardsSlice";

let stompClient: Client | null = null;

export const connectWebSocket = (boardId: number) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");

      stompClient?.subscribe(`/topic/boards/${boardId}`, (message) => {
        const event = JSON.parse(message.body);
        if (event.type === "CARD_MOVED") {
          const { cardId, sourceListId, destinationListId, newPosition } =
            event.data;

          store.dispatch(
            applyCardMovedFromSocket({
              cardId,
              sourceListId,
              destinationListId,
              newPosition,
            }),
          );
        }
      });
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
