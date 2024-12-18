import { Button, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import RadioInput from "@/components/RadioInput";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

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
  // Generate random 2 digit number (10-99)
  const generateTwoDigitNumber = (): number => {
    return Math.floor(Math.random() * 90) + 10;
  };

  useFocusEffect(
    useCallback(() => {
      const tmp = generateTwoDigitNumber();
      const a = Number(tmp + "." + generateTwoDigitNumber());
      const b = Number(tmp + "." + generateTwoDigitNumber());
      setFirstNumber(a);
      setSecondNumber(b);
      setUserAnswer("");
      setResult("");
      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  return (
    <>
      <View style={sharedStyles.screenContainer}>
        <TouchableOpacity
          style={sharedStyles.resetButton}
          onPress={() => {
            const tmp = generateTwoDigitNumber();
            const a = Number(tmp + "." + generateTwoDigitNumber());
            const b = Number(tmp + "." + generateTwoDigitNumber());
            setFirstNumber(a);
            setSecondNumber(b);
            setUserAnswer("");
            setResult("");
            setSelectedOption("a");
          }}
        >
          <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
        </TouchableOpacity>
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
        <View style={{ alignSelf: "flex-start", marginTop: 24 }}>
          <Text>Result: {result}</Text>
        </View>
      </View>
    </>
  );
}
