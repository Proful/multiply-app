import { Text, View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import Fraction from "@/components/Fraction";

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
    <View
      style={{
        flex: 1,
      }}
    >
      <Fraction numerator={firstNumber} denominator={secondNumber} />
      <View>
        <Text>=</Text>
        <TextInput
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
      <View>
        <Text>Result: {result}</Text>
      </View>
    </View>
  );
}
