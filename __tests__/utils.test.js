import { expect, it, describe } from 'vitest';
import { toNotation, fromNotation, createGame } from '../utils';
import { createEmptyBoard } from './testUtils';
import { createPawn, createBishop, createPieces, createRook } from '../pieces';
import { BLACK, WHITE, Pieces } from '../constants';
import { createHistory } from '../history';

describe('createGame', () => {
  it('creates a game', () => {
    const game = createGame();
    expect(Object.keys(game.history)).toEqual(Object.keys(createHistory()));
    expect(JSON.stringify(game.pieces)).toEqual(JSON.stringify(createPieces()));
    expect(game.whiteTaken).toEqual({});
    expect(game.blackTaken).toEqual({});
    expect(game.turn).toEqual(WHITE);
  });

  it('recreates a game from history', () => {
    const HISTORY = ['Pb2b4', 'Pe7e6', 'Pc2c3', 'Bf8xPb4'];
    const game = createGame(HISTORY);
    expect(game.history.toString()).toEqual(HISTORY.join('|'));
    expect(JSON.stringify(game.pieces)).not.toEqual(
      JSON.stringify(createPieces()),
    );
    expect(game.whiteTaken).toEqual({});
    expect(game.blackTaken).toEqual({ P: 1 });
    expect(game.turn).toEqual(WHITE);
  });

  it('gets piece from coords', () => {
    const game = createGame();
    expect(game.get('a1').id).toEqual(Pieces.ROOK);
  });
});

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

  it('en passant', () => {
    const pieces = createEmptyBoard();
    pieces[3][0] = createPawn(WHITE);
    pieces[3][1] = createPawn(BLACK, { movedTwo: true });
    const moveFrom = { x: 0, y: 3 };
    const moveTo = { x: 1, y: 2 };
    const notation = toNotation(pieces, moveFrom, moveTo, { x: 1, y: 3 });
    expect(notation).toBe('Pa5xPb6epb5');
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

describe('undo/redo', () => {
  it.todo('undo move');
  it.todo('undo taken');
  it.todo('undo castle');
  it.todo('redo move');
  it.todo('redo taken');
  it.todo('redo castle');
});
