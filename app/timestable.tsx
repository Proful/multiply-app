import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
export default function TimesTable() {
  const [digit, setDigit] = useState<number>(2); // Default value
  useFocusEffect(
    useCallback(() => {
      const fetchDigit = async () => {
        const savedDigit = await AsyncStorage.getItem("timestable-digit");
        if (savedDigit !== null) {
          setDigit(Number(savedDigit)); // Update the state with the retrieved value
        }
      };

      fetchDigit();

      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {};
    }, []), // Empty dependency array ensures this runs on focus
  );
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 44, fontWeight: "bold" }}>Times Table</Text>
      {[...Array(10)].map((_, i) => (
        <View
          key={i + 1}
          style={{
            flexDirection: "row",
            width: 220,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 28, width: 30, textAlign: "right" }}>
            {digit}
          </Text>
          <Text
            style={{ fontSize: 28, width: 70, textAlign: "left" }}
          >{`x   ${i + 1}`}</Text>
          <Text style={{ fontSize: 28, width: 20, textAlign: "center" }}>
            =
          </Text>
          <Text style={{ fontSize: 28, width: 60, textAlign: "left" }}>
            {digit * (i + 1)}
          </Text>
        </View>
      ))}
    </View>
  );
}
