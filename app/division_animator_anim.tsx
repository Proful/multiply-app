import React, { useCallback, useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
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
import { useFocusEffect } from "expo-router";

// Types
type Step = {
  currentDigit: number;
  product: number;
  remainder: number;
  position: number;
  currentValue: string;
  bringDown?: number;
};

// Constants
const SPACING = 50;
const BASE_X = 150;
const BASE_Y = 120;
const STEP_HEIGHT = 80;
const LINE_WIDTH = 200;
const STEP_DELAY = 500;
const ANIMATION_DURATION = 1000;
const MAX_STEPS = 10;

const LongDivisionAnimator = () => {
  // State
  const [dividend, setDividend] = useState("2354");
  const [divisor, setDivisor] = useState("3");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation shared values
  const opacities = Array(MAX_STEPS)
    .fill(0)
    .map(() => useSharedValue(0));
  const derivedOpacities = opacities.map((opacity) =>
    useDerivedValue(() => opacity.value),
  );

  // Load font
  const font = useFont(require("../assets/BlexMonoNerdFont-Regular.ttf"), 24);

  // Calculate division steps
  const calculateSteps = useCallback(() => {
    const divisorNum = parseInt(divisor);
    if (!divisorNum || isNaN(divisorNum)) return;

    const dividendDigits = dividend.split("").map(Number);
    const newSteps: Step[] = [];
    let currentNumber = "";
    let position = 0;
    let i = 0;

    while (i < dividendDigits.length) {
      currentNumber += dividendDigits[i];
      let currentNum = parseInt(currentNumber);

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

    // Reset animations
    opacities.forEach((opacity) => {
      opacity.value = 0;
    });

    setSteps(newSteps);
    setCurrentStep(0);
    setIsAnimating(false);
  }, [dividend, divisor]);

  // Initialize calculation on focus
  useFocusEffect(
    useCallback(() => {
      calculateSteps();
    }, [calculateSteps]),
  );

  // Handle animation of each step
  const animateStep = useCallback((stepIndex: number) => {
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
  }, []);

  // Handle next step button press
  const nextStep = useCallback(() => {
    if (isAnimating) return;

    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(nextStepIndex);
      animateStep(nextStepIndex);
    }
  }, [currentStep, steps.length, isAnimating, animateStep]);

  // Input handlers
  const handleDividendChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setDividend(text);
      calculateSteps();
    }
  };

  const handleDivisorChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setDivisor(text);
      calculateSteps();
    }
  };

  // Render functions
  const renderDivisionSymbol = () => (
    <Group key="division-symbol">
      <Path
        path={`M ${BASE_X - 30} ${BASE_Y - 40} h ${LINE_WIDTH}`}
        strokeWidth={2}
        style="stroke"
        color="#000"
      />
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
          y={BASE_Y - 5}
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
        if (stepIndex > currentStep || stepIndex >= MAX_STEPS) return null;

        const xOffset = BASE_X;
        const yOffset = BASE_Y + stepIndex * STEP_HEIGHT + 40;

        return (
          <Group
            key={`step-${stepIndex}`}
            opacity={derivedOpacities[stepIndex]}
          >
            {/* Quotient digit */}
            <SkiaText
              x={xOffset + step.position * SPACING}
              y={BASE_Y - 60}
              text={step.currentDigit.toString()}
              font={font}
            />

            {/* Product */}
            <Group>
              <SkiaText
                x={xOffset - 20 + stepIndex * 20}
                y={yOffset}
                text="-"
                font={font}
              />
              {step.product
                .toString()
                .split("")
                .map((digit, index) => (
                  <SkiaText
                    key={`product-${index}`}
                    x={xOffset + index * SPACING + stepIndex * 20}
                    y={yOffset}
                    text={digit}
                    font={font}
                  />
                ))}
            </Group>

            {/* Subtraction line */}
            <Path
              path={`M ${xOffset - 5} ${yOffset + 10} h ${LINE_WIDTH}`}
              strokeWidth={1}
              style="stroke"
              color="#000"
            />

            {/* Remainder and brought down digit */}
            <SkiaText
              x={xOffset + stepIndex * 20}
              y={yOffset + 40}
              text={step.remainder.toString()}
              font={font}
            />
            {step.bringDown !== undefined && (
              <SkiaText
                x={xOffset + stepIndex * 20 + SPACING}
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

  if (!font) {
    return (
      <View style={styles.container}>
        <Text>Loading font...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Dividend:</Text>
          <TextInput
            style={styles.input}
            value={dividend}
            onChangeText={handleDividendChange}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Divisor:</Text>
          <TextInput
            style={styles.input}
            value={divisor}
            onChangeText={handleDivisorChange}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>

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
        <Pressable
          style={[styles.button, isAnimating && styles.buttonDisabled]}
          onPress={nextStep}
          disabled={isAnimating}
        >
          <Text style={styles.buttonText}>
            {isAnimating ? "Animating..." : "Next Step"}
          </Text>
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
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  inputWrapper: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 120,
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  canvas: {
    width: "100%",
    minHeight: 400,
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default LongDivisionAnimator;
