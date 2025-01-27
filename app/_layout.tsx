import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/styles";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: colors.primary.bg,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mathlet" }} />
      <Stack.Screen
        name="timestable"
        options={{
          title: "Times Table",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/timestable_settings")}
              style={{
                marginRight: 10,
                zIndex: 9,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="timestable_settings"
        options={{ title: "Settings Times Table" }}
      />
      <Stack.Screen
        name="timestablepractice"
        options={{ title: "Times Table Practice" }}
      />
      <Stack.Screen
        name="multiplication"
        options={{
          title: "Multiplication",

          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/multiplication_settings")}
              style={{
                marginRight: 10,
                zIndex: 9,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="multiplication_settings"
        options={{ title: "Settings Multiplication" }}
      />
      <Stack.Screen
        name="comparingdecimals"
        options={{ title: "Comparing Decimals" }}
      />
      <Stack.Screen
        name="fractiontodecimal"
        options={{ title: "Fraction To Decimal" }}
      />
      <Stack.Screen
        name="decimaltofraction"
        options={{ title: "Decimal To Fraction" }}
      />
      <Stack.Screen
        name="addingdecimals"
        options={{ title: "Adding Decimals" }}
      />
      <Stack.Screen
        name="subtractingdecimals"
        options={{ title: "Subtracting Decimals" }}
      />
      <Stack.Screen
        name="addingfractions"
        options={{ title: "Adding Fractions" }}
      />
      <Stack.Screen
        name="subtractingfractions"
        options={{ title: "Subtracting Fractions" }}
      />
      <Stack.Screen
        name="threefractions"
        options={{ title: "Three Fractions" }}
      />
      <Stack.Screen name="lcm" options={{ title: "LCM" }} />
      <Stack.Screen
        name="addingmixed"
        options={{ title: "Adding Mixed Fractions" }}
      />
      <Stack.Screen
        name="subtractingmixed"
        options={{ title: "Subtracting Mixed Fractions" }}
      />
      <Stack.Screen name="division" options={{ title: "Division" }} />
    </Stack>
  );
}
