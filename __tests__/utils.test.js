import { expect, it, describe } from 'vitest';
import { createEmptyBoard, getNotation } from '../utils';
import { createBishop, createPieces, createRook } from '../pieces';
import { BLACK, WHITE } from '../constants';

describe('getNotation', () => {
  it('gets notation for move', () => {
    const pieces = createPieces();
    const moveFrom = { x: 1, y: 1 };
    const moveTo = { x: 1, y: 2 };
    const notation = getNotation(pieces, moveFrom, moveTo);
    expect(notation).toBe('Pb7b6');
  });

  it('gets notation for move', () => {
    const pieces = createEmptyBoard();
    pieces[0][0] = createRook(WHITE);
    pieces[3][0] = createBishop(BLACK);
    const moveFrom = { x: 0, y: 0 };
    const moveTo = { x: 0, y: 3 };
    const notation = getNotation(pieces, moveFrom, moveTo);
    expect(notation).toBe('Ra8xBa5');
  });
});
