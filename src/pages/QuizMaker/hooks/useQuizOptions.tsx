import { useContext } from "react";
import { QuizOptionsContext } from "../context/QuizOptionsContext";

export const useQuizOptions = () => {
  const context = useContext(QuizOptionsContext);
  if (!context) {
    throw new Error(
      "useQuizOptions must be used within a QuizOptionsContextProvider"
    );
  }
  return context;
};
