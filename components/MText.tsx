import { colors, fonts } from "@/lib/styles";
import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface MTextProps extends TextProps {
  children: React.ReactNode;
}

export default function MText({ children, style, ...props }: MTextProps) {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: fonts.primary,
    color: colors.card.fg,
    fontFamily: "BlexMono",
  },
});
