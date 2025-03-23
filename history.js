import { rehydrate } from './utils.js';

export function createHistory() {
  const history = [];

  // TODO: Optimize this by only saving the pieces that have changed
  const push = (newPieces, takenPiece) =>
    history.push({
      pieces: JSON.parse(JSON.stringify(newPieces)),
      takenPiece,
    });
  // TODO: 2d array white/black: [[w,b],[w,b]]
  // const push = (move) => history.push(move);

  const getLastMove = () => {
    if (history.length === 0) {
      return null;
    }
    const { pieces, takenPiece } = history.pop();
    return { pieces: rehydrate(pieces), takenPiece };
  };

  // getNextMove

  return { push, getLastMove };
}
