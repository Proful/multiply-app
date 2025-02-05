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
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { l } from "@/lib/utils";
import { colors } from "@/lib/styles";

// Configure Reanimated Logger
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
// Constants
const CONSTANTS = {
  SPACING: 50,
  BASE_X: 150,
  BASE_Y: 160,
  DIVIDER_START_X: 65,
  DIVIDER_START_Y: 180,
  STEP_HEIGHT: 50,
  LINE_WIDTH: 200,
  STEP_DELAY: 2000,
  ANIMATION_DURATION: 1000,
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

interface MultiplicationResultDisplayProps {
  result: number;
  font: SkFont;
  opacity: SharedValue<number>;
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
  writeDownOpacity: SharedValue<number>;
  font: SkFont;
}

interface DerivedValues {
  opacitiesForCarry: SharedValue<number>[];
  opacitiesForWriteDown: SharedValue<number>[];
  opacityForResult?: SharedValue<number>;
  xWriteDown: SharedValue<number>[];
  yWriteDown: SharedValue<number>[];
}

// Helper Functions
const getCalculationText = (step: Step, prevCarry?: number): string => {
  if (!step.multiplicandDigit) return "";

  const { multiplicandDigit: md, multiplierDigit: mr } = step;

  if (prevCarry && prevCarry > 0) {
    return `${mr}×${md}+${prevCarry}=${md * mr}+${prevCarry}=${md * mr + prevCarry}`;
  }

  return `${mr}×${md}=${md * mr}`;
};

const calculatePositionForStep = (
  shift: number,
  _stepsLength: number,
  currentSteps: Step[],
  multiplicandLength: number,
  multiplierLength: number,
): { x: number; y: number } => {
  // monkey patching
  const step1Count = currentSteps.filter((s) => s.shift === 0).length;
  let step1LengthOffset = step1Count === 3 ? 2 : 1;

  const len = multiplicandLength * multiplierLength;
  const iOffset =
    shift === 0
      ? len - currentSteps.length - 1
      : len - currentSteps.length + step1LengthOffset;

  const xOffset = shift === 0 ? 100 : 150;

  return {
    x: CONSTANTS.BASE_X - xOffset + iOffset * CONSTANTS.SPACING,
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
}) => {
  if (!text || !font) return null;
  const op = useDerivedValue(() => {
    return interpolate(opacity.value, [0, 0.2, 1, 0], [0, 1, 1, 0]);
  });
  return (
    <SkiaText
      x={x}
      y={y}
      text={text}
      font={font}
      opacity={op}
      color={colors.card.fg}
    />
  );
};

// Modified StepValues component with null checks
const StepValues: React.FC<StepValuesProps> = ({
  step,
  prevCarry,
  writeDownX,
  writeDownY,
  carryOpacity,
  writeDownOpacity,
  font,
}) => {
  if (!font) return null;
  const op = useDerivedValue(() => {
    return interpolate(writeDownOpacity.value, [0, 0.4, 1, 0], [0, 0, 1, 1]);
  });
  return (
    <Group>
      {step.value !== undefined && (
        <SkiaText
          x={80}
          y={sh / 2 + 40}
          text={(step.value % 10).toString()}
          font={font}
          opacity={carryOpacity}
          color={colors.card.fg}
        />
      )}
      {step.carry > 0 && (
        <SkiaText
          x={80}
          y={sh / 2 + 70}
          text={`Current Carry: ${step.carry}`}
          font={font}
          opacity={carryOpacity}
          color={colors.card.fg}
        />
      )}
      {prevCarry !== undefined && (
        <SkiaText
          x={80}
          y={sh / 2 + 100}
          text={`Prev Carry: ${prevCarry}`}
          font={font}
          opacity={carryOpacity}
          color={colors.card.fg}
        />
      )}
      {step.writeDown !== undefined && (
        <SkiaText
          x={writeDownX}
          y={writeDownY}
          text={step.writeDown.toString()}
          font={font}
          opacity={op}
          color={colors.card.fg}
        />
      )}
    </Group>
  );
};

const MultiplicationResultDisplay: React.FC<
  MultiplicationResultDisplayProps
> = ({ result, font, opacity }) => {
  if (!font) return null;
  let len = String(result).split("").length;
  let xOffset = 100;
  if (len === 3) {
    xOffset = 150;
  } else if (len === 4) {
    xOffset = 100;
  }
  l.len = { len, xOffset };
  return (
    <Group>
      {String(result)
        .split("")
        .map((char, i) => (
          <SkiaText
            key={`result-${i}`}
            x={CONSTANTS.BASE_X - xOffset + i * 50}
            y={CONSTANTS.BASE_Y + CONSTANTS.STEP_HEIGHT * 2 + 50}
            text={char}
            font={font}
            color={colors.card.fg}
            opacity={opacity}
          />
        ))}
    </Group>
  );
};

// Modified MultiplicationDisplay component with null checks
const MultiplicationDisplay: React.FC<MultiplicationDisplayProps> = ({
  multiplicand,
  multiplier,
  font,
}) => {
  if (!font) return null;
  return (
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
            color={colors.card.fg}
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
            color={colors.card.fg}
          />
        ))}
      <SkiaText
        x={CONSTANTS.BASE_X - 30}
        y={CONSTANTS.BASE_Y}
        text="×"
        font={font}
        color={colors.card.fg}
      />
      <Path
        path={`M ${CONSTANTS.DIVIDER_START_X} ${CONSTANTS.DIVIDER_START_Y} h ${CONSTANTS.LINE_WIDTH}`}
        strokeWidth={2}
        style="stroke"
        color={colors.card.fg}
      />
    </Group>
  );
};

