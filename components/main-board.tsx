import React from "react";
import { View } from "react-native";
import SubBoard from "./sub-board";
import tw from "twrnc";

function MainBoard({
  mainBoardState,
  currentPlayerTurn,
  lastClickedBoardId,
  lastClickedCellId,
  handlePlay,
}: {
  mainBoardState: (string | null)[][];
  currentPlayerTurn: string;
  lastClickedBoardId: number | null;
  lastClickedCellId: number | null;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
}) {
  return (
    <View style={tw`grid grid-cols-3 gap-2`}>
      {Array(9)
        .fill(null)
        .map((_, boardId) => (
          <SubBoard
            key={boardId}
            boardId={boardId}
            subBoardState={mainBoardState[boardId]}
            lastClickedCellId={
              lastClickedBoardId === boardId ? lastClickedCellId : null
            }
            isActiveSubBoard={true}
            currentPlayerTurn={currentPlayerTurn}
            handlePlay={handlePlay}
          />
        ))}
    </View>
  );
}

export default MainBoard;
