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
  color,
  getMoves({ pieces, x, y }) {
    const moves = [];

    // If a piece is not directly in front of the pawn, it can move
    // If the pawn is not in its starting position, it can move one square
    if (pieces[y + 1][x] == null) {
      moves.push({ x, y: y + 1 });
    }
    // If the pawn is in its starting position, it can move two squares
    if (y === 1 && pieces[y + 2][x] == null) {
      moves.push({ x, y: y + 2 });
    }
    // If a piece is diagonally in front of the pawn, it can take it
    if (pieces[y + 1][x + 1] != null) {
      moves.push({ x: x + 1, y: y + 1 });
    }
    if (pieces[y + 1][x - 1] != null) {
      moves.push({ x: x - 1, y: y + 1 });
    }

    return moves;
  },
  makeOnClick({ pieces, x, y }) {
    return () => {
      console.log("x, y", x, y);
      for (const move of this.getMoves({ pieces, x, y })) {
        const newX = move.x;
        const newY = move.y;
        if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
          console.log("newX", newX);
          console.log("newY", newY);
          // console.log("pieces[newY][newX]", pieces[newY][newX]);
          if (pieces[newY][newX] === null) {
            console.log("empty square");
          } else {
            console.log("take piece");
          }
          pieces[newY][newX] = { image: "." };
        }
      }
      // for (let i = 0; i < BOARD_SIZE; i++) {
      //   for (let j = 0; j < BOARD_SIZE; j++) {
      //     if (i === 1 && j === 1) {
      //       pieces[i][j] = createPawn();
      //     } else {
      //       pieces[i][j] = null;
      //     }
      //   }
      // }
      render(pieces);
    };
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

        if (sq.makeOnClick) {
          pieceEl.onclick = sq.makeOnClick({ pieces, x, y });
        }
      }
      rowContainer.appendChild(pieceEl);
    });
    piecesContainer.appendChild(rowContainer);
  });

  return piecesContainer;
}

function render(pieces) {
  // Loop over pieces and render them in their coordinates
  const piecesContainer = document.querySelector(".pieces");
  piecesContainer.innerHTML = "";
  piecesContainer.appendChild(createPieces(pieces));
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

// Add images

// When a piece is clicked, highlight its possible moves
// When a piece is dragged, highlight its possible moves
// When a move is clicked, move piece and rerender
// When a piece is dropped, move piece and rerender

// Take another piece when you land on it

const whiteTaken = {};
const blackTaken = {};

document.getElementById("root").appendChild(createBoard(board));
document.getElementById("root").appendChild(createPieces(pieces));
