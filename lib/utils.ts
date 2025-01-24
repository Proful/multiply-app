export function getRandomNumber(
  min: number | undefined,
  max: number | undefined,
) {
  if (min === undefined) {
    const options = [2, 3, 5];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  } else {
    return Math.floor(Math.random() * (max! - min + 1)) + min;
  }
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
export function getRandomNumberFrom(from: number) {
  const randomNumber = Math.floor(Math.random() * 10) + from;
  return randomNumber;
}
export function getRandomNumberTill(till: number) {
  const randomNumber = Math.floor(Math.random() * till) + 1;
  return randomNumber;
}
export function getRandomNumberFromArray(arr: number[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
export function leftPad(num: number, targetLength: number): string {
  return num.toString().padStart(targetLength, "0");
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

export type MixedNumberType = [number, number, number]; // [whole, numerator, denominator]

export function compareMixedNumbersWithSumold(
  a: MixedNumberType,
  b: MixedNumberType,
  result: MixedNumberType,
): boolean {
  const toFraction = ([whole, num, denom]: MixedNumberType): number =>
    (whole * denom + num) / denom;

  const sum = (x: MixedNumberType, y: MixedNumberType): MixedNumberType => {
    const [wholeX, numX, denomX] = x;
    const [wholeY, numY, denomY] = y;

    const commonDenom = denomX * denomY;
    const numeratorSum =
      (wholeX * denomX + numX) * denomY + (wholeY * denomY + numY) * denomX;

    const wholePart = Math.floor(numeratorSum / commonDenom);
    const remainder = numeratorSum % commonDenom;

    return [wholePart, remainder, commonDenom];
  };

  const simplify = ([whole, num, denom]: MixedNumberType): MixedNumberType => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);

    return [whole, num / divisor, denom / divisor];
  };

  const simplifiedA = simplify(a);
  const simplifiedB = simplify(b);
  const simplifiedResult = simplify(result);

  return (
    JSON.stringify(simplify(sum(simplifiedA, simplifiedB))) ===
    JSON.stringify(simplifiedResult)
  );
}

export function mixedNumbersWithDifference(
  a: MixedNumberType,
  b: MixedNumberType,
): MixedNumberType {
  const difference = (
    x: MixedNumberType,
    y: MixedNumberType,
  ): MixedNumberType => {
    const [wholeX, numX, denomX] = x;
    const [wholeY, numY, denomY] = y;

    const commonDenom = denomX * denomY;
    const numeratorDifference =
      (wholeX * denomX + numX) * denomY - (wholeY * denomY + numY) * denomX;

    const wholePart = Math.floor(numeratorDifference / commonDenom);
    const remainder = numeratorDifference % commonDenom;

    return [wholePart, remainder, commonDenom];
  };

  const simplify = ([whole, num, denom]: MixedNumberType): MixedNumberType => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);

    return [whole, num / divisor, denom / divisor];
  };

  const simplifiedA = simplify(a);
  const simplifiedB = simplify(b);

  return simplify(difference(simplifiedA, simplifiedB));
}

export function compareMixedNumbersWithDifference(
  a: MixedNumberType,
  b: MixedNumberType,
  result: MixedNumberType,
): boolean {
  const toFraction = ([whole, num, denom]: MixedNumberType): number =>
    (whole * denom + num) / denom;

  const difference = (
    x: MixedNumberType,
    y: MixedNumberType,
  ): MixedNumberType => {
    const [wholeX, numX, denomX] = x;
    const [wholeY, numY, denomY] = y;

    const commonDenom = denomX * denomY;
    const numeratorDifference =
      (wholeX * denomX + numX) * denomY - (wholeY * denomY + numY) * denomX;

    const wholePart = Math.floor(numeratorDifference / commonDenom);
    const remainder = numeratorDifference % commonDenom;

    return [wholePart, remainder, commonDenom];
  };

  const simplify = ([whole, num, denom]: MixedNumberType): MixedNumberType => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);

    return [whole, num / divisor, denom / divisor];
  };

  const simplifiedA = simplify(a);
  const simplifiedB = simplify(b);
  const simplifiedResult = simplify(result);

  return (
    JSON.stringify(simplify(difference(simplifiedA, simplifiedB))) ===
    JSON.stringify(simplifiedResult)
  );
}

