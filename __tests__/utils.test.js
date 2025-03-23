import { expect, it, describe } from 'vitest';
import { getNotation } from '../utils';
import { createPieces } from '../pieces';

describe('getNotation', () => {
  it('gets notation for move', () => {
    const pieces = createPieces();
    console.log('pieces', pieces);
    const moveFrom = { x: 1, y: 1 };
    const moveTo = { x: 1, y: 2 };
    const notation = getNotation(pieces, moveFrom, moveTo);
    expect(notation).toBe('Pb2b3');
  });
});
