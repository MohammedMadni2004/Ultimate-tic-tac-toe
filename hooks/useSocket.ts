import { ServerMessageSchema } from "@/utils/server-message-schema";
import { validateMessage } from "@/utils/validate-message";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

export function useSocket(
  setWaiting: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  setPlayerMark: React.Dispatch<React.SetStateAction<"X" | "O" | null>>,
  setDisconnected: React.Dispatch<React.SetStateAction<boolean>>,
  setGameResult: React.Dispatch<React.SetStateAction<string | null>>,
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void,
  resetGame: () => void,
  setRematchDeclined: React.Dispatch<React.SetStateAction<boolean>>,
  setIncomingRematchRequest: React.Dispatch<React.SetStateAction<boolean>>
) {
  const socketRef = useRef<WebSocket | null>(null);
  const gameIdRef = useRef<string>("");

  const handleMessage = (message: MessageEvent) => {
    try {
      const msg = validateMessage(message.data, ServerMessageSchema);

      switch (msg.type) {
        case "init":
          gameIdRef.current = msg.gameId;
          break;

        case "waiting":
          setWaiting(msg.waiting);
          break;

        case "mark":
          setPlayerMark(msg.mark);
          break;

        case "game": {
          const { moveHistory, currentMove } = msg.game;
          if (moveHistory.length === 1) {
            resetGame();
          } else {
            const [boardId, cellId] = moveHistory[currentMove];
            handlePlay(boardId, cellId, false);
          }
          break;
        }

        case "result":
          setGameResult(msg.result);
          break;

        case "error":
          console.error("Server error:", msg.error);
          break;

        case "rematch-request":
          setIncomingRematchRequest(true);
          break;

        case "rematch-accepted":
          resetGame();
          setPlayerMark((mark) => (mark === "X" ? "O" : "X"));
          break;

        case "rematch-declined":
          setRematchDeclined(true);
          Alert.alert("Rematch Declined", "Opponent declined the rematch.");
          break;
      }
    } catch (error) {
      console.error("Invalid message received:", error);
      throw error;
    }
  };

  const sendMessage = (message: any) => {
    if (gameIdRef.current) {
      message.gameId = gameIdRef.current;
    }
    socketRef.current?.send(JSON.stringify(message));
  };

  useEffect(() => {
    socketRef.current = new WebSocket("wss://socket.ammar-codeable.me:8443");
    const socket = socketRef.current;

    socket.onmessage = handleMessage;

    socket.onclose = () => {
      setDisconnected(true);
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    gameId: gameIdRef.current,
  };
}
