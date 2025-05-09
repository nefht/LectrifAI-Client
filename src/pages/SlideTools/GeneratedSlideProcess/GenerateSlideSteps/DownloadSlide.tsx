import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LuDownload } from "react-icons/lu";
import templateSlide from "../../../../assets/templates/template1.pptx";
import SlidePresentation from "../../../../shared/templates/SlidePresentation";
import { useSlideData } from "../../hooks/useSlideData";
import { useGeneratedSlide } from "../hooks/useGeneratedSlide";
import generatedSlideService from "../../service/generatedSlideService";
import { useSlideExport } from "../../../../hooks/useSlideExport";
import { FaArrowLeftLong } from "react-icons/fa6";

function DownloadSlide() {
  const { id } = useParams();
  const docs = [
    { uri: templateSlide }, // Local File
  ];
  const { slideData, setSlideData } = useSlideData();
  const { presentationOptions } = useGeneratedSlide();
  const { downloadPptxHelper } = useSlideExport();
  const [templateCode, setTemplateCode] = useState<string>("");

  const convertImageToBase64 = (
    imageUrl: string
  ): Promise<{ base64Image: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // CORS
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64Image = canvas.toDataURL("image/png");
          resolve({
            base64Image: base64Image,
            width: img.width,
            height: img.height,
          });
        } else {
          reject(new Error("Failed to create canvas context."));
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await generatedSlideService.getSlideContent(id);
          if (response?.slideData) {
            // Convert image URLs to base64
            const updatedSlideData = { ...response.slideData };
            // const imagePromises = updatedSlideData.slides.map(
            //   async (slide: any) => {
            //     const updatedSlide = { ...slide };
            //     if (updatedSlide.imageUrls) {
            //       const imagePromises = updatedSlide.imageUrls.map(
            //         async (image: { title: string; imageUrl: string }) => {
            //           const { base64Image, width, height } =
            //             await convertImageToBase64(image.imageUrl);
            //           return {
            //             title: image.title,
            //             imageUrl: base64Image,
            //             width: width,
            //             height: height,
            //           };
            //         }
            //       );
            //       updatedSlide.imageUrls = await Promise.all(imagePromises);
            //     }
            //     return updatedSlide;
            //   }
            // );

            // // setSlideData(response?.slideData);
            // const updatedSlides = await Promise.all(imagePromises);
            // updatedSlideData.slides = updatedSlides;
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

  return (
    <>
      {/* <DocViewer documents={docs} /> */}
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Download your presentation
      </h1>
      <p className="font-degular text-xl mb-4 text-center flex items-center justify-center">
        Preview your presentation and download it as a PPTX file. The downloaded
        presentation might be a bit different due to the display mode of web
        browser.
      </p>
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
