import { View, StyleSheet, Text } from "react-native";
import {
  Canvas,
  Path,
  Text as SkiaText,
  useFont,
  Group,
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

type Step = {
  currentDigit: number;
  product: number;
  remainder: number;
  position: number;
  currentValue: string;
  bringDown?: number;
  remainderStartPosition: number;
  subtractFromPosition: number;
};

const SPACING = 50;
const BASE_X = 150;
const BASE_Y = 120; // Increased to make room for line above dividend
const STEP_HEIGHT = 80;
const LINE_WIDTH = 200; // Width for horizontal lines

const STEP_DELAY = 500;
const ANIMATION_DURATION = 5000;
const MAX_STEPS = 10;

type LongDivisionAnimatorProps = {
  dividend: string;
  divisor: string;
};

// const LongDivisionAnimator = () => {
const LongDivisionAnimator = ({
  dividend = "9572",
  divisor = "8",
}: LongDivisionAnimatorProps) => {
  // const dividend = "9572";
  // const divisor = "8";
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

  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  const calculateSteps = useCallback(() => {
    const divisorNum = parseInt(divisor);
    if (!divisorNum || isNaN(divisorNum)) return;

    const dividendDigits = dividend.split("").map(Number);
    const newSteps = [];
    let currentNumber = "";
    let position = 0;
    let i = 0;
    let startPosition = 0;

    while (i < dividendDigits.length) {
      currentNumber += dividendDigits[i];
      let currentNum = parseInt(currentNumber);

      if (currentNum < divisorNum && i < dividendDigits.length - 1) {
        startPosition++;
        i++;
        continue;
      }

      const quotientDigit = Math.floor(currentNum / divisorNum);
      const product = quotientDigit * divisorNum;
      const remainder = currentNum - product;

      let bringDown;
      if (i < dividendDigits.length - 1) {
        let nextDigit = dividendDigits[i + 1];
        // Check if the remainder plus next digit would be less than divisor
        if (
          parseInt(remainder + "" + nextDigit) < divisorNum &&
          i + 2 <= dividendDigits.length
        ) {
          bringDown = parseInt(dividendDigits.slice(i + 1, i + 3).join(""));
        } else {
          bringDown = parseInt(nextDigit + "");
        }
      }

      newSteps.push({
        currentDigit: quotientDigit,
        product,
        remainder,
        position,
        currentValue: currentNumber,
        bringDown,
        remainderStartPosition: startPosition,
        subtractFromPosition:
          currentNumber.length === 1 ? startPosition : startPosition - 1,
      });

      currentNumber = remainder.toString();
      position++;
      startPosition = i + 1;
      i++;
    }
    // console.log(JSON.stringify(newSteps, null, 2));
    setSteps(newSteps);
    setCurrentStep(-1);
    setIsAnimating(false);
  }, [dividend, divisor]);

  // Initialize calculation on focus
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

  // Handle animation of each step
  const animateStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= MAX_STEPS) return;

      setIsAnimating(true);

      // Animate current step
      opacities[stepIndex].value = withSequence(
        withDelay(STEP_DELAY, withTiming(1, { duration: ANIMATION_DURATION })),
        withSpring(1),
      );

      // Enable next step button after animation
      setTimeout(() => {
        setIsAnimating(false);
      }, STEP_DELAY + ANIMATION_DURATION);
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
    return (
      <View style={styles.container}>
        <Text>Loading font...</Text>
      </View>
    );
  }

  const renderDivisionSymbol = () => (
    <Group key="division-symbol">
      {/* Main division line moved above dividend */}
      <Path
        path={`M ${BASE_X - 30} ${BASE_Y - 40} h ${LINE_WIDTH}`}
        strokeWidth={2}
        style="stroke"
        color="#000"
      />
      {/* Vertical line of division symbol */}
      <Path
        path={`M ${BASE_X - 30} ${BASE_Y - 40} v 60`}
        strokeWidth={2}
        style="stroke"
        color="#000"
      />
    </Group>
  );

  const renderDividend = () => (
    <Group key="dividend">
      {dividend.split("").map((digit, index) => (
        <SkiaText
          key={`dividend-${index}`}
          x={BASE_X + index * SPACING}
          y={BASE_Y - 5} // Positioned below the line
          text={digit}
          font={font}
        />
      ))}
    </Group>
  );

  const renderDivisor = () => (
    <SkiaText
      key="divisor"
      x={BASE_X - 60}
      y={BASE_Y}
      text={divisor}
      font={font}
    />
  );

  const renderSteps = () => (
    <Group key="steps">
      {steps.map((step, stepIndex) => {
        if (stepIndex > currentStep) return null;
        if (stepIndex >= MAX_STEPS) return null;

        const xOffset = BASE_X;
        const yOffset =
          BASE_Y + stepIndex + 0.2 * STEP_HEIGHT + stepIndex * 80 + 20;
        const productStr = step.product.toString();

        // Monkey fix: Alignment of product depending on currentValue
        // whether is single digit or double digit
        let shiftAlignmentOfProduct = false;
        if (step.currentValue.length === 2 && productStr.length === 1) {
          shiftAlignmentOfProduct = true;
        }

        // console.log(
        //   `step = ${stepIndex}, xOffset = ${xOffset}, x = ${xOffset + step.subtractFromPosition * SPACING}, sub = ${step.subtractFromPosition}, rem = ${step.remainderStartPosition}`,
        //   step,
        // );

        return (
          <Group
            key={`step-${stepIndex}`}
            opacity={derivedOpacities[stepIndex]}
          >
            {/* Keep quotient digit and product rendering the same */}
            <SkiaText
              x={xOffset + step.position * SPACING}
              y={BASE_Y - 60}
              text={step.currentDigit.toString()}
              font={font}
            />
            <Group key="productStr">
              <SkiaText
                x={
                  xOffset -
                  (shiftAlignmentOfProduct ? 0 : 20) +
                  step.subtractFromPosition * SPACING
                }
                y={yOffset}
                text="-"
                font={font}
              />
              {productStr.split("").map((digit, index) => (
                <SkiaText
                  key={`product-${index}`}
                  x={
                    xOffset +
                    (step.subtractFromPosition +
                      (shiftAlignmentOfProduct ? index + 1 : index)) *
                      SPACING
                  }
                  y={yOffset}
                  text={digit}
                  font={font}
                />
              ))}
            </Group>
            <Path
              path={`M ${xOffset - 5} ${yOffset + 10} h ${LINE_WIDTH}`}
              strokeWidth={1}
              style="stroke"
              color="#000"
            />

            {/* Updated remainder positioning */}
            <SkiaText
              x={xOffset + step.remainderStartPosition * SPACING}
              y={yOffset + 40}
              text={step.remainder.toString()}
              font={font}
            />

            {/* Updated bring down digit positioning */}
            {step.bringDown !== undefined && (
              <SkiaText
                x={xOffset + (step.remainderStartPosition + 1) * SPACING}
                y={yOffset + 40}
                text={step.bringDown.toString()}
                font={font}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );

  return (
    <View style={styles.container}>
      <Canvas
        style={[
          styles.canvas,
          { height: Math.max(400, steps.length * STEP_HEIGHT + 200) },
        ]}
      >
        {renderDivisionSymbol()}
        {renderDividend()}
        {renderDivisor()}
        {renderSteps()}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    width: 400,
    minHeight: 400,
    // backgroundColor: "red", // for debugging
  },
});

export default LongDivisionAnimator;
