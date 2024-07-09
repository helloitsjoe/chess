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

const WHITE = '#f5f5f5';
const BLACK = '#040404';
const BOARD_SIZE = 8;

const whiteTaken = {};
const blackTaken = {};

const files = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];

const whiteSvgs = await Promise.all(
  files.map((file) =>
    fetch(`./assets/white-${file}.svg`).then((res) => res.text()),
  ),
);

const blackSvgs = await Promise.all(
  files.map((file) =>
    fetch(`./assets/black-${file}.svg`).then((res) => res.text()),
  ),
);

const sprites = { [WHITE]: {}, [BLACK]: {} };

for (let i = 0; i < files.length; i++) {
  sprites[WHITE][files[i]] = whiteSvgs[i];
  sprites[BLACK][files[i]] = blackSvgs[i];
}

const isEmpty = (piece) => piece.id === 'empty';

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

const createEmpty = () => ({ id: 'empty' });
const createPawn = (color = WHITE) => ({
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
    if (isEmpty(pieces[newY][x])) {
      moves.push({ x, y: newY });
      // If the pawn is in its starting position, it can move two squares
      if (y === startY && isEmpty(pieces[newYStart][x])) {
        moves.push({ x, y: newYStart });
      }
    }
    // If a piece is diagonally in front of the pawn, it can take it
    // as long as the color is different
    const leftPiece = pieces[newY][x + 1];
    const rightPiece = pieces[newY][x - 1];
    if (leftPiece && !isEmpty(leftPiece) && leftPiece.color !== color) {
      moves.push({ x: x + 1, y: newY });
    }
    if (rightPiece && !isEmpty(rightPiece) && rightPiece.color !== color) {
      moves.push({ x: x - 1, y: newY });
    }

    return moves;
  },
});
const createRook = (color = WHITE) => ({
  id: 'rook',
  color,
  getMoves: makeGetRookMoves(color),
});
const createKnight = (color = WHITE) => ({
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
const createBishop = (color = WHITE) => ({
  id: 'bishop',
  color,
  getMoves: makeGetBishopMoves(color),
});
const createKing = (color = WHITE) => ({
  id: 'king',
  color,
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
const createQueen = (color = WHITE) => ({
  id: 'queen',
  color,
  getMoves({ pieces, x, y }) {
    return [
      ...makeGetBishopMoves(color)({ pieces, x, y }),
      ...makeGetRookMoves(color)({ pieces, x, y }),
    ];
  },
});

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
            pieces[y][x] = pieces[oldY][oldX];
            pieces[oldY][oldX] = createEmpty();
            clearMoves(pieces);
          } else {
            clearMoves(pieces);
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

// pieces[5][4] = createKing(WHITE);
// pieces[3][3] = createQueen(BLACK);
// pieces[3][6] = createRook(BLACK);
// pieces[3][5] = createBishop(BLACK);

// When a piece is dragged, highlight its possible moves
// When a piece is dropped, move piece and rerender

// Take another piece when you land on it

// Only allow one side to move at a time

document.getElementById('board-root').appendChild(createBoard(board));

render(pieces);
