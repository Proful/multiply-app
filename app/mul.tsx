import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Text as SkiaText,
  useFont,
  Group,
  Path,
  interpolate,
  SkFont,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Configure Reanimated Logger
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Constants
const CONSTANTS = {
  SPACING: 50,
  BASE_X: 150,
  BASE_Y: 120,
  DIVIDER_START_X: 65,
  DIVIDER_START_Y: 140,
  STEP_HEIGHT: 80,
  LINE_WIDTH: 200,
  STEP_DELAY: 1000,
  ANIMATION_DURATION: 2000,
} as const;

// Types
interface Step {
  value: number;
  carry: number;
  writeDown: number;
  multiplierDigit: number;
  multiplicandDigit: number;
  shift: number;
  x: number;
  y: number;
}

interface MultiplicationAnimatorProps {
  multiplicand?: number;
  multiplier?: number;
}

interface MultiplicationDisplayProps {
  multiplicand: number;
  multiplier: number;
  font: SkFont;
}

interface StepsDisplayProps {
  steps: Step[];
  currentStep: number;
  derivedValues: DerivedValues;
  font: SkFont;
}

interface StepCalculationProps {
  text: string;
  x: number;
  y: number;
  font: SkFont;
  opacity: SharedValue<number>;
}

interface StepValuesProps {
  step: Step;
  prevCarry?: number;
  writeDownX: SharedValue<number>;
  writeDownY: SharedValue<number>;
  carryOpacity: SharedValue<number>;
  font: SkFont;
}

interface DerivedValues {
  opacitiesForCarry: SharedValue<number>[];
  xWriteDown: SharedValue<number>[];
  yWriteDown: SharedValue<number>[];
}

// Helper Functions
const getCalculationText = (step: Step, prevCarry?: number): string => {
  if (!step.multiplicandDigit) return "";

  if (prevCarry && prevCarry > 0) {
    return `${step.multiplierDigit}×${step.multiplicandDigit}+${prevCarry}=${step.multiplicandDigit * step.multiplierDigit}+${prevCarry}=${step.multiplicandDigit * step.multiplierDigit + prevCarry}`;
  }

  return `${step.multiplierDigit}×${step.multiplicandDigit}=${step.multiplicandDigit * step.multiplierDigit}`;
};

const calculatePositionForStep = (
  shift: number,
  _stepsLength: number,
  currentSteps: Step[],
  multiplicandLength: number,
  multiplierLength: number,
): { x: number; y: number } => {
  const len = multiplicandLength * multiplierLength;
  const iOffset =
    shift === 0 ? len - currentSteps.length - 1 : len - currentSteps.length + 2;

  return {
    x: CONSTANTS.BASE_X - 100 + iOffset * CONSTANTS.SPACING,
    y: CONSTANTS.BASE_Y + 50 + shift * CONSTANTS.STEP_HEIGHT,
  };
};

const calculateSteps = (multiplicand: number, multiplier: number): Step[] => {
  const multiplicandStr = multiplicand.toString();
  const multiplierStr = multiplier.toString();
  const steps: Step[] = [];

  for (let i = multiplierStr.length - 1; i >= 0; i--) {
    const shift = multiplierStr.length - 1 - i;
    let carry = 0;

    for (let j = multiplicandStr.length - 1; j >= 0; j--) {
      const multiplierDigit = parseInt(multiplierStr[i]);
      const multiplicandDigit = parseInt(multiplicandStr[j]);
      const product = multiplierDigit * multiplicandDigit + carry;

      const { x, y } = calculatePositionForStep(
        shift,
        steps.length,
        steps,
        multiplicandStr.length,
        multiplierStr.length,
      );

      steps.push({
        value: product,
        carry: Math.floor(product / 10),
        writeDown: product % 10,
        multiplierDigit,
        multiplicandDigit,
        shift,
        x,
        y,
      });

      carry = Math.floor(product / 10);
    }

    if (carry > 0) {
      const { x, y } = calculatePositionForStep(
        shift,
        steps.length,
        steps,
        multiplicandStr.length,
        multiplierStr.length,
      );

      steps.push({
        value: carry,
        carry: 0,
        writeDown: carry,
        multiplierDigit: parseInt(multiplierStr[i]),
        multiplicandDigit: 0,
        shift,
        x,
        y,
      });
    }
  }

  return steps;
};

// SubComponents
const StepCalculation: React.FC<StepCalculationProps> = ({
  text,
  x,
  y,
  font,
  opacity,
}) => <SkiaText x={x} y={y} text={text} font={font} opacity={opacity} />;

