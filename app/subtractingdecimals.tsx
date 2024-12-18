import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

export default function SubtractingDecimals() {
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    return randomNum;
    // const options = [2, 4, 5, 10];
    // const randomIndex = Math.floor(Math.random() * 10)+1;
    // return options[randomIndex];
  }
  useFocusEffect(
    useCallback(() => {
      const a = getRandomNumber();
      const b = getRandomNumber();
      const c = Number("0." + (a > b ? a : b));
      const d = Number("0." + (a > b ? b : a));
      console.log(c, d);
      setFirstNumber(c);
      setSecondNumber(d);
      setUserAnswer("");
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
          const b = getRandomNumber();
          const c = Number("0." + (a > b ? a : b));
          const d = Number("0." + (a > b ? b : a));
          setFirstNumber(c);
          setSecondNumber(d);
          setUserAnswer("");
          setResult("");
        }}
      >
        <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
      </TouchableOpacity>
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
      {result === "correct" && (
        <ConfettiCannon
          count={200} // Number of particles
          origin={{ x: 200, y: 0 }} // Origin of the confetti (top-center)
          autoStart={true} // Automatically trigger confetti
          fadeOut={true} // Confetti fades out
          explosionSpeed={350} // Speed of the particles
        />
      )}
      <View style={{ alignSelf: "flex-start", marginTop: 24 }}>
        <Text>Result: {result}</Text>
      </View>
    </View>
  );
}
