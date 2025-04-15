export enum EQuizMakerOptions {
  TOPIC = "topic",
  DOCUMENT_TEXT = "documentText",
  FILE = "file",
  LECTURE_VIDEO_ID = "lectureVideoId",
  ACADEMIC_LEVEL = "academicLevel",
  LANGUAGE = "language",
  QUESTION_TYPE = "questionType",
  NUMBER_OF_QUESTIONS = "numberOfQuestions",
  SPECIFIC_REQUIREMENTS = "specificRequirements",
}

export interface QuizOptionsForm {
  [EQuizMakerOptions.TOPIC]: string;
  [EQuizMakerOptions.DOCUMENT_TEXT]: string;
  [EQuizMakerOptions.FILE]: File | null;
  [EQuizMakerOptions.ACADEMIC_LEVEL]: string;
  [EQuizMakerOptions.LANGUAGE]: string;
  [EQuizMakerOptions.QUESTION_TYPE]: string;
  [EQuizMakerOptions.NUMBER_OF_QUESTIONS]: number;
  [EQuizMakerOptions.SPECIFIC_REQUIREMENTS]: string;
}
