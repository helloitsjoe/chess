import { describe, it, expect } from 'vitest';
import { createEmpty, createPawn } from '../pieces';
import { createEmptyBoard } from '../utils';
import { BLACK, WHITE, Pieces } from '../constants';

it('empty square', () => {
  const empty = createEmpty();
  expect(empty).toEqual({ id: Pieces.EMPTY });
});

describe('pawn', () => {
  it.each`
    name       | color
    ${'black'} | ${BLACK}
    ${'white'} | ${WHITE}
  `('creates a $color pawn', ({ color }) => {
    const pawn = createPawn(color);
    expect(pawn).toEqual({
      id: Pieces.PAWN,
      color,
      getMoves: expect.any(Function),
    });
  });

  describe('WHITE', () => {
    it('can move one or two spaces from start square', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(WHITE);
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
      const pawn = createPawn(WHITE);
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([{ x: 0, y: 3, type: 'normal' }]);
    });

    it('is blocked by same color', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(WHITE);
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      pieces[3][0] = createPawn(WHITE);
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([]);
    });

    it('is blocked by opposite color', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(WHITE);
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      pieces[3][0] = createPawn(BLACK);
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([]);
    });

    it('can move diagonally when opponent piece is there', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(WHITE);
      const [x, y] = [2, 2];

      pieces[y][x] = pawn;
      pieces[3][3] = createPawn(BLACK);
      pieces[1][1] = createPawn(BLACK); // Pawn behind should not trigger diagonal

      const straightMove = { x: 2, y: 3, type: 'normal' };
      const diagonalMove = { x: 3, y: 3, type: 'normal' };
      let moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([straightMove, diagonalMove]);

      // Move black pawn to other diagonal
      pieces[3][3] = createEmpty();
      pieces[3][1] = createPawn(BLACK);
      const otherDiagonalMove = { x: 1, y: 3, type: 'normal' };
      moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([straightMove, otherDiagonalMove]);
    });

    it('promotes', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(WHITE);
      const [x, y] = [0, 6];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([{ x: 0, y: 7, type: 'promote' }]);
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

    it('is blocked by same color', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      pieces[1][0] = createPawn(BLACK);
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([]);
    });

    it('is blocked by opposite color', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [0, 2];
      pieces[y][x] = pawn;
      pieces[1][0] = createPawn(WHITE);
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([]);
    });

    it('can move diagonally when opponent piece is there', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [2, 2];
      pieces[y][x] = pawn;
      pieces[1][1] = createPawn(WHITE);
      pieces[3][3] = createPawn(WHITE); // Pawn behind should not trigger diagonal

      let moves = pawn.getMoves({ pieces, x, y });
      const straightMove = { x: 2, y: 1, type: 'normal' };
      const diagonalMove = { x: 1, y: 1, type: 'normal' };
      expect(moves).toEqual([straightMove, diagonalMove]);

      // Move black pawn to other diagonal
      pieces[1][1] = createEmpty();
      pieces[1][3] = createPawn(WHITE);
      const otherDiagonalMove = { x: 3, y: 1, type: 'normal' };
      moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([straightMove, otherDiagonalMove]);
    });

    it('promotes', () => {
      const pieces = createEmptyBoard();
      const pawn = createPawn(BLACK);
      const [x, y] = [0, 1];
      pieces[y][x] = pawn;
      const moves = pawn.getMoves({ pieces, x, y });
      expect(moves).toEqual([{ x: 0, y: 0, type: 'promote' }]);
    });
  });
});
