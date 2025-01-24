import { sharedStyles } from "@/lib/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    let intervalId: NodeJS.Timeout | undefined;
    let op = multiply;

    logic(op as () => AsyncGenerator<JSX.Element, void, unknown>);
    intervalId = setInterval(() => {
      logic(op as () => AsyncGenerator<JSX.Element, void, unknown>);
    }, INTERVAL_TIME);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={sharedStyles.screenContainer}>
      <View>{content}</View>
    </View>
  );
}
