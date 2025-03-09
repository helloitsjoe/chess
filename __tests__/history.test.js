import { describe, it, expect } from 'vitest';
import { createHistory } from '../history';
import { createEmpty, createPawn } from '../pieces';
import { BLACK, WHITE } from '../constants';

describe('history', () => {
  it('creates the history API', () => {
    const history = createHistory();
    expect(typeof history.push).toBe('function');
    expect(typeof history.getLastMove).toBe('function');
  });

  it('getLastMove returns null if no previous moves', () => {
    const history = createHistory();
    expect(history.getLastMove()).toBeNull();
  });

  it('push/getLastMove work', () => {
    const pieces = [
      [createPawn(WHITE), createPawn(BLACK)],
      [createEmpty(), createEmpty()],
    ];
    const takenPiece = createPawn(WHITE);

    const history = createHistory();
    expect(history.getLastMove()).toBeNull();
    history.push(pieces, takenPiece);
    const lastMove = history.getLastMove();
    expect(lastMove).toEqual({
      pieces: expect.any(Array),
      takenPiece: expect.any(Object),
    });

    const [row1, row2] = lastMove.pieces;
    const [pawn1, pawn2] = row1;
    const [empty1, empty2] = row2;
    expect(pawn1).toEqual({
      id: 'pawn',
      color: WHITE,
      getMoves: expect.any(Function),
    });
    expect(pawn2).toEqual({
      id: 'pawn',
      color: BLACK,
      getMoves: expect.any(Function),
    });
    expect(empty1).toEqual({ id: 'empty' });
    expect(empty2).toEqual({ id: 'empty' });
  });
});
