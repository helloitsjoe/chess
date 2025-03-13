import { WHITE, BLACK, Pieces } from './constants.js';

const files = [
  { file: 'king', id: Pieces.KING },
  { file: 'queen', id: Pieces.QUEEN },
  { file: 'rook', id: Pieces.ROOK },
  { file: 'bishop', id: Pieces.BISHOP },
  { file: 'knight', id: Pieces.KNIGHT },
  { file: 'pawn', id: Pieces.PAWN },
];

const whiteSvgs = await Promise.all(
  files.map(({ file }) =>
    fetch(`./assets/white-${file}.svg`).then((res) => res.text()),
  ),
);

const blackSvgs = await Promise.all(
  files.map(({ file }) =>
    fetch(`./assets/black-${file}.svg`).then((res) => res.text()),
  ),
);

export const sprites = { [WHITE]: {}, [BLACK]: {} };

for (let i = 0; i < files.length; i++) {
  sprites[WHITE][files[i].id] = whiteSvgs[i];
  sprites[BLACK][files[i].id] = blackSvgs[i];
}
