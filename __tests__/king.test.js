import { describe, it, expect } from 'vitest';
import { createKing, createPawn } from '../pieces';
import { createEmptyBoard } from '../utils';
import { BLACK, WHITE, Type, Pieces } from '../constants';
import { expectArraysEqual } from './testUtils';

describe('king', () => {
  it.each`
    name       | color
    ${'black'} | ${BLACK}
    ${'white'} | ${WHITE}
  `('creates a $name king', ({ color }) => {
    expect(createKing(color)).toEqual({
      id: Pieces.KING,
      color,
      hasMoved: false,
      inCheck: false,
      getMoves: expect.any(Function),
    });
  });

  it('can move down row/column', () => {
    // ....
    // ....
    // ..K.
    // ....
    const pieces = createEmptyBoard();
    const king = createKing(WHITE);
    const [x, y] = [2, 2];
    pieces[y][x] = king;
    const moves = king.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 1, y: 1, type: Type.NORMAL },
      { x: 2, y: 1, type: Type.NORMAL },
      { x: 2, y: 3, type: Type.NORMAL },
      { x: 3, y: 1, type: Type.NORMAL },
      { x: 1, y: 2, type: Type.NORMAL },
      { x: 1, y: 3, type: Type.NORMAL },
      { x: 3, y: 2, type: Type.NORMAL },
      { x: 3, y: 3, type: Type.NORMAL },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('is blocked by same color', () => {
    // ....
    // .KP.
    // .PP.
    // ....
    const pieces = createEmptyBoard();
    const king = createKing(WHITE);
    const [x, y] = [1, 1];
    pieces[y][x] = king;
    pieces[1][2] = createPawn(WHITE);
    pieces[2][1] = createPawn(WHITE);
    pieces[2][2] = createPawn(WHITE);
    const moves = king.getMoves({ pieces, x, y });
    const expectedMoves = [
      { x: 0, y: 0, type: Type.NORMAL },
      { x: 1, y: 0, type: Type.NORMAL },
      { x: 2, y: 0, type: Type.NORMAL },
      { x: 0, y: 1, type: Type.NORMAL },
      { x: 0, y: 2, type: Type.NORMAL },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  it('can take opposite color', () => {
    // ....
    // .KP.
    // .PP.
    // ....
    const pieces = createEmptyBoard();
    const king = createKing(WHITE);
    const [x, y] = [1, 1];
    pieces[y][x] = king;
    pieces[1][2] = createPawn(BLACK);
    pieces[2][1] = createPawn(BLACK);
    pieces[2][2] = createPawn(BLACK);
    const moves = king.getMoves({ pieces, x, y });
    // Does not take check into account
    const expectedMoves = [
      { x: 0, y: 0, type: Type.NORMAL },
      { x: 1, y: 0, type: Type.NORMAL },
      { x: 1, y: 2, type: Type.NORMAL },
      { x: 2, y: 0, type: Type.NORMAL },
      { x: 0, y: 1, type: Type.NORMAL },
      { x: 0, y: 2, type: Type.NORMAL },
      { x: 2, y: 1, type: Type.NORMAL },
      { x: 2, y: 2, type: Type.NORMAL },
    ];
    expectArraysEqual(moves, expectedMoves);
  });

  describe('castling', () => {
    it.todo('can castle if neither king nor rook has moved');
    it.todo('cannot castle if king is not in start square');
    it.todo('cannot castle if rook is not in start square');
    it.todo('cannot castle if king has moved out and back');
    it.todo('cannot castle if rook has moved out and back');
  });
});
