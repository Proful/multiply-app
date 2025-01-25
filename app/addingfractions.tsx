import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Fraction from "@/components/Fraction";
import Svg, { Line } from "react-native-svg";
import {
  compareFloat,
  getRandomNumberFrom,
  getRandomNumberTill,
  lcm,
} from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function AddingFractions() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number[]>([0, 0]);
  const [secondNumber, setSecondNumber] = useState<number[]>([0, 0]);
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
    setFirstNumber([a1, a]);
    setSecondNumber([b1, b]);
    setResult("");
    setIsCommonDenominator(false);
    setNumerator("");
    setDenominator("");
  }

  useFocusEffect(useCallback(setup, []));

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

  return (
    <View
      style={[
        sharedStyles.screenContainer,
        {
          backgroundColor: cardBg,
        },
      ]}
    >
      <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
        <Ionicons name="refresh-circle" size={50} color={`${cardBgTint}`} />
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
          <Text style={{ fontSize: 24, margin: 10, color: colors.card.fg }}>
            +
          </Text>
        </View>
        <Fraction numerator={secondNumber[0]} denominator={secondNumber[1]} />
      </View>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 42, color: colors.card.fg }}>
          ={" "}
        </Text>
        <View>
          <View>
            <TextInput
              style={{ fontSize: 24, color: colors.card.fg }}
              placeholder={"?"}
              value={numerator}
              onChangeText={(txt) => {
                setNumerator(txt);

                if (txt && Number(denominator) !== 0) {
                  const ans =
                    firstNumber[0] / firstNumber[1] +
                    secondNumber[0] / secondNumber[1];
                  if (compareFloat(Number(txt) / Number(denominator), ans)) {
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
            style={{ fontSize: 24, color: colors.card.fg }}
            placeholder={"?"}
            value={denominator}
            onChangeText={(txt) => {
              setDenominator(txt);
              if (txt) {
                const ans =
                  firstNumber[0] / firstNumber[1] +
                  secondNumber[0] / secondNumber[1];
                if (compareFloat(Number(numerator) / Number(txt), ans)) {
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
      <View style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 20 }}>
        <Text style={{ color: colors.card.fg }}>
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
        <Line
          x1="0"
          y1="10"
          x2="200"
          y2="10"
          stroke={colors.card.fg}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};
