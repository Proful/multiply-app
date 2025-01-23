import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { getRandomNumber } from "@/lib/utils";
import AnimatedDigit from "@/components/AnimatedDigit";

const STORAGE_KEY = "timestable";
const FROM_VALUE = 2;
const TO_VALUE = 10;

export default function TimesTable() {
  const [fromValue, setFromValue] = useState(FROM_VALUE);
  const [toValue, setToValue] = useState(TO_VALUE);
  const [digit, setDigit] = useState<number>(
    getRandomNumber(FROM_VALUE, TO_VALUE),
  ); // Default value from 2 to 10

  useFocusEffect(
    useCallback(() => {
      let interval: unknown;

      const loadStoredData = async () => {
        try {
          let fromValue = FROM_VALUE,
            toValue = TO_VALUE;
          const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
          if (storedValue) {
            const { from, to } = JSON.parse(storedValue);
            fromValue = Number(from);
            toValue = Number(to);
          }
        } catch (error) {
          console.error("Failed to load data from AsyncStorage:", error);
        }
        setFromValue(fromValue);
        setToValue(toValue);

        const randomNumber = getRandomNumber(fromValue, toValue);
        setDigit(randomNumber);

        interval = setInterval(() => {
          const randomNumber = getRandomNumber(fromValue, toValue);
          setDigit(randomNumber);
        }, 15000);
      };

      loadStoredData();
      // Cleanup function (optional, can be used for resetting states or cleanup tasks)
      return () => {
        if (interval) {
          //@ts-ignore
          clearInterval(interval);
        }
      };
    }, []), // Empty dependency array ensures this runs on focus
  );

  return (
    <View style={sharedStyles.screenContainer}>
      {/* {!isLoaded && <Text>loading</Text>} */}
      <>
        <TouchableOpacity
          style={sharedStyles.resetButton}
          onPress={() => {
            setDigit(getRandomNumber(fromValue, toValue));
          }}
        >
          <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <View
              key={i + 1}
              style={{
                flexDirection: "row",
                width: 220,
                justifyContent: "space-between",
              }}
            >
              <AnimatedDigit digit={digit} />
              <Text
                style={{ fontSize: 26, width: 70, textAlign: "left" }}
              >{` x   ${i + 1}`}</Text>
              <Text style={{ fontSize: 28, width: 20, textAlign: "center" }}>
                {"=  "}
              </Text>
              <AnimatedDigit
                digit={digit * (i + 1)}
                style={{ width: 60, textAlign: "left" }}
              />
            </View>
          ))}
        </View>
      </>
    </View>
  );
}
