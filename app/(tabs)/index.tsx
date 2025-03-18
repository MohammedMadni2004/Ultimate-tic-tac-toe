import React from "react";
import { View, Dimensions } from "react-native";
import { MotiView } from "moti"; // Make sure to install: npm install moti
import SubBoard from "@/components/sub-board";
import  tw  from "twrnc";
// GridLines component for React Native
function GridLines() {
  return (
    <View style={tw`absolute w-full h-full z-10`}>
      {/* Vertical lines */}
      <View
        style={[tw`absolute bg-gray-800 w-[2px] h-full`, { left: "33.33%" }]}
      />
      <View
        style={[tw`absolute bg-gray-800 w-[2px] h-full`, { left: "66.66%" }]}
      />

      {/* Horizontal lines */}
      <View
        style={[tw`absolute bg-gray-800 w-full h-[2px]`, { top: "33.33%" }]}
      />
      <View
        style={[tw`absolute bg-gray-800 w-full h-[2px]`, { top: "66.66%" }]}
      />
    </View>
  );
}

function MainBoard({
  mainBoardState,
  currentPlayerTurn,
  lastClickedBoardId,
  lastClickedCellId,
  nextActiveBoard,
  handlePlay,
  websocket, // Added websocket prop for multiplayer
}: {
  mainBoardState: (string | null)[][];
  currentPlayerTurn: string;
  lastClickedBoardId: number | null;
  lastClickedCellId: number | null;
  nextActiveBoard: (number | null)[] | null;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  websocket?: WebSocket;
}) {
  const ANIMATION_DURATION = 950;

  const getGlobalSquareIndex = (boardId: number, squareId: number) => {
    return boardId * 9 + squareId;
  };

  // Modified handlePlay to include websocket communication
  const handlePlayWithWebsocket = (
    boardId: number,
    cellId: number,
    yourMove: boolean
  ) => {
    // First handle the play locally
    handlePlay(boardId, cellId, yourMove);

    // If this is your move and websocket exists, send it to the opponent
    if (yourMove && websocket && websocket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: "move",
        boardId,
        cellId,
        player: currentPlayerTurn,
      });
      websocket.send(message);
    }
  };

  const windowWidth = Dimensions.get("window").width;
  const boardSize = Math.min(windowWidth - 40, 530); // 40px padding, max 530px

  return (
    <MotiView
      style={[
        tw`relative aspect-square`,
        { width: boardSize, height: boardSize },
      ]}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: ANIMATION_DURATION }}
    >
      <GridLines />

      <View style={tw`flex-1 flex-row flex-wrap`}>
        {Array(9)
          .fill(null)
          .map((_, boardId) => (
            <View key={boardId} style={tw`w-1/3 h-1/3`}>
              <SubBoard
                boardId={boardId}
                subBoardState={mainBoardState[boardId]}
                lastClickedCellId={
                  lastClickedBoardId === boardId ? lastClickedCellId : null
                }
                isActiveSubBoard={
                  (nextActiveBoard && nextActiveBoard.includes(boardId))!
                }
                currentPlayerTurn={currentPlayerTurn}
                handlePlay={handlePlayWithWebsocket}
                getGlobalSquareIndex={getGlobalSquareIndex}
              />
            </View>
          ))}
      </View>
    </MotiView>
  );
}

export default MainBoard;
