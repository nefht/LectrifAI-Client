export enum EQuizQuestion {
  QUESTION = "question",
  OPTIONS = "options",
  ANSWER = "answer",
  POINTS = "points",
  EXPLANATION = "explanation",
  QUESTION_TYPE = "questionType",
}

export interface QuizQuestion {
  [EQuizQuestion.QUESTION]: string;
  [EQuizQuestion.OPTIONS]: string[];
  [EQuizQuestion.ANSWER]: string;
  [EQuizQuestion.POINTS]: number;
  [EQuizQuestion.EXPLANATION]: string | null;
  [EQuizQuestion.QUESTION_TYPE]: "multiple choice" | "short answer";
}