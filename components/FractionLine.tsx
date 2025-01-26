import { colors } from "@/lib/styles";
import { View } from "react-native";
import Svg, { Line } from "react-native-svg";

export const FractionLine = ({ w }: { w: number }) => {
  return (
    <View>
      <Svg height="10" width={w}>
        <Line
          x1="0"
          y1="10"
          x2={w}
          y2="10"
          stroke={colors.card.fg}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};
