// import React from "react";
// import { View } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import { MotiPath } from "moti";
// import tw from 'twrnc';
// export default function GridLines() {
//   const pathVariants = {
//     from: { strokeDashoffset: 100 },
//     animate: {
//       strokeDashoffset: 0,
//       transition: {
//         duration: 950,
//         type: "timing",
//       },
//     },
//   };

//   return (
//     <View style={tw`absolute inset-0 pointer-events-none`}>
//       <Svg width="100%" height="100%" viewBox="0 0 100 100">
//         {/* Vertical Lines */}
//         <MotiPath
//           d="M 33.34 0 L 33.34 100"
//           stroke="gray"
//           strokeWidth="0.6"
//           fill="none"
//           strokeDasharray={100}
//           animate={pathVariants.animate}
//           from={pathVariants.from}
//         />
//         <MotiPath
//           d="M 66.66 0 L 66.66 100"
//           stroke="gray"
//           strokeWidth="0.6"
//           fill="none"
//           strokeDasharray={100}
//           animate={pathVariants.animate}
//           from={pathVariants.from}
//         />

//         {/* Horizontal Lines */}
//         <MotiPath
//           d="M 0 33.34 L 100 33.34"
//           stroke="gray"
//           strokeWidth="0.6"
//           fill="none"
//           strokeDasharray={100}
//           animate={pathVariants.animate}
//           from={pathVariants.from}
//         />
//         <MotiPath
//           d="M 0 66.66 L 100 66.66"
//           stroke="gray"
//           strokeWidth="0.6"
//           fill="none"
//           strokeDasharray={100}
//           animate={pathVariants.animate}
//           from={pathVariants.from}
//         />
//       </Svg>
//     </View>
//   );
// }
