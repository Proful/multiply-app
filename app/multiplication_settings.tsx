import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sharedStyles } from "@/lib/styles";

const MultiplicationSettings = () => {
  const [multiplicandDigit, setMultiplicandDigit] = useState("2");
  const [multiplicandDigitError, setMultiplicandDigitError] = useState("");

  // AsyncStorage Key
  const STORAGE_KEY = "multiplication";

  // Load initial data from AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedValue) {
          const { multiplicandDigit } = JSON.parse(storedValue);
          setMultiplicandDigit(String(multiplicandDigit));
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage:", error);
      }
    };

    loadStoredData();
  }, []);

  // Validate input
  const validateNumber = (value: string, setError: (error: string) => void) => {
    const number = parseInt(value, 10);
    if (!value) {
      setError("This field is required");
    } else if (isNaN(number) || number < 2 || number > 3) {
      setError("Enter a number between 2 and 3");
    } else {
      setError("");
    }
  };

  // Save data to AsyncStorage
  const saveData = async () => {
    if (!multiplicandDigitError) {
      try {
        const data = {
          multiplicandDigit: parseInt(multiplicandDigit, 10),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        Alert.alert("Success", "Values saved to AsyncStorage!");
      } catch (error) {
        console.error("Failed to save data to AsyncStorage:", error);
      }
    } else {
      Alert.alert("Error", "Please fix validation errors before saving.");
    }
  };

  return (
    <View style={sharedStyles.screenContainer}>
      <View style={styles.container}>
        {/* First Row */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Multiplicand Digit:</Text>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={multiplicandDigit}
              onChangeText={(value) => {
                setMultiplicandDigit(value);
                validateNumber(value, setMultiplicandDigitError);
              }}
              onBlur={() =>
                validateNumber(multiplicandDigit, setMultiplicandDigitError)
              }
            />
            <Text style={styles.errorText}>{multiplicandDigitError}</Text>
          </View>
        </View>

        {/* Save Button */}
        <Button title="Save" onPress={saveData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  label: {
    flex: 1,
    textAlign: "left",
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  fieldContainer: {
    flex: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    height: 16,
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
});

export default MultiplicationSettings;
