import { colors } from "@/lib/styles";
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
    <Svg height="10" width="30">
      <Line
        x1="0"
        y1="10"
        x2="30"
        y2="10"
        stroke={colors.card.fg}
        strokeWidth="2"
      />
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
    color: colors.card.fg,
  },
  line: {
    width: "150%",
    height: 2,
    backgroundColor: colors.card.fg,
    marginVertical: 4,
  },
  denominator: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.card.fg,
  },
});

export default Fraction;
