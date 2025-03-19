import React from "react";
import { View, Dimensions } from "react-native";
import SubBoard from "./sub-board";
import tw from "twrnc";

function MainBoard({
  mainBoardState,
  currentPlayerTurn,
  lastClickedBoardId,
  lastClickedCellId,
  handlePlay,
  playerMark, 
}: {
  mainBoardState: (string | null)[][];
  currentPlayerTurn: string;
  lastClickedBoardId: number | null;
  lastClickedCellId: number | null;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  playerMark: string | null; 
}) {
  const windowWidth = Dimensions.get("window").width;
  const boardSize = Math.min(windowWidth - 32, 500);

  return (
    <View
      style={[
        tw`flex-row flex-wrap border-2 border-gray-800 bg-gray-100 rounded-lg overflow-hidden`,
        { width: boardSize, height: boardSize },
      ]}
    >
      {Array(9)
        .fill(null)
        .map((_, boardId) => (
          <View
            key={boardId}
            style={tw`w-1/3 h-1/3 border border-gray-500 ${
              lastClickedBoardId === boardId ? "bg-blue-50" : ""
            }`}
          >
            <SubBoard
              boardId={boardId}
              subBoardState={mainBoardState[boardId]}
              lastClickedCellId={
                lastClickedBoardId === boardId ? lastClickedCellId : null
              }
              isActiveSubBoard={true}
              currentPlayerTurn={currentPlayerTurn}
              handlePlay={handlePlay}
              playerMark={playerMark} 
            />
          </View>
        ))}
    </View>
  );
}

export default MainBoard;
