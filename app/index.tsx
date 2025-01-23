import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/division_animator_anim")}
            style={styles.press}
          >
            <Text style={styles.text}>Times Table</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/timestablepractice")}
            style={styles.press}
          >
            <Text style={styles.text}>Times Table Practice</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/multiplication")}
            style={styles.press}
          >
            <Text style={styles.text}>Multiplication</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/comparingdecimals")}
            style={styles.press}
          >
            <Text style={styles.text}>Comparing Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/fractiontodecimal")}
            style={styles.press}
          >
            <Text style={styles.text}>Fraction To Decimal</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/decimaltofraction")}
            style={styles.press}
          >
            <Text style={styles.text}>Decimal To Fraction</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/addingdecimals")}
            style={styles.press}
          >
            <Text style={styles.text}>Adding Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/subtractingdecimals")}
            style={styles.press}
          >
            <Text style={styles.text}>Subtracting Decimals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/addingfractions")}
            style={styles.press}
          >
            <Text style={styles.text}>Adding Fractions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/subtractingfractions")}
            style={styles.press}
          >
            <Text style={styles.text}>Subtracting Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/threefractions")}
            style={styles.press}
          >
            <Text style={styles.text}>Three Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/lcm")}
            style={styles.press}
          >
            <Text style={styles.text}>LCM</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/addingmixed")}
            style={styles.press}
          >
            <Text style={styles.text}>Adding Mixed Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/subtractingmixed")}
            style={styles.press}
          >
            <Text style={styles.text}>Subtracting Mixed Fractions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <TouchableOpacity
            onPress={() => router.push("/division")}
            style={styles.press}
          >
            <Text style={styles.text}>Division</Text>
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
    textAlign: "center",
  },
});
