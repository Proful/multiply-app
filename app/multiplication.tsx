import { colors, sharedStyles } from "@/lib/styles";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { darkenColor, getRandomNumber, l } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import MultiplicationAnimator from "./multiplication_animator";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);

  useEffect(() => {
    setup();
  }, []);

  const setup = () => {
    setFirstNumber(getRandomNumber(10, 99));
    setSecondNumber(getRandomNumber(10, 99));
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
        <TouchableOpacity
          style={[
            sharedStyles.practiceButton,
            {
              backgroundColor: cardBgTint,
              zIndex: 10,
              width: 34,
              height: 34,
              borderRadius: 17,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={() => {
            router.push(`/multiplication_practice?id=${id}`);
          }}
        >
          <AntDesign name="form" size={24} color={`${cardBg}`} />
        </TouchableOpacity>
        {firstNumber > 0 && secondNumber > 0 && (
          <MultiplicationAnimator
            multiplicand={firstNumber}
            multiplier={secondNumber}
          />
        )}
      </View>
    </>
  );
}
