import { WHITE, BLACK, Type } from './constants.js';
import { putsSelfInCheck, getIsCheck, promote, castle } from './special.js';
import {
  save,
  toAlg,
  isEmpty,
  onBoard,
  toNotation,
  clearPending,
  clearEnPassantable,
} from './utils.js';
import { createEmpty } from './pieces.js';

export function update({ game, x, y }, userOptions = {}) {
  const pos = toAlg(x, y);
  const { autoSave, lockCheck = true } = userOptions;
  const { pieces, whiteTaken, blackTaken, turn, history } = game;
  const sq = game.get(pos);

  if (sq.pendingMove) {
    // Move piece
    const { x: oldX, y: oldY, type } = sq.pendingMove;
    const oldPos = toAlg(oldX, oldY);
    const oldPiece = game.get(oldPos);
    const newPiece = type === Type.PROMOTE ? promote(oldPiece.color) : oldPiece;

    if (lockCheck && type === Type.SELF_CHECK) {
      return game;
    }

    // TODO: Move this into getMoves?
    let pieceToTake = sq;
    let enPassant = null;

    const pLeft = toAlg(oldX - 1, oldY);
    const pRight = toAlg(oldX + 1, oldY);

    const left = game.get(pLeft);
    const right = game.get(pRight);

    if (left?.movedTwo) {
      pieceToTake = left;
      enPassant = { x: oldX - 1, y: oldY };
    } else if (right?.movedTwo) {
      pieceToTake = right;
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
    game.set(pos, newPiece);
    game.set(oldPos, createEmpty());

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
        if (onBoard(newX) && onBoard(newY)) {
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
          // pieces[newY][newX].pendingMove = { x, y, type };
          const newPos = toAlg(newX, newY);
          const newPiece = game.get(newPos);
          game.set(newPos, { ...newPiece, pendingMove: { x, y, type } });
        }
      }
    }
  }

  // TODO: position
  const kingCoords = getIsCheck({ pieces, turn });
  if (pieces[kingCoords.y]?.[kingCoords.x]) {
    pieces[kingCoords.y][kingCoords.x].inCheck = kingCoords.isCheck;
  }

  return { ...game, pieces, whiteTaken, blackTaken, history };
}
