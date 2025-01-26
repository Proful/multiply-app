import { colors, fonts } from "@/lib/styles";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
import MText from "./MText";
import { FractionLine } from "./FractionLine";
interface FractionProps {
  numerator: number;
  denominator: number;
}

const Fraction: React.FC<FractionProps> = ({ numerator, denominator }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <MText>{numerator}</MText>
        <FractionLine w={30} />
        <MText>{denominator}</MText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  numerator: {
    fontSize: fonts.primary,
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
    fontSize: fonts.primary,
    fontWeight: "bold",
    color: colors.card.fg,
  },
});

export default Fraction;
