import { useEffect, useState } from "react";
import { View, Text } from "react-native";
export function Question({ value }: { value: string }) {
  return <Text style={{ fontSize: 36 }}>{value}</Text>;
}
export function Answer({ value }: { value: string }) {
  return <Text style={{ fontSize: 36 }}>{value}</Text>;
}
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export enum Operation {
  Add = "ADD",
  Subtract = "SUBTRACT",
  Multiply = "MULTIPLY",
  Divide = "DIVIDE",
}
export enum FeaturesSubtype {
  None = "NONE",
  Multiply = "MULTIPLY",
  Divide = "DIVIDE",
}

export enum Features {
  None = "NONE",
  PracticeFast = "PRACTICE_FAST",
  Operation = "OPERATION",
  MultiplicationTable = "MULTIPLICATION_TABLE",
  FractionCompare = "FRACTION_COMPARE",
  FractionUnknown = "FRACTION_UNKNOWN",
  ToDecimal = "TO_DECIMAL",
  ToFraction = "TO_FRACTION",
  AddSubUnknown = "ADD_SUB_FRACTION",
  VedicMultiply = "VEDIC_MULTIPLY",
  VedicMultiplyBy11 = "VEDIC_MULTIPLY_BY_11",
  VedicDivideBy5 = "VEDIC_DIVIDE_BY_5",
  VedicMultiplyLeftSum10 = "VEDIC_MULTIPLY_LEFT_SUM_10",
  VedicMultiplyRightSum10 = "VEDIC_MULTIPLY_RIGHT_SUM_10",
}

export type OptionsData = {
  feature: Features;
  featureSubtype?: FeaturesSubtype;
  digits?: number;
  operation?: Operation;
  topDigits?: number;
  bottomDigits?: number;
};

const INTERVAL_TIME = 6000; //display Question
const TIMEOUT_TIME = 4000; //display answer

const multiply = function* (): Generator<JSX.Element, void, unknown> {
  // Chose random number from 2 to 9 for numerator & denominator
  const a = random(2, 15);
  const b = random(2, 9);

  yield <Question value={`${a} X ${b} = ?`} />;
  yield <Answer value={`${a} X ${b} = ${a * b}`} />;
};

const divide = function* () {
  const a = random(2, 9);
  const b = random(2, 9);
  const c = a * b;

  yield <Question value={`${c} ÷ ${b} = ?`} />;
  yield <Answer value={`${c} ÷ ${b} = ${a}`} />;
};

export const PracticeFast = () => {
  const [content, setContent] = useState(<></>);
  const optionsData = {
    feature: Features.PracticeFast,
    featureSubtype: FeaturesSubtype.Multiply,
  };
  const logic = (op: () => Generator<JSX.Element, void, unknown>) => {
    const mul = op();
    setContent(mul.next().value!); //! I know for sure that the Generator will return data

    setTimeout(() => {
      setContent(mul.next().value!);
    }, TIMEOUT_TIME);
  };

  useEffect(() => {
    console.log("load...123");
    let intervalId: unknown;
    let op: unknown;

    if (optionsData.featureSubtype === FeaturesSubtype.Multiply) op = multiply;
    else if (optionsData.featureSubtype === FeaturesSubtype.Divide) op = divide;
    else op = multiply;

    logic(op as () => Generator<JSX.Element, void, unknown>);
    intervalId = setInterval(() => {
      logic(op as () => Generator<JSX.Element, void, unknown>);
    }, INTERVAL_TIME);

    return () => {
      //@ts-ignore
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <View>{content}</View>
    </>
  );
};
