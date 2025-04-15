export enum EGeneratedSlideForm {
  TOPIC = "topicText",
  CONTENT = "content",
  TOPIC_FILE= "topicFile",
  TOPIC_FILE_ID = "topicFileId",
  FILE_URLS = "fileUrls",
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
  [EGeneratedSlideForm.CONTENT]: string;
  [EGeneratedSlideForm.TOPIC_FILE]: File | null;
  [EGeneratedSlideForm.TOPIC_FILE_ID]: string;
  [EGeneratedSlideForm.WRITING_TONE]: string;
  [EGeneratedSlideForm.LANGUAGE]: string;
  [EGeneratedSlideForm.NUMBER_OF_SLIDES]: number;
  [EGeneratedSlideForm.TEMPLATE_STYLE]: string;
  [EGeneratedSlideForm.TEMPLATE_CODE]: string;
}

export interface GeneratedSlideFromImage {
  [EGeneratedSlideForm.CONTENT]: File[];
  [EGeneratedSlideForm.FILE_URLS]: string[];
  [EGeneratedSlideForm.SLIDE_LAYOUT]: string; // "0" or "1"
  [EGeneratedSlideForm.LANGUAGE]: string;
  [EGeneratedSlideForm.TEMPLATE_STYLE]: string;
  [EGeneratedSlideForm.TEMPLATE_CODE]: string;
}