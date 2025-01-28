import { colors, sharedStyles } from "@/lib/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import MText from "@/components/MText";
import { getRandomNumber } from "@/lib/utils";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const INTERVAL_TIME = 4000; //display Question
const TIMEOUT_TIME = 2000; //display answer
const STORAGE_KEY = "timestable";
const FROM_VALUE = 2;
const TO_VALUE = 10;

export default function TimestablePractice() {
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });
  const { id, fromValue, toValue } = useLocalSearchParams();
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Create shared values for opacity transitions
  const questionOpacity = useSharedValue(1);
  const answerOpacity = useSharedValue(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    const generateNewNumbers = () => {
      const newA = getRandomNumber(
        +fromValue || FROM_VALUE,
        +toValue || TO_VALUE,
      );
      const newB = getRandomNumber(2, 9);
      setA(newA);
      setB(newB);
      setShowAnswer(false);
      questionOpacity.value = 1;
      answerOpacity.value = 0;

      // Show answer after delay
      timeoutId = setTimeout(() => {
        questionOpacity.value = withTiming(0, { duration: 800 });
        answerOpacity.value = withTiming(1, { duration: 800 });
        setShowAnswer(true);
      }, TIMEOUT_TIME);
    };

    // Initial generation
    generateNewNumbers();

    // Set up interval for subsequent generations
    intervalId = setInterval(generateNewNumbers, INTERVAL_TIME);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
    position: "absolute",
  }));

  const answerStyle = useAnimatedStyle(() => ({
    opacity: answerOpacity.value,
    position: "absolute",
  }));

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
      <View style={{ flexDirection: "row" }}>
        <MText>{`${a} X ${b} = `}</MText>
        <View>
          <Animated.Text style={[sharedStyles.defaultText, questionStyle]}>
            ?
          </Animated.Text>
          <Animated.Text style={[sharedStyles.defaultText, answerStyle]}>
            {a * b}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}
