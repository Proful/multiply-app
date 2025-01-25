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
import { colors, sharedStyles } from "@/lib/styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { divide, getRandomNumber } from "@/lib/utils";
import HintModal from "@/components/HintModal";
import LongDivisionAnimator from "./division_animator";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import PenScratchPad from "@/components/PenScratchPad";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";

export default function Division() {
  const { id } = useLocalSearchParams();
  const [dividend, setDividend] = useState<number>(0);
  const [divisor, setDivisor] = useState<number>(0);
  const [userQuotient, setUserQuotient] = useState<string>("");
  const [userReminder, setUserReminder] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const [modalVisible, setModalVisible] = useState(false);
  const [penModalVisible, setPenModalVisible] = useState(false);

  const openPenModal = () => {
    setPenModalVisible(true);
  };
  const closePenModal = () => setPenModalVisible(false);

  const openModal = () => {
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

  const cardBg = colors.card[+(id as string) % 10];
  const cardBgTint = darkenColor("#ffffff", 0.5);

  return (
    <View
      style={[
        sharedStyles.screenContainer,
        {
          backgroundColor: cardBg,
        },
      ]}
    >
      <TouchableOpacity style={sharedStyles.resetButton} onPress={setup}>
        <Ionicons name="refresh-circle" size={50} color={`${cardBgTint}`} />
      </TouchableOpacity>
      {result === "correct" && (
        <>
          <View style={sharedStyles.resultButton}>
            <Ionicons name="checkmark-circle-outline" size={50} color="green" />
          </View>
        </>
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

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          position: "absolute",
          left: 10,
          bottom: 10,
          backgroundColor: "#bec3c8",
        }}
      >
        <TouchableOpacity
          style={{ ...sharedStyles.penButton, marginLeft: 0 }}
          onPress={openPenModal}
        >
          <EvilIcons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} // Required for Android back button
      >
        <HintModal onCloseModal={closeModal}>
          <View style={styles.row}>
            <LongDivisionAnimator
              dividend={dividend + ""}
              divisor={divisor + ""}
            />
          </View>
        </HintModal>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={penModalVisible}
        onRequestClose={closePenModal} // Required for Android back button
      >
        <PenScratchPad />
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
          placeholder={"?"}
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
          placeholder={"?"}
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