const StepValues: React.FC<StepValuesProps> = ({
  step,
  prevCarry,
  writeDownX,
  writeDownY,
  carryOpacity,
  font,
}) => (
  <Group>
    <SkiaText
      x={80}
      y={sh / 2 + 40}
      text={(step.value % 10).toString()}
      font={font}
      opacity={carryOpacity}
    />
    {step.carry > 0 && (
      <SkiaText
        x={80}
        y={sh / 2 + 70}
        text={`Current Carry: ${step.carry}`}
        font={font}
        opacity={carryOpacity}
      />
    )}
    {prevCarry !== undefined && (
      <SkiaText
        x={80}
        y={sh / 2 + 100}
        text={`Prev Carry: ${prevCarry}`}
        font={font}
        opacity={carryOpacity}
      />
    )}
    <SkiaText
      x={writeDownX}
      y={writeDownY}
      text={step.writeDown.toString()}
      font={font}
      opacity={1}
    />
  </Group>
);

const MultiplicationDisplay: React.FC<MultiplicationDisplayProps> = ({
  multiplicand,
  multiplier,
  font,
}) => (
  <Group>
    {String(multiplicand)
      .split("")
      .map((char, i) => (
        <SkiaText
          key={`multiplicand-${i}`}
          x={CONSTANTS.BASE_X + i * 50}
          y={CONSTANTS.BASE_Y - 40}
          text={char}
          font={font}
        />
      ))}
    {String(multiplier)
      .split("")
      .map((char, i) => (
        <SkiaText
          key={`multiplier-${i}`}
          x={CONSTANTS.BASE_X + i * 50}
          y={CONSTANTS.BASE_Y}
          text={char}
          font={font}
        />
      ))}
    <SkiaText
      x={CONSTANTS.BASE_X - 30}
      y={CONSTANTS.BASE_Y}
      text="×"
      font={font}
    />
    <Path
      path={`M ${CONSTANTS.DIVIDER_START_X} ${CONSTANTS.DIVIDER_START_Y} h ${CONSTANTS.LINE_WIDTH}`}
      strokeWidth={2}
      style="stroke"
      color="#000"
    />
  </Group>
);

const StepsDisplay: React.FC<StepsDisplayProps> = ({
  steps,
  currentStep,
  derivedValues,
  font,
}) => (
  <Group>
    {steps.map((step, i) => {
      if (i > currentStep) return null;

      const calcText = getCalculationText(step, steps[i - 1]?.carry);

      return (
        <Group key={`step-${i}`}>
          <StepCalculation
            text={calcText}
            x={80}
            y={sh / 2 + 10}
            font={font}
            opacity={derivedValues.opacitiesForCarry[i]}
          />
          <StepValues
            step={step}
            prevCarry={steps[i - 1]?.carry}
            writeDownX={derivedValues.xWriteDown[i]}
            writeDownY={derivedValues.yWriteDown[i]}
            carryOpacity={derivedValues.opacitiesForCarry[i]}
            font={font}
          />
        </Group>
      );
    })}
    <Path
      path={`M ${CONSTANTS.DIVIDER_START_X} ${
        CONSTANTS.DIVIDER_START_Y + CONSTANTS.STEP_HEIGHT * 2
      } h ${CONSTANTS.LINE_WIDTH}`}
      strokeWidth={2}
      style="stroke"
      color="#000"
    />
  </Group>
);

// Main Component
const MultiplicationAnimator: React.FC<MultiplicationAnimatorProps> = ({
  multiplicand = 85,
  multiplier = 94,
}) => {
  const steps = calculateSteps(multiplicand, multiplier);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const derivedValues = {
    opacitiesForCarry: derivedOpacitiesForCarry,
    xWriteDown: xWriteDownValues,
    yWriteDown: yWriteDownValues,
  };

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
        withDelay(
          CONSTANTS.STEP_DELAY,
          withTiming(1, { duration: CONSTANTS.ANIMATION_DURATION }),
        ), // Fade in
        withTiming(0, { duration: CONSTANTS.ANIMATION_DURATION }), // Fade out
      );

      xy[stepIndex].value = withSequence(
        withDelay(
          CONSTANTS.STEP_DELAY + CONSTANTS.ANIMATION_DURATION,
          withTiming(1, { duration: CONSTANTS.ANIMATION_DURATION }),
        ), // Fade in
      );
      // Mark animation as complete after all animations finish
      setTimeout(
        () => {
          setIsAnimating(false);
        },
        CONSTANTS.STEP_DELAY + 2 * CONSTANTS.ANIMATION_DURATION,
      ); // Total duration for this step
    },
    [currentStep],
  );
  const nextStep = () => {
    if (isAnimating) return;

    const nextStepIndex = currentStep + 1;
    if (currentStep < steps.length - 1) {
      setCurrentStep(nextStepIndex);
      if (currentStep < 5) {
        animateStep(nextStepIndex);
      }
    }
  };

  if (!font) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <MultiplicationDisplay
          multiplicand={multiplicand}
          multiplier={multiplier}
          font={font}
        />
        <StepsDisplay
          steps={steps}
          currentStep={currentStep}
          derivedValues={derivedValues}
          font={font}
        />
      </Canvas>
    </View>
  );
};

// Styles
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