export function compareMixedNumbers(
  a: MixedNumberType,
  b: MixedNumberType,
): boolean {
  const toImproperFraction = ([whole, num, denom]: MixedNumberType): [
    number,
    number,
  ] => {
    const numerator = whole * denom + num;
    return [numerator, denom];
  };

  const simplifyFraction = ([num, denom]: [number, number]): [
    number,
    number,
  ] => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);
    return [num / divisor, denom / divisor];
  };

  const [aNumerator, aDenominator] = simplifyFraction(toImproperFraction(a));
  const [bNumerator, bDenominator] = simplifyFraction(toImproperFraction(b));

  // Compare fractions by cross multiplication to avoid floating-point errors
  return aNumerator * bDenominator >= bNumerator * aDenominator;
}

export function mixedNumbersWithSum(
  a: MixedNumberType,
  b: MixedNumberType,
): MixedNumberType {
  const toImproperFraction = ([whole, num, denom]: MixedNumberType): [
    number,
    number,
  ] => {
    const numerator = whole * denom + num; // Handles case when `whole` is 0
    return [numerator, denom];
  };

  const addFractions = (
    [num1, denom1]: [number, number],
    [num2, denom2]: [number, number],
  ): [number, number] => {
    const commonDenominator = denom1 * denom2;
    const numeratorSum = num1 * denom2 + num2 * denom1;
    return [numeratorSum, commonDenominator];
  };

  const simplifyFraction = ([num, denom]: [number, number]): [
    number,
    number,
  ] => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);
    return [num / divisor, denom / divisor];
  };

  const improperA = toImproperFraction(a);
  const improperB = toImproperFraction(b);

  // Add fractions
  const sum = addFractions(improperA, improperB);

  // Simplify sum and result for comparison
  const simplifiedSum = simplifyFraction(sum);

  // Compare fractions by cross multiplication
  return improperToMixedNumber(simplifiedSum);
}

function improperToMixedNumber(
  improper: [number, number],
): [number, number, number] {
  const [numerator, denominator] = improper;

  if (denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  const wholeNumber = Math.floor(numerator / denominator);
  const newNumerator = numerator % denominator;

  return [wholeNumber, newNumerator, denominator];
}
export function compareMixedNumbersWithSum(
  a: MixedNumberType,
  b: MixedNumberType,
  result: MixedNumberType,
): boolean {
  const toImproperFraction = ([whole, num, denom]: MixedNumberType): [
    number,
    number,
  ] => {
    const numerator = whole * denom + num; // Handles case when `whole` is 0
    return [numerator, denom];
  };

  const addFractions = (
    [num1, denom1]: [number, number],
    [num2, denom2]: [number, number],
  ): [number, number] => {
    const commonDenominator = denom1 * denom2;
    const numeratorSum = num1 * denom2 + num2 * denom1;
    return [numeratorSum, commonDenominator];
  };

  const simplifyFraction = ([num, denom]: [number, number]): [
    number,
    number,
  ] => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(num, denom);
    return [num / divisor, denom / divisor];
  };

  const improperA = toImproperFraction(a);
  const improperB = toImproperFraction(b);
  const improperResult = toImproperFraction(result);

  // Add fractions
  const sum = addFractions(improperA, improperB);

  // Simplify sum and result for comparison
  const simplifiedSum = simplifyFraction(sum);
  const simplifiedResult = simplifyFraction(improperResult);

  // Compare fractions by cross multiplication
  return (
    simplifiedSum[0] * simplifiedResult[1] ===
    simplifiedResult[0] * simplifiedSum[1]
  );
}
export function divide(
  dividend: number,
  divisor: number,
): { quotient: number; remainder: number } {
  if (divisor === 0) {
    throw new Error("Divisor cannot be zero.");
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  return { quotient, remainder };
}
export function compareFloat(a: number, b: number, epsilon = 1e-10) {
  const difference = a - b;
  return Math.abs(difference) < epsilon;
}
export function compareFloatWithDifference(
  value: number,
  a: number,
  b: number,
  epsilon = 1e-10,
) {
  const difference = a - b;
  return Math.abs(value - difference) < epsilon;
}
