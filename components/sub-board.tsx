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
}: {
  boardId: number;
  subBoardState: (string | null)[];
  lastClickedCellId: number | null;
  isActiveSubBoard: boolean;
  currentPlayerTurn: string;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
}) {
  return (
    <View style={tw`grid grid-cols-3 gap-1`}>
      {Array(9)
        .fill(null)
        .map((_, i) => (
          <Square
            key={i}
            handlePlay={handlePlay}
            cellId={i}
            cellValue={subBoardState[i]}
            boardId={boardId}
            isActiveSquare={isActiveSubBoard && !subBoardState[i]}
            isLastClickedSquare={lastClickedCellId === i}
            currentPlayerTurn={currentPlayerTurn}
          />
        ))}
    </View>
  );
}

export default SubBoard;
