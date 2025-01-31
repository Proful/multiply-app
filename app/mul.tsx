import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Text as SkiaText,
  useFont,
  Group,
  Path,
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
};

const SPACING = 50;
const BASE_X = 150;
const BASE_Y = 120;
const STEP_HEIGHT = 80;
const LINE_WIDTH = 200;

const STEP_DELAY = 7000;
const ANIMATION_DURATION = 2000;
const MAX_STEPS = 10;

type MultiplicationAnimatorProps = {
  multiplicand?: number;
  multiplier?: number;
};

const MultiplicationAnimator = ({
  multiplicand = 85,
  multiplier = 94,
}: MultiplicationAnimatorProps) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation shared values
  const opacities = Array(MAX_STEPS)
    .fill(0)
    .map(() => useSharedValue(0));
  const derivedOpacities = opacities.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );
  const opacitiesForCarry = Array(MAX_STEPS)
    .fill(0)
    .map(() => useSharedValue(0));
  const derivedOpacitiesForCarry = opacitiesForCarry.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );

  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  const calculateSteps = useCallback(() => {
    // const multiplicandStr = multiplicand.toString();
    // const multiplierStr = multiplier.toString();
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

        newSteps.push({
          value: product,
          carry,
          writeDown,
          multiplierDigit,
          multiplicandDigit,
          shift,
        });
      }

      // Handle final carry if exists
      if (carry > 0) {
        newSteps.push({
          value: carry,
          carry: 0,
          writeDown: carry,
          multiplierDigit: parseInt(multiplierStr[i]),
          multiplicandDigit: 0,
          shift,
        });
      }
    }

    setSteps(newSteps);
    setCurrentStep(-1);
    setIsAnimating(false);
  }, [multiplicand, multiplier]);

  useFocusEffect(
    useCallback(() => {
      calculateSteps();
    }, [calculateSteps]),
  );

  useEffect(() => {
    if (currentStep >= -1 && currentStep < steps.length - 1 && !isAnimating) {
      nextStep();
    }
  }, [currentStep, isAnimating, steps]);

  const animateStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= MAX_STEPS) return;

      setIsAnimating(true);

      const delay = stepIndex === 0 ? 10 : STEP_DELAY;
      const hide = stepIndex === 0 ? 4000 : 10;

      opacitiesForCarry[stepIndex].value = withSequence(
        withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION })),
        withSpring(1),
        withDelay(
          delay + hide,
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
      );

      opacities[stepIndex].value = withSequence(
        withDelay(
          delay + 4000,
          withTiming(1, { duration: ANIMATION_DURATION }),
        ),
        withSpring(1),
      );

      setTimeout(() => {
        setIsAnimating(false);
      }, delay + ANIMATION_DURATION);
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
        if (stepIndex >= MAX_STEPS) return null;

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

        let len = steps.length;

        let i = step.shift === 0 ? len - stepIndex - 1 : len - stepIndex + 2;
        const xOffset = BASE_X - 150 + i * SPACING;
        const yOffset = BASE_Y + 50 + step.shift * STEP_HEIGHT;

        return (
          <Group key={`step-${stepIndex}`}>
            <SkiaText
              x={80}
              y={sh / 2 + 10}
              text={val}
              font={font}
              opacity={derivedOpacitiesForCarry[stepIndex]}
            />
            {/* Carry number (if exists) */}
            {step.carry > 0 && (
              <SkiaText
                x={80}
                y={sh / 2 + 40}
                text={`Current Carry: ${step.carry.toString()}`}
                font={font}
                opacity={derivedOpacitiesForCarry[stepIndex]}
              />
            )}
            {stepIndex > 0 && (
              <SkiaText
                x={80}
                y={sh / 2 + 70}
                text={`Prev Carry: ${steps[stepIndex - 1].carry.toString()}`}
                font={font}
                opacity={derivedOpacitiesForCarry[stepIndex]}
              />
            )}

            {/* Write down number */}
            <SkiaText
              x={xOffset}
              y={yOffset}
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
