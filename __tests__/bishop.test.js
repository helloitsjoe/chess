import { describe, it, expect } from 'vitest';
import { createBishop } from '../pieces';
import { createEmptyBoard } from '../utils';
import { BLACK, WHITE } from '../constants';
import { expectArraysEqual } from './testUtils';

describe('bishop', () => {
  it.each`
    name       | color
    ${'black'} | ${BLACK}
    ${'white'} | ${WHITE}
  `('creates a $name bishop', ({ color }) => {
    expect(createBishop(color)).toEqual({
      id: 'bishop',
      color,
      getMoves: expect.any(Function),
    });
  });

  it('can move diagonally', () => {
    const pieces = createEmptyBoard();
    const bishop = createBishop();
    const [x, y] = [3, 3];
    pieces[y][x] = bishop;
    const moves = bishop.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 6 },
      { x: 7, y: 7 },
      { x: 0, y: 6 },
      { x: 1, y: 5 },
      { x: 2, y: 4 },
      { x: 4, y: 2 },
      { x: 5, y: 1 },
      { x: 6, y: 0 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('is blocked by same color', () => {
    const pieces = createEmptyBoard();
    const bishop = createBishop();
    const [x, y] = [1, 1];
    pieces[y][x] = bishop;
    pieces[2][2] = createBishop();
    const moves = bishop.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('is blocked by opposite color (but can take)', () => {
    const pieces = createEmptyBoard();
    const bishop = createBishop();
    const [x, y] = [1, 1];
    pieces[y][x] = bishop;
    pieces[2][2] = createBishop(BLACK);
    const moves = bishop.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
    ];
    expectArraysEqual(moves, expectedMoves);
  });
});
