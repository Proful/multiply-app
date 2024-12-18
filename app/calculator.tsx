import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

// Define the type for our button props
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

// Button component for consistent styling
const CalculatorButton: React.FC<ButtonProps> = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue.toString());
    } else if (operator) {
      const currentValue = firstOperand !== null ? parseFloat(firstOperand) : 0;
      let result;

      switch (operator) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "-":
          result = currentValue - inputValue;
          break;
        case "*":
          result = currentValue * inputValue;
          break;
        case "/":
          result = currentValue / inputValue;
          break;
        default:
          result = inputValue;
      }

      setDisplay(result.toString());
      setFirstOperand(result.toString());
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <CalculatorButton
            title="C"
            onPress={clearDisplay}
            style={styles.grayButton}
          />
          <CalculatorButton
            title="+/-"
            onPress={() => {}}
            style={styles.grayButton}
          />
          <CalculatorButton
            title="%"
            onPress={() => {}}
            style={styles.grayButton}
          />
          <CalculatorButton
            title="÷"
            onPress={() => performOperation("/")}
            style={styles.orangeButton}
          />
        </View>

        <View style={styles.buttonRow}>
          <CalculatorButton title="7" onPress={() => inputDigit("7")} />
          <CalculatorButton title="8" onPress={() => inputDigit("8")} />
          <CalculatorButton title="9" onPress={() => inputDigit("9")} />
          <CalculatorButton
            title="×"
            onPress={() => performOperation("*")}
            style={styles.orangeButton}
          />
        </View>

        <View style={styles.buttonRow}>
          <CalculatorButton title="4" onPress={() => inputDigit("4")} />
          <CalculatorButton title="5" onPress={() => inputDigit("5")} />
          <CalculatorButton title="6" onPress={() => inputDigit("6")} />
          <CalculatorButton
            title="-"
            onPress={() => performOperation("-")}
            style={styles.orangeButton}
          />
        </View>

        <View style={styles.buttonRow}>
          <CalculatorButton title="1" onPress={() => inputDigit("1")} />
          <CalculatorButton title="2" onPress={() => inputDigit("2")} />
          <CalculatorButton title="3" onPress={() => inputDigit("3")} />
          <CalculatorButton
            title="+"
            onPress={() => performOperation("+")}
            style={styles.orangeButton}
          />
        </View>

        <View style={styles.buttonRow}>
          <CalculatorButton
            title="0"
            onPress={() => inputDigit("0")}
            style={styles.zeroButton}
          />
          <CalculatorButton title="." onPress={inputDecimal} />
          <CalculatorButton
            title="="
            onPress={() => performOperation("=")}
            style={styles.orangeButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-end",
  },
  displayContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 20,
  },
  displayText: {
    color: "white",
    fontSize: 60,
    fontWeight: "200",
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#333",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  zeroButton: {
    backgroundColor: "#333",
    width: 170,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  grayButton: {
    backgroundColor: "#a5a5a5",
  },
  orangeButton: {
    backgroundColor: "#f1a33c",
  },
});

export default Calculator;
