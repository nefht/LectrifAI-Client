import React, { createContext, useState } from "react";
import {
  EGeneratedSlideForm,
  GeneratedSlideFormProcess,
} from "../../constants/generated-slide-form";
import {
  templateSamples,
  templateStyles,
} from "../../constants/template-constants";

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
      [EGeneratedSlideForm.WRITING_TONE]: "",
      [EGeneratedSlideForm.LANGUAGE]: "",
      [EGeneratedSlideForm.NUMBER_OF_SLIDES]: 0,
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
