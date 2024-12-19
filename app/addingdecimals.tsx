import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

export default function AddingDecimals() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const options = [2, 4, 5, 10];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  const setup = () => {
    const a = getRandomNumber();
    const b = getRandomNumber();
    setFirstNumber(Number("0." + a));
    setSecondNumber(Number("0." + b));
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
      <Text style={{ fontSize: 44 }}>
        {firstNumber} + {secondNumber}
      </Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 10 }}>= </Text>
        <TextInput
          style={{ fontSize: 24 }}
          placeholder={"Enter Answer"}
          value={userAnswer}
          onChangeText={(txt) => {
            setUserAnswer(txt);

            if (txt) {
              const isAlmostEqual =
                Math.abs(firstNumber + secondNumber - Number(txt)) <
                Number.EPSILON;
              if (isAlmostEqual) {
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
