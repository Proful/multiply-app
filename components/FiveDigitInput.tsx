import { colors, fonts } from "@/lib/styles";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

interface FiveDigitInputProps {
  seed: number;
  disabledIndex?: number;
  numOfDigits?: number;
  direction?: "L2R" | "R2L";
  onDigit?: (digit: number) => void;
}

const FiveDigitInput = ({
  seed,
  disabledIndex,
  numOfDigits,
  direction = "R2L",
  onDigit,
}: FiveDigitInputProps) => {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    setDigits(["", "", "", "", ""]);
  }, [seed]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; // Prevent more than 1 character
    if (!/^\d?(\.\d*)?$/.test(text)) return; // Allow digits and a single period

    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);

    if (onDigit) {
      onDigit(Number(newDigits.join("")));
    }

    if (text && direction === "R2L" && index > 0) {
      // Move to the prev input if available
      inputs.current[index - 1]?.focus();
    }
    if (text && direction === "L2R" && index < 4) {
      // Move to the next input if available
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      if (!digits[index] && direction === "R2L" && index < 0) {
        inputs.current[index + 1]?.focus();
      }
      if (!digits[index] && direction === "L2R" && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => {
        if (numOfDigits && index > numOfDigits - 1) {
          return;
        }
        return (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[
              styles.input,
              {
                borderColor:
                  disabledIndex !== index
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.2)",
              },
            ]}
            editable={disabledIndex !== index}
            ref={(ref) => {
              if (ref) inputs.current[index] = ref;
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  input: {
    borderWidth: 1,
    textAlign: "center",
    fontSize: fonts.secondary,
    marginHorizontal: 4,
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 8,
    color: colors.card.fg,
  },
});

export default FiveDigitInput;
