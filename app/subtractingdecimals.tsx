import { Text, View, TextInput, Button } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";

export default function SubtractingDecimals() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const options = [2, 4, 5, 10];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }
  useFocusEffect(
    useCallback(() => {
      const a = getRandomNumber();
      const b = getRandomNumber();
      setFirstNumber(Number("0." + (a > b ? a : b)));
      setSecondNumber(Number("0." + (a > b ? b : a)));
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
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 44 }}>
        {firstNumber} - {secondNumber}
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
              if (Number(txt) === firstNumber - secondNumber) {
                setResult("correct");
              } else {
                setResult("wrong");
              }
            }
          }}
        />
      </View>
      <View style={{ alignSelf: "flex-start", marginTop: 24 }}>
        <Text>Result: {result}</Text>
        <Button
          onPress={() => {
            const a = getRandomNumber();
            const b = getRandomNumber();
            setFirstNumber(Number("0." + (a > b ? a : b)));
            setSecondNumber(Number("0." + (a > b ? b : a)));
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
}
