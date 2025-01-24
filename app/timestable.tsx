import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback, useEffect } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import { getRandomNumber } from "@/lib/utils";
import AnimatedDigit from "@/components/AnimatedDigit";

const STORAGE_KEY = "timestable";
const FROM_VALUE = 2;
const TO_VALUE = 10;

export default function TimesTable() {
  const [fromValue, setFromValue] = useState(-1);
  const [toValue, setToValue] = useState(-1);
  const [digit, setDigit] = useState<number>(-1);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    // Trigger immediately
    setDigit(
      getRandomNumber(
        Number(fromValue) || FROM_VALUE,
        Number(toValue) || TO_VALUE,
      ),
    );

    // Set interval for repeated updates every 15 seconds
    interval = setInterval(() => {
      setDigit(
        getRandomNumber(
          Number(fromValue) || FROM_VALUE,
          Number(toValue) || TO_VALUE,
        ),
      );
    }, 15000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fromValue, toValue]);

  useFocusEffect(
    useCallback(() => {
      const loadStoredData = async () => {
        let from = FROM_VALUE;
        let to = TO_VALUE;

        try {
          const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
          console.log(storedValue);

          if (storedValue) {
            const parsed = JSON.parse(storedValue);
            from = Number(parsed.from) || FROM_VALUE;
            to = Number(parsed.to) || TO_VALUE;
          }
        } catch (error) {
          console.error("Failed to load data from AsyncStorage:", error);
        }

        setFromValue(from);
        setToValue(to);
      };
      loadStoredData();
    }, []),
  );

  if (digit === -1) {
    return null;
  }

  return (
    <View style={sharedStyles.screenContainer}>
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
