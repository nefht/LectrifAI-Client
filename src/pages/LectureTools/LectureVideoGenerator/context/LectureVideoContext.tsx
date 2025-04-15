import { createContext, useState } from "react";
import {
  EGeneratedLectureForm,
  GeneratedLectureForm,
  LectureVideoForm,
} from "../constants/generate-lecture-form";
import { lectureLengths, lectureSpeeds, voiceStyles } from "../constants/lecture-settings";

interface LectureVideoContextProps {
  lectureOptions: GeneratedLectureForm;
  setLectureOptions: React.Dispatch<React.SetStateAction<GeneratedLectureForm>>;
  handleGetLectureOptions: (event: {
    target: { name: any; value: any };
  }) => void;
  lectureVideoSettings: LectureVideoForm;
  setLectureVideoSettings: React.Dispatch<
    React.SetStateAction<LectureVideoForm>
  >;
}

export const LectureVideoContext = createContext<
  LectureVideoContextProps | undefined
>(undefined);

export const LectureVideoProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // State để tạo lecture script
  const [lectureOptions, setLectureOptions] = useState<GeneratedLectureForm>({
    [EGeneratedLectureForm.FILE]: null,
    [EGeneratedLectureForm.FILE_ID]: "",
    [EGeneratedLectureForm.ACADEMIC_LEVEL]: "",
    [EGeneratedLectureForm.VOICE_TYPE]: "",
    [EGeneratedLectureForm.VOICE_STYLE]: voiceStyles[0].value,
    [EGeneratedLectureForm.BACKGROUND_MUSIC]: "",
    [EGeneratedLectureForm.LANGUAGE]: "",
    [EGeneratedLectureForm.LECTURE_SPEED]: lectureSpeeds[1].value,
    [EGeneratedLectureForm.LECTURE_LENGTH]: lectureLengths[1].value,
    [EGeneratedLectureForm.INTERACTIVE_QUIZ]: false,
    [EGeneratedLectureForm.SPECIFIC_REQUIREMENTS]: "",
  });
  // State để tạo lecture video
  const [lectureVideoSettings, setLectureVideoSettings] =
    useState<LectureVideoForm>({
      [EGeneratedLectureForm.FILE_ID]: "",
      [EGeneratedLectureForm.LECTURE_SCRIPT_ID]: "",
      [EGeneratedLectureForm.LANGUAGE_CODE]: "",
      [EGeneratedLectureForm.VOICE_TYPE]: "",
      [EGeneratedLectureForm.LECTURE_SPEED]: "",
    });

  const handleGetLectureOptions = (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    let options = { ...lectureOptions, [name]: value };
    setLectureOptions(options);
    console.log(options);
  };

  return (
    <LectureVideoContext.Provider
      value={{
        lectureOptions,
        setLectureOptions,
        handleGetLectureOptions,
        lectureVideoSettings,
        setLectureVideoSettings,
      }}
    >
      {children}
    </LectureVideoContext.Provider>
  );
};
