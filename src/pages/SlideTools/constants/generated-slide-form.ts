export enum EGeneratedSlideForm {
  TOPIC = "topic",
  CONTENT = "content",
  WRITING_TONE = "writingTone",
  LANGUAGE = "language",
  NUMBER_OF_SLIDES = "numberOfSlides",
  TEMPLATE_STYLE = "templateStyle",
  TEMPLATE_CODE = "templateCode",
  SPECIFIC_REQUIREMENTS = "specificRequirements",
}

export interface GeneratedSlideFormModal {
  [EGeneratedSlideForm.TOPIC]: string;
  [EGeneratedSlideForm.WRITING_TONE]: string;
  [EGeneratedSlideForm.LANGUAGE]: string;
  [EGeneratedSlideForm.NUMBER_OF_SLIDES]: number;
  [EGeneratedSlideForm.TEMPLATE_STYLE]: string;
  [EGeneratedSlideForm.TEMPLATE_CODE]: string;
  [EGeneratedSlideForm.SPECIFIC_REQUIREMENTS]: string;
}

export interface GeneratedSlideFormProcess {
  [EGeneratedSlideForm.CONTENT]: string | File;
  [EGeneratedSlideForm.WRITING_TONE]: string;
  [EGeneratedSlideForm.LANGUAGE]: string;
  [EGeneratedSlideForm.NUMBER_OF_SLIDES]: number;
  [EGeneratedSlideForm.TEMPLATE_STYLE]: string;
  [EGeneratedSlideForm.TEMPLATE_CODE]: string;
}