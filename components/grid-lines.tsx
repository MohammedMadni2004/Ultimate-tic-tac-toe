import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { MotiView } from "moti";
import tw from "twrnc";

export default function GridLines() {
  return (
    <View style={tw`absolute inset-0 pointer-events-none`}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        {/* Vertical Lines */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 950 }}
        >
          <Path d="M 33.34 0 L 33.34 100" stroke="gray" strokeWidth="0.6" fill="none" />
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 950 }}
        >
          <Path d="M 66.66 0 L 66.66 100" stroke="gray" strokeWidth="0.6" fill="none" />
        </MotiView>

        {/* Horizontal Lines */}
        <MotiView
          from={{ opacity: 0, translateX: -10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 950 }}
        >
          <Path d="M 0 33.34 L 100 33.34" stroke="gray" strokeWidth="0.6" fill="none" />
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateX: 10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 950 }}
        >
          <Path d="M 0 66.66 L 100 66.66" stroke="gray" strokeWidth="0.6" fill="none" />
        </MotiView>
      </Svg>
    </View>
  );
}
