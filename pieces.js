import { isEmpty } from './utils.js';
import { BLACK, BOARD_SIZE, WHITE, Type, Pieces } from './constants.js';

const { EMPTY, KING, QUEEN, ROOK, PAWN, KNIGHT, BISHOP } = Pieces;

// TODO: Check for check/checkmate before allowing move
function makeGetRookMoves(color) {
  return ({ pieces, x, y }) => {
    const moves = [];

    for (let i = x + 1; i < BOARD_SIZE; i++) {
      if (isEmpty(pieces[y][i])) {
        moves.push({ x: i, y });
      } else {
        if (pieces[y][i].color !== color) {
          moves.push({ x: i, y });
        }
        break;
      }
    }

    for (let i = x - 1; i >= 0; i--) {
      if (isEmpty(pieces[y][i])) {
        moves.push({ x: i, y });
      } else {
        if (pieces[y][i].color !== color) {
          moves.push({ x: i, y });
        }
        break;
      }
    }

    for (let i = y + 1; i < BOARD_SIZE; i++) {
      if (isEmpty(pieces[i][x])) {
        moves.push({ x, y: i });
      } else {
        if (pieces[i][x].color !== color) {
          moves.push({ x, y: i });
        }
        break;
      }
    }

    for (let i = y - 1; i >= 0; i--) {
      if (isEmpty(pieces[i][x])) {
        moves.push({ x, y: i });
      } else {
        if (pieces[i][x].color !== color) {
          moves.push({ x, y: i });
        }
        break;
      }
    }

    return moves;
  };
}

function makeGetBishopMoves(color) {
  return ({ pieces, x, y }) => {
    const moves = [];

    // TODO: Try to DRY this up
    for (let i = 1; i < BOARD_SIZE; i++) {
      const newY = y + i;
      const newX = x + i;

      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;

      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY });
        }
        break;
      }
    }

    for (let i = 1; i < BOARD_SIZE; i++) {
      const newY = y - i;
      const newX = x - i;
      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;
      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY });
        }
        break;
      }
    }

    for (let i = 1; i < BOARD_SIZE; i++) {
      const newY = y - i;
      const newX = x + i;
      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;
      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY });
        }
        break;
      }
    }

    for (let i = 1; i < BOARD_SIZE; i++) {
      const newY = y + i;
      const newX = x - i;
      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;
      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY });
        }
        break;
      }
    }

    return moves;
  };
}

// Pieces
export const createEmpty = () => ({ id: EMPTY });

export const createPawn = (color) => ({
  id: PAWN,
  color,
  getMoves({ pieces, x, y }) {
    const direction = color === WHITE ? 1 : -1;
    const startY = color === WHITE ? 1 : 6;
    const newY = y + 1 * direction;
    const newYStart = y + 2 * direction;
    const canPromote = color === BLACK ? newY === 0 : newY === BOARD_SIZE - 1;
    const type = canPromote ? Type.PROMOTE : Type.NORMAL;

    const moves = [];

    // If a piece is not directly in front of the pawn, it can move
    // If the pawn is not in its starting position, it can move one square
    if (isEmpty(pieces[newY]?.[x])) {
      moves.push({ x, y: newY, type });
      // If the pawn is in its starting position, it can move two squares
      if (y === startY && isEmpty(pieces[newYStart]?.[x])) {
        moves.push({ x, y: newYStart, type });
      }
    }
    // If a piece is diagonally in front of the pawn, it can take it
    // as long as the color is different
    const leftPiece = pieces[newY]?.[x + 1];
    const rightPiece = pieces[newY]?.[x - 1];
    if (leftPiece && !isEmpty(leftPiece) && leftPiece.color !== color) {
      moves.push({ x: x + 1, y: newY, type });
    }
    if (rightPiece && !isEmpty(rightPiece) && rightPiece.color !== color) {
      moves.push({ x: x - 1, y: newY, type });
    }

    return moves;
  },
});

export const createRook = (color, hasMoved = false) => ({
  id: ROOK,
  color,
  hasMoved,
  getMoves: makeGetRookMoves(color),
});

