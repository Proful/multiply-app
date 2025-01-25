import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  resetButton: { position: "absolute", top: 10, right: 10 },
  resultButton: { position: "absolute", top: 10, left: 10 },
  hintButton: { position: "absolute", bottom: 10, right: 10 },
  penButton: { position: "absolute", bottom: 10, left: 10 },
  quizButton: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const colors = {
  card: {
    0: "#4CAF50", // Green
    1: "#2196F3", // Blue
    2: "#FF5722", // Deep Orange
    3: "#607D8B", // Blue Gray
    4: "#FF9800", // Orange
    5: "#673AB7", // Deep Purple
    6: "#795548", // Brown
    7: "#03A9F4", // Light Blue
    8: "#E91E63", // Pink
    9: "#009688", // Teal
    fg: "#ffffff",
  } as any,
  primary: {
    bg: "#f9f9f9",
    fg: "black",
  },
};
