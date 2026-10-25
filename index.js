import {
  WHITE,
  BLACK,
  BOARD_SIZE,
  Type,
  Pieces,
  HISTORY_DELIMITER,
} from './constants.js';
import { update } from './game.js';
import { save, undo, redo, createGame } from './utils.js';
import { sprites } from './sprites.js';

// TODO:
// Check for checkmate
// Check for stalemate
// En passant
// Drag-n-drop

window.addEventListener('keydown', (e) => {
  if (e.key === 'u') draw(undo(game));
});

document.getElementById('undo-button').onclick = () => draw(undo(game));
document.getElementById('redo-button').onclick = () => draw(redo(game));
document.getElementById('save-button').onclick = () => save(game);

document.getElementById('load-button').onclick = () => {
  const historyStr = localStorage.getItem('chess-history');
  game = createGame(historyStr.split(HISTORY_DELIMITER));

  draw(game);
};

document.getElementById('export-button').onclick = () => {
  const historyStr = game.history.toString();
  const response = confirm(`Copy history to clipboard? ${historyStr}`);
  if (response) {
    navigator.clipboard.writeText(historyStr);
  }
};

document.getElementById('import-button').onclick = () => {
  const historyStr = prompt('Enter an exported game history:');
  game = createGame(historyStr.split(HISTORY_DELIMITER));
  draw(game);
};

const showHintsInput = document.getElementById('show-hints');
const lockCheckInput = document.getElementById('lock-check');
const autoSaveInput = document.getElementById('autosave');

showHintsInput.onchange = (e) => {
  showHints = !showHints;
  e.target.checked = showHints;
  draw(game);
};

lockCheckInput.onchange = (e) => {
  lockCheck = !lockCheck;
  e.target.checked = lockCheck;
  draw(game);
};

autoSaveInput.onchange = (e) => {
  autoSave = !autoSave;
  e.target.checked = autoSave;
  draw(game);
};

let showHints = showHintsInput.checked;
let lockCheck = lockCheckInput.checked;
let autoSave = autoSaveInput.checked;

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
        if (sq.id !== Pieces.EMPTY) {
          pieceEl.innerHTML = sprites[sq.color][sq.id];
        }

        if (showHints) {
          if (sq.id === Pieces.KING) {
            if (sq.inCheck && sq.color === game.turn) {
              pieceEl.classList.add('bad-move');
            } else {
              pieceEl.classList.remove('show-move');
            }
          }

          if (sq.pendingMove) {
            const className =
              sq.pendingMove.type === Type.SELF_CHECK
                ? 'bad-move'
                : 'show-move';
            pieceEl.classList.add(className);
          } else {
            pieceEl.classList.remove('show-move');
          }
        }

        // TODO: Don't replace this click handler on every draw
        pieceEl.onclick = () => {
          game = update({ game, sq, x, y }, { autoSave, lockCheck });
          draw(game);
        };
      }
      rowContainer.appendChild(pieceEl);
    });
    piecesContainer.appendChild(rowContainer);
  });

  return piecesContainer;
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

document.getElementById('board-root').appendChild(createBoard(board));

let game = createGame();
draw(game);
