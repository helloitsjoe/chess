import { WHITE, BLACK } from './constants.js';

const files = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];

const whiteSvgs = await Promise.all(
  files.map((file) =>
    fetch(`./assets/white-${file}.svg`).then((res) => res.text()),
  ),
);

const blackSvgs = await Promise.all(
  files.map((file) =>
    fetch(`./assets/black-${file}.svg`).then((res) => res.text()),
  ),
);

export const sprites = { [WHITE]: {}, [BLACK]: {} };

for (let i = 0; i < files.length; i++) {
  sprites[WHITE][files[i]] = whiteSvgs[i];
  sprites[BLACK][files[i]] = blackSvgs[i];
}
