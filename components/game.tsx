import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import MainBoard from "./main-board";
import tw from "twrnc";
import getMainBoardState from "@/utils/getMainBoardState";

function Game({
  currentMove,
  setCurrentMove,
  moveHistory,
  setMoveHistory,
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
  setCurrentMove: (currentMove: number) => void;
  moveHistory: [number, number][];
  setMoveHistory: (moveHistory: [number, number][]) => void;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  gameResult?: string | null;
  playerMark?: string | null;
  onResign?: () => void;
  onDrawOffer?: () => void;
  onRematch?: () => void;
  disconnected?: boolean;
  rematchDeclined?: boolean;
}) {
  const currentPlayerTurn = currentMove % 2 === 0 ? "X" : "O";

  const mainBoardKey = useRef(0);
  const handleRestart = () => {
    mainBoardKey.current += 1;
    setMoveHistory([[-1, -1]]);
    setCurrentMove(0);
  };
  const mainBoardState: (string | null)[][] = getMainBoardState(
    currentMove,
    moveHistory,
  );

  return (
    <ScrollView contentContainerStyle={tw`flex-1 items-center`}>
      <View style={tw`w-full max-w-[800px]`}>
        <MainBoard
          key={mainBoardKey.current}
          mainBoardState={mainBoardState}
          currentPlayerTurn={currentPlayerTurn}
          lastClickedBoardId={moveHistory[currentMove][0]}
          lastClickedCellId={moveHistory[currentMove][1]}
          handlePlay={handlePlay}
        />

      </View>
    </ScrollView>
  );
}

export default Game;
