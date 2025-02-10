import { useEffect, useState } from "react";
import { GeneratedSlideFormProcess } from "../../constants/generated-slide-form";
import InformationTab from "../../PresentationMaker/GeneratedSlideModal/InformationTab";
import TemplatesTab from "../../PresentationMaker/GeneratedSlideModal/TemplatesTab";
import { useGeneratedSlide } from "../hooks/useGeneratedSlide";
import helperService from "../../../../services/helperService";

function SelectStyle() {
  const { presentationOptions, handleGetPresentationOptions } =
    useGeneratedSlide();
  const [languages, setLanguages] = useState([
    { code: "eng", name: "English" },
  ]);

  // Lấy danh sách ngôn ngữ
  useEffect(() => {
    const fetLanguages = async () => {
      const response = await helperService.getAllLanguages();
      setLanguages(response);
    };
    fetLanguages();
  }, []);

  return (
    <>
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Select a style
      </h1>
      <p className="font-degular text-xl">
        Pick a theme that suits your presentation
      </p>
      <InformationTab
        presentationOptions={presentationOptions as GeneratedSlideFormProcess}
        handleGetPresentationOptions={handleGetPresentationOptions}
        languages={languages}
      />
      <TemplatesTab
        presentationOptions={presentationOptions as GeneratedSlideFormProcess}
        handleGetPresentationOptions={handleGetPresentationOptions}
      />
    </>
  );
}

export default SelectStyle;
