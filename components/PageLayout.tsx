// Layout.tsx
import { sharedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface LayoutProps {
  children: React.ReactNode;
  showResetButton?: boolean;
  onReset?: () => void;
}

const PageLayout: React.FC<LayoutProps> = ({
  children,
  showResetButton = false,
  onReset,
}) => {
  return (
    <View style={sharedStyles.screenContainer}>
      <View style={styles.content}>{children}</View>
      {showResetButton && (
        <TouchableOpacity
          style={sharedStyles.resetButton}
          onPress={onReset || (() => console.log("Reset"))}
        >
          <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  content: {
    flex: 1,
  },
});

export default PageLayout;
