import { WHITE, BLACK } from './constants.js';
import {
  createPawn,
  createRook,
  createKnight,
  createBishop,
  createKing,
  createQueen,
  createEmpty,
} from './pieces.js';

export const isEmpty = (piece) => piece?.id === 'empty';

// getMoves functions aren't serialized when we save undo state
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
      return factory ? factory(piece.color, piece.hasMoved) : createEmpty();
    }),
  );
}

export function checkForCheck({ pieces, turn }) {
  const allMoves = [];
  let kingPosition = {};

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = pieces[y][x];
      if (piece.id === 'king' && piece.color !== turn) {
        kingPosition = { x, y };
      }
      if (piece.id !== 'empty' && piece.color === turn) {
        allMoves.push(piece.getMoves({ pieces, x, y }));
      }
    }
  }

  console.log('allMoves', allMoves.flat());
  console.log('kingPosition', kingPosition);

  return allMoves
    .flat()
    .some((move) => move.x === kingPosition.x && move.y === kingPosition.y);
}

export function promote(color) {
  const selection = prompt('Which would you like to promote to? Q, R, N, B');
  switch (selection.toUpperCase()) {
    case 'Q':
      return createQueen(color);
    case 'R':
      return createRook(color);
    case 'N':
      return createKnight(color);
    case 'B':
      return createBishop(color);
    default:
      return promote(color);
  }
}

export function castle({ pieces, x, y }) {
  const piece = pieces[y][x];
  if (piece.color === BLACK) {
    if (x === 6) {
      const newRook = pieces[7][7];
      newRook.hasMoved = true;
      pieces[7][5] = newRook;
      pieces[7][7] = createEmpty();
    } else if (x === 2) {
      const newRook = pieces[7][0];
      newRook.hasMoved = true;
      pieces[7][3] = newRook;
      pieces[7][0] = createEmpty();
    }
  } else if (piece.color === WHITE) {
    if (x === 2) {
      const newRook = pieces[0][0];
      newRook.hasMoved = true;
      pieces[0][3] = newRook;
      pieces[0][0] = createEmpty();
    } else if (x === 6) {
      const newRook = pieces[0][7];
      newRook.hasMoved = true;
      pieces[0][5] = newRook;
      pieces[0][7] = createEmpty();
    }
  }
}
