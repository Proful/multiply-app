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
});
