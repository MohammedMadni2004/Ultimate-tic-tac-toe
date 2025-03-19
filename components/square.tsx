import React from "react";
import { TouchableOpacity, Text } from "react-native";
import tw from "twrnc";

function Square({
  handlePlay,
  boardId,
  cellId,
  cellValue,
  isActiveSquare,
  isLastClickedSquare,
  currentPlayerTurn,
  playerMark, 
}: {
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  boardId: number;
  cellId: number;
  cellValue: string | null;
  isActiveSquare: boolean;
  isLastClickedSquare: boolean;
  currentPlayerTurn: string;
  playerMark: string | null;
}) {
  const getSquareContent = () => {
    if (cellValue === "X") return { text: "X", style: "text-red-600" };
    if (cellValue === "O") return { text: "O", style: "text-blue-600" };

    if (isActiveSquare && playerMark) {
      return {
        text: playerMark,
        style: playerMark === "X" ? "text-red-300" : "text-blue-300",
      };
    }

    return { text: "", style: "" };
  };

  const { text, style } = getSquareContent();

  return (
    <TouchableOpacity
      style={tw`w-full h-full justify-center items-center ${
        isLastClickedSquare
          ? "bg-blue-200"
          : isActiveSquare
          ? "bg-yellow-100"
          : "bg-white"
      }`}
      disabled={!isActiveSquare}
      onPress={() => handlePlay(boardId, cellId, true)}
      activeOpacity={isActiveSquare ? 0.6 : 1}
    >
      <Text
        style={tw`font-bold ${style ? style : "text-gray-400"} ${
          text ? "text-xl" : "text-xs"
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default Square;
