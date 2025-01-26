import { colors } from "@/lib/styles";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
import { FractionLine } from "./FractionLine";
import MText from "./MText";

interface MexedNumberProps {
  wholeNumber: number;
  numerator: number;
  denominator: number;
}

const MixedNumber: React.FC<MexedNumberProps> = ({
  wholeNumber,
  numerator,
  denominator,
}) => {
  return (
    <View style={{ alignItems: "flex-start" }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MText>{wholeNumber === 0 ? "" : wholeNumber}</MText>
          <View style={styles.fractionContainer}>
            <MText>{numerator}</MText>
            <FractionLine w={50} />
            <MText>{denominator}</MText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: "flex-start",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wholeNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
    color: colors.card.fg,
  },
  fractionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

export default MixedNumber;
