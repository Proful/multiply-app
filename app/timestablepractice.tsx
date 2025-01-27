import { colors, sharedStyles } from "@/lib/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import MText from "@/components/MText";
import { getRandomNumber } from "@/lib/utils";

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

  const a = getRandomNumber(fromValue, toValue);
  const b = getRandomNumber(2, 9);

  yield <MText>{`${a} X ${b} = ?`}</MText>;
  yield <MText>{`${a} X ${b} = ${a * b}`}</MText>;
};

export default function TimestablePractice() {
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });
  const { id } = useLocalSearchParams();
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

  const cardBg = colors.card[+(id as string) % 10];

  if (!loaded && !error) {
    return null;
  }
  return (
    <View
      style={[
        sharedStyles.screenContainer,
        {
          backgroundColor: cardBg,
        },
      ]}
    >
      <View>{content}</View>
    </View>
  );
}
