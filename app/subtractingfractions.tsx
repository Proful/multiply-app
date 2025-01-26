import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import Svg, { Line } from "react-native-svg";
import {
  compareFloat,
  getRandomNumberFrom,
  getRandomNumberTill,
  lcm,
} from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { FractionLine } from "@/components/FractionLine";
import { useFonts } from "expo-font";
import MText from "@/components/MText";

export default function SubtractingFractions() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number[]>([0, 0]);
  const [secondNumber, setSecondNumber] = useState<number[]>([0, 0]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isCommonDenominator, setIsCommonDenominator] =
    useState<boolean>(false);

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

    if (a1 / a > b1 / b) {
      setFirstNumber([a1, a]);
      setSecondNumber([b1, b]);
    } else {
      setFirstNumber([b1, b]);
      setSecondNumber([a1, a]);
    }

    setUserAnswer("");
    setResult("");
    setIsCommonDenominator(false);
    setNumerator("");
    setDenominator("");
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
        firstNumber[0] / firstNumber[1] - secondNumber[0] / secondNumber[1];
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Fraction numerator={firstNumber[0]} denominator={firstNumber[1]} />
        <MText>-</MText>
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
          <TextInput
            style={sharedStyles.textInput}
            placeholderTextColor={colors.card.fg}
            placeholder={"?"}
            value={numerator}
            onChangeText={(txt) => checkAnswer(txt, "NUMERATOR")}
          />

          <FractionLine w={200} />

          <TextInput
            style={sharedStyles.textInput}
            placeholderTextColor={colors.card.fg}
            placeholder={"?"}
            value={denominator}
            onChangeText={(txt) => checkAnswer(txt, "DENOMINATOR")}
          />
        </View>
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
      <View style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 20 }}>
        <Text style={{ color: colors.card.fg }}>
          Is common denominator? {isCommonDenominator ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}
