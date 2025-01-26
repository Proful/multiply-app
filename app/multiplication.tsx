import { colors, fonts, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Line } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";
import { darkenColor, getRandomNumber } from "@/lib/utils";
import FiveDigitInput from "@/components/FiveDigitInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import { FractionLine } from "@/components/FractionLine";

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
  const cardBgTint = darkenColor("#ffffff", 0.5);

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
        <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
          <Ionicons name="refresh-circle" size={50} color={`${cardBgTint}`} />
        </TouchableOpacity>
        {result === "correct" && (
          <View style={sharedStyles.resultButton}>
            <Ionicons name="checkmark-circle-outline" size={50} color="green" />
          </View>
        )}
        {result === "wrong" && (
          <View style={sharedStyles.resultButton}>
            <Ionicons name="close-circle-outline" size={50} color="red" />
          </View>
        )}
        <View style={{ alignItems: "center" }}>
          <MText>{firstNumber}</MText>

          <View>
            <MText>{secondNumber}</MText>
            <MText style={{ position: "absolute", top: 0, left: -40 }}>
              {"X"}
            </MText>
          </View>

          <FractionLine w={250} />
          <FiveDigitInput seed={seed} />
          <FiveDigitInput seed={seed} />
          <FractionLine w={250} />
          <FiveDigitInput onDigit={checkAnswer} seed={seed} />

          {result === "correct" && (
            <ConfettiCannon
              count={200} // Number of particles
              origin={{ x: 200, y: 0 }} // Origin of the confetti (top-center)
              autoStart={true} // Automatically trigger confetti
              fadeOut={true} // Confetti fades out
              explosionSpeed={350} // Speed of the particles
            />
          )}
        </View>
      </View>
    </>
  );
}

const Divider = () => (
  <View>
    <Svg height="10" width="250">
      <Line
        x1="0"
        y1="10"
        x2="250"
        y2="10"
        stroke={colors.card.fg}
        strokeWidth="2"
      />
    </Svg>
  </View>
);
