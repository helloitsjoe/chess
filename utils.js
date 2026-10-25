import { BLACK, WHITE, BOARD_SIZE, Pieces } from './constants.js';
import { factoryMap, castle } from './special.js';
import { createHistory } from './history.js';
import { createPieces } from './pieces.js';
const { EMPTY } = Pieces;

export const isEmpty = (piece) => piece?.id === EMPTY;

const ROWS = 'abcdefgh';
const getRank = (y) => BOARD_SIZE - y;
const getRow = (num) => BOARD_SIZE - Number(num);
const getCol = (letter) => ROWS.indexOf(letter);

export function toNotation(pieces, moveFrom, moveTo) {
  const fromRank = getRank(moveFrom.y);
  const fromRow = ROWS[moveFrom.x];
  const toRank = getRank(moveTo.y);
  const toRow = ROWS[moveTo.x];
  const piece = pieces[moveFrom.y][moveFrom.x];
  const taken = pieces[moveTo.y][moveTo.x];

  return `${piece.id}${fromRow}${fromRank}${!isEmpty(taken) ? 'x' + taken.id : ''}${toRow}${toRank}`;
}

export function clearPending(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const row = pieces[i];
    for (let j = 0; j < row.length; j++) {
      pieces[i][j].pendingMove = null;
    }
  }
}

export function fromNotation(notation) {
  // Regex to parse notation. For example 'Pb7b6' would be: ['P', 'b7', 'b6']
  // and 'Ra8xBa5' would be: [R, a8, x, B, a5]
  const notationRegex = /([A-Z])([a-h][1-8])x?([A-Z])?([a-h][1-8])/;
  const [, id, from, takenId = '', to] = notation.match(notationRegex);

  const fromSq = { x: getCol(from[0]), y: getRow(from[1]) };
  const toSq = { x: getCol(to[0]), y: getRow(to[1]) };

  return { id, fromSq, takenId, toSq };
}

export function undo(game) {
  clearPending(game.pieces);
  const previous = game.history.undo();
  if (!previous) return;

  game.turn = game.turn === WHITE ? BLACK : WHITE;

  const { toSq, fromSq, id, takenId } = fromNotation(previous);

  const createPiece = factoryMap[id];
  const createEmpty = factoryMap[takenId || Pieces.EMPTY];

  game.pieces[fromSq.y][fromSq.x] = createPiece(game.turn);
  game.pieces[toSq.y][toSq.x] = createEmpty(
    game.turn === WHITE ? BLACK : WHITE,
  );

  if (id === Pieces.KING && Math.abs(fromSq.x - toSq.x) > 1) {
    castle({ pieces: game.pieces, x: fromSq.x, y: fromSq.y });
  }

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

  const { toSq, fromSq, id, takenId } = fromNotation(next);

  const createPiece = factoryMap[id];
  const createEmpty = factoryMap[Pieces.EMPTY];

  game.pieces[fromSq.y][fromSq.x] = createEmpty();
  game.pieces[toSq.y][toSq.x] = createPiece(
    game.turn === WHITE ? BLACK : WHITE,
  );

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
