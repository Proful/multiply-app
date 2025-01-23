import React, { useRef } from "react";
import { StyleSheet, SafeAreaView, Button } from "react-native";

import FreeCanvas from "react-native-free-canvas";
const PenScratchPad = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FreeCanvas
        // style={{flex: 1}}
        style={styles.flex1} //avoid using a new Object to prevent unnecessary re-rendering
        strokeColor={"#4CC9FE"}
        strokeWidth={1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
export default PenScratchPad;
