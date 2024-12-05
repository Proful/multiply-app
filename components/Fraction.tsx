import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FractionProps {
  numerator: number;
  denominator: number;
}

const Fraction: React.FC<FractionProps> = ({ numerator, denominator }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.numerator}>{numerator}</Text>
        <View style={styles.line} />
        <Text style={styles.denominator}>{denominator}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  numerator: {
    fontSize: 14,
    fontWeight: "bold",
  },
  line: {
    width: "150%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 4,
  },
  denominator: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Fraction;
