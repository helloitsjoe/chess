import { WHITE, BLACK, BOARD_SIZE, Type } from './constants.js';
import { putsSelfInCheck, getIsCheck, promote, castle } from './special.js';
import {
  isEmpty,
  toNotation,
  save,
  clearPending,
  clearEnPassantable,
} from './utils.js';
import { createEmpty } from './pieces.js';

export function update({ game, x, y }, userOptions = {}) {
  const { autoSave, lockCheck = true } = userOptions;
  const { pieces, whiteTaken, blackTaken, turn, history } = game;
  const sq = pieces[y][x];

  if (sq.pendingMove) {
    // Move piece
    const { x: oldX, y: oldY, type } = sq.pendingMove;
    const oldPiece = pieces[oldY][oldX];
    const newPiece = type === Type.PROMOTE ? promote(oldPiece.color) : oldPiece;

    if (lockCheck && type === Type.SELF_CHECK) {
      return game;
    }

    // TODO: Move this into getMoves?
    let pieceToTake = pieces[y][x];
    let enPassant = null;

    // TODO: White taking en passant + undo is buggy, puts black pawn back 2 squares further down than it should
    // TODO: Also, movedTwo needs to reset when undoing
    if (pieces[oldY][oldX - 1]?.movedTwo) {
      pieceToTake = pieces[oldY][oldX - 1];
      enPassant = { x: oldX - 1, y: oldY };
    } else if (pieces[oldY][oldX + 1]?.movedTwo) {
      pieceToTake = pieces[oldY][oldX + 1];
      enPassant = { x: oldX + 1, y: oldY };
    }

    if (!isEmpty(pieceToTake)) {
      const takenMap = pieceToTake.color === BLACK ? whiteTaken : blackTaken;
      takenMap[pieceToTake.id] = (takenMap[pieceToTake.id] || 0) + 1;
    }

    const moveNote = toNotation(pieces, sq.pendingMove, { x, y }, enPassant);
    history.push(moveNote);

    if (autoSave) {
      save(game);
    }

    clearPending(pieces);
    clearEnPassantable(pieces, turn);

    newPiece.hasMoved = true;
    newPiece.movedTwo = type === Type.EN_PASSANTABLE;

    // Make move
    pieces[y][x] = newPiece;
    pieces[oldY][oldX] = createEmpty();

    if (enPassant) {
      pieces[enPassant.y][enPassant.x] = createEmpty();
    }

    if (pieceToTake.id === 'king') {
      const winner = turn === WHITE ? 'white' : 'black';
      alert(`Checkmate! ${winner} wins!`);
    }

    if (type === Type.CASTLE) {
      castle({ pieces, x, y });
    }

    game.turn = game.turn === WHITE ? BLACK : WHITE;
  } else {
    clearPending(pieces);
    if (sq.color === turn) {
      const moveOptions = sq?.getMoves ? sq.getMoves({ pieces, x, y }) : [];
      for (const { x: newX, y: newY, type: newType } of moveOptions) {
        if (newX >= 0 && newY >= 0 && newX < BOARD_SIZE && newY < BOARD_SIZE) {
          // TODO: Also check for checkmate/stalemate
          const isCheck = putsSelfInCheck({
            pieces,
            turn,
            x,
            y,
            newX,
            newY,
          });
          const type = isCheck ? Type.SELF_CHECK : newType;
          pieces[newY][newX].pendingMove = { x, y, type };
        }
      }
    }
  }

  const kingCoords = getIsCheck({ pieces, turn });
  if (pieces[kingCoords.y]?.[kingCoords.x]) {
    pieces[kingCoords.y][kingCoords.x].inCheck = kingCoords.isCheck;
  }

  return { ...game, pieces, whiteTaken, blackTaken, history };
}
