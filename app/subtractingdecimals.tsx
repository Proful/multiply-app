import { View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { compareFloatWithDifference, getRandomNumber } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import { FractionLine } from "@/components/FractionLine";
import FiveDigitInput from "@/components/FiveDigitInput";

export default function SubtractingDecimals() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [seed, setSeed] = useState<number>(0);
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const setup = () => {
    const a = getRandomNumber(100, 999);
    const b = getRandomNumber(100, 999);
    const c = Number("0." + (a > b ? a : b));
    const d = Number("0." + (a > b ? b : a));
    setFirstNumber(c);
    setSecondNumber(d);
    setResult("");
    setSeed(getRandomNumber(10, 999999));
  };

  useFocusEffect(useCallback(setup, []));

  if (!loaded && !error) {
    return null;
  }

  const checkAnswer = (digit: number) => {
    if (digit) {
      if (
        compareFloatWithDifference(Number(digit), firstNumber, secondNumber)
      ) {
        setResult("correct");
      } else {
        setResult("wrong");
      }
    }
  };

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

  return (
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
            {"-"}
          </MText>
        </View>

        <FractionLine w={200} />
        <FiveDigitInput onDigit={checkAnswer} seed={seed} />
      </View>

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
  );
}
