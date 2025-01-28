import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { colors, fonts, sharedStyles } from "@/lib/styles";
import { AntDesign } from "@expo/vector-icons";
import { divide, getRandomNumber } from "@/lib/utils";
import HintModal from "@/components/HintModal";
import LongDivisionAnimator from "./division_animator";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import PenScratchPad from "@/components/PenScratchPad";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";
import FiveDigitInput from "@/components/FiveDigitInput";

export default function Division() {
  const { id } = useLocalSearchParams();
  const [seed, setSeed] = useState<number>(0);
  const [dividend, setDividend] = useState<number>(0);
  const [divisor, setDivisor] = useState<number>(0);
  const [userQuotient, setUserQuotient] = useState<string>("");
  const [userReminder, setUserReminder] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const [modalVisible, setModalVisible] = useState(false);
  const [penModalVisible, setPenModalVisible] = useState(false);
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

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
    setSeed(getRandomNumber(10, 999999));
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

  if (!loaded && !error) {
    return null;
  }

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
      <ResetButton onReset={setup} />
      <ResultButton result={result} />

      <TouchableOpacity
        style={{ ...sharedStyles.hintButton, marginRight: 5 }}
        onPress={openModal}
      >
        <AntDesign name="questioncircle" size={40} color={`${cardBgTint}`} />
      </TouchableOpacity>

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          position: "absolute",
          left: 10,
          bottom: 10,
          backgroundColor: cardBgTint,
        }}
      >
        <TouchableOpacity
          style={{ ...sharedStyles.penButton, marginLeft: 0 }}
          onPress={openPenModal}
        >
          <EvilIcons name="pencil" size={24} color={`${cardBg}`} />
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

      <MText>
        {dividend} ÷ {divisor}
      </MText>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 60,
        }}
      >
        <MText style={{ fontSize: fonts.secondary }}>Quotient</MText>
        <FiveDigitInput
          numOfDigits={4}
          seed={seed}
          direction="L2R"
          onDigit={(txt) => checkAnswer(txt + "", "QUOTIENT")}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MText style={{ fontSize: fonts.secondary }}>Reminder</MText>
        <FiveDigitInput
          numOfDigits={3}
          seed={seed}
          direction="L2R"
          onDigit={(txt) => checkAnswer(txt + "", "REMAINDER")}
        />
      </View>
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
