// import React from "react";
// import { View } from "react-native";
// import { MotiView } from "moti";
// import SubBoard from "./sub-board";
// import GridLines from "./grid-lines";
// import tw from 'twrnc';
// type MainBoardProps = {
//   mainBoardState: (string | null)[][];
//   currentPlayerTurn: string;
//   lastClickedBoardId: number | null;
//   lastClickedCellId: number | null;
//   nextActiveBoard: (number | null)[] | null;
//   handlePlay: (boardId: number, cellId: number, yourMove: boolean) => void;
// };

// const MainBoard: React.FC<MainBoardProps> = ({
//   mainBoardState,
//   currentPlayerTurn,
//   lastClickedBoardId,
//   lastClickedCellId,
//   nextActiveBoard,
//   handlePlay,
// }) => {
//   const ANIMATION_DURATION = 0.95;
//   const TOTAL_SQUARES = 81;
//   const STAGGER_DELAY = 0.015;

//   const getGlobalSquareIndex = (boardId: number, squareId: number) => {
//     return boardId * 9 + squareId;
//   };

//   return (
//     <MotiView
//       from={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{
//         type: "timing",
//         duration: ANIMATION_DURATION * 1000,
//         delay: STAGGER_DELAY * 1000 * TOTAL_SQUARES,
//       }}
//       style={tw`relative flex flex-wrap w-full aspect-square min-h-80 min-w-80`}
//     >
//       <GridLines />

//       {Array(9)
//         .fill(null)
//         .map((_, boardId) => (
//           <SubBoard
//             key={boardId}
//             boardId={boardId}
//             subBoardState={mainBoardState[boardId]}
//             lastClickedCellId={
//               lastClickedBoardId === boardId ? lastClickedCellId : null
//             }
//             isActiveSubBoard={
//               nextActiveBoard ? nextActiveBoard.includes(boardId) : false
//             }
//             currentPlayerTurn={currentPlayerTurn}
//             handlePlay={handlePlay}
//             getGlobalSquareIndex={getGlobalSquareIndex}
//           />
//         ))}
//     </MotiView>
//   );
// };

// export default MainBoard;
