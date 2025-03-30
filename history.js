import { HISTORY_DELIMITER } from './constants.js';

export function createHistory(initialHistory = '') {
  const history = [...initialHistory];
  let pointer = 0;

  const toString = () => history.join(HISTORY_DELIMITER);

  // TODO: 2d array white/black: [[w,b],[w,b]]
  const push = (move) => {
    history.splice(pointer, Infinity);
    pointer++;
    history.push(move);
  };

  const undo = () => {
    if (pointer === 0) {
      return null;
    }
    pointer--;
    return history[pointer];
  };

  const redo = () => {
    if (pointer >= history.length) {
      return null;
    }
    pointer++;
    return history[pointer - 1];
  };

  return { push, undo, redo, toString };
}