// Modified StepsDisplay component with null checks
const StepsDisplay: React.FC<StepsDisplayProps> = ({
  steps,
  currentStep,
  derivedValues,
  font,
}) => {
  if (!font) return null;
  return (
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
              writeDownOpacity={derivedValues.opacitiesForWriteDown[i]}
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
        color={colors.card.fg}
      />
    </Group>
  );
};

// Modified main component with font loading check
const MultiplicationAnimator: React.FC<MultiplicationAnimatorProps> = ({
  multiplicand = 15,
  multiplier = 20,
}) => {
  const steps = calculateSteps(multiplicand, multiplier);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const opacitiesForStep = steps.map(() => useSharedValue(0));
  const derivedOpacitiesForCarry = opacitiesForStep.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );

  const opacitiesForWriteDown = steps.map(() => useSharedValue(0));
  const derivedOpacitiesForWriteDown = opacitiesForWriteDown.map((opacity) =>
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

  const opacityForResult = useSharedValue(0);

  const derivedValues = {
    opacitiesForCarry: derivedOpacitiesForCarry,
    opacitiesForWriteDown: derivedOpacitiesForWriteDown,
    opacityForResult,
    xWriteDown: xWriteDownValues,
    yWriteDown: yWriteDownValues,
  };

  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  useEffect(() => {
    if (font) {
      setFontLoaded(true);
    }
  }, [font]);

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
    if (
      currentStep >= -1 &&
      currentStep < steps.length - 1 &&
      !isAnimating &&
      fontLoaded
    ) {
      nextStep();
    }
  }, [currentStep, isAnimating, steps, fontLoaded]);

  const animateStep = useCallback(
    (stepIndex: number) => {
      if (!fontLoaded) return;

      setIsAnimating(true);

      let t = CONSTANTS.ANIMATION_DURATION;
      let t1 = t;
      let d1 = t1 + t1 + t;
      let sd = t1 + t1 + d1 + t1 + t;

      opacitiesForStep[stepIndex].value = withSequence(
        // t1 => each step along with carry to appear
        withTiming(1, { duration: t1 }, () => {
          // t1 => in parallel (writeDown text to appear and text movement)
          opacitiesForWriteDown[stepIndex].value = withTiming(1, {
            duration: t1,
          });
          xy[stepIndex].value = withTiming(1, { duration: t1 });
        }),
        // d1 => delay before step fade out (t1 + t1 + t)
        // t1 => step to fade out
        withDelay(
          d1,
          withTiming(0, { duration: t1 }, () => {
            if (stepIndex === steps.length - 1) {
              opacityForResult.value = withTiming(1, { duration: t1 });
            }
          }),
        ),
      );

      setTimeout(() => {
        setIsAnimating(false);
      }, sd);
    },
    [currentStep, fontLoaded],
  );

  const nextStep = () => {
    if (isAnimating || !fontLoaded) return;

    const nextStepIndex = currentStep + 1;
    if (currentStep < steps.length - 1) {
      setCurrentStep(nextStepIndex);
      animateStep(nextStepIndex);
    }
  };

  if (!fontLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <MultiplicationDisplay
          multiplicand={multiplicand}
          multiplier={multiplier}
          font={font!}
        />
        <StepsDisplay
          steps={steps}
          currentStep={currentStep}
          derivedValues={derivedValues}
          font={font!}
        />
        <MultiplicationResultDisplay
          result={multiplicand * multiplier}
          font={font!}
          opacity={opacityForResult}
        />
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
