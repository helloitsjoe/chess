import { BLACK, WHITE, BOARD_SIZE, Pieces, Type } from './constants.js';
import { factoryMap, castle } from './special.js';
import { createHistory } from './history.js';
import { createPieces, createPawn, createEmpty } from './pieces.js';
const { EMPTY } = Pieces;

export const isEmpty = (piece) => piece?.id === EMPTY;

const FILES = 'abcdefgh';
const getRank = (y) => BOARD_SIZE - y;
const getRow = (num) => BOARD_SIZE - Number(num);
const getCol = (letter) => FILES.indexOf(letter);

export function save(game) {
  localStorage.setItem('chess-history', game.history.toString());
}

export function toNotation(pieces, moveFrom, moveTo, enPassant) {
  const fromRank = getRank(moveFrom.y);
  const fromFile = FILES[moveFrom.x];
  const toRank = getRank(moveTo.y);
  const toFile = FILES[moveTo.x];
  const piece = pieces[moveFrom.y][moveFrom.x];
  const taken = pieces[moveTo.y][moveTo.x];

  return `${piece.id}${fromFile}${fromRank}${!isEmpty(taken) ? 'x' + taken.id : ''}${toFile}${toRank}${enPassant ? 'ep' + toFile + enPassant.y : ''}`;
}

export function clearPending(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const row = pieces[i];
    for (let j = 0; j < row.length; j++) {
      pieces[i][j].pendingMove = null;
    }
  }
}

export function clearEnPassantable(pieces, turn) {
  for (let i = 0; i < pieces.length; i++) {
    const row = pieces[i];
    for (let j = 0; j < row.length; j++) {
      const piece = pieces[i][j];
      if (piece.color === turn && piece.movedTwo) {
        pieces[i][j].type = Type.NORMAL;
        pieces[i][j].movedTwo = false;
      }
    }
  }
}

export function fromNotation(notation) {
  // Regex to parse notation. For example 'Pb7b6' would be: ['P', 'b7', 'b6']
  // and 'Ra8xBa5' would be: [R, a8, x, B, a5]
  const notationRegex =
    /([A-Z])([a-h][1-8])x?([A-Z])?([a-h][1-8])(ep)?([a-z][1-8])?/;
  const [, id, from, takenId = '', to, , ep] = notation.match(notationRegex);

  const fromSq = { x: getCol(from[0]), y: getRow(from[1]) };
  const toSq = { x: getCol(to[0]), y: getRow(to[1]) };

  if (ep) {
    const enPassant = { x: getCol(ep[0]), y: getRow(ep[1]) };
    return { id, fromSq, takenId: Pieces.PAWN, toSq, enPassant };
  }

  return { id, fromSq, takenId, toSq };
}

export function undo(game) {
  clearPending(game.pieces);
  const previous = game.history.undo();
  if (!previous) return;

  game.turn = game.turn === WHITE ? BLACK : WHITE;

  const { toSq, fromSq, id, takenId, enPassant } = fromNotation(previous);

  const createPiece = factoryMap[id];
  const recreateTakenOrEmpty = factoryMap[takenId || Pieces.EMPTY];

  game.pieces[fromSq.y][fromSq.x] = createPiece(game.turn);

  if (enPassant) {
    game.pieces[enPassant.y][enPassant.x] = createPawn(
      game.turn === WHITE ? BLACK : WHITE,
    );
    game.pieces[toSq.y][toSq.x] = createEmpty();
  } else {
    game.pieces[toSq.y][toSq.x] = recreateTakenOrEmpty(
      game.turn === WHITE ? BLACK : WHITE,
    );
  }

  if (id === Pieces.KING && Math.abs(fromSq.x - toSq.x) > 1) {
    castle({ pieces: game.pieces, x: fromSq.x, y: fromSq.y });
  }

  console.log(' takenId', takenId);

  if (takenId) {
    if (game.turn === BLACK) {
      game.blackTaken[takenId]--;
    } else {
      game.whiteTaken[takenId]--;
    }
  }

  return game;
}

export function redo(game) {
  clearPending(game.pieces);
  const next = game.history.redo();
  if (!next) return;

  game.turn = game.turn === WHITE ? BLACK : WHITE;

  const { toSq, fromSq, id, takenId, enPassant } = fromNotation(next);

  const createPiece = factoryMap[id];
  const createEmpty = factoryMap[Pieces.EMPTY];

  game.pieces[fromSq.y][fromSq.x] = createEmpty();
  game.pieces[toSq.y][toSq.x] = createPiece(
    game.turn === WHITE ? BLACK : WHITE,
  );

  if (enPassant) {
    game.pieces[enPassant.y][enPassant.x] = createEmpty();
  }

  if (id === Pieces.KING && Math.abs(fromSq.x - toSq.x) > 1) {
    castle({ pieces: game.pieces, x: toSq.x, y: toSq.y });
  }

  if (takenId) {
    if (game.turn === WHITE) {
      game.blackTaken[takenId] = (game.blackTaken[takenId] || 0) + 1;
    } else {
      game.whiteTaken[takenId] = (game.whiteTaken[takenId] || 0) + 1;
    }
  }

  return game;
}

export function createGame(initialHistory = []) {
  const game = {
    history: createHistory(initialHistory),
    pieces: createPieces(),
    whiteTaken: {},
    blackTaken: {},
    turn: WHITE,
  };

  for (let i = 0; i < initialHistory.length; i++) {
    redo(game);
  }

  return game;
}
