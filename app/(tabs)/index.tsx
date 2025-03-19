import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import Game from "@/components/game";
import { useSocket } from "@/hooks/useSocket";
import tw from "twrnc";
import ChoosePlayerModal from "@/components/ChoosePlayerModal";
import getActiveBoards from "@/utils/getActiveBoard";
import calculateResult from "@/utils/calculate-result";

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
  const [incomingRematchRequest, setIncomingRematchRequest] = useState(false);

  const handleOnlinePlay = (
    boardId: number,
    cellId: number,
    yourMove: boolean = true
  ) => {
    if (yourMove && (currentMove % 2 === 0 ? "X" : "O") !== playerMark) {
      return;
    }

    if (yourMove) {
      const mainBoardState = Array(9)
        .fill(null)
        .map(() => Array(9).fill(null));

      for (let i = 1; i < moveHistory.length && i <= currentMove; i++) {
        const [bId, cId] = moveHistory[i];
        if (bId >= 0 && cId >= 0) {
          mainBoardState[bId][cId] = i % 2 === 1 ? "X" : "O";
        }
      }

      const reducedMainBoardState = mainBoardState.map((subBoard) =>
        calculateResult(subBoard)
      );

      const isGameInactive = Boolean(gameResult);
      const isCurrentPlayerTurn = true;

      const activeBoards = getActiveBoards(
        isGameInactive,
        reducedMainBoardState,
        moveHistory,
        currentMove,
        isCurrentPlayerTurn
      );

      if (activeBoards && !activeBoards.includes(boardId)) {
        return;
      }
    }

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

  const handleIncomingRematchRequest = (accept: boolean) => {
    sendMessage({
      type: accept  ? "rematch-accepted":"rematch-declined",
      
    });

    setIncomingRematchRequest(false);

    if (accept) {
      resetGame();
      
    }
  };

  const findNewOpponent = () => {
    resetGame();
    setRematchDeclined(false);
    setWaiting(true);
    sendMessage({ type: "init" });
  };

  const resetGame = () => {
    setCurrentMove(0);
    setMoveHistory([[-1, -1]]);
    setGameResult(null);
    setRematchDeclined(false);
  };

  const { socket, sendMessage } = useSocket(
    setWaiting,
    setPlayerMark,
    setDisconnected,
    setGameResult,
    handleOnlinePlay,
    resetGame,
    setRematchDeclined,
    setIncomingRematchRequest
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
        <ChoosePlayerModal socket={sendMessage} setPlayerMark={setPlayerMark} />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-center items-center py-4`}
      >
        <View style={tw`w-full max-w-md px-4`}>
          <Text style={tw`text-2xl font-bold mb-2 text-center`}>
            {gameResult
              ? `Game Over: ${gameResult}`
              : `${playerMark}'s Turn ${playerMark === "X" ? "(You)" : ""}`}
            {}
          </Text>
          <Text style={tw`text-center text-gray-600 mb-4`}>
            {playerMark === "X" ? "You are Player X" : "You are Player O"}
          </Text>
          <Game
            currentMove={currentMove}
            setCurrentMove={setCurrentMove}
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            handlePlay={handleOnlinePlay}
            gameResult={gameResult}
            playerMark={playerMark}
            onResign={handleResign}
            onRematch={handleRematch}
            onFindNewOpponent={findNewOpponent}
            disconnected={disconnected}
            rematchDeclined={rematchDeclined}
          />
        </View>
      </ScrollView>

      <Modal
        visible={incomingRematchRequest}
        transparent={true}
        animationType="fade"
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-4 rounded-lg w-4/5 max-w-md`}>
            <Text style={tw`text-lg font-medium mb-4 text-center`}>
              Your opponent wants a rematch
            </Text>
            <View style={tw`flex-row justify-around`}>
              <TouchableOpacity
                style={tw`bg-red-500 px-4 py-2 rounded-md`}
                onPress={() => handleIncomingRematchRequest(false)}
              >
                <Text style={tw`text-white font-bold`}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-green-500 px-4 py-2 rounded-md`}
                onPress={() => handleIncomingRematchRequest(true)}
              >
                <Text style={tw`text-white font-bold`}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {disconnected && !gameResult && (
        <View
          style={tw`absolute inset-0 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-4 rounded-lg`}>
            <Text style={tw`text-lg text-red-600`}>
              You have been disconnected from the server.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default OnlineGame;
