import { WHITE, BLACK, BOARD_SIZE, Pieces } from './constants.js';
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

export const isEmpty = (piece) => piece?.id === EMPTY;

const ROWS = 'abcdefgh';

export function getNotation(pieces, moveFrom, moveTo) {
  const moveFromRank = moveFrom.y + 1;
  const moveFromRow = ROWS[moveFrom.x];
  const moveToRank = moveTo.y + 1;
  const moveToRow = ROWS[moveTo.x];
  const piece = pieces[moveFrom.y][moveFrom.x];
  const taken = pieces[moveTo.y][moveTo.x];

  return `${piece.id}${moveFromRow}${moveFromRank}${!isEmpty(taken) ? 'x' + taken.id : ''}${moveToRow}${moveToRank}`;
}

// getMoves functions aren't serialized when we save undo state
export function rehydrate(pieces) {
  const factoryMap = {
    [PAWN]: createPawn,
    [ROOK]: createRook,
    [KNIGHT]: createKnight,
    [BISHOP]: createBishop,
    [KING]: createKing,
    [QUEEN]: createQueen,
  };

  return pieces.map((row) =>
    row.map((piece) => {
      const factory = factoryMap[piece.id];
      return factory ? factory(piece.color, piece.hasMoved) : createEmpty();
    }),
  );
}

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

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  );
}
