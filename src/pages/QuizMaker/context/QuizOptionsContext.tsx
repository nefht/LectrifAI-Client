import React, { createContext, useState } from "react";
import {
  EQuizMakerOptions,
  QuizOptionsForm,
} from "../constants/quiz-maker-options";

interface QuizOptionsContextProps {
  quizMakerOptions: QuizOptionsForm;
  setQuizMakerOptions: React.Dispatch<
    React.SetStateAction<QuizOptionsForm>
  >;
  handleGetQuizMakerOptions: (event: {
    target: { name: any; value: any };
  }) => void;
}

export const QuizOptionsContext = createContext<
  QuizOptionsContextProps | undefined
>(undefined);

export const QuizOptionsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [quizMakerOptions, setQuizMakerOptions] =
    useState<QuizOptionsForm>({
      [EQuizMakerOptions.TOPIC]: "",
      [EQuizMakerOptions.DOCUMENT_TEXT]: "",
      [EQuizMakerOptions.FILE]: null,
      [EQuizMakerOptions.ACADEMIC_LEVEL]: "",
      [EQuizMakerOptions.LANGUAGE]: "",
      [EQuizMakerOptions.QUESTION_TYPE]: "",
      [EQuizMakerOptions.NUMBER_OF_QUESTIONS]: 1,
      [EQuizMakerOptions.SPECIFIC_REQUIREMENTS]: "",
    });

  const handleGetQuizMakerOptions = (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    let options = { ...quizMakerOptions, [name]: value };
    setQuizMakerOptions(options);
    console.log(options);
  };

  return (
    <QuizOptionsContext.Provider
      value={{
        quizMakerOptions,
        setQuizMakerOptions,
        handleGetQuizMakerOptions,
      }}
    >
      {children}
    </QuizOptionsContext.Provider>
  );
};
