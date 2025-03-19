import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import Game from "@/components/game";
import { useSocket } from "@/hooks/useSocket";
import tw from "twrnc";
import ChoosePlayerModal from "@/components/ChoosePlayerModal";

function OnlineGame() {
  const [waiting, setWaiting] = useState<boolean | undefined>();
  const [disconnected, setDisconnected] = useState(false);
  const [playerMark, setPlayerMark] = useState<"X" | "O" | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveHistory, setMoveHistory] = useState<[number, number][]>([
    [-1, -1],
  ]);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [rematchDeclined, setRematchDeclined] = useState(false);

  const handleOnlinePlay = (
    boardId: number,
    cellId: number,
    yourMove: boolean = true
  ) => {
    setCurrentMove((currentMove) => currentMove + 1);
    setMoveHistory((moveHistory) => [...moveHistory, [boardId, cellId]]);

    if (yourMove) {
      sendMessage({
        type: "move",
        move: [boardId, cellId],
      });
    }
  };

  const handleResign = () => {
    sendMessage({ type: "resign" });
    setGameResult(playerMark === "X" ? "O" : "X");
  };

  const handleDrawOffer = () => {
    sendMessage({
      type: "draw-offer",
      action: "offer",
    });
    Alert.alert("Draw Offer", "Draw offer sent to opponent.");
  };

  const handleRematch = () => {
    sendMessage({
      type: "rematch",
      action: "request",
    });
    Alert.alert("Rematch Request", "Rematch request sent to opponent.");
  };

  const resetGame = () => {
    setCurrentMove(0);
    setMoveHistory([[-1, -1]]);
    setGameResult(null);
  };

  const { socket, sendMessage } = useSocket(
    setWaiting,
    setPlayerMark,
    setDisconnected,
    setGameResult,
    handleOnlinePlay,
    resetGame,
    setRematchDeclined
  );

  if (waiting === undefined) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-4 text-lg text-gray-800`}>
          Connecting to server...
        </Text>
      </View>
    );
  }

  if (waiting === true) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-4 text-lg text-gray-800`}>
          Waiting for another player...
        </Text>
      </View>
    );
  }

  if (!disconnected && !playerMark) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-800`}>
          Please wait while we assign you a player mark...
        </Text>
        <ChoosePlayerModal socket={ sendMessage} />
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <Game
        currentMove={currentMove}
        setCurrentMove={setCurrentMove}
        moveHistory={moveHistory}
        setMoveHistory={setMoveHistory}
        handlePlay={handleOnlinePlay}
        gameResult={gameResult}
        playerMark={playerMark}
        onResign={handleResign}
        onDrawOffer={handleDrawOffer}
        onRematch={handleRematch}
        disconnected={disconnected}
        rematchDeclined={rematchDeclined}
      />
      {disconnected && !gameResult && (
        <View style={tw`absolute inset-0 justify-center items-center`}>
          <Text style={tw`text-lg text-red-600`}>
            You have been disconnected from the server.
          </Text>
        </View>
      )}
    </View>
  );
}

export default OnlineGame;
