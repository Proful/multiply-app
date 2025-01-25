import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { compareFloatWithDifference } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function SubtractingDecimals() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    return randomNum;
  }

  const setup = () => {
    const a = getRandomNumber();
    const b = getRandomNumber();
    const c = Number("0." + (a > b ? a : b));
    const d = Number("0." + (a > b ? b : a));
    setFirstNumber(c);
    setSecondNumber(d);
    setUserAnswer("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

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
      <Text style={{ fontSize: 44, color: colors.card.fg }}>
        {firstNumber} - {secondNumber}
      </Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 10, color: colors.card.fg }}>
          ={" "}
        </Text>
        <TextInput
          style={{ fontSize: 24, width: "75%", color: colors.card.fg }}
          placeholder={"?"}
          value={userAnswer}
          onChangeText={(txt) => {
            setUserAnswer(txt);

            if (txt) {
              if (
                compareFloatWithDifference(
                  Number(txt),
                  firstNumber,
                  secondNumber,
                )
              ) {
                setResult("correct");
              } else {
                setResult("wrong");
              }
            }
          }}
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
