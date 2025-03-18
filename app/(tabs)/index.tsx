import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import MainBoard from "@/components/main-board";
import calculateResult from "@/utils/calculate-result";
import tw from 'twrnc';

const GameScreen = ({
  gameId,
  playerId,
}: {
  gameId: string;
  playerId: string;
}) => {
  // Game state
  const [mainBoardState, setMainBoardState] = useState<(string | null)[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string>("X");
  const [lastClickedBoardId, setLastClickedBoardId] = useState<number | null>(
    null
  );
  const [lastClickedCellId, setLastClickedCellId] = useState<number | null>(
    null
  );
  const [nextActiveBoard, setNextActiveBoard] = useState<
    (number | null)[] | null
  >([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [playerSymbol, setPlayerSymbol] = useState<string | null>(null);

  // Websocket connection
  const websocketRef = useRef<WebSocket | null>(null);

  // Initialize websocket connection
  useEffect(() => {
    const wsUrl = `wss://your-websocket-server.com/games/${gameId}?playerId=${playerId}`;

    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };
   //
    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "gameState") {
        // Update game state from server
        setMainBoardState(data.mainBoardState);
        setCurrentPlayerTurn(data.currentPlayerTurn);
        setLastClickedBoardId(data.lastClickedBoardId);
        setLastClickedCellId(data.lastClickedCellId);
        setNextActiveBoard(data.nextActiveBoard);
        setGameResult(data.gameResult);
        setPlayerSymbol(data.playerSymbol); // X or O
      } else if (data.type === "move") {
        // Handle opponent's move
        if (data.player !== playerSymbol) {
          handlePlay(data.boardId, data.cellId, false);
        }
      } else if (data.type === "error") {
        Alert.alert("Game Error", data.message);
      }
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      Alert.alert("Connection Error", "Failed to connect to the game server");
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [gameId, playerId]);

  // Handle play function
  const handlePlay = (boardId: number, cellId: number, yourMove: boolean) => {
    // Only allow moves if it's your turn
    if (yourMove && currentPlayerTurn !== playerSymbol) {
      return;
    }

    // Check if the game is already over
    if (gameResult) {
      return;
    }

    // Check if the board is active
    if (nextActiveBoard && !nextActiveBoard.includes(boardId)) {
      return;
    }

    // Deep clone the state to avoid direct mutation
    const newMainBoardState = JSON.parse(JSON.stringify(mainBoardState));

    // Check if the cell is already filled
    if (newMainBoardState[boardId][cellId]) {
      return;
    }

    // Update the board state
    newMainBoardState[boardId][cellId] = currentPlayerTurn;

    // Determine which board is active next
    let newNextActiveBoard;
    const subGameResult = calculateResult(newMainBoardState[cellId]);

    if (
      subGameResult ||
      newMainBoardState[cellId].every((cell) => cell !== null)
    ) {
      // If the next board is already won or full, player can play anywhere
      newNextActiveBoard = Array(9)
        .fill(null)
        .map((_, i) => {
          const subResult = calculateResult(newMainBoardState[i]);
          return !subResult && newMainBoardState[i].includes(null) ? i : null;
        })
        .filter((i) => i !== null);
    } else {
      newNextActiveBoard = [cellId];
    }

    // Update state
    setMainBoardState(newMainBoardState);
    setCurrentPlayerTurn(currentPlayerTurn === "X" ? "O" : "X");
    setLastClickedBoardId(boardId);
    setLastClickedCellId(cellId);
    setNextActiveBoard(newNextActiveBoard);

    // Check if there's a game result
    const mainGameResult = calculateMainGameResult(newMainBoardState);
    if (mainGameResult) {
      setGameResult(mainGameResult);
    }
  };

  // Calculate the overall game result
  const calculateMainGameResult = (boardState: (string | null)[][]) => {
    const boardResults = boardState.map((subBoard) =>
      calculateResult(subBoard)
    );
    return calculateResult(boardResults);
  };

  // Show loading screen while connecting
  if (!isConnected || !playerSymbol) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-4 text-lg text-gray-800`}>
          Connecting to game...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white items-center justify-center`}>
      <Text style={tw`text-2xl font-bold mb-5 text-gray-800`}>
        {gameResult
          ? `Game Over: ${gameResult === "DRAW" ? "Draw" : `${gameResult} wins!`}`
          : `${currentPlayerTurn}'s Turn${currentPlayerTurn === playerSymbol ? " (Your Turn)" : ""}`}
      </Text>

      <View style={tw`items-center justify-center`}>
        <MainBoard
          mainBoardState={mainBoardState}
          currentPlayerTurn={currentPlayerTurn}
          lastClickedBoardId={lastClickedBoardId}
          lastClickedCellId={lastClickedCellId}
          nextActiveBoard={nextActiveBoard}
          handlePlay={handlePlay}
          websocket={websocketRef.current ?? undefined}
        />
      </View>

      <View style={tw`mt-5 p-2.5`}>
        <Text style={tw`text-base text-gray-600`}>
          {isConnected
            ? `Connected as ${playerSymbol}`
            : "Connection lost. Trying to reconnect..."}
        </Text>
      </View>
    </SafeAreaView>
  );
};

