import { describe, it, expect, beforeEach } from 'vitest';
import { update } from '../game.js';
import { createGame, undo, redo } from '../utils.js';
import { Pieces, WHITE, BLACK } from '../constants.js';
import { c } from './testUtils.js';

const { PAWN, EMPTY, BISHOP, KING, ROOK } = Pieces;

// Both sides set up to castle both long and short
const CASTLE_SETUP =
  'Pg2g4|Pg7g5|Bf1h3|Bf8h6|Ng1f3|Ng8f6|Pb2b3|Pb7b6|Bc1b2|Bc8b7|Nb1c3|Nb8c6|Pe2e4|Pe7e5|Qd1e2|Qd8e7'.split(
    '|',
  );

// Both sides set up to take en passant. Each side also has pawns pushed
// to a passant position but on a previous turn (false positive test)
const EN_PASSANT_SETUP = 'Pf2f4|Pc7c5|Pf4f5|Pc5c4|Pd2d4|Pe7e5'.split('|');

let game;

beforeEach(() => {
  game = createGame();
});

function move(from, to) {
  game = update({ game, ...c(from) });
  game = update({ game, ...c(to) });
}

function expectCastlingSetup(game) {
  expect(game.pieces[7].map((p) => p.id).join('')).toBe('REEEKEER');
  expect(game.get('a1')).toMatchObject({ id: ROOK, color: WHITE });
  expect(game.get('b1')).toMatchObject({ id: EMPTY });
  expect(game.get('c1')).toMatchObject({ id: EMPTY });
  expect(game.get('d1')).toMatchObject({ id: EMPTY });
  expect(game.get('e1')).toMatchObject({ id: KING, color: WHITE });
  expect(game.get('f1')).toMatchObject({ id: EMPTY });
  expect(game.get('g1')).toMatchObject({ id: EMPTY });
  expect(game.get('h1')).toMatchObject({ id: ROOK, color: WHITE });

  expect(game.pieces[0].map((p) => p.id).join('')).toBe('REEEKEER');
  expect(game.get('a8')).toMatchObject({ id: ROOK, color: BLACK });
  expect(game.get('b8')).toMatchObject({ id: EMPTY });
  expect(game.get('c8')).toMatchObject({ id: EMPTY });
  expect(game.get('d8')).toMatchObject({ id: EMPTY });
  expect(game.get('e8')).toMatchObject({ id: KING, color: BLACK });
  expect(game.get('f8')).toMatchObject({ id: EMPTY });
  expect(game.get('g8')).toMatchObject({ id: EMPTY });
  expect(game.get('h8')).toMatchObject({ id: ROOK, color: BLACK });
}

function expectShortCastleWhite(game) {
  expect(game.pieces[7].map((p) => p.id).join('')).toBe('REEEERKE');
  expect(game.get('a1')).toMatchObject({ id: ROOK, color: WHITE });
  expect(game.get('b1')).toMatchObject({ id: EMPTY });
  expect(game.get('c1')).toMatchObject({ id: EMPTY });
  expect(game.get('d1')).toMatchObject({ id: EMPTY });
  expect(game.get('e1')).toMatchObject({ id: EMPTY });
  expect(game.get('f1')).toMatchObject({ id: ROOK, color: WHITE });
  expect(game.get('g1')).toMatchObject({ id: KING, color: WHITE });
  expect(game.get('h1')).toMatchObject({ id: EMPTY });
}

function expectShortCastleBlack(game) {
  expect(game.pieces[0].map((p) => p.id).join('')).toBe('REEEERKE');
  expect(game.get('a8')).toMatchObject({ id: ROOK, color: BLACK });
  expect(game.get('b8')).toMatchObject({ id: EMPTY });
  expect(game.get('c8')).toMatchObject({ id: EMPTY });
  expect(game.get('d8')).toMatchObject({ id: EMPTY });
  expect(game.get('e8')).toMatchObject({ id: EMPTY });
  expect(game.get('f8')).toMatchObject({ id: ROOK, color: BLACK });
  expect(game.get('g8')).toMatchObject({ id: KING, color: BLACK });
  expect(game.get('h8')).toMatchObject({ id: EMPTY });
}

function expectLongCastleWhite(game) {
  expect(game.pieces[7].map((p) => p.id).join('')).toBe('EEKREEER');
  expect(game.get('a1')).toMatchObject({ id: EMPTY });
  expect(game.get('b1')).toMatchObject({ id: EMPTY });
  expect(game.get('c1')).toMatchObject({ id: KING, color: WHITE });
  expect(game.get('d1')).toMatchObject({ id: ROOK, color: WHITE });
  expect(game.get('e1')).toMatchObject({ id: EMPTY });
  expect(game.get('f1')).toMatchObject({ id: EMPTY });
  expect(game.get('g1')).toMatchObject({ id: EMPTY });
  expect(game.get('h1')).toMatchObject({ id: ROOK, color: WHITE });
}

