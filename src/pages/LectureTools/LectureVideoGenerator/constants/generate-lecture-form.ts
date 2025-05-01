export enum EGeneratedLectureForm {
    // Tạo script
    FILE = "file",
    FILE_ID = "fileId",
    ACADEMIC_LEVEL = "academicLevel",
    VOICE_STYLE = "voiceStyle",
    BACKGROUND_MUSIC = "backgroundMusic",
    LANGUAGE = "language",
    LECTURE_LENGTH = "lectureLength",
    INTERACTIVE_QUIZ = "interactiveQuiz",
    SPECIFIC_REQUIREMENTS = "specificRequirements",
    // Tạo video
    LECTURE_SCRIPT_ID = "lectureScriptId",
    LANGUAGE_CODE = "languageCode",
    VOICE_TYPE = "voiceType",
    LECTURE_SPEED = "lectureSpeed",
}

export interface GeneratedLectureForm {
    [EGeneratedLectureForm.FILE]: File | null;
    [EGeneratedLectureForm.FILE_ID]: string;
    [EGeneratedLectureForm.ACADEMIC_LEVEL]: string;
    [EGeneratedLectureForm.VOICE_TYPE]: string;
    [EGeneratedLectureForm.VOICE_STYLE]: string;
    // [EGeneratedLectureForm.BACKGROUND_MUSIC]: string;
    [EGeneratedLectureForm.LANGUAGE]: string;
    [EGeneratedLectureForm.LECTURE_SPEED]: string;
    [EGeneratedLectureForm.LECTURE_LENGTH]: string;
    [EGeneratedLectureForm.INTERACTIVE_QUIZ]: boolean;
    [EGeneratedLectureForm.SPECIFIC_REQUIREMENTS]: string;
}

export interface LectureVideoForm {
    [EGeneratedLectureForm.FILE_ID]: string;
    [EGeneratedLectureForm.LECTURE_SCRIPT_ID]: string;
    [EGeneratedLectureForm.LANGUAGE_CODE]: string;
    [EGeneratedLectureForm.VOICE_TYPE]: string;
    [EGeneratedLectureForm.LECTURE_SPEED]: string;
}