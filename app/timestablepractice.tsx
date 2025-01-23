import AnimatedDigit from "@/components/AnimatedDigit";
import { sharedStyles } from "@/lib/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

//Animation is overkill
export function Question({ value }: { value: string }) {
  // return (
  //   <AnimatedDigit digit={value} style={{ width: "100%", fontSize: 36 }} />
  // );
  return <Text style={{ fontSize: 36 }}>{value}</Text>;
}
export function Answer({ value }: { value: string }) {
  // return (
  //   <AnimatedDigit digit={value} style={{ width: "100%", fontSize: 36 }} />
  // );
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

const INTERVAL_TIME = 4000; //display Question
const TIMEOUT_TIME = 2000; //display answer
const STORAGE_KEY = "timestable";
const FROM_VALUE = 2;
const TO_VALUE = 10;

const multiply = async function* (): AsyncGenerator<
  JSX.Element,
  void,
  unknown
> {
  // const loadStoredData = async () => {
  let fromValue = FROM_VALUE,
    toValue = TO_VALUE;
  try {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      const { from, to } = JSON.parse(storedValue);
      fromValue = Number(from);
      toValue = Number(to);
    }
  } catch (error) {
    console.error("Failed to load data from AsyncStorage:", error);
  }
  // };

  // loadStoredData();

  const a = random(fromValue, toValue);
  const b = random(2, 9);

  yield <Question value={`${a} X ${b} = ?`} />;
  yield <Answer value={`${a} X ${b} = ${a * b}`} />;
};

export default function TimestablePractice() {
  const [content, setContent] = useState(<></>);
  const logic = async (
    op: () => AsyncGenerator<JSX.Element, void, unknown>,
  ) => {
    const mul = op();
    setContent((await mul.next()).value!); //! I know for sure that the Generator will return data

    setTimeout(async () => {
      setContent((await mul.next()).value!);
    }, TIMEOUT_TIME);
  };

  useEffect(() => {
    let intervalId: unknown;
    let op = multiply;

    // if (optionsData.featureSubtype === FeaturesSubtype.Multiply) op = multiply;
    // else if (optionsData.featureSubtype === FeaturesSubtype.Divide) op = divide;
    // else op = multiply;

    logic(op as () => AsyncGenerator<JSX.Element, void, unknown>);
    intervalId = setInterval(() => {
      logic(op as () => AsyncGenerator<JSX.Element, void, unknown>);
    }, INTERVAL_TIME);

    return () => {
      //@ts-ignore
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={sharedStyles.screenContainer}>
      <View>{content}</View>
    </View>
  );
}
