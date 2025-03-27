import { describe, it, expect } from 'vitest';
import { createHistory } from '../history';
import { createEmpty, createPawn } from '../pieces';
import { BLACK, WHITE } from '../constants';
import { toNotation } from '../utils';

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
      [createPawn(BLACK), createEmpty()],
      [createEmpty(), createPawn(WHITE)],
    ];

    const history = createHistory();
    expect(history.getLastMove()).toBeNull();
    history.push(toNotation(pieces, { x: 1, y: 1 }, { x: 0, y: 0 }));
    const lastMove = history.getLastMove();
    expect(lastMove).toEqual('Pb1xPa2');

    // const [row1, row2] = lastMove.pieces;
    // const [pawn1, pawn2] = row1;
    // const [empty1, empty2] = row2;
    // expect(pawn1).toEqual({
    //   id: Pieces.PAWN,
    //   color: WHITE,
    //   getMoves: expect.any(Function),
    // });
    // expect(pawn2).toEqual({
    //   id: Pieces.PAWN,
    //   color: BLACK,
    //   getMoves: expect.any(Function),
    // });
    // expect(empty1).toEqual({ id: Pieces.EMPTY });
    // expect(empty2).toEqual({ id: Pieces.EMPTY });
  });
});
