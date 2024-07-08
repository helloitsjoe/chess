/**
 * @typedef Piece
 * @property {string} id
 * @property {string} image
 * @property {Array<Move>} moves
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
 * @typedef PieceMap
 * @property {Piece} pawn
 * @property {Piece} rook
 * @property {Piece} knight
 * @property {Piece} bishop
 * @property {Piece} queen
 * @property {Piece} king
 */

const WHITE = "#f5f5f5";
const BLACK = "#040404";
const BOARD_SIZE = 8;

/**
 * @param {Piece} piece
 * @returns {boolean}
 */
const isEmpty = (piece = {}) => piece.type === "empty";

const createEmpty = () => ({ type: "empty" });
const createPawn = (color = WHITE) => ({
  id: "pawn",
  image: "P",
  color,
  getMoves({ pieces, x, y }) {
    const moves = [];

    // If a piece is not directly in front of the pawn, it can move
    // If the pawn is not in its starting position, it can move one square
    if (isEmpty(pieces[y + 1][x])) {
      moves.push({ x, y: y + 1 });
      // If the pawn is in its starting position, it can move two squares
      if (y === 1 && isEmpty(pieces[y + 2][x])) {
        moves.push({ x, y: y + 2 });
      }
    }
    // If a piece is diagonally in front of the pawn, it can take it
    if (!isEmpty(pieces[y + 1][x + 1])) {
      moves.push({ x: x + 1, y: y + 1 });
    }
    if (!isEmpty(pieces[y + 1][x - 1])) {
      moves.push({ x: x - 1, y: y + 1 });
    }

    return moves;
  },
  onClick({ pieces, x, y }) {
    clearMoves(pieces);
    const moveOptions = this.getMoves({ pieces, x, y });
    for (const { x: newX, y: newY } of moveOptions) {
      if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
        if (isEmpty(pieces[newY][newX])) {
          console.log("empty square");
        } else {
          console.log("take piece");
        }
        pieces[newY][newX].showMove = true;
      }
    }
    render(pieces);
  },
});
const createRook = (color = WHITE) => ({
  id: "rook",
  image: "R",
  moves: [],
  color,
  onClick() {},
});
const createKnight = (color = WHITE) => ({
  id: "knight",
  image: "H",
  moves: [],
  color,
  onClick() {},
});
const createBishop = (color = WHITE) => ({
  id: "bishop",
  image: "B",
  moves: [],
  color,
  onClick() {},
});
const createKing = (color = WHITE) => ({
  id: "king",
  image: "K",
  moves: [],
  color,
  onClick() {},
});
const createQueen = (color = WHITE) => ({
  id: "queen",
  image: "Q",
  moves: [],
  color,
  onClick() {},
});

function createBoard(board) {
  const boardDiv = document.createElement("div");
  boardDiv.classList.add("board");
  board.forEach((row, y) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    row.forEach((sq, x) => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      if ((x % 2 && y % 2 === 0) || (x % 2 === 0 && y % 2)) {
        squareDiv.classList.add("black");
      } else {
        squareDiv.classList.add("white");
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
      // TODO: Bring back the piece that was there
      // if (!isEmpty(pieces[i][j])) {
      //   if (pieces[i][j].showMove) {
      pieces[i][j].showMove = false;
      // }
      // }
    }
  }
}

function renderPieces(pieces) {
  const piecesContainer = document.createElement("div");
  piecesContainer.classList.add("pieces");
  pieces.forEach((row, y) => {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    row.forEach((sq, x) => {
      const pieceEl = document.createElement("div");
      pieceEl.classList.add("square", "piece");
      if (sq) {
        pieceEl.textContent = sq.image;
        if (sq.color === BLACK) {
          pieceEl.classList.add("piece-black");
        } else {
          pieceEl.classList.add("piece-white");
        }

        if (sq.showMove) {
          pieceEl.classList.add("show-move");
        } else {
          pieceEl.classList.remove("show-move");
        }

        pieceEl.onclick = () => {
          console.log("pieceEl clicked");
          sq.onClick({ pieces, x, y });
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
function render(pieces /* , moves */) {
  // Loop over pieces and render them in their coordinates
  const piecesRoot = document.getElementById("pieces-root");
  // const movesRoot = document.getElementById("moves-root");
  piecesRoot.innerHTML = "";
  // movesRoot.innerHTML = "";
  piecesRoot.appendChild(renderPieces(pieces));
  // TODO: Why are the moves not showing?
  // movesRoot.appendChild(createMoves(moves));
}

/** @type Board */
const board = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => null),
);

// const moves = Array.from({ length: BOARD_SIZE }, () =>
//   Array.from({ length: BOARD_SIZE }, () => ({type: 'empty'})),
// );

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

pieces[2][3] = createPawn(BLACK);

// Add images

// When a piece is clicked, highlight its possible moves
// When a piece is dragged, highlight its possible moves
// When a move is clicked, move piece and rerender
// When a piece is dropped, move piece and rerender

// Take another piece when you land on it

// const whiteTaken = {};
// const blackTaken = {};

document.getElementById("board-root").appendChild(createBoard(board));

render(pieces);
