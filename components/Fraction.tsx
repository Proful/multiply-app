import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
interface FractionProps {
  numerator: number;
  denominator: number;
}

const Fraction: React.FC<FractionProps> = ({ numerator, denominator }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.numerator}>{numerator}</Text>
        <LineExample />
        {/* <View style={styles.line} /> */}
        <Text style={styles.denominator}>{denominator}</Text>
      </View>
    </View>
  );
};

const LineExample = () => (
  <View>
    <Svg height="10" width="50">
      <Line x1="0" y1="10" x2="50" y2="10" stroke="black" strokeWidth="2" />
    </Svg>
  </View>
);
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  numerator: {
    fontSize: 24,
    fontWeight: "bold",
  },
  line: {
    width: "150%",
    height: 2,
    backgroundColor: "black",
    marginVertical: 4,
  },
  denominator: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Fraction;
