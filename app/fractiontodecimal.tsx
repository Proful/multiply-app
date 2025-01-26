import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import { colors, fonts, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomNumber, getRandomNumberFromArray } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";

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
