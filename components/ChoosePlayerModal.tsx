import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import tw from "twrnc";

function ChoosePlayerModal({
  socket,
  setPlayerMark,
}: {
  socket: (message: any) => void;
  setPlayerMark: React.Dispatch<React.SetStateAction<"X" | "O" | null>>;
})  {
  const [chosenMark, setChosenMark] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleChoose = (mark: 'X'|'O') => {
    setChosenMark(mark);
    socket({ type: "player", player: mark });
    setPlayerMark(mark);
    setTimeout(() => setIsVisible(false), 500); 
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={tw`bg-white p-6 rounded-lg items-center`}>
        <Text style={tw`text-lg font-bold mb-2`}>
          {!chosenMark ? "Select Player" : "Waiting for opponent..."}
        </Text>
        <Text style={tw`text-gray-600 text-center mb-4`}>
          Players will be assigned randomly if both choose the same option.
        </Text>

        <View style={tw`flex-row gap-4`}>
          <TouchableOpacity
            style={tw`px-4 py-2 rounded-lg ${
              chosenMark === "X" ? "bg-gray-300" : "bg-blue-500"
            }`}
            onPress={() => handleChoose("X")}
          >
            <Text style={tw`text-white font-semibold`}>Player X</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`px-4 py-2 rounded-lg ${
              chosenMark === "O" ? "bg-gray-300" : "bg-red-500"
            }`}
            onPress={() => handleChoose("O")}
          >
            <Text style={tw`text-white font-semibold`}>Player O</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ChoosePlayerModal;
