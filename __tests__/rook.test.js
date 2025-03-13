import { describe, it, expect } from 'vitest';
import { createRook } from '../pieces';
import { createEmptyBoard } from '../utils';
import { BLACK, WHITE, Pieces } from '../constants';
import { expectArraysEqual } from './testUtils';

describe('rook', () => {
  it.each`
    name       | color
    ${'black'} | ${BLACK}
    ${'white'} | ${WHITE}
  `('creates a $name rook', ({ color }) => {
    expect(createRook(color)).toEqual({
      id: Pieces.ROOK,
      color,
      hasMoved: false,
      getMoves: expect.any(Function),
    });
  });

  it('can move down row/column', () => {
    const pieces = createEmptyBoard();
    const rook = createRook(WHITE);
    const [x, y] = [3, 3];
    pieces[y][x] = rook;
    const moves = rook.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 3, y: 7 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('is blocked by same color', () => {
    // ....
    // .R.R
    // ....
    // .R..
    const pieces = createEmptyBoard();
    const rook = createRook(WHITE);
    const [x, y] = [1, 1];
    pieces[y][x] = rook;
    pieces[1][3] = createRook(WHITE);
    pieces[3][1] = createRook(WHITE);
    const moves = rook.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('is blocked by opposite color (but can take)', () => {
    // ....
    // .R.R
    // ....
    // .R..
    const pieces = createEmptyBoard();
    const rook = createRook(WHITE);
    const [x, y] = [1, 1];
    pieces[y][x] = rook;
    pieces[1][3] = createRook(BLACK);
    pieces[3][1] = createRook(BLACK);
    const moves = rook.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });
});
