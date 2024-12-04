import { PracticeFast } from "@/components/PracticeFast";
import { Text, View } from "react-native";

export default function Practice() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PracticeFast />
    </View>
  );
}
