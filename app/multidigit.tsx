import MultiplicationChecker from "@/components/MultiplicationChecker";
import { sharedStyles } from "@/lib/styles";
import { Text, View } from "react-native";

export default function MultiDigit() {
  return (
    <View style={sharedStyles.screenContainer}>
      <MultiplicationChecker />
    </View>
  );
}
