import {
  createPawn,
  createRook,
  createKnight,
  createBishop,
  createKing,
  createQueen,
  createEmpty,
} from './pieces.js';

export const isEmpty = (piece) => piece.id === 'empty';

// getPieces functions aren't serialized when we save undo state
export function rehydrate(pieces) {
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
