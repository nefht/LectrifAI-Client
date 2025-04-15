import React, { createContext, useState } from "react";
import {
  EGeneratedSlideForm,
  GeneratedSlideFormProcess,
} from "../../constants/generated-slide-form";
import {
  templateSamples,
  templateStyles,
} from "../../constants/template-constants";
import { writingTones } from "../../PresentationMaker/GeneratedSlideModal/InformationTab";

interface GenerateSlideContextProps {
  presentationOptions: GeneratedSlideFormProcess;
  setPresentationOptions: React.Dispatch<
    React.SetStateAction<GeneratedSlideFormProcess>
  >;
  handleGetPresentationOptions: (event: {
    target: { name: any; value: any };
  }) => void;
}

export const GeneratedSlideContext = createContext<
  GenerateSlideContextProps | undefined
>(undefined);

export const GeneratedSlideProcessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [presentationOptions, setPresentationOptions] =
    useState<GeneratedSlideFormProcess>({
      [EGeneratedSlideForm.CONTENT]: "",
      [EGeneratedSlideForm.TOPIC_FILE]: null,
      [EGeneratedSlideForm.TOPIC_FILE_ID]: "",
      [EGeneratedSlideForm.WRITING_TONE]: writingTones[0].value || "",
      [EGeneratedSlideForm.LANGUAGE]: "English",
      [EGeneratedSlideForm.NUMBER_OF_SLIDES]: 10,
      [EGeneratedSlideForm.TEMPLATE_STYLE]: templateStyles[0].value || "",
      [EGeneratedSlideForm.TEMPLATE_CODE]:
        templateSamples?.find(
          (sample) => sample.style === templateStyles[0].value
        )?.samples[0].code || "",
    });

  const handleGetPresentationOptions = (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    let options = { ...presentationOptions, [name]: value };
    setPresentationOptions(options);
    console.log(options);
  };

  return (
    <GeneratedSlideContext.Provider
      value={{
        presentationOptions,
        setPresentationOptions,
        handleGetPresentationOptions,
      }}
    >
      {children}
    </GeneratedSlideContext.Provider>
  );
};
