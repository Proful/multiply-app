import React from "react";
import { Canvas, Circle } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";

const BouncingBall = () => {
  const translateY = useSharedValue(0); // Vertical position of the ball

  // Animate the shared value
  React.useEffect(() => {
    translateY.value = withRepeat(
      withTiming(200, {
        duration: 1000,
      }),
      -1, // Infinite loop
      true, // Reverse direction
    );
  }, [translateY]);

  // Use Reanimated styles to map shared value to Skia's Canvas
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <Canvas style={styles.canvas}>
          <Circle cx={100} cy={100} r={50} color="dodgerblue" />
        </Canvas>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  canvas: {
    width: 200,
    height: 200,
  },
});

export default BouncingBall;
