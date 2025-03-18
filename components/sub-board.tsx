import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { MotiView } from "moti";
import calculateResult from "@/utils/calculate-result";
import tw from "twrnc";
import Square from '@/components/square'; 

function SubBoardResult({
  subGameResult,
  setIsAnimationComplete,
}: {
  subGameResult: string;
  setIsAnimationComplete: (arg0: boolean) => void;
}) {
  return subGameResult === "Tie" ? null : (
    <MotiView
      from={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 1600 }}
      onDidAnimate={() => setIsAnimationComplete(true)}
      style={tw`absolute w-full h-full justify-center items-center`}
    >
      {subGameResult === "X" ? (
        <>
          <View style={tw`absolute w-5/6 h-[4px] bg-gray-900 rotate-45`} />
          <View style={tw`absolute w-5/6 h-[4px] bg-gray-900 -rotate-45`} />
        </>
      ) : (
        <View
          style={tw`w-4/5 h-4/5 border-[4px] border-gray-900 rounded-full`}
        />
      )}
    </MotiView>
  );
}

function SubBoard({
  boardId,
  subBoardState,
  lastClickedCellId,
  isActiveSubBoard,
  currentPlayerTurn,
  handlePlay,
  getGlobalSquareIndex,
  showWinAnimation = true,
}: {
  boardId: number;
  subBoardState: (string | null)[];
  lastClickedCellId: number | null;
  isActiveSubBoard: boolean;
  currentPlayerTurn: string;
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  getGlobalSquareIndex: (boardId: number, squareId: number) => number;
  showWinAnimation?: boolean;
}) {
  const subGameResult = calculateResult(subBoardState);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  return (
    <View style={tw`relative w-full h-full justify-center items-center`}>
      {/* Grid for SubBoard */}
      <MotiView
        style={[
          tw`absolute w-full h-full grid grid-cols-3 gap-1 p-2`,
          {
            display:
              showWinAnimation && subGameResult && subGameResult !== "DRAW"
                ? "none"
                : "flex",
          },
        ]}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <FlatList
          data={Array(9).fill(null)}
          numColumns={3}
          keyExtractor={(_, i) => `${boardId}-${i}`}
          renderItem={({ index }) => (
            <Square
              handlePlay={handlePlay}
              cellId={index}
              cellValue={subBoardState[index]}
              boardId={boardId}
              isActiveSquare={isActiveSubBoard && !subBoardState[index]}
              isLastClickedSquare={lastClickedCellId === index}
              currentPlayerTurn={currentPlayerTurn}
              globalIndex={getGlobalSquareIndex(boardId, index)}
            />
          )}
        />
      </MotiView>

      {/* Win Animation */}
      {showWinAnimation && subGameResult && (
        <MotiView
          style={[
            tw`absolute w-full h-full justify-center items-center`,
            { display: isAnimationComplete ? "none" : "flex" },
          ]}
        >
          <SubBoardResult
            subGameResult={subGameResult}
            setIsAnimationComplete={setIsAnimationComplete}
          />
        </MotiView>
      )}
    </View>
  );
}

export default SubBoard;
