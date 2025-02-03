import { colors, sharedStyles } from "@/lib/styles";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { getRandomNumber } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import ResetButton from "@/components/ResetButton";
import MultiplicationAnimator from "./mul";

const STORAGE_KEY = "multiplication";
export default function App() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);

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
    };

    loadStoredData();
  };

  useFocusEffect(useCallback(setup, []));
  const cardBg = colors.card[+(id as string) % 10];
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
        {firstNumber > 0 && secondNumber > 0 && (
          <MultiplicationAnimator
            multiplicand={firstNumber}
            multiplier={secondNumber}
          />
        )}
      </View>
    </>
  );
}
