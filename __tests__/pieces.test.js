import { describe, it, expect } from 'vitest';
import { createEmpty, createPawn } from '../pieces';
import { BLACK, WHITE, BOARD_SIZE } from '../constants';

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => createEmpty()),
  );
}

it('empty square', () => {
  const empty = createEmpty();
  expect(empty).toEqual({ id: 'empty' });
});

describe('pawn', () => {
  it.each`
    color      | value
    ${'black'} | ${BLACK}
    ${'white'} | ${WHITE}
  `('creates a $color pawn', ({ color }) => {
    const pawn = createPawn(color);
    expect(pawn).toEqual({ id: 'pawn', color, getMoves: expect.any(Function) });
  });

  describe('WHITE', () => {
    it('can move one or two spaces from start square', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn();
      const [x, y] = [0, 1];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([
        { x: 0, y: 2, type: 'normal' },
        { x: 0, y: 3, type: 'normal' },
      ]);
    });

    it('can move only one space from non-start square', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn();
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([{ x: 0, y: 3, type: 'normal' }]);
    });

    it('can move diagonally when opponent piece is there', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn();
      const blackPawn = createPawn(BLACK);
      const [x, y] = [1, 2];
      pieces[y][x] = pawn;
      pieces[3][2] = blackPawn;

      let moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([
        { x: 1, y: 3, type: 'normal' }, // Straight
        { x: 2, y: 3, type: 'normal' }, // Diagonal
      ]);

      // Move black pawn to other diagonal
      pieces[3][2] = createEmpty();
      pieces[3][0] = blackPawn;
      moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([
        { x: 1, y: 3, type: 'normal' }, // Straight
        { x: 0, y: 3, type: 'normal' }, // Diagonal
      ]);
    });
  });

  describe('BLACK', () => {
    it('can move one or two spaces from start square', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [0, 6];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([
        { x: 0, y: 5, type: 'normal' },
        { x: 0, y: 4, type: 'normal' },
      ]);
    });

    it('can move only one space from non-start square', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [0, 5];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([{ x: 0, y: 4, type: 'normal' }]);
    });
  });
});
