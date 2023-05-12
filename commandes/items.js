export function duelRoll(min, max) {
    //Si pas de ratio (PVE) alors 0
  let roll = simpleDice(1, 10 + Number(this.dataDuel.ratioChallenger)) || 0;
  if (roll > 10) { roll = 10; }
  while (roll % 10 == 0 && roll > 0) {
      roll += simpleDice(1, 10);
  }
  return roll;
}

export function simpleDice(min, max) {
  min = Math.ceil(parseInt(min));
  max = Math.floor(parseInt(max));
  let result = Math.floor(Math.random() * (max - min)) + min;
  return result;
}

export function swDice(max, joker = false) {
  let jokerRoll = simpleDice(1, 6);
  let roll = simpleDice(1, max);

  if (jokerRoll == 6 && joker) {
    while (jokerRoll % 6 == 0) {
      jokerRoll += simpleDice(1, 6);
    }
  }
  while (roll % max == 0 && roll > 0) {
    roll += simpleDice(1, max);
  }
  if (joker && jokerRoll > roll) {
    roll = jokerRoll;
  }
  
  return roll;
}