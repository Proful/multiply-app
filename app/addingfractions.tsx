import { Text, View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import {
  compareFloat,
  getRandomNumber,
  getRandomNumberFrom,
  getRandomNumberTill,
  lcm,
} from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { useLocalSearchParams } from "expo-router";
import { FractionLine } from "@/components/FractionLine";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";
import FiveDigitInput from "@/components/FiveDigitInput";

export default function AddingFractions() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number[]>([0, 0]);
  const [secondNumber, setSecondNumber] = useState<number[]>([0, 0]);
  const [result, setResult] = useState<string>("");
  const [isCommonDenominator, setIsCommonDenominator] =
    useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  function setup() {
    const a = getRandomNumberFrom(4);
    const a1 = getRandomNumberTill(a);
    const b = getRandomNumberFrom(5);
    const b1 = getRandomNumberTill(b);
    setFirstNumber([a1, a]);
    setSecondNumber([b1, b]);
    setResult("");
    setIsCommonDenominator(false);
    setNumerator("");
    setDenominator("");
    setSeed(getRandomNumber(10, 999999));
  }

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

    if (c) {
      setIsCommonDenominator(+c === lcm(firstNumber[2], secondNumber[2]));
    }

    if (b && c) {
      const ans =
        firstNumber[0] / firstNumber[1] + secondNumber[0] / secondNumber[1];
      const isMatch = compareFloat(Number(b) / Number(c), ans);

      setResult(isMatch ? "correct" : "wrong");
    } else {
      setResult("wrong");
    }
  }

  if (!loaded && !error) {
    return null;
  }

  const cardBg = colors.card[+(id as string) % 10];

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
          alignItems: "center",
          gap: 10,
        }}
      >
        <Fraction numerator={firstNumber[0]} denominator={firstNumber[1]} />
        <MText>+</MText>
        <Fraction numerator={secondNumber[0]} denominator={secondNumber[1]} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <MText>=</MText>
        <View>
          <FiveDigitInput
            numOfDigits={2}
            seed={seed}
            direction="L2R"
            onDigit={(txt) => checkAnswer(txt + "", "NUMERATOR")}
          />

          <FractionLine w={150} />

          <FiveDigitInput
            numOfDigits={2}
            seed={seed}
            direction="L2R"
            onDigit={(txt) => checkAnswer(txt + "", "DENOMINATOR")}
          />
        </View>
      </View>
      <View style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 20 }}>
        <Text style={{ color: colors.card.fg }}>
          Is common denominator?: {isCommonDenominator ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}
