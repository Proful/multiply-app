import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomNumber, getRandomNumberFromArray } from "@/lib/utils";

export default function FractionToDecimal() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const setup = () => {
    const a = getRandomNumberFromArray([2, 4, 5, 10]);
    const b = getRandomNumber(1, a - 1);
    setFirstNumber(b);
    setSecondNumber(a);
    setUserAnswer("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  return (
    <View style={sharedStyles.screenContainer}>
      <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
        <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
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
        <Text style={{ fontSize: 24 }}>= </Text>
        <TextInput
          style={{ fontSize: 24, width: "20%" }}
          placeholder={"?"}
          keyboardType="numeric"
          value={userAnswer}
          onChangeText={(txt) => {
            setUserAnswer(txt);
            if (txt) {
              if (Number(txt) === firstNumber / secondNumber) {
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
