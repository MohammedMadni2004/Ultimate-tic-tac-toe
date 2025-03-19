import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MainBoard from "./main-board";
import tw from "twrnc";
import getActiveBoards from "@/utils/getActiveBoard";
import calculateResult from "@/utils/calculate-result";

export default function Game({
  currentMove,
  moveHistory,
  handlePlay,
  gameResult,
  playerMark,
  onResign,
  onDrawOffer,
  onRematch,
  disconnected,
  rematchDeclined,
}: {
  currentMove: number;
  setCurrentMove: React.Dispatch<React.SetStateAction<number>>;
  moveHistory: [number, number][];
  setMoveHistory: React.Dispatch<React.SetStateAction<[number, number][]>>;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  gameResult: string | null;
  playerMark: "X" | "O" | null;
  onResign: () => void;
  onDrawOffer: () => void;
  onRematch: () => void;
  disconnected: boolean;
  rematchDeclined: boolean;
}) {
  const mainBoardState = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  const currentPlayerTurn = currentMove % 2 === 0 ? "X" : "O";
  let lastClickedBoardId = null;
  let lastClickedCellId = null;

  for (let i = 1; i <= currentMove && i < moveHistory.length; i++) {
    const [boardId, cellId] = moveHistory[i];
    if (boardId >= 0 && cellId >= 0) {
      mainBoardState[boardId][cellId] = i % 2 === 1 ? "X" : "O";
      if (i === currentMove) {
        lastClickedBoardId = boardId;
        lastClickedCellId = cellId;
      }
    }
  }

  const isYourTurn = currentPlayerTurn === playerMark;

  // Calculate active boards for next move
  const reducedMainBoardState = mainBoardState.map((subBoard) =>
    calculateResult(subBoard)
  );

  const isGameInactive = Boolean(gameResult);
  const activeBoards = getActiveBoards(
    isGameInactive,
    reducedMainBoardState,
    moveHistory,
    currentMove,
    isYourTurn
  );

  // Create a user-friendly message about where to play next
  const getNextMoveMessage = () => {
    if (!isYourTurn) return "Waiting for opponent's move...";
    if (gameResult) return "Game over";

    if (!activeBoards || activeBoards.length === 0) {
      return "No valid moves available";
    }

    if (activeBoards.length > 1) {
      return "You can play in any highlighted sub-board";
    }

    // Board positions description
    const boardPositions = [
      "top-left",
      "top-center",
      "top-right",
      "middle-left",
      "center",
      "middle-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    return `Play in the ${boardPositions[activeBoards[0]]} sub-board`;
  };

  return (
    <View style={tw`w-full items-center`}>
      <Text style={tw`text-lg font-medium mb-2 text-center`}>
        {gameResult
          ? `Game Over: ${gameResult}`
          : isYourTurn
          ? "Your turn"
          : "Opponent's turn"}
      </Text>

      {isYourTurn && !gameResult && (
        <View style={tw`mb-3 p-2 bg-yellow-100 rounded-md w-full`}>
          <Text style={tw`text-center font-medium text-yellow-800`}>
            {getNextMoveMessage()}
          </Text>
        </View>
      )}

      <View style={tw`w-full mb-4`}>
        <MainBoard
          mainBoardState={mainBoardState}
          currentPlayerTurn={currentPlayerTurn}
          lastClickedBoardId={lastClickedBoardId}
          lastClickedCellId={lastClickedCellId}
          handlePlay={handlePlay}
          playerMark={playerMark}
          moveHistory={moveHistory}
          currentMove={currentMove}
        />
      </View>

      {!disconnected && (
        <View style={tw`flex-row flex-wrap justify-center gap-2 mt-2`}>
          {!gameResult ? (
            <>
              <TouchableOpacity
                style={tw`bg-red-500 px-3 py-2 rounded-md`}
                onPress={onResign}
              >
                <Text style={tw`text-white font-bold`}>Resign</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-500 px-3 py-2 rounded-md`}
                onPress={onDrawOffer}
              >
                <Text style={tw`text-white font-bold`}>Offer Draw</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={tw`bg-blue-500 px-3 py-2 rounded-md ${
                rematchDeclined ? "opacity-50" : ""
              }`}
              onPress={onRematch}
              disabled={rematchDeclined}
            >
              <Text style={tw`text-white font-bold`}>
                {rematchDeclined ? "Rematch Declined" : "Request Rematch"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
