import { useState, Fragment, useEffect, useRef } from "react";
import { Presentation, render } from "react-pptx";
import Preview from "react-pptx/preview";
import { saveAs } from "file-saver";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import templates from "./ExportTemplates";
import { useSlideExport } from "../../hooks/useSlideExport";

interface SlidePresentationProps {
  templateCode: string;
  data: any;
  onSlidesUpdate?: (slides: JSX.Element[], currentSlide: number) => void;
}

function SlidePresentation({
  templateCode,
  data,
  onSlidesUpdate,
}: SlidePresentationProps) {
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewSlide, setViewSlide] = useState(false);
  const { exportPptx, setExportSlides } = useSlideExport();
  // Ref để lưu trạng thái trước đó và tránh gọi lại callback liên tục
  const prevCurrentSlide = useRef<number | null>(null);

  useEffect(() => {
    const selectedTemplate =
      templates[templateCode] || templates["minimalist-01"];
    const generatedSlides = selectedTemplate(data);
    setSlides(generatedSlides);
    setExportSlides(generatedSlides);

    // Sau khi render xong, mới gửi dữ liệu lên parent
    setTimeout(() => {
      if (onSlidesUpdate && generatedSlides.length > 0) {
        onSlidesUpdate(generatedSlides, currentSlide);
      }
    }, 0);
  }, [templateCode, JSON.stringify(data)]);

  // Cập nhật currentSlide chỉ khi thực sự thay đổi
  useEffect(() => {
    if (
      onSlidesUpdate &&
      slides.length > 0 &&
      currentSlide !== prevCurrentSlide.current
    ) {
      prevCurrentSlide.current = currentSlide; // Lưu giá trị trước đó
      setTimeout(() => {
        onSlidesUpdate(slides, currentSlide);
      }, 0);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleViewSlide = () => {
    setViewSlide(!viewSlide);
  };

  return (
    <>
      {viewSlide && (
        <Transition show={viewSlide} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => {}}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gray-500/50" />
              {currentSlide !== 0 && (
                <IoIosArrowDropleftCircle
                  className="z-50 hidden xl:block absolute left-4 top-1/2 -translate-y-1/2 text-6xl text-gray-200 hover:text-white cursor-pointer transition-all duration-300 active:scale-90"
                  onClick={prevSlide}
                />
              )}
              {currentSlide !== slides.length - 1 && (
                <IoIosArrowDroprightCircle
                  className="z-50 hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 text-6xl text-gray-200 hover:text-white cursor-pointer transition-all duration-300 active:scale-90"
                  onClick={nextSlide}
                />
              )}
              <IoCloseCircle
                className="absolute top-4 right-4 text-gray-200 rounded-full w-10 h-10 hover:text-white cursor-pointer active:scale-90"
                onClick={handleViewSlide}
              />
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-500"
                enterFrom="translate-y-4 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition ease-in duration-500"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-4 opacity-0"
              >
                <DialogPanel className="pointer-events-auto relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] lg:max-h-full overflow-auto hide-scrollbar">
                  <Preview>
                    <Presentation>{slides[currentSlide]}</Presentation>
                  </Preview>
                  {currentSlide !== 0 && (
                    <GrPrevious
                      className="z-50 xl:hidden absolute left-0 top-1/2 -translate-y-1/2 text-6xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90"
                      onClick={prevSlide}
                    />
                  )}
                  {currentSlide !== slides.length - 1 && (
                    <GrNext
                      className="z-50 xl:hidden absolute right-0 top-1/2 -translate-y-1/2 text-6xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90"
                      onClick={nextSlide}
                    />
                  )}
                </DialogPanel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className="w-full flex flex-col items-center justify-center ">
        {/* Slide chính */}
        <div className="relative flex w-full max-h-screen items-center justify-center gap-4 mb-7 group">
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <Preview>
              <Presentation>{slides[currentSlide]}</Presentation>
            </Preview>
          </div>
          {currentSlide !== 0 && (
            <GrPrevious
              className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
              onClick={prevSlide}
            />
          )}
          {currentSlide !== slides.length - 1 && (
            <GrNext
              className="absolute right-0 top-1/2 -translate-y-1/2 text-5xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
              onClick={nextSlide}
            />
          )}
          <div className="absolute top-3 left-3 rounded-md px-4 py-1 bg-black/40 text-lg opacity-0 group-hover:opacity-100">
            <p className="text-white font-medium">
              {currentSlide + 1}/{slides.length}
            </p>
          </div>
          <div
            className="absolute top-3 right-3 rounded-full p-2 bg-black/40 text-2xl cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
            onClick={handleViewSlide}
          >
            <MdOutlineZoomOutMap className="text-white hover:scale-95" />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-4 rounded-lg flex-nowrap">
            {slides.length > 0 ? (
              slides.map((slide, index) => (
                <div
                  key={index}
                  className={`relative w-20 md:w-28 lg:w-32 xl:w-40 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                    index === currentSlide
                      ? "border-gray-400"
                      : "border-transparent"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <Preview>
                    <Presentation>{slide}</Presentation>
                  </Preview>
                  <div
                    className={`absolute left-2 bottom-2 px-2 rounded-md text-white text-sm font-medium bg-black/50 backdrop-blur-md ${
                      index === currentSlide && "font-bold"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Generating thumbnails...</p>
            )}
          </div>
        </div>

        {/* Hidden Slide Render for Thumbnails */}
        <div className="hidden">
          {slides.map((slide, index) => (
            <div key={index}>
              <Preview>
                <Presentation>{slide}</Presentation>
              </Preview>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SlidePresentation;
