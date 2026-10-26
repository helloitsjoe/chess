import { Pieces } from './constants.js';
import {
  createPawn,
  createRook,
  createKnight,
  createBishop,
  createKing,
  createQueen,
  createEmpty,
} from './pieces.js';
const { KING, PAWN, QUEEN, KNIGHT, BISHOP, ROOK, EMPTY } = Pieces;

export const factoryMap = {
  [PAWN]: createPawn,
  [ROOK]: createRook,
  [KNIGHT]: createKnight,
  [BISHOP]: createBishop,
  [KING]: createKing,
  [QUEEN]: createQueen,
  [EMPTY]: createEmpty,
};

// TODO: Consolidate this with getIsCheck. Can use pendingMove instead of new/old?
export function putsSelfInCheck({
  pieces: origPieces,
  turn,
  x: oldX,
  y: oldY,
  newX,
  newY,
}) {
  const pieces = [...origPieces.map((row) => [...row])];

  const movingPiece = pieces[oldY][oldX];
  pieces[newY][newX] = movingPiece;
  pieces[oldY][oldX] = createEmpty();

  const allMoves = [];
  let kingCoords = {};

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = pieces[y][x];
      if (piece.id === KING && piece.color === turn) {
        kingCoords = { x, y };
      }
      if (piece.id !== EMPTY && piece.color !== turn) {
        allMoves.push(...piece.getMoves({ pieces, x, y }));
      }
    }
  }

  const isCheck = allMoves.some(
    (move) => move.x === kingCoords.x && move.y === kingCoords.y,
  );

  return isCheck;
}

export function getIsCheck({ pieces: origPieces, turn }) {
  const pieces = [...origPieces.map((row) => [...row])];

  const allMoves = [];
  let kingCoords = {};

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = pieces[y][x];
      if (piece.id === KING && piece.color !== turn) {
        kingCoords = { x, y };
      }
      if (piece.id !== EMPTY && piece.color === turn) {
        allMoves.push(...piece.getMoves({ pieces, x, y }));
      }
    }
  }

  const isCheck = allMoves.some(
    (move) => move.x === kingCoords.x && move.y === kingCoords.y,
  );

  return { ...kingCoords, isCheck };
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
  const undo = x === 4;
  const piece = pieces[y][x];
  const kingXShort = 6;
  const kingXLong = 2;
  const emptyKing = undo ? 5 : 4; // This should account for long too?

  const newRook = createRook(piece.color);
  newRook.hasMoved = !undo;

  // TODO: Clean this up
  const undoShort = pieces[y][5].id === ROOK;
  const undoLong = pieces[y][3].id === ROOK;

  if (x === kingXShort || undoShort) {
    const rookX = undo ? 7 : 5;
    const emptyRook = undo ? 5 : 7;
    pieces[y][rookX] = newRook;
    pieces[y][emptyRook] = createEmpty();
  } else if (x === kingXLong || undoLong) {
    const rookX = undo ? 0 : 3;
    const emptyRook = undo ? 3 : 0;
    pieces[y][rookX] = newRook;
    pieces[y][emptyRook] = createEmpty();
  }
  pieces[y][emptyKing] = createEmpty();
}

export function enPassant() {
  //
}
