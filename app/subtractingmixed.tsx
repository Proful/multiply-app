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
import {
  compareMixedNumbers,
  compareMixedNumbersWithDifference,
  getRandomNumber,
  lcm,
  mixedNumbersWithDifference,
  MixedNumberType,
} from "@/lib/utils";
import { colors, sharedStyles } from "@/lib/styles";
import { AntDesign } from "@expo/vector-icons";
import MixedNumber from "@/components/MixedNumber";
import HintModal from "@/components/HintModal";
import { useLocalSearchParams } from "expo-router";
import { darkenColor } from "@/lib/utils";
import { FractionLine } from "@/components/FractionLine";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import ResetButton from "@/components/ResetButton";
import ResultButton from "@/components/ResultButton";

export default function SubtractingMixed() {
  const { id } = useLocalSearchParams();
  const [firstNumber, setFirstNumber] = useState<MixedNumberType>([0, 0, 0]);
  const [secondNumber, setSecondNumber] = useState<MixedNumberType>([0, 0, 0]);
  const [answer, setAnswer] = useState<MixedNumberType>([0, 0, 0]);
  const [result, setResult] = useState<string>("");
  const [isCommonDenominator, setIsCommonDenominator] =
    useState<boolean>(false);

  const [wholeNumber, setWholeNumber] = useState<string>("");
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");

  const [modalVisible, setModalVisible] = useState(false);
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  const openModal = () => {
    setAnswer(mixedNumbersWithDifference(firstNumber, secondNumber));
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  function setup() {
    const a = getRandomNumber(2, 9);
    const a2 = getRandomNumber(3, 10);
    const a1 = getRandomNumber(2, a2 - 1);
    const x = [a, a1, a2] as MixedNumberType;

    const b = getRandomNumber(2, 9);
    const b2 = getRandomNumber(3, 10);
    const b1 = getRandomNumber(2, b2 - 1);
    const y = [b, b1, b2] as MixedNumberType;

    if (compareMixedNumbers(x, y)) {
      setFirstNumber(x);
      setSecondNumber(y);
    } else {
      setFirstNumber(y);
      setSecondNumber(x);
    }

    //reset
    setResult("");
    setIsCommonDenominator(false);
    setWholeNumber("");
    setNumerator("");
    setDenominator("");
  }

  useFocusEffect(useCallback(setup, []));

  function checkAnswer(text: string, type: string) {
    let a = wholeNumber,
      b = numerator,
      c = denominator;

    if (type === "WHOLE_NUMBER") {
      a = text;
      setWholeNumber(a);
    } else if (type === "NUMERATOR") {
      b = text;
      setNumerator(b);
    } else if (type === "DENOMINATOR") {
      c = text;
      setDenominator(c);
    }

    if (c) {
      setIsCommonDenominator(+c === lcm(firstNumber[2], secondNumber[2]));
    }

    if (b && c) {
      const isMatch = compareMixedNumbersWithDifference(
        firstNumber,
        secondNumber,
        [a ? +a : 1, +b, +c],
      );

      setResult(isMatch ? "correct" : "wrong");
    } else {
      setResult("wrong");
    }
  }

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
            <Text style={styles.text}>Answer:</Text>
            <MixedNumber
              wholeNumber={answer[0]}
              numerator={answer[1]}
              denominator={answer[2]}
            />
          </View>
        </HintModal>
      </Modal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <MixedNumber
          wholeNumber={firstNumber[0]}
          numerator={firstNumber[1]}
          denominator={firstNumber[2]}
        />
        <MText>-</MText>
        <MixedNumber
          wholeNumber={secondNumber[0]}
          numerator={secondNumber[1]}
          denominator={secondNumber[2]}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginTop: 30,
        }}
      >
        <MText>=</MText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <TextInput
              keyboardType="number-pad"
              maxLength={2}
              style={[styles.input, { color: colors.card.fg }]}
              value={wholeNumber}
              onChangeText={(txt) => checkAnswer(txt, "WHOLE_NUMBER")}
            />
          </View>
          <View>
            <View>
              <TextInput
                style={sharedStyles.textInput}
                placeholderTextColor={colors.card.fg}
                placeholder={"?"}
                value={numerator}
                onChangeText={(txt) => checkAnswer(txt, "NUMERATOR")}
              />
            </View>
            <FractionLine w={200} />
            <TextInput
              style={sharedStyles.textInput}
              placeholderTextColor={colors.card.fg}
              placeholder={"?"}
              value={denominator}
              onChangeText={(txt) => checkAnswer(txt, "DENOMINATOR")}
            />
          </View>
        </View>
      </View>
      <View style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 20 }}>
        <Text style={{ color: colors.card.fg }}>
          Is common denominator?: {isCommonDenominator ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 4,
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 8,
  },
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
