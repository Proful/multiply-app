import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { getRandomMultiple, getRandomNumber, lcm } from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";

export default function LCM() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const setup = () => {
    const a = getRandomMultiple(getRandomNumber(undefined, undefined))!;
    const b = getRandomMultiple(getRandomNumber(undefined, undefined))!;
    setFirstNumber(a);
    setSecondNumber(b);
    setUserAnswer("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  if (!loaded && !error) {
    return null;
  }

  const checkAnswer = (txt: string) => {
    setUserAnswer(txt);

    if (txt) {
      if (Number(txt) === lcm(firstNumber, secondNumber)) {
        setResult("correct");
      } else {
        setResult("wrong");
      }
    }
  };

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
          <MText>
            {firstNumber} and {secondNumber}
          </MText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <MText>=</MText>
          <TextInput
            style={sharedStyles.textInput}
            placeholderTextColor={colors.card.fg}
            placeholder={"?"}
            value={userAnswer}
            onChangeText={checkAnswer}
          />
        </View>
      </View>
    </>
  );
}
