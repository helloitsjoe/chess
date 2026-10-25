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
  const kingXShort = undo ? 4 : 6;
  const kingXLong = undo ? 4 : 2;
  const rookXShort = undo ? 7 : 5;
  const rookXLong = undo ? 0 : 3;
  const emptyX = undo ? 5 : 7;

  const newRook = createRook(piece.color);
  newRook.hasMoved = !undo;

  if (x === kingXShort) {
    pieces[y][rookXShort] = newRook;
  } else if (x === kingXLong) {
    pieces[y][rookXLong] = newRook;
  }
  pieces[y][emptyX] = createEmpty();
}

export function enPassant() {
  //
}
