import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MainBoard from "./main-board";
import tw from "twrnc";

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
  // Calculate current game state
  const mainBoardState = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Reconstruct the board from move history
  const currentPlayerTurn = currentMove % 2 === 0 ? "X" : "O";
  let lastClickedBoardId = null;
  let lastClickedCellId = null;

  // Apply moves
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

  return (
    <View style={tw`w-full items-center`}>
      <Text style={tw`text-2xl font-bold mb-2 text-center`}>
        {gameResult
          ? `Game Over: ${gameResult}`
          : `${currentPlayerTurn}'s Turn ${
              currentPlayerTurn === playerMark ? "(You)" : ""
            }`}
      </Text>

      <View style={tw`w-full mb-4`}>
        <MainBoard
          mainBoardState={mainBoardState}
          currentPlayerTurn={currentPlayerTurn}
          lastClickedBoardId={lastClickedBoardId}
          lastClickedCellId={lastClickedCellId}
          handlePlay={handlePlay}
        />
      </View>

      {/* Game controls */}
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
