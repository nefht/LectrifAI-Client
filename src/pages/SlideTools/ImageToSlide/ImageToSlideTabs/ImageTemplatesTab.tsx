import TemplatesTab from "../../PresentationMaker/GeneratedSlideModal/TemplatesTab";
import { useImageToSlide } from "../hooks/useImageToSlide";

function ImageTemplatesTab() {
  const { presentationOptions, handleGetPresentationOptions } =
    useImageToSlide();
  return (
    <TemplatesTab
      presentationOptions={presentationOptions}
      handleGetPresentationOptions={handleGetPresentationOptions}
    />
  );
}

export default ImageTemplatesTab;
