import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/lib/styles";
import { AntDesign } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  const renderItem = ({
    item,
    index,
  }: {
    item: { route: string; title: string; description: string };
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => router.push(`${item.route}?id=${index}` as any)}
      style={[
        styles.press,
        {
          backgroundColor: colors.card[index % 10],
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
    >
      <View
        style={{
          width: "75%",
        }}
      >
        <Text
          style={[styles.title, { flexWrap: "wrap", width: "100%" }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View style={{ marginBottom: 10 }} />
        <Text
          style={[styles.description, { flexWrap: "wrap", width: "100%" }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>
      <View
        style={{
          borderColor: colors.card.fg,
          borderWidth: 1,
          borderRadius: 5,
          padding: 18,
        }}
      >
        <AntDesign name="checkcircle" size={24} color="#02cc03" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.route}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.bg,
    padding: 16,
  },
  press: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.card.fg,
    textAlign: "left",
  },
  description: {
    fontSize: 12,
    color: colors.card.fg,
    textAlign: "left",
  },
});

const data = [
  {
    route: "/timestable",
    title: "Times Table",
    description: "Learn and practice multiplication tables.",
    color: "#4CAF50",
  }, // Green
  {
    route: "/timestablepractice",
    title: "Times Table Practice",
    description: "Test your skills with times table exercises.",
    color: "#2196F3",
  }, // Blue
  {
    route: "/multiplication",
    title: "Multiplication",
    description: "Master the art of multiplication.",
    color: "#FF5722",
  }, // Deep Orange
  {
    route: "/comparingdecimals",
    title: "Comparing Decimals",
    description: "Understand how to compare decimal numbers.",
    color: "#9C27B0",
  }, // Purple
  {
    route: "/fractiontodecimal",
    title: "Fraction To Decimal",
    description: "Convert fractions to decimals easily.",
    color: "#FF9800",
  }, // Orange
  {
    route: "/decimaltofraction",
    title: "Decimal To Fraction",
    description: "Learn how to convert decimals into fractions.",
    color: "#673AB7",
  }, // Deep Purple
  {
    route: "/addingdecimals",
    title: "Adding Decimals",
    description: "Practice addition with decimal numbers.",
    color: "#03A9F4",
  }, // Light Blue
  {
    route: "/subtractingdecimals",
    title: "Subtracting Decimals",
    description: "Learn subtraction with decimals.",
    color: "#E91E63",
  }, // Pink
  {
    route: "/addingfractions",
    title: "Adding Fractions",
    description: "Add fractions with ease and precision.",
    color: "#009688",
  }, // Teal
  {
    route: "/subtractingfractions",
    title: "Subtracting Fractions",
    description: "Master subtracting fractions step by step.",
    color: "#F44336",
  }, // Red
  {
    route: "/threefractions",
    title: "Three Fractions",
    description: "Work with three fractions simultaneously.",
    color: "#795548",
  }, // Brown
  {
    route: "/lcm",
    title: "LCM",
    description: "Find the least common multiple (LCM) of numbers.",
    color: "#FFC107",
  }, // Amber
  {
    route: "/addingmixed",
    title: "Adding Mixed Fractions",
    description: "Learn to add mixed fractions effectively.",
    color: "#607D8B",
  }, // Blue Gray
  {
    route: "/subtractingmixed",
    title: "Subtracting Mixed Fractions",
    description: "Master subtraction of mixed fractions.",
    color: "#8BC34A",
  }, // Light Green
  {
    route: "/division",
    title: "Division",
    description: "Sharpen your division skills.",
    color: "#FFEB3B",
  }, // Yellow
];
