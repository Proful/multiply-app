import { Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import RadioInput from "@/components/RadioInput";

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
      console.log(a, b);
      setFirstNumber(a);
      setSecondNumber(b);
      setUserAnswer("");
      setResult("");
      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text>
          {firstNumber} ? {secondNumber}
        </Text>
      </View>
      <RadioInput
        options={[">", "<", "="]}
        value={selectedOption}
        onValueChange={handleRadioValueChange}
      />
      <View>
        <Text>Result: {result}</Text>
      </View>
    </View>
  );
}