export const createKnight = (color) => ({
  id: KNIGHT,
  color,
  getMoves({ pieces, x, y }) {
    const moves = [];
    const allMoves = [
      { x: x + 1, y: y + 2 },
      { x: x + 2, y: y + 1 },
      { x: x + 2, y: y - 1 },
      { x: x + 1, y: y - 2 },
      { x: x - 1, y: y - 2 },
      { x: x - 2, y: y - 1 },
      { x: x - 2, y: y + 1 },
      { x: x - 1, y: y + 2 },
    ];

    for (const { x: newX, y: newY } of allMoves) {
      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;
      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY });
        }
      }
    }

    return moves;
  },
});

export const createBishop = (color) => ({
  id: BISHOP,
  color,
  getMoves: makeGetBishopMoves(color),
});

export const createKing = (color, hasMoved = false) => ({
  id: KING,
  color,
  hasMoved,
  inCheck: false,
  getMoves({ pieces, x, y }) {
    const moves = [];

    const allMoves = [
      { x, y: y + 1 },
      { x, y: y - 1 },
      { x: x + 1, y },
      { x: x - 1, y },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
    ].map((m) => ({ ...m, type: Type.NORMAL }));

    // If no pieces between king and rook AND neither has moved yet, allow castle
    if (!this.hasMoved) {
      if (color === BLACK) {
        if (x === 4 && y === BOARD_SIZE - 1) {
          const kingsRook = pieces[BOARD_SIZE - 1][BOARD_SIZE - 1];
          const queensRook = pieces[BOARD_SIZE - 1][0];
          if (kingsRook.id === ROOK && !kingsRook.hasMoved) {
            allMoves.push({ x: x + 2, y, type: Type.CASTLE });
          }
          if (queensRook.id === ROOK && !queensRook.hasMoved) {
            allMoves.push({ x: x - 2, y, type: Type.CASTLE });
          }
        }
      } else {
        if (x === 4 && y === 0) {
          const kingsRook = pieces[0][0];
          const queensRook = pieces[0][BOARD_SIZE - 1];
          if (kingsRook.id === ROOK && !kingsRook.hasMoved) {
            allMoves.push({ x: x - 2, y, type: Type.CASTLE });
          }
          if (queensRook.id === ROOK && !queensRook.hasMoved) {
            allMoves.push({ x: x + 2, y, type: Type.CASTLE });
          }
        }
      }
    }

    for (const { x: newX, y: newY, type } of allMoves) {
      const newMove = pieces[newY]?.[newX];
      if (!newMove) continue;
      if (isEmpty(newMove)) {
        moves.push({ x: newX, y: newY, type });
      } else {
        if (newMove.color !== color) {
          moves.push({ x: newX, y: newY, type });
        }
      }
    }

    return moves;
  },
});

export const createQueen = (color) => ({
  id: QUEEN,
  color,
  getMoves({ pieces, x, y }) {
    return [
      ...makeGetBishopMoves(color)({ pieces, x, y }),
      ...makeGetRookMoves(color)({ pieces, x, y }),
    ];
  },
});

export function createPieces() {
  return [
    [
      createRook(WHITE),
      createKnight(WHITE),
      createBishop(WHITE),
      createQueen(WHITE),
      createKing(WHITE),
      createBishop(WHITE),
      createKnight(WHITE),
      createRook(WHITE),
    ],
    Array.from({ length: BOARD_SIZE }, () => createPawn(WHITE)),
    Array.from({ length: BOARD_SIZE }, () => createEmpty(WHITE)),
    Array.from({ length: BOARD_SIZE }, () => createEmpty(WHITE)),
    Array.from({ length: BOARD_SIZE }, () => createEmpty(WHITE)),
    Array.from({ length: BOARD_SIZE }, () => createEmpty(WHITE)),
    Array.from({ length: BOARD_SIZE }, () => createPawn(BLACK)),
    [
      createRook(BLACK),
      createKnight(BLACK),
      createBishop(BLACK),
      createQueen(BLACK),
      createKing(BLACK),
      createBishop(BLACK),
      createKnight(BLACK),
      createRook(BLACK),
    ],
  ];
}
