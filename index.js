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

const createPawn = (color = WHITE) => ({
  id: "pawn",
  image: "P",
  moves: [],
  color,
  onclick: () => {
    console.log("Clicked the pawn!");
  },
});
const createRook = (color = WHITE) => ({
  id: "rook",
  image: "R",
  moves: [],
  color,
});
const createKnight = (color = WHITE) => ({
  id: "knight",
  image: "H",
  moves: [],
  color,
});
const createBishop = (color = WHITE) => ({
  id: "bishop",
  image: "B",
  moves: [],
  color,
});
const createKing = (color = WHITE) => ({
  id: "king",
  image: "K",
  moves: [],
  color,
});
const createQueen = (color = WHITE) => ({
  id: "queen",
  image: "Q",
  moves: [],
  color,
});

const BOARD_SIZE = 8;
const SQUARE_SIZE = 50;

/** @type Board */
const board = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => null),
);

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

function createPieces(pieces) {
  const piecesDiv = document.createElement("div");
  piecesDiv.classList.add("pieces");
  pieces.forEach((row, y) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    row.forEach((sq, x) => {
      const pieceDiv = document.createElement("div");
      pieceDiv.classList.add("square", "piece");
      if (sq) {
        pieceDiv.textContent = sq.image;
        if (sq.color === BLACK) {
          pieceDiv.classList.add("piece-black");
        } else {
          pieceDiv.classList.add("piece-white");
        }

        if (sq.onclick) {
          pieceDiv.onclick = sq.onclick;
        }
      }
      rowDiv.appendChild(pieceDiv);
    });
    piecesDiv.appendChild(rowDiv);
  });

  return piecesDiv;
}

function render() {
  // Loop over pieces and render them in their coordinates
}

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
  Array.from({ length: BOARD_SIZE }, () => null),
  Array.from({ length: BOARD_SIZE }, () => null),
  Array.from({ length: BOARD_SIZE }, () => null),
  Array.from({ length: BOARD_SIZE }, () => null),
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

// When a piece is clicked, highlight its possible moves
// When a piece is dragged, highlight its possible moves
// When a move is clicked, move piece and rerender
// When a piece is dropped, move piece and rerender

// Take another piece when you land on it

const whiteTaken = {};
const blackTaken = {};

document.getElementById("root").appendChild(createBoard(board));
document.getElementById("root").appendChild(createPieces(pieces));
