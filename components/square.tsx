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
  // Check if it's the user's turn
  const isUserTurn = currentPlayerTurn === playerMark;

  // Square is only clickable if it's active AND it's the user's turn
  const isClickable = isActiveSquare && isUserTurn && !cellValue;

  const getSquareContent = () => {
    // For already placed marks, use bold colors
    if (cellValue === "X")
      return { text: "X", style: "text-red-700 font-extrabold" };
    if (cellValue === "O")
      return { text: "O", style: "text-blue-700 font-extrabold" };

    // For preview marks (when hovering over valid squares), use lighter colors
    if (isClickable && playerMark) {
      return {
        text: playerMark,
        style:
          playerMark === "X"
            ? "text-red-300 opacity-50"
            : "text-blue-300 opacity-50",
      };
    }

    return { text: "", style: "" };
  };

  const { text, style } = getSquareContent();

  // Enhanced background colors for better visibility
  const getBgColor = () => {
    if (isLastClickedSquare) return "bg-indigo-200"; // Last move
    if (isClickable) return "bg-yellow-200"; // Valid next move
    if (isActiveSquare) return "bg-yellow-50"; // Active but not clickable
    return "bg-white"; // Inactive
  };

  return (
    <TouchableOpacity
      style={tw`w-full h-full justify-center items-center ${getBgColor()}`}
      disabled={!isClickable}
      onPress={() => handlePlay(boardId, cellId, true)}
      activeOpacity={isClickable ? 0.6 : 1}
    >
      <Text
        style={tw`${style ? style : "text-gray-400"} ${
          text ? "text-2xl" : "text-xs"
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default Square;
