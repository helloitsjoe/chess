import { expect, it, describe } from 'vitest';
import { createEmptyBoard, toNotation, fromNotation } from '../utils';
import { createBishop, createPieces, createRook } from '../pieces';
import { BLACK, WHITE } from '../constants';

describe('toNotation', () => {
  it('gets notation for move', () => {
    const pieces = createPieces();
    const moveFrom = { x: 1, y: 1 };
    const moveTo = { x: 1, y: 2 };
    const notation = toNotation(pieces, moveFrom, moveTo);
    expect(notation).toBe('Pb7b6');
  });

  it('gets notation for taking move', () => {
    const pieces = createEmptyBoard();
    pieces[0][0] = createRook(WHITE);
    pieces[3][0] = createBishop(BLACK);
    const moveFrom = { x: 0, y: 0 };
    const moveTo = { x: 0, y: 3 };
    const notation = toNotation(pieces, moveFrom, moveTo);
    expect(notation).toBe('Ra8xBa5');
  });
});

describe('fromNotation', () => {
  it('gets move from notation', () => {
    expect(fromNotation('Pb7b6')).toEqual({
      fromSq: { x: 1, y: 1 },
      toSq: { x: 1, y: 2 },
      id: 'P',
      takenId: '',
    });
  });

  it('gets taking move from notation', () => {
    expect(fromNotation('Ra8xBa5')).toEqual({
      fromSq: { x: 0, y: 0 },
      toSq: { x: 0, y: 3 },
      id: 'R',
      takenId: 'B',
    });
  });
});
