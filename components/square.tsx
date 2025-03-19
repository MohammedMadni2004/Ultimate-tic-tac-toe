import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";

function Square({
  handlePlay,
  boardId,
  cellId,
  cellValue,
  isActiveSquare,
  isLastClickedSquare,
  currentPlayerTurn,
}: {
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  boardId: number;
  cellId: number;
  cellValue: string | null;
  isActiveSquare: boolean;
  isLastClickedSquare: boolean;
  currentPlayerTurn: string;
}) {
  return (
    <TouchableOpacity
      style={tw`aspect-square bg-gray-200 justify-center items-center ${
        isLastClickedSquare ? "bg-blue-500" : ""
      }`}
      disabled={!isActiveSquare}
      onPress={() => handlePlay(boardId, cellId, true)}
    >
      <View>
        <Text style={tw`text-xl`}>
          {cellValue || (isActiveSquare ? currentPlayerTurn : "")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default Square;
