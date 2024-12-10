import { Text, View, TextInput, Button } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Svg, { Line } from "react-native-svg";

export default function CommonDecimalToFractions() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const options = [2, 4, 5, 10];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }
  useFocusEffect(
    useCallback(() => {
      const a = getRandomNumber();
      setFirstNumber(Number("0." + a));
      setSecondNumber(a);
      setNumerator("");
      setDenominator("");
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
      <Text style={{ fontSize: 44 }}>{firstNumber}</Text>
      <View>
        <Text style={{ fontSize: 24 }}>= </Text>
        <TextInput
          style={{ fontSize: 24 }}
          placeholder={"Enter Numerator"}
          value={numerator}
          onChangeText={(txt) => {
            setNumerator(txt);

            if (txt && Number(denominator) !== 0) {
              if (Number(txt) / Number(denominator) === firstNumber) {
                setResult("correct");
              } else {
                setResult("wrong");
              }
            }
          }}
        />
        <View>
          <Svg height="10" width="200">
            <Line
              x1="0"
              y1="10"
              x2="200"
              y2="10"
              stroke="blue"
              strokeWidth="2"
            />
          </Svg>
        </View>
        <TextInput
          style={{ fontSize: 24 }}
          placeholder={"Enter Denominator"}
          value={denominator}
          onChangeText={(txt) => {
            setDenominator(txt);
            if (txt && Number(txt) !== 0) {
              if (Number(numerator) / Number(txt) === firstNumber) {
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
            setFirstNumber(Number("0." + a));
            setSecondNumber(a);
            setNumerator("");
            setDenominator("");
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
