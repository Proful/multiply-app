import { colors, fonts, sharedStyles } from "@/lib/styles";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { darkenColor, getRandomNumber } from "@/lib/utils";
import FiveDigitInput from "@/components/FiveDigitInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import { FractionLine } from "@/components/FractionLine";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";

const STORAGE_KEY = "multiplication";
export default function Multiplication() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [seed, setSeed] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const setup = () => {
    const loadStoredData = async () => {
      let x = getRandomNumber(10, 99);
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue) {
          const { multiplicandDigit } = JSON.parse(storedValue);
          if (multiplicandDigit === 3) {
            x = getRandomNumber(100, 999);
          } else if (multiplicandDigit === 4) {
            x = getRandomNumber(1000, 9999);
          } else if (multiplicandDigit === 5) {
            x = getRandomNumber(10000, 99999);
          } else {
            x = getRandomNumber(10, 99);
          }
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage:", error);
      }

      setFirstNumber(x);
      setSecondNumber(getRandomNumber(10, 99));
      setSeed(getRandomNumber(10, 999999));
      setResult("");
    };

    loadStoredData();
  };

  useFocusEffect(useCallback(setup, []));

  const checkAnswer = (userValue: number) => {
    const correctAnswer = firstNumber * secondNumber;

    if (userValue === correctAnswer) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  const cardBg = colors.card[+(id as string) % 10];

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <View
        style={[
          sharedStyles.screenContainer,
          {
            backgroundColor: cardBg,
          },
        ]}
      >
        <ResetButton onReset={setup} />
        <ResultButton result={result} />

        <View style={{ alignItems: "center" }}>
          <MText style={{ letterSpacing: fonts.primary }}>{firstNumber}</MText>

          <View>
            <MText style={{ letterSpacing: fonts.primary }}>
              {secondNumber}
            </MText>
            <MText style={{ position: "absolute", top: 0, left: -40 }}>
              {"X"}
            </MText>
          </View>

          <FractionLine w={250} />
          <FiveDigitInput seed={seed} />
          <FiveDigitInput seed={seed} disabledIndex={4} />
          <FractionLine w={250} />
          <FiveDigitInput onDigit={checkAnswer} seed={seed} />
        </View>
      </View>
    </>
  );
}
