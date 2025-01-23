import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

interface AnimatedDigitProps {
  digit: string | number;
  style?: object;
}

export default function AnimatedDigit({ digit, style }: AnimatedDigitProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animate out
    opacity.value = withTiming(0, { duration: 100 });
    translateY.value = withSpring(-150);

    // Animate in
    const timeoutId = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 100 });
      translateY.value = withSpring(0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.Text style={[styles.digit, style, animatedStyle]}>
      {digit}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  digit: {
    fontSize: 26,
    width: 30,
    textAlign: "right",
  },
});
