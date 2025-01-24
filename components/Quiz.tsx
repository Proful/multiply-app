import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, useNavigation } from "expo-router";

const { width: sw, height: sh } = Dimensions.get("window");
const USER_STYLES = {
  1: {
    bg: "#e6f3ff",
    activeBg: "#2196f3",
    textColor: "#2196f3",
    activeTextColor: "white",
  },
  2: {
    bg: "#fff0e6",
    activeBg: "#ff9800",
    textColor: "#ff9800",
    activeTextColor: "white",
  },
  3: {
    bg: "#e6ffe6",
    activeBg: "#4caf50",
    textColor: "#4caf50",
    activeTextColor: "white",
  },
} as any;

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}

interface UserState {
  name: string;
  selectedOption: string | null;
  correctCount: number;
  wrongCount: number;
  answeredQuestions: Set<number>;
  answers: string[];
  pendingCorrect: boolean; // New field to track pending correct answer
}

type QuizScreenProp = {
  quizData: QuizData;
};
export default function QuizScreen({ quizData }: QuizScreenProp) {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeUser, setActiveUser] = useState<number>(1);
  const [showAnswer, setShowAnswer] = useState(false);

  // State for each user
  const [userStates, setUserStates] = useState<{ [key: number]: UserState }>({
    1: {
      name: "Jhia",
      selectedOption: null,
      correctCount: 0,
      wrongCount: 0,
      answeredQuestions: new Set(),
      answers: [],
      pendingCorrect: false, // Initialize new field
    },
    2: {
      name: "Mom",
      selectedOption: null,
      correctCount: 0,
      wrongCount: 0,
      answeredQuestions: new Set(),
      answers: [],
      pendingCorrect: false, // Initialize new field
    },
    3: {
      name: "Dad",
      selectedOption: null,
      correctCount: 0,
      wrongCount: 0,
      answeredQuestions: new Set(),
      answers: [],
      pendingCorrect: false, // Initialize new field
    },
  });

  const handleOptionSelect = (option: string) => {
    const currentUserState = userStates[activeUser];

    // Check if current user has already answered this question
    if (currentUserState.answeredQuestions.has(currentQuestion)) {
      return;
    }

    const isCorrect = option === quizData?.quiz[currentQuestion].answer;

    setUserStates((prev) => {
      const newState = { ...prev };
      const newAnswers = [...currentUserState.answers];
      newAnswers[currentQuestion] = option;

      newState[activeUser] = {
        ...currentUserState,
        selectedOption: option,
        answeredQuestions: new Set([
          ...currentUserState.answeredQuestions,
          currentQuestion,
        ]),
        answers: newAnswers,
        pendingCorrect: isCorrect, // Set pending status if answer is correct
        correctCount: currentUserState.correctCount, // Don't increment immediately
        wrongCount: !isCorrect
          ? currentUserState.wrongCount + 1
          : currentUserState.wrongCount,
      };
      return newState;
    });
  };

  useEffect(() => {
    if (showAnswer) {
      setUserStates((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((userId) => {
          const numericId = parseInt(userId);
          const userState = newState[numericId];
          if (
            userState.pendingCorrect &&
            userState.answeredQuestions.has(currentQuestion)
          ) {
            newState[numericId] = {
              ...userState,
              correctCount: userState.correctCount + 1,
              pendingCorrect: false,
            };
          }
        });
        return newState;
      });
    }
  }, [showAnswer]);

  const handleUserSwitch = (userId: number) => {
    setActiveUser(userId);
    setShowAnswer(false);
  };

  const handleSwipe = (dir: string) => {
    console.log("dir", dir);

    if (dir === "right") {
      handleSwipeRight();
    } else {
      handleSwipeLeft();
    }
  };

  const handleSwipeRight = () => {
    if (currentQuestion < quizData!.quiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      Alert.alert("You are on the last question.");
    }
  };

  const handleSwipeLeft = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setShowAnswer(false);
    } else {
      Alert.alert("You are on the first question.");
    }
  };

  if (!quizData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Stack.Screen
        options={{
          title: `Question ${currentQuestion + 1}/${quizData?.quiz?.length}`,
        }}
      />
      <View>
        <View style={styles.quizContainer}>
          <LinearGradient
            colors={["#ffffff", "#eceef0"]}
            style={styles.lgContainer}
          >
            <View style={{ flex: 1, margin: 10 }}>
              <View style={{ flex: 1 }}>
                <View style={styles.quizContainerOrange}>
                  <View key={currentQuestion} style={styles.quizContainerWhite}>
                    <Swipeable
                      friction={1}
                      leftThreshold={40}
                      rightThreshold={40}
                      onSwipeableClose={handleSwipe}
                    >
                      <QuizView
                        question={quizData.quiz[currentQuestion].question}
                        answer={quizData.quiz[currentQuestion].answer}
                        selectedOption={userStates[activeUser].selectedOption!}
                        options={quizData.quiz[currentQuestion].options}
                        handleOptionSelect={handleOptionSelect}
                        showAnswer={showAnswer}
                        userStates={userStates}
                        activeUser={activeUser}
                        currentQuestion={currentQuestion}
                      />
                    </Swipeable>
                  </View>

                  {/* User Selection Buttons */}
                  <View style={styles.userButtonsContainer}>
                    {[1, 2, 3].map((userId) => (
                      <TouchableOpacity
                        key={userId}
                        style={[
                          styles.userButton,
                          {
                            backgroundColor:
                              activeUser === userId
                                ? USER_STYLES[userId].activeBg
                                : USER_STYLES[userId].bg,
                          },
                        ]}
                        onPress={() => handleUserSwitch(userId)}
                      >
                        <Text
                          style={[
                            styles.userButtonText,
                            {
                              color:
                                activeUser === userId
                                  ? USER_STYLES[userId].activeTextColor
                                  : USER_STYLES[userId].textColor,
                            },
                          ]}
                        >
                          {userStates[userId].name} (
                          {userStates[userId].correctCount}/
                          {userStates[userId].answeredQuestions.size})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* View Answer Button */}
                  <TouchableOpacity
                    style={styles.viewAnswerButton}
                    onPress={() => setShowAnswer(true)}
                  >
                    <Text style={styles.viewAnswerButtonText}>View Answer</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.prevNextButton,
                        {
                          backgroundColor:
                            currentQuestion === 0 ? "#f1f7fc" : "#e5ecf8",
                        },
                      ]}
                      onPress={() => handleSwipeLeft()}
                      disabled={currentQuestion === 0}
                    >
                      <Text style={styles.prevNextButtonText}>Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.prevNextButton,
                        {
                          backgroundColor:
                            currentQuestion === quizData.quiz.length - 1
                              ? "#f1f7fc"
                              : "#e5ecf8",
                        },
                      ]}
                      onPress={() => handleSwipeRight()}
                      disabled={currentQuestion === quizData.quiz.length - 1}
                    >
                      <Text style={styles.prevNextButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

interface QuizViewProps {
  question: string;
  answer: string;
  selectedOption: string;
  options: string[];
  handleOptionSelect: (option: string) => void;
  showAnswer: boolean;
  userStates: { [key: number]: UserState };
  activeUser: number;
  currentQuestion: number;
}

const QuizView = ({
  question,
  answer,
  selectedOption,
  options,
  handleOptionSelect,
  showAnswer,
  userStates,
  activeUser,
  currentQuestion,
}: QuizViewProps) => {
  if (!question || !options) {
    return null;
  }

  const getUsersForOption = (option: string) => {
    return Object.entries(userStates)
      .filter(([_, state]) => state.answers[currentQuestion] === option)
      .map(([userId]) => parseInt(userId));
  };

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 28 }}>{question}</Text>

      <View
        style={{
          marginVertical: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {options.map((option, index) => {
          const usersWhoSelected = getUsersForOption(option);
          // const isSelectedByCurrentUser =
          //   userStates[activeUser].answers[currentQuestion] === option;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleOptionSelect(option);
              }}
              style={{
                padding: 50,
                borderRadius: 25,
                marginBottom: 15,
                backgroundColor: "#f1f7fc",
                borderWidth: usersWhoSelected.length > 0 ? 1 : 0,
                borderColor: "#e0e0e0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "black" }}>{option}</Text>

                {usersWhoSelected.map((userId, i) => (
                  <View
                    key={userId}
                    style={{
                      position: "absolute",
                      top: -42,
                      backgroundColor: USER_STYLES[userId].activeBg,
                      left: -20 + 20 * i,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  />
                ))}
                {option === answer && showAnswer && (
                  <View
                    style={{
                      position: "absolute",
                      right: -4,
                      top: -22,
                      zIndex: 9,
                    }}
                  >
                    <AntDesign name="checkcircle" size={24} color="#02cc03" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const additionalStyles = StyleSheet.create({
  userButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  activeUserButton: {
    // backgroundColor: "#7284ca",
  },
  userButtonText: {
    textAlign: "center",
    color: "black",
  },
  activeUserButtonText: {
    color: "white",
  },
  viewAnswerButton: {
    backgroundColor: "#e5ecf8",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  viewAnswerButtonText: {
    textAlign: "center",
    color: "#7284ca",
    fontWeight: "bold",
  },
  prevNextButton: {
    paddingVertical: 10, // Ensures consistent vertical padding
    paddingHorizontal: 20, // Adds more horizontal padding for a larger button
    borderRadius: 8,
    marginBottom: 10,
  },
  prevNextButtonText: {
    textAlign: "center",
    color: "#7284ca",
    fontWeight: "bold",
    fontSize: 16, // Optional: Adjust text size for better readability
  },
});

// Merge the additional styles with existing styles
const styles = StyleSheet.create({
  ...StyleSheet.create({
    // ... your existing styles ...
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e5ecf8",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 15,
    },
    left: {
      width: 40,
      height: 40,
      backgroundColor: "#7284ca",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    leftText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#f4fcff",
    },
    right: {
      marginStart: 16,
      flex: 1,
    },
    title: { textAlign: "left", fontSize: 16 },
    subtitle: {
      textAlign: "left",
      fontSize: 12,
      color: "#94a4af",
      textTransform: "uppercase",
    },
    quizContainerOrange: {
      backgroundColor: "#ffe1e3",
      padding: 10,
      borderRadius: 30,
      height: 300,
    },
    quizContainerWhite: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 15,
      minHeight: 300,
      margin: 20,
      elevation: 5,
    },
    quizFooterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 5,
      marginTop: 240,
    },
    lgContainer: {
      borderRadius: 40,
      height: sh * 0.9,
      marginTop: (sh - sh * 0.9) / 8,
    },
    quizContainer: {
      width: sw * 0.95,
      marginLeft: (sw - sw * 0.95) / 2,
    },
  }),
  ...additionalStyles,
});
