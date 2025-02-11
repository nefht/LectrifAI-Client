import { createContext, useState } from "react";
import {
  EGeneratedSlideForm,
  GeneratedSlideFromImage,
} from "../../constants/generated-slide-form";
import {
  templateSamples,
  templateStyles,
} from "../../constants/template-constants";

interface ImageToSlideContextProps {
  presentationOptions: GeneratedSlideFromImage;
  setPresentationOptions: React.Dispatch<
    React.SetStateAction<GeneratedSlideFromImage>
  >;
  handleGetPresentationOptions: (event: {
    target: { name: any; value: any };
  }) => void;
}

export const ImageToSlideContext = createContext<
  ImageToSlideContextProps | undefined
>(undefined);

export const ImageToSlideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [presentationOptions, setPresentationOptions] =
    useState<GeneratedSlideFromImage>({
      [EGeneratedSlideForm.CONTENT]: "",
      [EGeneratedSlideForm.SLIDE_LAYOUT]: "0",
      [EGeneratedSlideForm.LANGUAGE]: "",
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
    <ImageToSlideContext.Provider
      value={{
        presentationOptions,
        setPresentationOptions,
        handleGetPresentationOptions,
      }}
    >
      {children}
    </ImageToSlideContext.Provider>
  );
};
