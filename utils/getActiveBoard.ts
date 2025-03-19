function getActiveBoards(
  isGameInactive: boolean,
  reducedMainBoardState: (string | null)[],
  moveHistory: [number, number][],
  currentMove: number,
  isCurrentPlayerTurn?: boolean
) {
  if (isGameInactive || isCurrentPlayerTurn === false) {
    return null;
  }

  if (currentMove === 0 || moveHistory.length <= 1) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !reducedMainBoardState[i]);
  }

  const lastMove = moveHistory[currentMove];
  if (!lastMove)
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !reducedMainBoardState[i]);

  const lastClickedCellId = lastMove[1];

  if (reducedMainBoardState[lastClickedCellId]) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !reducedMainBoardState[i]);
  }

  return [lastClickedCellId];
}

export default getActiveBoards;
