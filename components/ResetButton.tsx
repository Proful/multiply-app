import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ResetButtonProps {
  onReset: () => void; // Function to call when the button is pressed
  color?: string; // Optional color for the icon
  size?: number; // Optional size for the icon
  style?: object; // Optional additional styles for the button
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onReset: onPress,
  color = "rgba(255,255,255,0.5)", // Default color is black
  size = 50, // Default size
  style = {}, // Default empty style
}) => {
  return (
    <TouchableOpacity style={[styles.resetButton, style]} onPress={onPress}>
      <Ionicons name="refresh-circle" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: { position: "absolute", top: 10, right: 10 },
});

export default ResetButton;
