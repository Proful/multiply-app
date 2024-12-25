import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import {
  Canvas,
  Path,
  Text as SkiaText,
  useFont,
  Group,
} from "@shopify/react-native-skia";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useState } from "react";
import { useFocusEffect } from "expo-router";

type Step = {
  currentDigit: number;
  product: number;
  remainder: number;
  position: number;
  currentValue: string;
  bringDown?: number;
};

const SPACING = 50;
const BASE_X = 150;
const BASE_Y = 120; // Increased to make room for line above dividend
const STEP_HEIGHT = 80;
const LINE_WIDTH = 200; // Width for horizontal lines

const STEP_DELAY = 500;
const ANIMATION_DURATION = 5000;
const MAX_STEPS = 10;

const LongDivisionAnimator = () => {
  const [dividend, setDividend] = useState("2354");
  const [divisor, setDivisor] = useState("3");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  const calculateSteps = useMemo(
    () => () => {
      const divisorNum = parseInt(divisor);

      const dividendDigits = dividend.split("").map(Number);
      const newSteps: Step[] = [];
      let currentNumber = "";
      let position = 0;
      let i = 0;

      while (i < dividendDigits.length) {
        // Add current digit to working number
        currentNumber += dividendDigits[i];
        let currentNum = parseInt(currentNumber);

        // If number is less than divisor and we have more digits, bring down next digit
        if (currentNum < divisorNum && i < dividendDigits.length - 1) {
          i++;
          continue;
        }

        const quotientDigit = Math.floor(currentNum / divisorNum);
        const product = quotientDigit * divisorNum;
        const remainder = currentNum - product;

        newSteps.push({
          currentDigit: quotientDigit,
          product,
          remainder,
          position,
          currentValue: currentNumber,
          bringDown:
            i < dividendDigits.length - 1 ? dividendDigits[i + 1] : undefined,
        });

        currentNumber = remainder.toString();
        position++;
        i++;
      }

      setSteps(newSteps);
      setCurrentStep(0);
      // startAnimation();
    },
    [dividend, divisor],
  );

  useFocusEffect(useCallback(calculateSteps, []));

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
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

        return (
          <Group key={`step-${stepIndex}`}>
            {/* Quotient digit */}
            <SkiaText
              x={xOffset + step.position * SPACING}
              y={BASE_Y - 60} // Moved up above the line
              text={step.currentDigit.toString()}
              font={font}
            />

            <Group key="productStr">
              <SkiaText
                x={xOffset - 20 + stepIndex * 20}
                y={yOffset} // Positioned below the line
                text={"-"}
                font={font}
              />
              {productStr.split("").map((digit, index) => (
                <SkiaText
                  key={`dividend-${index}`}
                  x={xOffset + index * SPACING + stepIndex * 50}
                  y={yOffset} // Positioned below the line
                  text={digit}
                  font={font}
                />
              ))}
            </Group>

            {/* Subtraction line with same width as division line */}
            <Path
              path={`M ${xOffset - 5} ${yOffset + 10} h ${LINE_WIDTH}`}
              strokeWidth={1}
              style="stroke"
              color="#000"
            />

            {/* Remainder and brought down digit on same line */}
            <SkiaText
              x={
                xOffset +
                stepIndex * 50 +
                ((step.remainder.toString().length + 1) * SPACING) / 2
              }
              y={yOffset + 40}
              text={step.remainder.toString()}
              font={font}
            />

            {step.bringDown !== undefined && (
              <SkiaText
                x={
                  xOffset +
                  stepIndex * 50 +
                  ((step.remainder.toString().length + 1) * SPACING) / 1
                }
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

      {currentStep >= 0 && currentStep < steps.length - 1 && (
        <Pressable style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next Step</Text>
        </Pressable>
      )}

      {currentStep === steps.length - 1 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Final Result: Quotient ={" "}
            {Math.floor(parseInt(dividend) / parseInt(divisor))}, Remainder ={" "}
            {parseInt(dividend) % parseInt(divisor)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 150,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  canvas: {
    minHeight: 400,
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LongDivisionAnimator;
