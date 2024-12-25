import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Svg, { Line } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomNumber } from "@/lib/utils";
import FiveDigitInput from "@/components/FiveDigitInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "multiplication";
export default function Multiplication() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [seed, setSeed] = useState<number>(0);
  const [result, setResult] = useState<string>("");

  const setup = () => {
    const loadStoredData = async () => {
      let x = getRandomNumber(10, 99);
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue) {
          const { multiplicandDigit } = JSON.parse(storedValue);
          if (multiplicandDigit === 3) {
            x = getRandomNumber(100, 999);
          } else if (multiplicandDigit === 4) {
            x = getRandomNumber(1000, 9999);
          } else if (multiplicandDigit === 5) {
            x = getRandomNumber(10000, 99999);
          } else {
            x = getRandomNumber(10, 99);
          }
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage:", error);
      }

      setFirstNumber(x);
      setSecondNumber(getRandomNumber(10, 99));
      setSeed(getRandomNumber(10, 999999));
      setResult("");
    };

    loadStoredData();
  };

  useFocusEffect(useCallback(setup, []));

  const checkAnswer = (userValue: number) => {
    const correctAnswer = firstNumber * secondNumber;

    if (userValue === correctAnswer) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

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
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 44 }}>{"    " + firstNumber}</Text>

          <Text style={{ fontSize: 44 }}>{"X " + secondNumber}</Text>

          <View>
            <Svg height="10" width="250">
              <Line
                x1="0"
                y1="10"
                x2="250"
                y2="10"
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
          </View>

          <FiveDigitInput seed={seed} />
          <FiveDigitInput seed={seed} />
          <View>
            <Svg height="10" width="250">
              <Line
                x1="0"
                y1="10"
                x2="250"
                y2="10"
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
          </View>
          <FiveDigitInput onDigit={checkAnswer} seed={seed} />

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
      </View>
    </>
  );
}
