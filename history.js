export function createHistory() {
  const history = [];
  let pointer = 0;

  // TODO: 2d array white/black: [[w,b],[w,b]]
  const push = (move) => {
    pointer++;
    history.push(move);
  };

  const getLastMove = () => {
    if (pointer === 0) {
      return null;
    }
    pointer--;
    return history[pointer];
  };

  const getNextMove = () => {
    if (pointer >= history.length) {
      return null;
    }
    pointer++;
    return history[pointer - 1];
  };

  return { push, getLastMove, getNextMove };
}
