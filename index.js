import { WHITE, BLACK, BOARD_SIZE } from './constants.js';
import { isEmpty, rehydrate } from './utils.js';
import { sprites } from './sprites.js';
import { createHistory } from './history.js';
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

const history = createHistory();

document.getElementById('undo-button').onclick = () => {
  const previous = history.getLastMove();
  if (!previous) return;
  turn = turn === WHITE ? BLACK : WHITE;
  const { pieces: previousPieces, takenPiece } = previous;
  if (!isEmpty(takenPiece)) {
    const { color, id } = takenPiece;
    if (color === WHITE) {
      blackTaken[id]--;
    } else {
      whiteTaken[id]--;
    }
  }
  draw(previousPieces, whiteTaken, blackTaken);
};

document.getElementById('save-button').onclick = () => {
  // TODO: Need to get whiteTaken and blackTaken
  localStorage.setItem(
    'chess',
    JSON.stringify({ pieces, whiteTaken, blackTaken }),
  );
};

document.getElementById('load-button').onclick = () => {
  const { pieces, whiteTaken, blackTaken } = JSON.parse(
    localStorage.getItem('chess'),
  );
  console.log('pieces', pieces);
  draw(rehydrate(pieces), whiteTaken, blackTaken);
};

let turn = BLACK;

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

// TODO: Shouldn't need to pass in taken pieces
function drawPieces(pieces, whiteTaken, blackTaken) {
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

        // TODO: Don't replace this click handler on every draw
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
                blackTaken[pieceToTake.id] =
                  (blackTaken[pieceToTake.id] || 0) + 1;
              } else {
                whiteTaken[pieceToTake.id] =
                  (whiteTaken[pieceToTake.id] || 0) + 1;
              }
            }

            history.push(pieces, pieceToTake);

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
          draw(pieces, whiteTaken, blackTaken);
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
function draw(pieces, whiteTaken, blackTaken) {
  // Loop over pieces and draw them in their coordinates
  const piecesRoot = document.getElementById('pieces-root');
  const whiteTakenBox = document.getElementById('white-taken');
  const blackTakenBox = document.getElementById('black-taken');

  piecesRoot.innerHTML = '';
  piecesRoot.appendChild(drawPieces(pieces, whiteTaken, blackTaken));

  whiteTakenBox.innerHTML = '';
  blackTakenBox.innerHTML = '';

  Object.entries(whiteTaken).forEach(([piece, count]) => {
    for (let i = 0; i < count; i++) {
      const pieceEl = document.createElement('div');
      pieceEl.innerHTML = sprites[BLACK][piece];
      whiteTakenBox.appendChild(pieceEl);
    }
  });

  Object.entries(blackTaken).forEach(([piece, count]) => {
    for (let i = 0; i < count; i++) {
      const pieceEl = document.createElement('div');
      pieceEl.innerHTML = sprites[WHITE][piece];
      blackTakenBox.appendChild(pieceEl);
    }
  });
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

draw(pieces, whiteTaken, blackTaken);
