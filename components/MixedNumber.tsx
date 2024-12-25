import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";

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
          <Text style={styles.wholeNumber}>
            {wholeNumber === 0 ? "" : wholeNumber}
          </Text>
          <View style={styles.fractionContainer}>
            <Text style={styles.numerator}>{numerator}</Text>
            <LineExample />
            <Text style={styles.denominator}>{denominator}</Text>
          </View>
        </View>
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
    // alignItems: "flex-start",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wholeNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  fractionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

export default MixedNumber;
