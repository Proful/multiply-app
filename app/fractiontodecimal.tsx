import { View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import { colors, sharedStyles } from "@/lib/styles";
import { getRandomNumber, getRandomNumberFromArray } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";

export default function FractionToDecimal() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const setup = () => {
    const a = getRandomNumberFromArray([2, 4, 5, 10]);
    const b = getRandomNumber(1, a - 1);
    setFirstNumber(b);
    setSecondNumber(a);
    setUserAnswer("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  const checkAnswer = (txt: string) => {
    setUserAnswer(txt);
    if (txt) {
      if (Number(txt) === firstNumber / secondNumber) {
        setResult("correct");
      } else {
        setResult("wrong");
      }
    }
  };

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

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
      <ResetButton onReset={setup} />
      <ResultButton result={result} />

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 30,
          gap: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fraction numerator={firstNumber} denominator={secondNumber} />
        <MText>=</MText>
        <TextInput
          style={sharedStyles.textInput}
          placeholderTextColor={colors.card.fg}
          placeholder={"?"}
          keyboardType="numeric"
          value={userAnswer}
          onChangeText={checkAnswer}
        />
      </View>
    </View>
  );
}
