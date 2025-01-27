import { View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { colors, sharedStyles } from "@/lib/styles";
import { useLocalSearchParams } from "expo-router";
import { darkenColor, getRandomNumberFromArray } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import { FractionLine } from "@/components/FractionLine";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";

export default function DecimalToFraction() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const setup = () => {
    const a = getRandomNumberFromArray([2, 4, 5, 10]);
    setFirstNumber(Number("0." + a));
    setNumerator("");
    setDenominator("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  function checkAnswer(text: string, type: string) {
    let b = numerator,
      c = denominator;

    if (type === "NUMERATOR") {
      b = text;
      setNumerator(b);
    } else if (type === "DENOMINATOR") {
      c = text;
      setDenominator(c);
    }

    if (b && c) {
      const isMatch = +b / +c === firstNumber;

      setResult(isMatch ? "correct" : "wrong");
    } else {
      setResult("wrong");
    }
  }

  if (!loaded && !error) {
    return null;
  }

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

  return (
    <View
      style={[
        sharedStyles.screenContainer,
        {
          backgroundColor: cardBg,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <ResetButton onReset={setup} />
      <ResultButton result={result} />

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 40,
          gap: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MText>{firstNumber}</MText>
        <MText>=</MText>
        <View>
          <TextInput
            style={sharedStyles.textInput}
            placeholderTextColor={colors.card.fg}
            placeholder={"?"}
            value={numerator}
            onChangeText={(txt) => checkAnswer(txt, "NUMERATOR")}
          />

          <FractionLine w={50} />

          <TextInput
            style={sharedStyles.textInput}
            placeholderTextColor={colors.card.fg}
            placeholder={"?"}
            value={denominator}
            onChangeText={(txt) => checkAnswer(txt, "DENOMINATOR")}
          />
        </View>
      </View>
    </View>
  );
}
