import { Button, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import RadioInput from "@/components/RadioInput";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomNumber, leftPad } from "@/lib/utils";

export default function ComparingDecimals() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("option1");

  const handleRadioValueChange = (value: string) => {
    setSelectedOption(value);
    if (value === ">") {
      setResult(firstNumber > secondNumber ? "correct" : "wrong");
    } else if (value === "<") {
      setResult(firstNumber < secondNumber ? "correct" : "wrong");
    } else {
      setResult(firstNumber === secondNumber ? "correct" : "wrong");
    }
  };

  const setup = () => {
    const tmp = getRandomNumber(1, 99);
    const a = Number(tmp + "." + leftPad(getRandomNumber(1, 999), 3));
    const b = Number(tmp + "." + leftPad(getRandomNumber(1, 999), 3));
    setFirstNumber(a);
    setSecondNumber(b);
    setUserAnswer("");
    setResult("");
    setSelectedOption("");
  };

  useFocusEffect(useCallback(setup, []));

  return (
    <>
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
          }}
        >
          <Text style={{ fontSize: 44 }}>
            {firstNumber} ? {secondNumber}
          </Text>
        </View>
        <RadioInput
          options={[">", "<", "="]}
          value={selectedOption}
          onValueChange={handleRadioValueChange}
        />
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
    </>
  );
}
