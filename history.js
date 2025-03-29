export function createHistory() {
  const history = [];
  let pointer = 0;

  const inspect = () => history.join(' ');

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

  return { push, undo, redo, inspect };
}
