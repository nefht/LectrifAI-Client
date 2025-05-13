import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LuDownload } from "react-icons/lu";
import SlidePresentation from "../../../../shared/templates/SlidePresentation";
import { useSlideData } from "../../hooks/useSlideData";
import { useGeneratedSlide } from "../hooks/useGeneratedSlide";
import generatedSlideService from "../../service/generatedSlideService";
import { useSlideExport } from "../../../../hooks/useSlideExport";
import { FaArrowLeftLong } from "react-icons/fa6";
import { templateSamples } from "../../constants/template-constants";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";

function DownloadSlide() {
  const { id } = useParams();
  const { slideData, setSlideData } = useSlideData();
  const { presentationOptions } = useGeneratedSlide();
  const { downloadPptxHelper } = useSlideExport();
  const [templateCode, setTemplateCode] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await generatedSlideService.getSlideContent(id);
          if (response?.slideData) {
            const updatedSlideData = { ...response.slideData };
            setSlideData(updatedSlideData);
            console.log("Updated Slide Data:", updatedSlideData);
          }
          setTemplateCode(response?.templateCode);
        }
      } catch (error) {
        console.error("Failed to get slide content:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateCode = e.target.value;
    setTemplateCode(newTemplateCode);
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <>
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Download your presentation
      </h1>
      <p className="font-degular text-xl mb-4 text-center flex items-center justify-center">
        Preview your presentation and download it as a PPTX file. The downloaded
        presentation might be a bit different due to the display mode of web
        browser.
      </p>

      {/* Dropdown để chọn template */}
      <div className="mb-8">
        <label htmlFor="template-select" className="font-semibold text-lg">
          Select Template
        </label>
        <select
          id="template-select"
          value={templateCode}
          onChange={handleTemplateChange}
          className="ml-4 p-2 rounded-md border-2 border-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 cursor-pointer text-gray-700"
        >
          {templateSamples.map((template) =>
            template.samples.map((sample) => (
              <option key={sample.code} value={sample.code}>
                {capitalizeFirstLetter(sample.code)}
              </option>
            ))
          )}
        </select>
      </div>

      <SlidePresentation templateCode={templateCode} data={slideData} />
      <div className="w-full mt-16 flex gap-2">
        <Link
          to={`/slide/generate-process/outline/${id}`}
          className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold
            text-white text-center bg-black hover:bg-gray-800 hover:text-white`}
        >
          <FaArrowLeftLong className="text-lg" />
          Go back
        </Link>
        <button
          className=" ml-auto flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
          onClick={() => {
            downloadPptxHelper(templateCode, slideData, slideData.title);
          }}
        >
          Download presentation
          <LuDownload className="text-xl" />
        </button>
      </div>
    </>
  );
}

export default DownloadSlide;
