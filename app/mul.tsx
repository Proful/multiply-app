import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Text as SkiaText,
  useFont,
  Group,
  Path,
  interpolate,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { l } from "@/lib/utils";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
type Step = {
  value: number;
  carry: number;
  writeDown: number;
  multiplierDigit: number;
  multiplicandDigit: number;
  shift: number;
  x: number; // New property for x position
  y: number; // New property for y position
};

const SPACING = 50;
const BASE_X = 150;
const BASE_Y = 120;
const STEP_HEIGHT = 80;
const LINE_WIDTH = 200;

const STEP_DELAY = 1000;
const ANIMATION_DURATION = 2000;

type MultiplicationAnimatorProps = {
  multiplicand?: number;
  multiplier?: number;
};

const MultiplicationAnimator = ({
  multiplicand = 85,
  multiplier = 94,
}: MultiplicationAnimatorProps) => {
  const steps = cal();
  // const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation shared values
  const opacities = steps.map(() => useSharedValue(0));
  const derivedOpacities = opacities.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );
  const opacitiesForCarry = steps.map(() => useSharedValue(0));
  const derivedOpacitiesForCarry = opacitiesForCarry.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );
  const xy = steps.map(() => useSharedValue(0));
  const xWriteDownValues = steps.map((_, stepIndex) =>
    useDerivedValue(() => {
      return interpolate(
        xy[stepIndex].value,
        [0, 1],
        [80, steps[stepIndex]?.x || 80],
      );
    }),
  );

  const yWriteDownValues = steps.map((_, stepIndex) =>
    useDerivedValue(() => {
      return interpolate(
        xy[stepIndex].value,
        [0, 1],
        [sh / 2 + 40, steps[stepIndex]?.y || sh / 2 + 40],
      );
    }),
  );
  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  const setup = useCallback(() => {
    setCurrentStep(-1);
    setIsAnimating(false);
  }, [multiplicand, multiplier]);

  useFocusEffect(
    useCallback(() => {
      setup();
    }, [setup]),
  );

  useEffect(() => {
    if (currentStep >= -1 && currentStep < steps.length - 1 && !isAnimating) {
      nextStep();
    }
  }, [currentStep, isAnimating, steps]);

  const animateStep = useCallback(
    (stepIndex: number) => {
      setIsAnimating(true);

      // Animate opacitiesForCarry
      opacitiesForCarry[stepIndex].value = withSequence(
        withDelay(STEP_DELAY, withTiming(1, { duration: ANIMATION_DURATION })), // Fade in
        withTiming(0, { duration: ANIMATION_DURATION }), // Fade out
      );

      // Animate opacities
      opacities[stepIndex].value = withSequence(
        withDelay(
          STEP_DELAY + ANIMATION_DURATION,
          withTiming(1, { duration: ANIMATION_DURATION }),
        ), // Fade in
        withSpring(1), // Stay visible
      );

      xy[stepIndex].value = withSequence(
        withDelay(
          STEP_DELAY + ANIMATION_DURATION,
          withTiming(1, { duration: ANIMATION_DURATION }),
        ), // Fade in
      );
      // Mark animation as complete after all animations finish
      setTimeout(
        () => {
          setIsAnimating(false);
        },
        STEP_DELAY + 2 * ANIMATION_DURATION,
      ); // Total duration for this step
    },
    [currentStep],
  );
  const nextStep = () => {
    if (isAnimating) return;

    const nextStepIndex = currentStep + 1;
    if (currentStep < steps.length - 1) {
      setCurrentStep(nextStepIndex);
      animateStep(nextStepIndex);
    }
  };

  if (!font) {
    return <View style={styles.container} />;
  }

  const renderMultiplication = () => (
    <Group>
      {/* Multiplicand */}
      {multiplicand
        .toString()
        .split("")
        .map((char, i) => (
          <SkiaText
            key={i}
            x={BASE_X + i * 40}
            y={BASE_Y - 40}
            text={char}
            font={font}
          />
        ))}

      {/* Multiplier */}
      {multiplier
        .toString()
        .split("")
        .map((char, i) => (
          <SkiaText
            key={i}
            x={BASE_X + i * 40}
            y={BASE_Y}
            text={char}
            font={font}
          />
        ))}

      {/* Multiplication symbol */}
      <SkiaText x={BASE_X - 30} y={BASE_Y} text="×" font={font} />

      {/* Horizontal line */}
      <Path
        path={`M ${BASE_X - 30} ${BASE_Y + 20} h ${LINE_WIDTH}`}
        strokeWidth={2}
        style="stroke"
        color="#000"
      />
    </Group>
  );

  const renderSteps = () => (
    <Group>
      {steps.map((step, stepIndex) => {
        if (stepIndex > currentStep) return null;

        let val = "";

        if (
          stepIndex > 0 &&
          steps[stepIndex - 1].carry > 0 &&
          step.multiplicandDigit > 0
        ) {
          val = `${step.multiplierDigit}X${step.multiplicandDigit}+${steps[stepIndex - 1].carry}=${step.multiplicandDigit * step.multiplierDigit}+${steps[stepIndex - 1].carry}=${step.multiplicandDigit * step.multiplierDigit + steps[stepIndex - 1].carry}`;
        } else if (step.multiplicandDigit > 0) {
          val = `${step.multiplierDigit}X${step.multiplicandDigit}=${step.multiplicandDigit * step.multiplierDigit}`;
        } else {
          val = "";
        }

        return (
          <Group key={`step-${stepIndex}`}>
            <SkiaText
              x={80}
              y={sh / 2 + 10}
              text={val}
              font={font}
              opacity={derivedOpacitiesForCarry[stepIndex]}
            />
            <SkiaText
              x={80}
              y={sh / 2 + 40}
              text={(step.value % 10) + ""}
              font={font}
              opacity={derivedOpacitiesForCarry[stepIndex]}
            />
            {/* Carry number (if exists) */}
            {step.carry > 0 && (
              <SkiaText
                x={80}
                y={sh / 2 + 70}
                text={`Current Carry: ${step.carry.toString()}`}
                font={font}
                opacity={derivedOpacitiesForCarry[stepIndex]}
              />
            )}
            {stepIndex > 0 && (
              <SkiaText
                x={80}
                y={sh / 2 + 100}
                text={`Prev Carry: ${steps[stepIndex - 1].carry.toString()}`}
                font={font}
                opacity={derivedOpacitiesForCarry[stepIndex]}
              />
            )}

            {/* Write down number */}
            <SkiaText
              x={xWriteDownValues[stepIndex].value} // Use the precomputed x position
              y={yWriteDownValues[stepIndex].value} // Use the precomputed y position
              text={step.writeDown.toString()}
              font={font}
              opacity={derivedOpacities[stepIndex]}
            />
          </Group>
        );
      })}

      {/* Final horizontal line */}
      <Path
        path={`M ${BASE_X - 30} ${BASE_Y + 20 + STEP_HEIGHT * 2} h ${LINE_WIDTH}`}
        strokeWidth={2}
        style="stroke"
        color="#000"
      />
    </Group>
  );

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {renderMultiplication()}
        {renderSteps()}
      </Canvas>
    </View>
  );
};

