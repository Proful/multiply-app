import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import Svg, { Line } from "react-native-svg";
import { getRandomNumberFrom, getRandomNumberTill, lcm } from "@/lib/utils";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

export default function SubtractingFractions() {
  const [firstNumber, setFirstNumber] = useState<number[]>([0, 0]);
  const [secondNumber, setSecondNumber] = useState<number[]>([0, 0]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isCommonDenominator, setIsCommonDenominator] =
    useState<boolean>(false);

  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");

  function setup() {
    const a = getRandomNumberFrom(4);
    const a1 = getRandomNumberTill(a);
    const b = getRandomNumberFrom(5);
    const b1 = getRandomNumberTill(b);

    if (a1 / a > b1 / b) {
      setFirstNumber([a1, a]);
      setSecondNumber([b1, b]);
    } else {
      setFirstNumber([b1, b]);
      setSecondNumber([a1, a]);
    }

    setUserAnswer("");
    setResult("");
    setIsCommonDenominator(false);
    setNumerator("");
    setDenominator("");
  }

  useFocusEffect(useCallback(setup, []));

  return (
    <View style={sharedStyles.screenContainer}>
      <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
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
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Fraction numerator={firstNumber[0]} denominator={firstNumber[1]} />
        <View>
          <Text style={{ fontSize: 24, margin: 26 }}>-</Text>
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
                    firstNumber[0] / firstNumber[1] -
                    secondNumber[0] / secondNumber[1];
                  console.log("ans", ans);
                  if (
                    Number(txt) / Number(denominator) - ans <
                    Number.EPSILON
                  ) {
                    setResult("correct");
                  } else {
                    setResult("wrong");
                  }
                } else {
                  setResult("wrong");
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
              if (txt) {
                const ans =
                  firstNumber[0] / firstNumber[1] -
                  secondNumber[0] / secondNumber[1];
                console.log("ans2", ans);
                if (Number(txt) / Number(denominator) - ans < Number.EPSILON) {
                  setResult("correct");
                } else {
                  setResult("wrong");
                }
              } else {
                setResult("wrong");
              }
              if (txt && Number(txt) === lcm(firstNumber[1], secondNumber[1])) {
                setIsCommonDenominator(true);
              } else {
                setIsCommonDenominator(false);
              }
            }}
          />
        </View>
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
      <View style={{ alignSelf: "flex-start" }}>
        <Text>
          Is common denominator?: {isCommonDenominator ? "Yes" : "No"}
        </Text>
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
