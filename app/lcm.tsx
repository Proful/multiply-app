import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { getRandomMultiple, getRandomNumber, lcm } from "@/lib/utils";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";

export default function LCM() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const setup = () => {
    const a = getRandomMultiple(getRandomNumber())!;
    const b = getRandomMultiple(getRandomNumber())!;
    setFirstNumber(a);
    setSecondNumber(b);
    setUserAnswer("");
    setResult("");
  };
  useFocusEffect(
    useCallback(() => {
      setup();
      return () => {};
    }, []),
  );
  return (
    <>
      <View style={sharedStyles.screenContainer}>
        <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
          <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 44 }}>
            {firstNumber} and {secondNumber}
          </Text>
        </View>
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
                if (Number(txt) === lcm(firstNumber, secondNumber)) {
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
        </View>
      </View>
    </>
  );
}