function expectLongCastleBlack(game) {
  expect(game.pieces[0].map((p) => p.id).join('')).toBe('EEKREEER');
  expect(game.get('a8')).toMatchObject({ id: EMPTY });
  expect(game.get('b8')).toMatchObject({ id: EMPTY });
  expect(game.get('c8')).toMatchObject({ id: KING, color: BLACK });
  expect(game.get('d8')).toMatchObject({ id: ROOK, color: BLACK });
  expect(game.get('e8')).toMatchObject({ id: EMPTY });
  expect(game.get('f8')).toMatchObject({ id: EMPTY });
  expect(game.get('g8')).toMatchObject({ id: EMPTY });
  expect(game.get('h8')).toMatchObject({ id: ROOK, color: BLACK });
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

  it('after short castling (white)', () => {
    game = createGame(CASTLE_SETUP);
    expectCastlingSetup(game);

    move('e1', 'g1');
    expectShortCastleWhite(game);

    game = undo(game);
    expectCastlingSetup(game);

    // Undo should reset castling rights and let user castle later
    move('e1', 'g1');
    expectShortCastleWhite(game);

    game = undo(game);
    expectCastlingSetup(game);

    game = redo(game);
    expectShortCastleWhite(game);
  });

  it('after short castling (black)', () => {
    game = createGame(CASTLE_SETUP);
    expectCastlingSetup(game);

    move('a2', 'a3'); // Move white so black can move
    move('e8', 'g8');
    expectShortCastleBlack(game);

    game = undo(game);
    expectCastlingSetup(game);

    // Undo should reset castling rights and let user castle later
    move('e8', 'g8');
    expectShortCastleBlack(game);

    game = undo(game);
    expectCastlingSetup(game);

    game = redo(game);
    expectShortCastleBlack(game);
  });

  it('after long castling (white)', () => {
    game = createGame(CASTLE_SETUP);
    expectCastlingSetup(game);

    move('e1', 'c1');
    expectLongCastleWhite(game);

    game = undo(game);
    expectCastlingSetup(game);

    // Undo should reset castling rights and let user castle later
    move('e1', 'c1');
    expectLongCastleWhite(game);

    game = undo(game);
    expectCastlingSetup(game);

    game = redo(game);
    expectLongCastleWhite(game);
  });

  it('after long castling (black)', () => {
    game = createGame(CASTLE_SETUP);
    expectCastlingSetup(game);

    move('a2', 'a3'); // Move white so black can move
    move('e8', 'c8');
    expectLongCastleBlack(game);

    game = undo(game);
    expectCastlingSetup(game);

    // Undo should reset castling rights and let user castle later
    move('e8', 'c8');
    expectLongCastleBlack(game);

    game = undo(game);
    expectCastlingSetup(game);

    game = redo(game);
    expectLongCastleBlack(game);
  });

  it('after en passant (black)', () => {
    game = createGame(EN_PASSANT_SETUP);
    expect(game.get('c4')).toMatchObject({ id: PAWN, color: BLACK });

    // Move into passant position
    move('b2', 'b4');

    move('c4', 'b3');
    expect(game.get('b3')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('b4')).toMatchObject({ id: EMPTY });
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    expect(game.get('c4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('d4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});

    // Undo should reset en passant rights and let user take
    move('c4', 'b3');
    expect(game.get('b3')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('b4')).toMatchObject({ id: EMPTY });
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    expect(game.get('c4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('d4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});

    game = redo(game);
    expect(game.get('b3')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('b4')).toMatchObject({ id: EMPTY });
    expect(game.blackTaken).toEqual({ [PAWN]: 1 });
  });

  it('after en passant (white)', () => {
    game = createGame(EN_PASSANT_SETUP);
    expect(game.get('f5')).toMatchObject({ id: PAWN, color: WHITE });

    // White move so black can move
    move('a2', 'a3');
    // Black move into passant position
    move('g7', 'g5');
    move('f5', 'g6');
    expect(game.get('g6')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('g5')).toMatchObject({ id: EMPTY });
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    expect(game.get('g5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('f5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.whiteTaken).toEqual({});

    // Undo should reset en passant rights and let user take
    move('f5', 'g6');
    expect(game.get('g6')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('g5')).toMatchObject({ id: EMPTY });
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });

    game = undo(game);
    expect(game.get('g5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('f5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.whiteTaken).toEqual({});

    game = redo(game);
    expect(game.get('g6')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.get('g5')).toMatchObject({ id: EMPTY });
    expect(game.whiteTaken).toEqual({ [PAWN]: 1 });
  });

  it('en passant is only valid on next turn (black)', () => {
    game = createGame(EN_PASSANT_SETUP);
    expect(game.get('c4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('d4')).toMatchObject({ id: PAWN, color: WHITE });

    // Move into passant position
    move('b2', 'b4');
    // Tries to take the pawn that moved into position the previous turn
    move('c4', 'd3');

    expect(game.get('c4')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('d4')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.blackTaken).toEqual({});
  });

  it('en passant is only valid on next turn (white)', () => {
    game = createGame(EN_PASSANT_SETUP);
    expect(game.get('e5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('f5')).toMatchObject({ id: PAWN, color: WHITE });

    // White move so black can move
    move('a2', 'a3');
    // Move into passant position
    move('g7', 'g5');
    // Tries to take the pawn that moved into position the previous turn
    move('f5', 'e6');

    expect(game.get('e5')).toMatchObject({ id: PAWN, color: BLACK });
    expect(game.get('f5')).toMatchObject({ id: PAWN, color: WHITE });
    expect(game.whiteTaken).toEqual({});
  });
});
