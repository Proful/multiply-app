import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { sharedStyles } from "@/lib/styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { divide, getRandomNumber } from "@/lib/utils";
import HintModal from "@/components/HintModal";

export default function Division() {
  const [dividend, setDividend] = useState<number>(0);
  const [divisor, setDivisor] = useState<number>(0);
  const [userQuotient, setUserQuotient] = useState<string>("");
  const [userReminder, setUserReminder] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [answer, setAnswer] = useState<number[]>([0, 0]);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    const { quotient, remainder } = divide(dividend, divisor);
    setAnswer([quotient, remainder]);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const setup = () => {
    const a = getRandomNumber(99, 9999);
    const b = getRandomNumber(2, 9);
    setDividend(a);
    setDivisor(b);
    setUserQuotient("");
    setUserReminder("");
    setResult("");
  };

  useFocusEffect(useCallback(setup, []));

  const checkAnswer = (txt: string, type: string) => {
    let q = userQuotient,
      r = userReminder;

    if (type === "QUOTIENT") {
      q = txt;
      setUserQuotient(q);
    } else if (type === "REMAINDER") {
      r = txt;
      setUserReminder(r);
    }

    if (q) {
      const { quotient, remainder } = divide(dividend, divisor);
      const isEqual = quotient === +q && remainder === +(r || "0");
      if (isEqual) {
        setResult("correct");
      } else {
        setResult("wrong");
      }
    }
  };

  return (
    <View style={sharedStyles.screenContainer}>
      <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
        <Ionicons name="refresh-circle" size={50} color="#bec3c8" />
      </TouchableOpacity>
      {result === "correct" && (
        <View style={sharedStyles.resultButton}>
          <Ionicons name="checkmark-circle-outline" size={50} color="green" />
        </View>
      )}
      {result === "wrong" && (
        <View style={sharedStyles.resultButton}>
          <Ionicons name="close-circle-outline" size={50} color="red" />
        </View>
      )}

      <TouchableOpacity
        style={{ ...sharedStyles.hintButton, marginRight: 5 }}
        onPress={openModal}
      >
        <AntDesign name="questioncircle" size={40} color="#bec3c8" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} // Required for Android back button
      >
        <HintModal onCloseModal={closeModal}>
          <View style={styles.row}>
            <Text style={styles.text}>Quotient: {answer[0]}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Reminder: {answer[1]}</Text>
          </View>
        </HintModal>
      </Modal>

      <Text style={{ fontSize: 44 }}>
        {dividend} ÷ {divisor}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 30,
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 10 }}>Quotient = </Text>
        <TextInput
          style={{ fontSize: 24, width: "75%" }}
          placeholder={"Enter Answer"}
          value={userQuotient}
          keyboardType="numeric"
          onChangeText={(txt) => checkAnswer(txt, "QUOTIENT")}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 30,
        }}
      >
        <Text style={{ fontSize: 24, marginTop: 10 }}>Reminder = </Text>
        <TextInput
          style={{ fontSize: 24, width: "75%" }}
          placeholder={"Enter Answer"}
          value={userReminder}
          keyboardType="numeric"
          onChangeText={(txt) => checkAnswer(txt, "REMAINDER")}
        />
      </View>
      {result === "correct" && (
        <ConfettiCannon
          count={200} // Number of particles
          origin={{ x: 200, y: 0 }} // Origin of the confetti (top-center)
          autoStart={true} // Automatically trigger confetti
          fadeOut={true} // Confetti fades out
          explosionSpeed={350} // Speed of the particles
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center", // Align vertically in the center
    justifyContent: "flex-start", // Align items from the start of the row
  },
  text: {
    marginRight: 20,
    fontSize: 16,
  },
});
