import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router/stack";
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#bec3c8",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Math App" }} />
      <Stack.Screen name="timestable" options={{ title: "Times Table" }} />
      <Stack.Screen
        name="practice"
        options={{ title: "Multiplication Practice" }}
      />
      <Stack.Screen
        name="multidigit"
        options={{ title: "Multi Digit Multiplication" }}
      />
      <Stack.Screen
        name="compdecimals"
        options={{ title: "Comparing Decimals" }}
      />
      <Stack.Screen
        name="commonfractions"
        options={{ title: "Fraction To Decimal" }}
      />
      <Stack.Screen
        name="commondecimaltofractions"
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
    </Stack>
  );
}
/*
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="timestable"
          options={{
            drawerLabel: "Times Table",
            title: "Times Table",
          }}
        />
        <Drawer.Screen
          name="practice"
          options={{
            drawerLabel: "Multiplication Practice",
            title: "Multiplication Practice",
          }}
        />
        <Drawer.Screen
          name="multidigit"
          options={{
            drawerLabel: "Multi Digit Multiplication",
            title: "Multi Digit Multiplication",
          }}
        />
        <Drawer.Screen
          name="compdecimals"
          options={{
            drawerLabel: "Comparing Decimals",
            title: "Comparing Decimals",
          }}
        />
        <Drawer.Screen
          name="commonfractions"
          options={{
            drawerLabel: "Common Fractions To Decimal",
            title: "Common Fractions To Decimal",
          }}
        />
        <Drawer.Screen
          name="commondecimaltofractions"
          options={{
            drawerLabel: "Common Decimal To Fractions",
            title: "Common Decimal To Fractions",
          }}
        />
        <Drawer.Screen
          name="addingdecimals"
          options={{
            drawerLabel: "Adding Decimals",
            title: "Adding Decimals",
          }}
        />
        <Drawer.Screen
          name="subtractingdecimals"
          options={{
            drawerLabel: "Subtracting Decimals",
            title: "Subtracting Decimals",
          }}
        />
        <Drawer.Screen
          name="addingfractions"
          options={{
            drawerLabel: "Adding Fractions",
            title: "Adding Fractions",
          }}
        />
        <Drawer.Screen
          name="subtractingfractions"
          options={{
            drawerLabel: "Subtracting Fractions",
            title: "Subtracting Fractions",
          }}
        />
        <Drawer.Screen
          name="threefractions"
          options={{
            drawerLabel: "Three Fractions",
            title: "Three Fractions",
          }}
        />
        <Drawer.Screen
          name="lcm"
          options={{
            drawerLabel: "LCM",
            title: "LCM",
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
*/
