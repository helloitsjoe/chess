import { isEmpty } from './utils.js';
import { BOARD_SIZE, WHITE } from './constants.js';

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
export const createEmpty = () => ({ id: 'empty' });

export const createPawn = (color = WHITE) => ({
  id: 'pawn',
  color,
  getMoves({ pieces, x, y }) {
    const direction = color === WHITE ? 1 : -1;
    const startY = color === WHITE ? 1 : 6;
    const newY = y + 1 * direction;
    const newYStart = y + 2 * direction;

    const moves = [];

    // If a piece is not directly in front of the pawn, it can move
    // If the pawn is not in its starting position, it can move one square
    if (isEmpty(pieces[newY]?.[x])) {
      moves.push({ x, y: newY });
      // If the pawn is in its starting position, it can move two squares
      if (y === startY && isEmpty(pieces[newYStart]?.[x])) {
        moves.push({ x, y: newYStart });
      }
    }
    // If a piece is diagonally in front of the pawn, it can take it
    // as long as the color is different
    const leftPiece = pieces[newY]?.[x + 1];
    const rightPiece = pieces[newY]?.[x - 1];
    if (!isEmpty(leftPiece) && leftPiece?.color !== color) {
      moves.push({ x: x + 1, y: newY });
    }
    if (!isEmpty(rightPiece) && rightPiece?.color !== color) {
      moves.push({ x: x - 1, y: newY });
    }

    return moves;
  },
});

export const createRook = (color = WHITE) => ({
  id: 'rook',
  color,
  getMoves: makeGetRookMoves(color),
});

export const createKnight = (color = WHITE) => ({
  id: 'knight',
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

export const createBishop = (color = WHITE) => ({
  id: 'bishop',
  color,
  getMoves: makeGetBishopMoves(color),
});

export const createKing = (color = WHITE) => ({
  id: 'king',
  color,
  hasMoved: false,
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
    ];

    // If no pieces between king and rook AND neither has moved yet, allow castle
    // if (!pieces[y][x].hasMoved) {

    // }

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

export const createQueen = (color = WHITE) => ({
  id: 'queen',
  color,
  getMoves({ pieces, x, y }) {
    return [
      ...makeGetBishopMoves(color)({ pieces, x, y }),
      ...makeGetRookMoves(color)({ pieces, x, y }),
    ];
  },
});
