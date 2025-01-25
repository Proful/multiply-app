import { colors } from "@/lib/styles";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

interface FiveDigitInputProps {
  seed: number;
  onDigit?: (digit: number) => void;
}

const FiveDigitInput = ({ seed, onDigit }: FiveDigitInputProps) => {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    setDigits(["", "", "", "", ""]);
  }, [seed]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; // Prevent more than 1 character
    if (!/^\d?$/.test(text)) return; // Allow only digits

    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);

    if (onDigit) {
      onDigit(Number(newDigits.join("")));
    }

    if (text && index > 0) {
      // Move to the prev input if available
      inputs.current[index - 1]?.focus();
    }
    // if (text && index < 4) {
    //   // Move to the next input if available
    //   inputs.current[index + 1]?.focus();
    // }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index < 0) {
      inputs.current[index + 1]?.focus();
    }
    // if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
    //   inputs.current[index - 1]?.focus();
    // }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.input}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
        />
      ))}
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
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 4,
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 8,
    color: colors.card.fg,
  },
});

export default FiveDigitInput;