const { width: sw, height: sh } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    width: sw,
    height: sh,
  },
});

export default MultiplicationAnimator;

const cal = () => {
  const multiplicandStr = "85";
  const multiplierStr = "94";
  const newSteps: Step[] = [];

  // Calculate each step of multiplication
  for (let i = multiplierStr.length - 1; i >= 0; i--) {
    const shift = multiplierStr.length - 1 - i;
    let carry = 0;

    for (let j = multiplicandStr.length - 1; j >= 0; j--) {
      const multiplierDigit = parseInt(multiplierStr[i]);
      const multiplicandDigit = parseInt(multiplicandStr[j]);

      const product = multiplierDigit * multiplicandDigit + carry;
      const writeDown = product % 10;
      carry = Math.floor(product / 10);

      // Calculate x and y positions for writeDown
      const len = multiplicandStr.length * multiplierStr.length;
      const iOffset =
        shift === 0 ? len - newSteps.length - 1 : len - newSteps.length + 2;
      const xOffset = BASE_X - 150 + iOffset * SPACING;
      const yOffset = BASE_Y + 50 + shift * STEP_HEIGHT;

      newSteps.push({
        value: product,
        carry,
        writeDown,
        multiplierDigit,
        multiplicandDigit,
        shift,
        x: xOffset, // Store x position
        y: yOffset, // Store y position
      });
    }

    // Handle final carry if exists
    if (carry > 0) {
      const len = multiplicandStr.length * multiplierStr.length;
      const iOffset =
        shift === 0 ? len - newSteps.length - 1 : len - newSteps.length + 2;
      const xOffset = BASE_X - 150 + iOffset * SPACING;
      const yOffset = BASE_Y + 50 + shift * STEP_HEIGHT;

      newSteps.push({
        value: carry,
        carry: 0,
        writeDown: carry,
        multiplierDigit: parseInt(multiplierStr[i]),
        multiplicandDigit: 0,
        shift,
        x: xOffset, // Store x position
        y: yOffset, // Store y position
      });
    }
  }
  return newSteps;
};
