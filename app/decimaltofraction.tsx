import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import Svg, { Line } from "react-native-svg";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function DecimalToFraction() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function getRandomNumber() {
    const options = [2, 4, 5, 10];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  const setup = () => {
    const a = getRandomNumber();
    setFirstNumber(Number("0." + a));
    setNumerator("");
    setDenominator("");
    setResult("");
  };

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
      <Text style={{ fontSize: 44, color: colors.card.fg }}>{firstNumber}</Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 45, color: colors.card.fg }}>
          ={" "}
        </Text>
        <View>
          <TextInput
            style={{ fontSize: 24, color: colors.card.fg }}
            placeholder={"?"}
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
                stroke={colors.card.fg}
                strokeWidth="2"
              />
            </Svg>
          </View>
          <TextInput
            style={{ fontSize: 24, color: colors.card.fg }}
            placeholder={"?"}
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
