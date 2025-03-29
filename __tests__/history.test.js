import { describe, it, expect } from 'vitest';
import { createHistory } from '../history';

describe('history', () => {
  it('creates the history API', () => {
    const history = createHistory();
    expect(typeof history.push).toBe('function');
    expect(typeof history.undo).toBe('function');
    expect(typeof history.redo).toBe('function');
  });

  it('undo returns null if no previous moves', () => {
    const history = createHistory();
    expect(history.undo()).toBeNull();
  });

  it('push/undo/redo work', () => {
    const history = createHistory();
    expect(history.undo()).toBeNull();
    const firstMove = 'Pc1c2';
    const secondMove = 'Pb7b6';

    history.push(firstMove);
    history.push(secondMove);

    expect(history.undo()).toBe(secondMove);
    expect(history.undo()).toBe(firstMove);
    expect(history.undo()).toBeNull();
    // Should not move before beginning of array
    expect(history.undo()).toBeNull();
    expect(history.redo()).toBe(firstMove);
    expect(history.redo()).toBe(secondMove);
    // Should not move past end of array
    expect(history.redo()).toBeNull();
    expect(history.undo()).toBe(secondMove);
    expect(history.undo()).toBe(firstMove);
    expect(history.undo()).toBeNull();
  });

  it('overwrites history after undo + new move', () => {
    const history = createHistory();
    const firstMove = 'Pc1c2';
    const secondWrongMove = 'Pb7b6';
    const secondFixedMove = 'Pc7c6';

    history.push(firstMove);
    history.push(secondWrongMove);
    expect(history.inspect()).toBe(`${firstMove} ${secondWrongMove}`);

    history.undo();
    history.push(secondFixedMove);

    expect(history.inspect()).toBe(`${firstMove} ${secondFixedMove}`);
  });
});
