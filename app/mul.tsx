import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  x: number;
  y: number;
};

const STEP_DELAY = 2000;

const AnimatedDigit = ({
  digit,
  appearDelay,
  disappearDelay = 0,
  shouldFade = false,
}: {
  digit: string;
  appearDelay: number;
  disappearDelay?: number;
  shouldFade?: boolean;
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (shouldFade) {
      opacity.value = withDelay(
        appearDelay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(disappearDelay - 300, withTiming(0, { duration: 300 })),
        ),
      );
    } else {
      opacity.value = withDelay(appearDelay, withTiming(1, { duration: 300 }));
    }
  }, []);

  return (
    <Animated.Text
      style={[
        { fontFamily: "monospace" },
        useAnimatedStyle(() => ({ opacity: opacity.value })),
      ]}
    >
      {digit}
    </Animated.Text>
  );
};

const MultiplicationExplainer: React.FC<Props> = ({ x = 25, y = 34 }) => {
  // Split numbers into digits
  const [x1, x2] = String(x).padStart(2, "0").split("").map(Number);
  const [y1, y2] = String(y).padStart(2, "0").split("").map(Number);

  // Calculate first row (multiplying by y2)
  const firstDigitProduct = x2 * y2; // 5 × 4 = 20
  const carry1 = Math.floor(firstDigitProduct / 10); // carry 2
  const firstDigitResult = firstDigitProduct % 10; // write 0

  const secondDigitProduct = x1 * y2 + carry1; // (2 × 4) + 2 = 10

  // First row will show complete number 100
  const firstRowResult = y2 * x; // 4 × 25 = 100
  const firstRowDigits = String(firstRowResult).padStart(3, " ").split("");

  // Calculate second row (multiplying by y1)
  const secondRowProduct = y1 * x; // 3 × 25 = 75
  const secondRowDigits = String(secondRowProduct).padStart(2, " ").split("");

  const lines = {
    first: useSharedValue(0),
    second: useSharedValue(0),
  };

  useEffect(() => {
    lines.first.value = withDelay(0, withTiming(1, { duration: 300 }));
    lines.second.value = withDelay(
      8 * STEP_DELAY,
      withTiming(1, { duration: 300 }),
    );
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {/* Carried digits row */}
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", height: 20 }}
      >
        <AnimatedDigit digit="  " appearDelay={0} />
        {carry1 > 0 && (
          <AnimatedDigit
            digit={carry1.toString()}
            appearDelay={STEP_DELAY}
            disappearDelay={2 * STEP_DELAY}
            shouldFade={true}
          />
        )}
      </View>

      {/* First number */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <AnimatedDigit digit="  " appearDelay={0} />
        <AnimatedDigit digit={x1.toString()} appearDelay={0} />
        <AnimatedDigit digit=" " appearDelay={0} />
        <AnimatedDigit digit={x2.toString()} appearDelay={0} />
      </View>

      {/* Second number */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <AnimatedDigit digit="X " appearDelay={0} />
        <AnimatedDigit digit={y1.toString()} appearDelay={0} />
        <AnimatedDigit digit=" " appearDelay={0} />
        <AnimatedDigit digit={y2.toString()} appearDelay={0} />
      </View>

      {/* First line */}
      <Animated.Text
        style={[
          { fontFamily: "monospace" },
          useAnimatedStyle(() => ({ opacity: lines.first.value })),
        ]}
      >
        ---------
      </Animated.Text>

      {/* First row results (4 × 25 = 100) */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        {firstRowDigits.map((digit, index) => (
          <AnimatedDigit
            key={index}
            digit={digit}
            appearDelay={STEP_DELAY + index * STEP_DELAY}
          />
        ))}
      </View>

      {/* Second row results (3 × 25 = 75) */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        {secondRowDigits.map((digit, index) => (
          <AnimatedDigit
            key={index}
            digit={digit}
            appearDelay={4 * STEP_DELAY + index * STEP_DELAY}
          />
        ))}
      </View>

      {/* Final line */}
      <Animated.Text
        style={[
          { fontFamily: "monospace" },
          useAnimatedStyle(() => ({ opacity: lines.second.value })),
        ]}
      >
        ---------
      </Animated.Text>

      {/* Final result */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <AnimatedDigit
          digit={(x * y).toString()}
          appearDelay={7 * STEP_DELAY}
        />
      </View>
    </View>
  );
};

export default MultiplicationExplainer;
