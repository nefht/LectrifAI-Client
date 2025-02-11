export enum EGeneratedSlideForm {
  TOPIC = "topic",
  CONTENT = "content",
  WRITING_TONE = "writingTone",
  LANGUAGE = "language",
  NUMBER_OF_SLIDES = "numberOfSlides",
  TEMPLATE_STYLE = "templateStyle",
  TEMPLATE_CODE = "templateCode",
  SPECIFIC_REQUIREMENTS = "specificRequirements",
  SLIDE_LAYOUT = "slideLayout", // ImageToSlide: Extract text only/Include images
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

export interface GeneratedSlideFromImage {
  [EGeneratedSlideForm.CONTENT]: string | File[];
  [EGeneratedSlideForm.SLIDE_LAYOUT]: string; // "0" or "1"
  [EGeneratedSlideForm.LANGUAGE]: string;
  [EGeneratedSlideForm.TEMPLATE_STYLE]: string;
  [EGeneratedSlideForm.TEMPLATE_CODE]: string;
}