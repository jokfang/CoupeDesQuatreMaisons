export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let result = Math.floor(Math.random() * (max - min)) + min;
  if (result > 10) {
    result = 10;
  } else if (result < 1) {
    result = 0;
  }
  return result;
}