import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

interface ResultButtonProps {
  result: string;
}

const ResultButton: React.FC<ResultButtonProps> = ({ result }) => {
  return (
    <>
      {result === "correct" && (
        <View style={styles.resultButton}>
          <Ionicons name="checkmark-circle-outline" size={50} color="green" />
        </View>
      )}
      {result === "wrong" && (
        <View style={styles.resultButton}>
          <Ionicons name="close-circle-outline" size={50} color="red" />
        </View>
      )}
      {result === "correct" && (
        <ConfettiCannon
          count={200} // Number of particles
          origin={{ x: 200, y: 0 }} // Origin of the confetti (top-center)
          autoStart={true} // Automatically trigger confetti
          fadeOut={true} // Confetti fades out
          explosionSpeed={350} // Speed of the particles
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  resultButton: { position: "absolute", top: 10, left: 10 },
});

export default ResultButton;
