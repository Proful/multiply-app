import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import RadioInput from "@/components/RadioInput";
import { colors, sharedStyles } from "@/lib/styles";
import { getRandomNumber, leftPad, rightPad } from "@/lib/utils";
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

    if (value === "Greater than (>)") {
      setResult(firstNumber > secondNumber ? "correct" : "wrong");
    } else if (value === "Less than (<)") {
      setResult(firstNumber < secondNumber ? "correct" : "wrong");
    } else {
      setResult(firstNumber === secondNumber ? "correct" : "wrong");
    }
  };

  const setup = () => {
    const tmp = getRandomNumber(1, 99);
    const a = Number(tmp + "." + getRandomNumber(100, 999));
    const b = Number(tmp + "." + getRandomNumber(100, 999));
    setFirstNumber(a);
    setSecondNumber(b);
    setResult("");
    setSelectedOption("");
  };

  useFocusEffect(useCallback(setup, []));

  const cardBg = colors.card[+(id as string) % 10];

  if (!loaded && !error) {
    return null;
  }

  const x = rightPad(firstNumber, 5);
  const y = rightPad(secondNumber, 5);

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
            {x} ? {y}
          </MText>
        </View>

        <RadioInput
          options={["Greater than (>)", "Less than (<)", "Equal to (=)"]}
          value={selectedOption}
          onValueChange={handleRadioValueChange}
        />
      </View>
    </>
  );
}
