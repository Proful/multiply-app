import { Link } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/timestable")}
            style={styles.press}
          >
            <Text>Times Table</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/practice")}
            style={styles.press}
          >
            <Text>Practice</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/multidigit")}
            style={styles.press}
          >
            <Text>Multiplication</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/compdecimals")}
            style={styles.press}
          >
            <Text>Comparing Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/commonfractions")}
            style={styles.press}
          >
            <Text>Fractions To Decimal</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/commondecimaltofractions")}
            style={styles.press}
          >
            <Text>Decimal To Fractions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/addingdecimals")}
            style={styles.press}
          >
            <Text>Adding Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/subtractingdecimals")}
            style={styles.press}
          >
            <Text>Subtracting Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/addingfractions")}
            style={styles.press}
          >
            <Text>Adding Fractions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/subtractingfractions")}
            style={styles.press}
          >
            <Text>Subtracting Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/threefractions")}
            style={styles.press}
          >
            <Text>Three Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/lcm")}
            style={styles.press}
          >
            <Text>LCM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center the grid vertically
    alignItems: "stretch", // Ensure rows span full width
  },
  row: {
    flexDirection: "row", // Arrange items horizontally
    flex: 1, // Each row takes up equal vertical space
  },
  column: {
    flex: 1, // Each column takes up equal horizontal space
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    backgroundColor: "#f9f9f9",
    color: "#596066",
    margin: 8, // Add spacing between columns and rows
    borderRadius: 8, // Optional: rounded corners

    elevation: 5, // Add box shadow
  },
  press: {
    flex: 1, // Each column takes up equal horizontal space
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
