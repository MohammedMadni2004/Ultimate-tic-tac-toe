import React from "react";
import { View, Pressable } from "react-native";
import { MotiView } from "moti";
import tw from "twrnc";
import XIcon from "@/components/icons/XIcon"; // Replace with actual SVG component
import CircleIcon from "@/components/icons/CircleIcon"; // Replace with actual SVG component

function Square({
  handlePlay,
  boardId,
  cellId,
  cellValue,
  isActiveSquare,
  isLastClickedSquare,
  currentPlayerTurn,
  globalIndex,
}: {
  handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
  boardId: number;
  cellId: number;
  cellValue: string | null;
  isActiveSquare: boolean;
  isLastClickedSquare: boolean;
  currentPlayerTurn: string;
  globalIndex: number;
}) {
  let value;

  if (cellValue === "X") {
    value = <XIcon width={30} height={30} />;
  } else if (cellValue === "O") {
    value = <CircleIcon width={30} height={30} />;
  } else if (isActiveSquare) {
    value =
      currentPlayerTurn === "X" ? (
        <XIcon width={20} height={20} style={tw`opacity-60`} />
      ) : (
        <CircleIcon width={20} height={20} style={tw`opacity-60`} />
      );
  }

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 10, stiffness: 100 }}
      style={tw`flex items-center justify-center w-full h-full`}
    >
      <Pressable
        disabled={!isActiveSquare}
        onPress={() => handlePlay(boardId, cellId, true)}
        style={[
          tw`aspect-square w-11/12 h-11/12 rounded-md p-2 md:w-full md:h-full md:p-4`,
          isLastClickedSquare
            ? tw`bg-gray-900`
            : isActiveSquare
            ? tw`bg-gray-300`
            : tw`bg-gray-100 opacity-50`,
        ]}
      >
        {value}
      </Pressable>
    </MotiView>
  );
}

export default Square;
