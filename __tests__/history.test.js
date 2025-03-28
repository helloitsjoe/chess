import { describe, it, expect } from 'vitest';
import { createHistory } from '../history';
import { createPawn } from '../pieces';
import { BLACK, WHITE } from '../constants';
import { createEmptyBoard, toNotation } from '../utils';

describe('history', () => {
  it('creates the history API', () => {
    const history = createHistory();
    expect(typeof history.push).toBe('function');
    expect(typeof history.getLastMove).toBe('function');
    expect(typeof history.getNextMove).toBe('function');
  });

  it('getLastMove returns null if no previous moves', () => {
    const history = createHistory();
    expect(history.getLastMove()).toBeNull();
  });

  it('push/getLastMove/getNextMove work', () => {
    const pieces = createEmptyBoard();
    pieces[1][1] = createPawn(BLACK);
    pieces[7][2] = createPawn(WHITE);

    const history = createHistory();
    expect(history.getLastMove()).toBeNull();
    history.push(toNotation(pieces, { x: 2, y: 7 }, { x: 2, y: 6 }));
    history.push(toNotation(pieces, { x: 1, y: 1 }, { x: 1, y: 2 }));

    const firstMove = 'Pc1c2';
    const secondMove = 'Pb7b6';

    expect(history.getLastMove()).toBe(secondMove);
    expect(history.getLastMove()).toBe(firstMove);
    expect(history.getLastMove()).toBeNull();
    // Should not move before beginning of array
    expect(history.getLastMove()).toBeNull();
    expect(history.getNextMove()).toBe(firstMove);
    expect(history.getNextMove()).toBe(secondMove);
    // Should not move past end of array
    expect(history.getNextMove()).toBeNull();
    expect(history.getLastMove()).toBe(secondMove);
    expect(history.getLastMove()).toBe(firstMove);
    expect(history.getLastMove()).toBeNull();
  });
});
