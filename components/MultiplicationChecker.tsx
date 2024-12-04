import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Alert } from "react-native";

const MultiplicationChecker = () => {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
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
      console.log("correct");
    } else {
      setResult("wrong");
      console.log("wrong");
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Line 1: First number */}
        <Text style={{ fontSize: 44 }}>{"    " + firstNumber}</Text>

        {/* Line 2: Second number */}
        <Text style={{ fontSize: 44 }}>{"X " + secondNumber}</Text>

        {/* Line 3: Divider */}
        <Text style={{ fontSize: 44 }}>-----------</Text>

        {/* Line 4: Input field */}
        <TextInput
          style={{ fontSize: 28, width: "60%" }}
          value={userAnswer}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          placeholder="Enter your answer"
        />
      </View>
      <View>
        <Text style={{ fontSize: 24, marginTop: 24 }}>Result: {result}</Text>
      </View>
    </View>
  );
};

export default MultiplicationChecker;
