// Settings.tsx
import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

const Settings = () => {
  const [inputValue, setInputValue] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const fetchDigit = async () => {
        const savedDigit = await AsyncStorage.getItem("timestable-digit");
        if (savedDigit !== null) {
          setInputValue(savedDigit); // Update the state with the retrieved value
        }
      };

      fetchDigit();

      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  const saveDigit = async () => {
    const number = parseInt(inputValue, 10);
    if (!isNaN(number)) {
      try {
        await AsyncStorage.setItem("timestable-digit", number + "");
      } catch (e) {
        // saving error
      }
    } else {
      alert("Please enter a valid number");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Times table digit</Text>
      <Picker
        selectedValue={inputValue}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          fontSize: 18,
          marginBottom: 16,
        }}
        onValueChange={(itemValue) => setInputValue(itemValue.toString())}
      >
        {Array.from({ length: 14 }, (_, i) => i + 2).map((number) => (
          <Picker.Item key={number} label={`${number}`} value={number} />
        ))}
      </Picker>
      <Button title="Save" onPress={saveDigit} />
    </View>
  );
};

export default Settings;
