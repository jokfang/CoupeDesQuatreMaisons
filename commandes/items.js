export function getRandomInt(min, max) {
  let result = simpleDice(min, max);
  if (result > 10) {
    result = 10;
  } else if (result < 1) {
    result = 0;
  }
  return result;
}

export function simpleDice(min, max) {
  min = Math.ceil(parseInt(min));
  max = Math.floor(parseInt(max));
  let result = Math.floor(Math.random() * (max - min)) + min;
  return result;
}