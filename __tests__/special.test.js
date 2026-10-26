import { expect, describe, it } from 'vitest';
import { createKing } from '../pieces.js';
import { castle } from '../special.js';
import { createGame } from '../utils';
import { BLACK, WHITE, Pieces } from '../constants';

describe('castle', () => {
  it.each([
    { dir: 'short', color: 'black', kingX: 6, rookX: 5, y: 0, undo: false },
    { dir: 'short', color: 'white', kingX: 6, rookX: 5, y: 7, undo: false },
    { dir: 'long', color: 'black', kingX: 2, rookX: 3, y: 0, undo: false },
    { dir: 'long', color: 'white', kingX: 2, rookX: 3, y: 7, undo: false },
    { dir: 'short', color: 'black', kingX: 4, rookX: 7, y: 0, undo: true },
    { dir: 'short', color: 'white', kingX: 4, rookX: 7, y: 7, undo: true },
    { dir: 'long', color: 'black', kingX: 4, rookX: 0, y: 0, undo: true },
    { dir: 'long', color: 'white', kingX: 4, rookX: 0, y: 7, undo: true },
  ])('$dir castles $color, undo: $undo', ({ color, kingX, rookX, y }) => {
    const undo = kingX === 4;
    const { pieces } = createGame();
    const pieceColor = color === 'white' ? WHITE : BLACK;
    pieces[y][kingX] = createKing(pieceColor);
    castle({ pieces, x: kingX, y });
    expect(pieces[y][rookX].id).toEqual(Pieces.ROOK);
    expect(pieces[y][rookX].hasMoved).toEqual(!undo);
  });
});
