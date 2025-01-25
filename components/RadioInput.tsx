import { colors } from "@/lib/styles";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RadioInputProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  options,
  value,
  onValueChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleRadioPress = (option: string) => {
    setSelectedValue(option);
    onValueChange(option);
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioButton}
          onPress={() => handleRadioPress(option)}
        >
          <View
            style={[
              styles.radioButtonInner,
              selectedValue === option ? styles.selectedRadioButton : null,
            ]}
          />
          <Text style={styles.radioButtonLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
  },
  selectedRadioButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radioButtonLabel: {
    fontSize: 20,
    color: colors.card.fg,
  },
});

export default RadioInput;
