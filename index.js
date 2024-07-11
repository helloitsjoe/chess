import { WHITE, BLACK, BOARD_SIZE } from './constants.js';
import { isEmpty } from './utils.js';
import { sprites } from './sprites.js';
import {
  createPawn,
  createRook,
  createKnight,
  createBishop,
  createKing,
  createQueen,
  createEmpty,
} from './pieces.js';

// TODO:
// Check for check
// Check for checkmate
// Move taken pieces to the side
// Specialty moves (castling, en passant)
// Drag-n-drop

/**
 * @typedef Piece
 * @property {string} id
 * @property {string} color
 * @property {Function} getMoves
 */

/**
 * @typedef Move
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Board {Array<Piece | null>}
 */

/**
 * @param {Piece} piece
 * @returns {boolean}
 */

const whiteTaken = {};
const blackTaken = {};

const history = [];

document.getElementById('undo').onclick = () => {
  if (history.length) {
    const { pieces } = history.pop();
    render(rehydrate(pieces));
  }
};

let turn = BLACK;

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

function createBoard(board) {
  const boardDiv = document.createElement('div');
  boardDiv.classList.add('board');
  board.forEach((row, y) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach((sq, x) => {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square');
      if ((x % 2 && y % 2 === 0) || (x % 2 === 0 && y % 2)) {
        squareDiv.classList.add('dark');
      } else {
        squareDiv.classList.add('white');
      }
      rowDiv.appendChild(squareDiv);
    });
    boardDiv.appendChild(rowDiv);
  });

  return boardDiv;
}

function clearMoves(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const row = pieces[i];
    for (let j = 0; j < row.length; j++) {
      pieces[i][j].pendingMove = null;
    }
  }
}

function renderPieces(pieces) {
  document.getElementById('turn').innerText =
    turn === WHITE ? "White's move" : "Black's move";

  const piecesContainer = document.createElement('div');
  piecesContainer.classList.add('pieces');
  pieces.forEach((row, y) => {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('row');
    row.forEach((sq, x) => {
      const pieceEl = document.createElement('div');
      pieceEl.classList.add('square', 'piece');
      if (sq) {
        if (sq.id !== 'empty') {
          pieceEl.innerHTML = sprites[sq.color][sq.id];
        }

        if (sq.pendingMove) {
          pieceEl.classList.add('show-move');
        } else {
          pieceEl.classList.remove('show-move');
        }

        // TODO: Don't replace this click handler on every render
        pieceEl.onclick = () => {
          if (sq.pendingMove) {
            // Move piece
            const { x: oldX, y: oldY } = sq.pendingMove;
            clearMoves(pieces);

            // TODO: Move this into getMoves?
            // TODO: Handle getting pieces back
            const pieceToTake = pieces[y][x];
            if (!isEmpty(pieceToTake)) {
              if (pieceToTake.color === WHITE) {
                whiteTaken[pieceToTake.id] =
                  (whiteTaken[pieceToTake.id] || 0) + 1;
              } else {
                blackTaken[pieceToTake.id] =
                  (blackTaken[pieceToTake.id] || 0) + 1;
              }
            }

            // TODO: Optimize this by only saving the pieces that have changed
            history.push({ pieces: JSON.parse(JSON.stringify(pieces)) });

            // Make move
            pieces[y][x] = pieces[oldY][oldX];
            pieces[oldY][oldX] = createEmpty();

            turn = turn === WHITE ? BLACK : WHITE;
          } else {
            clearMoves(pieces);
            if (sq.color === turn) {
              const moveOptions = sq?.getMoves
                ? sq.getMoves({ pieces, x, y })
                : [];
              for (const { x: newX, y: newY } of moveOptions) {
                if (
                  newX >= 0 &&
                  newY >= 0 &&
                  newX < BOARD_SIZE &&
                  newY < BOARD_SIZE
                ) {
                  pieces[newY][newX].pendingMove = { x, y };
                }
              }
            }
          }
          render(pieces);
        };
      }
      rowContainer.appendChild(pieceEl);
    });
    piecesContainer.appendChild(rowContainer);
  });

  return piecesContainer;
}

/**
 * @param {Array<Array<Piece | null>>} pieces
 * @param {Array<Array<Move | null>>} moves
 */
function render(pieces) {
  // Loop over pieces and render them in their coordinates
  const piecesRoot = document.getElementById('pieces-root');
  // const whiteTakenBox = document.getElementById('white-taken');
  // const blackTakenBox = document.getElementById('black-taken');
  piecesRoot.innerHTML = '';
  piecesRoot.appendChild(renderPieces(pieces));
}

/** @type Board */
const board = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => null),
);

const pieces = [
  [
    createRook(),
    createKnight(),
    createBishop(),
    createKing(),
    createQueen(),
    createBishop(),
    createKnight(),
    createRook(),
  ],
  [
    createPawn(),
    createPawn(),
    createPawn(),
    createPawn(),
    createPawn(),
    createPawn(),
    createPawn(),
    createPawn(),
  ],
  Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  [
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
    createPawn(BLACK),
  ],
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

document.getElementById('board-root').appendChild(createBoard(board));

render(pieces);
