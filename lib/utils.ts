export function getRandomNumber() {
  const options = [2, 3, 5];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}
export function getRandomMultiple(w: number) {
  // Generate all multiples of w in the range 1 to 50
  const multiples = [];
  for (let i = w; i <= 30; i += w) {
    multiples.push(i);
  }

  // If there are no multiples, return null
  if (multiples.length === 0) {
    return null;
  }

  // Select a random multiple
  const randomIndex = Math.floor(Math.random() * multiples.length);
  return multiples[randomIndex];
}
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
export function lcmOfThree(a: number, b: number, c: number): number {
  return lcm(lcm(a, b), c);
}
export function getRandomNumberFrom(from: number) {
  const randomNumber = Math.floor(Math.random() * 10) + from;
  return randomNumber;
}
export function getRandomNumberTill(till: number) {
  const randomNumber = Math.floor(Math.random() * till) + 1;
  return randomNumber;
}
