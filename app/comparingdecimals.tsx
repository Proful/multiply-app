import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import RadioInput from "@/components/RadioInput";
import { colors, sharedStyles } from "@/lib/styles";
import { getRandomNumber, leftPad } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";

export default function ComparingDecimals() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("option1");
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

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

  if (!loaded && !error) {
    return null;
  }

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
        <ResetButton onReset={setup} />
        <ResultButton result={result} />

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <MText>
            {firstNumber} ? {secondNumber}
          </MText>
        </View>

        <RadioInput
          options={[">", "<", "="]}
          value={selectedOption}
          onValueChange={handleRadioValueChange}
        />
      </View>
    </>
  );
}
