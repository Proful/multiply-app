import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Svg, { Line } from "react-native-svg";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";

export default function DecimalToFraction() {
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
    <View style={sharedStyles.screenContainer}>
      <TouchableOpacity
        style={sharedStyles.resetButton}
        onPress={() => {
          const a = getRandomNumber();
          setFirstNumber(Number("0." + a));
          setSecondNumber(a);
          setNumerator("");
          setDenominator("");
          setResult("");
        }}
      >
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
      <Text style={{ fontSize: 44 }}>{firstNumber}</Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 45 }}>= </Text>
        <View>
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
                stroke="black"
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
      </View>
    </View>
  );
}
