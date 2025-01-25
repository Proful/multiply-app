import { Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import RadioInput from "@/components/RadioInput";
import { colors, sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomNumber, leftPad } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function ComparingDecimals() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("option1");

  const handleRadioValueChange = (value: string) => {
    setSelectedOption(value);
    if (value === ">") {
      setResult(firstNumber > secondNumber ? "correct" : "wrong");
    } else if (value === "<") {
      setResult(firstNumber < secondNumber ? "correct" : "wrong");
    } else {
      setResult(firstNumber === secondNumber ? "correct" : "wrong");
    }
  };

  const setup = () => {
    const tmp = getRandomNumber(1, 99);
    const a = Number(tmp + "." + leftPad(getRandomNumber(1, 999), 3));
    const b = Number(tmp + "." + leftPad(getRandomNumber(1, 999), 3));
    setFirstNumber(a);
    setSecondNumber(b);
    setResult("");
    setSelectedOption("");
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
            {firstNumber} ? {secondNumber}
          </Text>
        </View>
        <RadioInput
          options={[">", "<", "="]}
          value={selectedOption}
          onValueChange={handleRadioValueChange}
        />
        {result === "correct" && (
          <ConfettiCannon
            count={200} // Number of particles
            origin={{ x: 200, y: 0 }} // Origin of the confetti (top-center)
            autoStart={true} // Automatically trigger confetti
            fadeOut={true} // Confetti fades out
            explosionSpeed={350} // Speed of the particles
          />
        )}
      </View>
    </>
  );
}
