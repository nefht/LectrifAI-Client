import { useEffect } from "react";
import { useParams } from "react-router";
import templateSlide from "../../../../assets/templates/template1.pptx";
import SlidePresentation from "../../../../shared/templates/SlidePresentation";
import { useSlideData } from "../../hooks/useSlideData";
import { useGeneratedSlide } from "../hooks/useGeneratedSlide";
import { EGeneratedSlideForm } from "../../constants/generated-slide-form";
import generatedSlideService from "../../service/generatedSlideService";

function DownloadSlide() {
  const { id } = useParams();
  const docs = [
    { uri: templateSlide }, // Local File
  ];
  const { slideData, setSlideData } = useSlideData();
  const { presentationOptions } = useGeneratedSlide();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await generatedSlideService.getSlideContent(id);
          if (response?.slideData) {
            console.log(response?.slideData);

            setSlideData(response?.slideData);
          }
          console.log(slideData);
        }
      } catch (error) {
        console.error("Failed to get slide content:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      {/* <DocViewer documents={docs} /> */}
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Download your presentation
      </h1>
      <p className="font-degular text-xl mb-4">
        Preview your presentation and download it as a PPTX or PDF file
      </p>
      <SlidePresentation
        templateCode={presentationOptions[EGeneratedSlideForm.TEMPLATE_CODE]}
        data={slideData}
      />
      {/* <button
        className="border bg-green-600 w-[100px] text-white"
        onClick={downloadSlide}
      >
        TEST PPTX
      </button> */}
      {/* <img className="mt-8 rounded-lg" src={example} alt="" /> */}
      {/* <iframe
        src="https://docs.google.com/presentation/d/1VJpqD1qkAJT0E2vcDRYDzMzDlybyFYQY/preview#slide=id.p1"
        width="100%"
        height="600px"
        frameBorder="0"
        title="Google Slides Viewer"
      ></iframe> */}
    </>
  );
}

export default DownloadSlide;
