import { View } from "react-native";
import React from "react";
import Quiz from "@/components/Quiz";

export default function App() {
  const quizData = generateRandomQuizData(10, 99);

  return (
    <View>
      <Quiz quizData={quizData} />
    </View>
  );
}
interface QuizQuestion {
  question: string;
  options: string[]; // 4 options
  answer: string;
}

interface QuizData {
  quiz: QuizQuestion[];
}

function generateRandomQuizData(min: number, max: number): QuizData {
  const questionsPool: { question: string; answer: number }[] = [];

  // Create the pool of all possible questions
  for (let i = min; i <= max; i++) {
    for (let j = min; j < max; j++) {
      questionsPool.push({
        question: `${i} x ${j} = ?`,
        answer: i * j,
      });
    }
  }

  // Shuffle the questions pool
  const shuffledQuestions = questionsPool.sort(() => Math.random() - 0.5);

  // Select 10 random questions
  const quiz: QuizQuestion[] = [];
  const selectedQuestions = shuffledQuestions.slice(0, 10);

  for (const { question, answer } of selectedQuestions) {
    const incorrectOptions = new Set<number>();

    // Generate 3 unique incorrect options close to the correct answer
    while (incorrectOptions.size < 3) {
      const offset = Math.floor(Math.random() * 5) + 1; // Offset between 1 and 5
      const randomOption =
        Math.random() > 0.5 ? answer + offset : answer - offset;

      // Ensure the random option is positive and not equal to the correct answer
      if (randomOption > 0 && randomOption !== answer) {
        incorrectOptions.add(randomOption);
      }
    }

    const options = Array.from(incorrectOptions);
    const correctOptionIndex = Math.floor(Math.random() * 4);
    options.splice(correctOptionIndex, 0, answer); // Insert the correct answer

    quiz.push({
      question,
      options: options.map(String), // Convert options to strings
      answer: String(answer),
    });
  }

  return { quiz };
}
