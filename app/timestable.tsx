import { TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { colors, sharedStyles } from "@/lib/styles";
import { darkenColor, getRandomNumber } from "@/lib/utils";
import AnimatedDigit from "@/components/AnimatedDigit";
import { useFonts } from "expo-font";
import MText from "@/components/MText";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import ResetButton from "@/components/ResetButton";
const STORAGE_KEY = "timestable";
const FROM_VALUE = 2;
const TO_VALUE = 10;

export default function TimesTable() {
  const { id } = useLocalSearchParams();
  const [fromValue, setFromValue] = useState(-1);
  const [toValue, setToValue] = useState(-1);
  const [digit, setDigit] = useState<number>(-1);
  const [loaded, error] = useFonts({
    BlexMono: require("../assets/BlexMonoNerdFont-Regular.ttf"),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    // Trigger immediately
    setDigit(
      getRandomNumber(
        Number(fromValue) || FROM_VALUE,
        Number(toValue) || TO_VALUE,
      ),
    );

    // Set interval for repeated updates every 15 seconds
    interval = setInterval(() => {
      setDigit(
        getRandomNumber(
          Number(fromValue) || FROM_VALUE,
          Number(toValue) || TO_VALUE,
        ),
      );
    }, 15000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fromValue, toValue]);

  useFocusEffect(
    useCallback(() => {
      const loadStoredData = async () => {
        let from = FROM_VALUE;
        let to = TO_VALUE;

        try {
          const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

          if (storedValue) {
            const parsed = JSON.parse(storedValue);
            from = Number(parsed.from) || FROM_VALUE;
            to = Number(parsed.to) || TO_VALUE;
          }
        } catch (error) {
          console.error("Failed to load data from AsyncStorage:", error);
        }

        setFromValue(from);
        setToValue(to);
      };
      loadStoredData();
    }, []),
  );

  if (digit === -1) {
    return null;
  }

  if (!loaded && !error) {
    return null;
  }

  const setup = () => {
    setDigit(getRandomNumber(fromValue, toValue));
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
      <>
        <ResetButton onReset={setup} />

        <TouchableOpacity
          style={{ ...sharedStyles.hintButton, marginRight: 5 }}
          onPress={() => {
            router.navigate(
              `/timestablepractice?id=5&fromValue=${fromValue}&toValue=${toValue}`,
            );
          }}
        >
          <AntDesign
            name="questioncircle"
            size={40}
            color="rgba(255,255,255,0.5)"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[sharedStyles.quizButton, { backgroundColor: cardBgTint }]}
          onPress={() => {
            router.navigate("/quiz/timestable");
          }}
        >
          <AntDesign name="appstore-o" size={24} color={`${cardBg}`} />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: 5,
              }}
            >
              <AnimatedDigit digit={digit} />
              <MText>{`X`}</MText>
              <MText>{`${i + 2}`}</MText>
              <MText>{"="}</MText>
              <AnimatedDigit
                digit={
                  digit * (i + 2) < 10 ? ` ${digit * (i + 2)}` : digit * (i + 2)
                }
              />
            </View>
          ))}
        </View>
      </>
    </View>
  );
}
