import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

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
            drawerLabel: "Practice",
            title: "Practice",
          }}
        />
        <Drawer.Screen
          name="multidigit"
          options={{
            drawerLabel: "Multi Digit",
            title: "Multi Digit Multiplication",
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
