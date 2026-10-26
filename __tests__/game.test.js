import { describe, it, expect, beforeEach } from 'vitest';
import { update } from '../game.js';
import { createGame, undo, redo } from '../utils.js';
import { Pieces, WHITE, BLACK } from '../constants.js';
import { c } from './testUtils.js';

const { PAWN, EMPTY, BISHOP } = Pieces;

let game;

beforeEach(() => {
  game = createGame();
});

function move(from, to) {
  game = update({ game, ...c(from) });
  game = update({ game, ...c(to) });
}

describe('update', () => {
  it('moves pieces', () => {
    expect(game.get('d4').id).toBe(EMPTY);
    expect(game.get('d2').id).toBe(PAWN);

    move('d2', 'd4');

    expect(game.get('d4').id).toBe(PAWN);
    expect(game.get('d2').id).toBe(EMPTY);
  });

  it('forbids invalid moves', () => {
    move('d2', 'd5');

    expect(game.get('d5').id).toBe(EMPTY);
    expect(game.get('d2').id).toBe(PAWN);
  });

  it('forbids same color moving twice', () => {
    move('d2', 'd4');

    expect(game.get('d4').id).toBe(PAWN);

    move('d4', 'd5');

    expect(game.get('d4').id).toBe(PAWN);
    expect(game.get('d5').id).toBe(EMPTY);
  });

  it('does not allow user to move into check', () => {
    move('e2', 'e4');
    expect(game.get('e4').id).toBe(PAWN);

    move('e7', 'e5');
    expect(game.get('e5').id).toBe(PAWN);

    move('f1', 'b5');
    expect(game.get('b5').id).toBe(BISHOP);

    // d2 pawn is pinned
    move('d2', 'd4');
    expect(game.get('d2').id).toBe(PAWN);
    expect(game.get('d4').id).toBe(EMPTY);
  });

  it('allows taking', () => {
    game = createGame(['Pe2e4', 'Pd7d5']);
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });

    move('e4', 'd5');
    expect(game.get('e4')).toMatchObject({ id: EMPTY });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });
  });

  it('allows white to take en passant', () => {
    move('e2', 'e4');
    move('d7', 'd5');
    move('e4', 'e5');
    move('f7', 'f5');

    expect(game.get('f5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('e5')).toMatchObject({ id: PAWN, color: WHITE });

    move('e5', 'f6');

    expect(game.get('f5')).toMatchObject({ id: EMPTY });
    expect(game.get('f6')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('e5')).toMatchObject({ id: EMPTY });
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });
  });

  it('allows black to take en passant', () => {
    move('e2', 'e4');
    move('d7', 'd5');
    move('e4', 'e5');
    move('d5', 'd4');

    expect(game.get('d4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('e5')).toMatchObject({ id: PAWN, color: WHITE });

    move('c2', 'c4');
    move('d4', 'c3');

    expect(game.get('c4')).toMatchObject({ id: EMPTY });
    expect(game.get('c3')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });
  });

  it('only allows en passant on move immediately following', () => {
    move('e2', 'e4');
    move('d7', 'd5');
    move('e4', 'e5');
    move('f7', 'f5');

    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('e5')).toMatchObject({ id: PAWN, color: WHITE });

    move('e5', 'd6');

    // No move
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('e5')).toMatchObject({ id: PAWN, color: WHITE });
  });
});

describe('undo/redo', () => {
  it('allows undo/redo', () => {
    move('e2', 'e4');
    move('d7', 'd5');

    expect(game.get('e4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });

    game = undo(game);
    game = undo(game);

    // Pieces are back to start
    expect(game.get('e4')).toMatchObject({ id: EMPTY });
    expect(game.get('d5')).toMatchObject({ id: EMPTY });
    expect(game.get('e2')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d7')).toMatchObject({ id: PAWN, color: BLACK });

    game = redo(game);
    game = redo(game);

    // Pieces are back where they were
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('e2')).toMatchObject({ id: EMPTY });
    expect(game.get('d7')).toMatchObject({ id: EMPTY });
  });

  it('after white takes', () => {
    move('e2', 'e4');
    move('d7', 'd5');
    // Take
    move('e4', 'd5');
    expect(game.get('e4')).toMatchObject({ id: EMPTY });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    // Pawns and maps are back
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.blackTaken).toEqual({});
    expect(game.whiteTaken).toEqual({});

    game = redo(game);
    // Pawns and maps retake
    expect(game.get('e4')).toMatchObject({ id: EMPTY });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });
  });

  it('after black takes', () => {
    move('e2', 'e4');
    move('d7', 'd5');
    move('a2', 'a3');

    // Black takes
    move('d5', 'e4');
    expect(game.get('d5')).toMatchObject({ id: EMPTY });
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.whiteTaken).toEqual({});
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    // Pawns and maks are back
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('d5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.blackTaken).toEqual({});
    expect(game.whiteTaken).toEqual({});

    game = redo(game);
    expect(game.get('d5')).toMatchObject({ id: EMPTY });
    expect(game.get('e4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.whiteTaken).toEqual({});
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });
  });

  it.todo('after en passant (white)'); // Should allow en passant after redo (reset movedTwo)
  it.todo('after en passant (black)');
  it.todo('after short castling (white)');
  it.todo('after long castling (white)');
  it.todo('after short castling (black)');
  it.todo('after long castling (black)');
});
