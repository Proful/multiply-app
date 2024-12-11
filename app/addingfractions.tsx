import { Text, View, TextInput } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import Svg, { Line } from "react-native-svg";

export default function AddingFractions() {
  const [firstNumber, setFirstNumber] = useState<number[]>([0, 0]);
  const [secondNumber, setSecondNumber] = useState<number[]>([0, 0]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  function getRandomNumber(from: number) {
    const randomNumber = Math.floor(Math.random() * 10) + from;
    return randomNumber;
  }
  function getRandomNumberTill(till: number) {
    const randomNumber = Math.floor(Math.random() * till) + 1;
    return randomNumber;
  }
  useFocusEffect(
    useCallback(() => {
      const a = getRandomNumber(4);
      const a1 = getRandomNumberTill(a);
      const b = getRandomNumber(5);
      const b1 = getRandomNumberTill(b);
      setFirstNumber([a1, a]);
      setSecondNumber([b1, b]);
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
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Fraction numerator={firstNumber[0]} denominator={firstNumber[1]} />
        <View>
          <Text style={{ fontSize: 24, margin: 10 }}>+</Text>
        </View>
        <Fraction numerator={secondNumber[0]} denominator={secondNumber[1]} />
      </View>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 42 }}>= </Text>
        <View>
          <View>
            <TextInput
              style={{ fontSize: 24 }}
              placeholder={"Enter Numerator"}
              value={numerator}
              onChangeText={(txt) => {
                setNumerator(txt);

                if (txt && Number(denominator) !== 0) {
                  const ans =
                    firstNumber[0] / firstNumber[1] +
                    secondNumber[0] / secondNumber[1];
                  if (Number(txt) / Number(denominator) === ans) {
                    setResult("correct");
                  } else {
                    setResult("wrong");
                  }
                }
              }}
            />
          </View>
          <FractionLine />
          <TextInput
            style={{ fontSize: 24 }}
            placeholder={"Enter Denominator"}
            value={denominator}
            onChangeText={(txt) => {
              setDenominator(txt);
            }}
          />
        </View>
      </View>
      <View style={{ alignSelf: "flex-start" }}>
        <Text>Result: {result}</Text>
      </View>
    </View>
  );
}

const FractionLine = () => {
  return (
    <View>
      <Svg height="10" width="200">
        <Line x1="0" y1="10" x2="200" y2="10" stroke="black" strokeWidth="2" />
      </Svg>
    </View>
  );
};
