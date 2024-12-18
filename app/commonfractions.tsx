import { Button, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import Fraction from "@/components/Fraction";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

export default function CommonFractions() {
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
  function getRandomNumber() {
    const options = [2, 4, 5, 10];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }
  useFocusEffect(
    useCallback(() => {
      const a = getRandomNumber();
      const b = Math.floor(Math.random() * a);
      const c = b === 0 ? 1 : b;
      setFirstNumber(c);
      setSecondNumber(a);
      setUserAnswer("");
      setResult("");
      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  return (
    <View style={sharedStyles.screenContainer}>
      <TouchableOpacity
        style={sharedStyles.resetButton}
        onPress={() => {
          const a = getRandomNumber();
          const b = Math.floor(Math.random() * a);
          const c = b === 0 ? 1 : b;
          setFirstNumber(c);
          setSecondNumber(a);
          setUserAnswer("");
          setResult("");
        }}
      >
        <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
      </TouchableOpacity>
      <Fraction numerator={firstNumber} denominator={secondNumber} />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 13 }}>= </Text>
        <TextInput
          style={{ fontSize: 28 }}
          placeholder={"Enter your answer"}
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
      <View style={{ alignSelf: "flex-start", marginTop: 24 }}>
        <Text>Result: {result}</Text>
      </View>
    </View>
  );
}
