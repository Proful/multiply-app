import MText from "@/components/MText";
import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { View, Text, Button } from "react-native";
const data = require("./mul.json");
// console.log(data);

type Props = {
  x: number;
  y: number;
};

const MultiplicationExplainer: React.FC<Props> = ({ x = 25, y = 34 }) => {
  const [step1, setStep1] = useState(["", "", "", "", ""]);
  const [step2, setStep2] = useState(["", "", "", "", ""]);
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  useEffect(() => {
    let currentData = [...data]; // Create a copy of the data array
    let currentStep1 = [...step1]; // Create a copy of the step1 array
    let currentStep2 = [...step2]; // Create a copy of the step1 array

    const interval = setInterval(() => {
      if (currentData.length > 0) {
        // Pop the first element from the data array
        const poppedElement = currentData.shift()!;

        if (poppedElement.shift === 0) {
          // Update the step1 array from right to left
          const newStep1 = [...currentStep1];
          for (let i = newStep1.length - 1; i >= 0; i--) {
            if (newStep1[i] === undefined || newStep1[i] === "") {
              newStep1[i] = poppedElement.writeDown;
              break;
            }
          }
          // Update the state
          setStep1(newStep1);
          currentStep1 = [...newStep1];
        }

        if (poppedElement.shift === 1) {
          // Update the step2 array from right to left
          const newStep2 = [...currentStep2];
          for (let i = newStep2.length - 1; i >= 0; i--) {
            if (newStep2[i] === undefined || newStep2[i] === "") {
              newStep2[i] = poppedElement.writeDown;
              break;
            }
          }

          setStep2(newStep2);
          currentStep2 = [...newStep2];
        }
      } else {
        // Clear the interval if there's no more data to process
        clearInterval(interval);
      }
    }, 2000); // 2-second delay

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only on mount
  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ fontSize: 48, fontFamily: "BlexMono" }}>
          {x}X{y}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {step1.map((s, i) => {
          return (
            <Text key={i} style={{ fontSize: 48, fontFamily: "BlexMono" }}>
              {s}
            </Text>
          );
        })}
      </View>
      <View style={{ flexDirection: "row" }}>
        {step2.map((s, i) => {
          return (
            <Text key={i} style={{ fontSize: 48, fontFamily: "BlexMono" }}>
              {s}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default MultiplicationExplainer;
