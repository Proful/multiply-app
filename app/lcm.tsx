import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { getRandomMultiple, getRandomNumber, lcm } from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function LCM() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const setup = () => {
    const a = getRandomMultiple(getRandomNumber(undefined, undefined))!;
    const b = getRandomMultiple(getRandomNumber(undefined, undefined))!;
    setFirstNumber(a);
    setSecondNumber(b);
    setUserAnswer("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

  return (
    <>
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
          <Text style={{ fontSize: 44, color: colors.card.fg }}>
            {firstNumber} and {secondNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 24, marginTop: 10, color: colors.card.fg }}>
            ={" "}
          </Text>
          <TextInput
            style={{ fontSize: 24, width: "55%", color: colors.card.fg }}
            placeholder={"?"}
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
      </View>
    </>
  );
}
