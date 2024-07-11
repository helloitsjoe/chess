import {
  createPawn,
  createRook,
  createKnight,
  createBishop,
  createKing,
  createQueen,
  createEmpty,
} from './pieces.js';

// getPieces functions aren't serialized when we save undo state
function rehydrate(pieces) {
  const factoryMap = {
    pawn: createPawn,
    rook: createRook,
    knight: createKnight,
    bishop: createBishop,
    king: createKing,
    queen: createQueen,
  };

  return pieces.map((row) =>
    row.map((piece) => {
      const factory = factoryMap[piece.id];
      return factory ? factory(piece.color) : createEmpty();
    }),
  );
}

export function createHistory() {
  const history = [];

  // TODO: Optimize this by only saving the pieces that have changed
  const push = (newPieces) =>
    history.push({ pieces: JSON.parse(JSON.stringify(newPieces)) });

  const getLastMove = () => {
    if (history.length === 0) {
      return null;
    }
    const { pieces } = history.pop();
    return rehydrate(pieces);
  };

  return { push, getLastMove };
}
