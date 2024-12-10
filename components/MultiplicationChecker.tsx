import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert, Button } from "react-native";

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

  useFocusEffect(
    useCallback(() => {
      setFirstNumber(generateTwoDigitNumber());
      setSecondNumber(generateTwoDigitNumber());
      setUserAnswer("");
      setResult("");
      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  // Initialize numbers on component mount
  // useEffect(() => {
  //   setFirstNumber(generateTwoDigitNumber());
  //   setSecondNumber(generateTwoDigitNumber());
  // }, []);

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
    <View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 44 }}>{"    " + firstNumber}</Text>

        <Text style={{ fontSize: 44 }}>{"X " + secondNumber}</Text>

        <Text style={{ fontSize: 44 }}>-----------</Text>

        <TextInput
          style={{ fontSize: 20, width: "60%" }}
          value={carry}
          onChangeText={setCarry}
          keyboardType="numeric"
          placeholder="carry"
        />

        <TextInput
          style={{ fontSize: 28, width: "60%" }}
          value={step1}
          onChangeText={setStep1}
          keyboardType="numeric"
          placeholder="Step 1"
        />

        <TextInput
          style={{ fontSize: 28, width: "60%" }}
          value={step2}
          onChangeText={setStep2}
          keyboardType="numeric"
          placeholder="Step 2"
        />
        <Text style={{ fontSize: 44 }}>-----------</Text>

        <TextInput
          style={{ fontSize: 28, width: "60%" }}
          value={userAnswer}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          placeholder="Enter your answer"
        />
      </View>
      <View style={{ alignSelf: "flex-start", marginTop: 24 }}>
        <Text>Result: {result}</Text>
        <Button
          onPress={() => {
            setFirstNumber(generateTwoDigitNumber());
            setSecondNumber(generateTwoDigitNumber());
            setUserAnswer("");
            setResult("");
          }}
          title="Reset"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </View>
  );
};

export default MultiplicationChecker;
