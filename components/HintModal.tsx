import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

interface HintModalProps {
  onCloseModal: () => void;
  children: React.ReactNode;
}

export default function HintModal({ onCloseModal, children }: HintModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Hint</Text>

        <View style={styles.body}>{children}</View>
        <TouchableOpacity style={styles.button} onPress={onCloseModal}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 4,
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(256, 256, 256, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    // backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 6,
    backgroundColor: "red",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  body: {
    marginVertical: 10,
    // height: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center", // Align vertically in the center
    justifyContent: "flex-start", // Align items from the start of the row
  },
  text: {
    marginRight: 20,
    fontSize: 16,
    // fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
