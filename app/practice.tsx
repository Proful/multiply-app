import { PracticeFast } from "@/components/PracticeFast";
import { sharedStyles } from "@/lib/styles";
import { Text, View } from "react-native";

export default function Practice() {
  return (
    <View style={sharedStyles.screenContainer}>
      <PracticeFast />
    </View>
  );
}
