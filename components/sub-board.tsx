import React from "react";
import { View } from "react-native";
import Square from "./square";
import tw from "twrnc";

function SubBoard({
  boardId,
  subBoardState,
  lastClickedCellId,
  isActiveSubBoard,
  currentPlayerTurn,
  handlePlay,
  playerMark, 
}: {
  boardId: number;
  subBoardState: (string | null)[];
  lastClickedCellId: number | null;
  isActiveSubBoard: boolean;
  currentPlayerTurn: string;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  playerMark: string | null; 
}) {
  return (
    <View
      style={tw`flex-row flex-wrap w-full h-full ${
        isActiveSubBoard ? "bg-yellow-50" : ""
      }`}
    >
      {Array(9)
        .fill(null)
        .map((_, i) => (
          <View key={i} style={tw`w-1/3 h-1/3 border border-gray-300`}>
            <Square
              handlePlay={handlePlay}
              cellId={i}
              cellValue={subBoardState[i]}
              boardId={boardId}
              isActiveSquare={isActiveSubBoard && !subBoardState[i]}
              isLastClickedSquare={lastClickedCellId === i}
              currentPlayerTurn={currentPlayerTurn}
              playerMark={playerMark} 
            />
          </View>
        ))}
    </View>
  );
}

export default SubBoard;
