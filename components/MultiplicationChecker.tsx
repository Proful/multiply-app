import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import Svg, { Line } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";

const MultiplicationChecker = () => {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [carry, setCarry] = useState<string>("");
  const [step1, setStep1] = useState<string>("");
  const [step2, setStep2] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Generate random 2 digit number (10-99)
  const generateTwoDigitNumber = (): number => {
    return Math.floor(Math.random() * 90) + 10;
  };

  const setup = () => {
    setFirstNumber(generateTwoDigitNumber());
    setSecondNumber(generateTwoDigitNumber());
    setUserAnswer("");
    setResult("");
    setCarry("");
    setStep1("");
    setStep2("");
  };

  useFocusEffect(useCallback(setup, []));

  // Check user's answer
  const checkAnswer = (input: string) => {
    const userValue = parseInt(input);
    const correctAnswer = firstNumber * secondNumber;

    if (userValue === correctAnswer) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    setUserAnswer(text);
    if (text.length > 0) {
      checkAnswer(text);
    }
  };

  return (
    <>
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
        {/* <Text style={{ fontSize: 14 }}>-----------</Text> */}

        {/* <TextInput */}
        {/*   style={{ */}
        {/*     fontSize: 20, */}
        {/*     width: "45%", */}
        {/*     textAlign: "right", */}
        {/*     letterSpacing: 12, */}
        {/*   }} */}
        {/*   value={carry} */}
        {/*   onChangeText={setCarry} */}
        {/*   keyboardType="numeric" */}
        {/*   placeholder="carry" */}
        {/*   selection={{ start: 0, end: 0 }} */}
        {/* /> */}

        <TextInput
          style={{
            fontSize: 28,
            width: "45%",
            textAlign: "right",
            letterSpacing: 12,
          }}
          value={step1}
          onChangeText={setStep1}
          keyboardType="numeric"
          placeholder="Step 1"
          selection={{ start: 0, end: 0 }}
        />

        <TextInput
          style={{
            fontSize: 28,
            width: "45%",
            textAlign: "right",
            letterSpacing: 12,
          }}
          value={step2}
          onChangeText={(txt) => {
            setStep2(txt);
          }}
          keyboardType="numeric"
          placeholder="Step 2"
          selection={{ start: 0, end: 0 }}
          onFocus={() => {
            if (!step2) {
              setStep2("0");
            }
          }}
        />
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

        <TextInput
          style={{
            fontSize: 28,
            width: "45%",
            textAlign: "right",
            letterSpacing: 12,
          }}
          value={userAnswer}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          placeholder="Answer"
          selection={{ start: 0, end: 0 }}
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
};

export default MultiplicationChecker;
