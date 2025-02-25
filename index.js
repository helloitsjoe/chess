import { WHITE, BLACK, BOARD_SIZE } from './constants.js';
import { checkForCheck, isEmpty, rehydrate, promote, castle } from './utils.js';
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
// Disallow move to check
// Check for checkmate
// Check for stalemate?
// Blocked squares red?
// Specialty moves (castling, en passant)
// Drag-n-drop

let showHints = true;

function undo() {
  const previous = game.history.getLastMove();
  if (!previous) return;
  game.turn = game.turn === WHITE ? BLACK : WHITE;
  const { pieces: previousPieces, takenPiece } = previous;
  if (!isEmpty(takenPiece)) {
    const { color, id } = takenPiece;
    if (color === WHITE) {
      game.blackTaken[id]--;
    } else {
      game.whiteTaken[id]--;
    }
  }
  game.pieces = previousPieces;
  draw(game);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'u') undo();
});

document.getElementById('undo-button').onclick = undo;

document.getElementById('save-button').onclick = () => {
  localStorage.setItem('chess', JSON.stringify(game));
};

document.getElementById('load-button').onclick = () => {
  game = JSON.parse(localStorage.getItem('chess'));
  game.pieces = rehydrate(game.pieces);
  draw(game);
};

document.getElementById('show-hints').onchange = (e) => {
  showHints = !showHints;
  e.target.checked = showHints;
  draw(game);
};

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

function drawPieces({ pieces }) {
  document.getElementById('turn').innerText =
    game.turn === WHITE ? "White's move" : "Black's move";

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

        if (showHints) {
          if (sq.pendingMove) {
            pieceEl.classList.add('show-move');
          } else {
            pieceEl.classList.remove('show-move');
          }
        }

        // TODO: Don't replace this click handler on every draw
        pieceEl.onclick = () => {
          update({ game, sq, x, y });
          draw(game);
        };
      }
      rowContainer.appendChild(pieceEl);
    });
    piecesContainer.appendChild(rowContainer);
  });

  return piecesContainer;
}

function update({ game, sq, x, y }) {
  const { pieces, whiteTaken, blackTaken, turn, history } = game;
  if (sq.pendingMove) {
    // Move piece
    const { x: oldX, y: oldY, type } = sq.pendingMove;
    const oldPiece = pieces[oldY][oldX];
    const newPiece = type === 'promote' ? promote(oldPiece.color) : oldPiece;

    clearMoves(pieces);

    // TODO: Move this into getMoves?
    const pieceToTake = pieces[y][x];
    if (!isEmpty(pieceToTake)) {
      if (pieceToTake.color === WHITE) {
        blackTaken[pieceToTake.id] = (blackTaken[pieceToTake.id] || 0) + 1;
      } else {
        whiteTaken[pieceToTake.id] = (whiteTaken[pieceToTake.id] || 0) + 1;
      }
    }

    history.push(pieces, pieceToTake);

    newPiece.hasMoved = true;

    // Make move
    pieces[y][x] = newPiece;
    pieces[y][x].hasMoved = true;
    pieces[oldY][oldX] = createEmpty();

    if (type === 'castle') {
      castle({ pieces, x, y });
    }

    if (checkForCheck({ pieces, turn })) {
      console.log('Check!');
    }

    game.turn = turn === WHITE ? BLACK : WHITE;
  } else {
    // TODO: Make it impossible to put yourself in check
    clearMoves(pieces);
    if (sq.color === turn) {
      const moveOptions = sq?.getMoves ? sq.getMoves({ pieces, x, y }) : [];
      for (const { x: newX, y: newY, type } of moveOptions) {
        if (newX >= 0 && newY >= 0 && newX < BOARD_SIZE && newY < BOARD_SIZE) {
          pieces[newY][newX].pendingMove = { x, y, type };
        }
      }
    }
  }

  game = { ...game, pieces, whiteTaken, blackTaken, history };
}

function draw(game) {
  // Loop over pieces and draw them in their coordinates
  const piecesRoot = document.getElementById('pieces-root');
  const whiteTakenBox = document.getElementById('white-taken');
  const blackTakenBox = document.getElementById('black-taken');

  piecesRoot.innerHTML = '';
  piecesRoot.appendChild(drawPieces(game));

  whiteTakenBox.innerHTML = '';
  blackTakenBox.innerHTML = '';

  const { whiteTaken, blackTaken } = game;

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

const board = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => null),
);

let game = {
  pieces: [
    [
      createRook(),
      createKnight(),
      createBishop(),
      createQueen(),
      createKing(),
      createBishop(),
      createKnight(),
      createRook(),
    ],
    Array.from({ length: BOARD_SIZE }, () => createPawn()),
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
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
  ],
  whiteTaken: {},
  blackTaken: {},
  history: createHistory(),
  turn: BLACK,
};

document.getElementById('board-root').appendChild(createBoard(board));

draw(game);
