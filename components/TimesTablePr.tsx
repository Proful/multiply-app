import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { Canvas, Text, useFont, Group } from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";

const TimesTablePr = () => {
  const font = useFont(require("./assets/Roboto-Regular.ttf"), 48);
  const opacity = useSharedValue(0); // Shared value for animating answer opacity

  const [question, setQuestion] = React.useState({ a: 5, b: 2 });
  const [answer, setAnswer] = React.useState(question.a * question.b);

  if (!font) {
    return null; // Return null until the font is loaded
  }

  const nextQuestion = () => {
    // Generate a random question
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setQuestion({ a, b });
    setAnswer(a * b);

    // Reset animation
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 1000 }); // Animate the answer opacity
  };

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group>
          {/* Question */}
          <Text
            x={50}
            y={100}
            text={`${question.a} x ${question.b} = ?`}
            font={font}
            color="dodgerblue"
          />
          {/* Answer (Animated) */}
          <Text
            x={50}
            y={180}
            text={`= ${answer}`}
            font={font}
            color="limegreen"
          />
        </Group>
      </Canvas>
      <Button title="Next Question" onPress={nextQuestion} />
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
    width: 300,
    height: 300,
  },
});

export default TimesTablePr;
