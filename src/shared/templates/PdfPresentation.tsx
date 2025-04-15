import { useEffect, useState, Fragment, useRef } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

import { GrNext, GrPrevious } from "react-icons/gr";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfPresentationProps {
  onPageChange: (pageIndex: number) => void;
  pdfUrl: string;
}

function PdfPresentation({ onPageChange, pdfUrl }: PdfPresentationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [viewPage, setViewPage] = useState(false);
  const [scale, setScale] = useState(1.5); // Mặc định cho mobile

  useEffect(() => {
    onPageChange(pageNumber - 1);
  }, [pageNumber, onPageChange]);

  // Cập nhật container width bằng ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Cập nhật scale theo kích thước màn hình
  useEffect(() => {
    const updateScale = () => {
      if (containerWidth >= 1280) {
        setScale(3); // xl
      } else if (containerWidth >= 1024) {
        setScale(2.5); // lg
      } else if (containerWidth >= 768) {
        setScale(2); // md
      } else {
        setScale(1.5); // mặc định mobile
      }
    };

    updateScale();
  }, [containerWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("Total Pages:", numPages);
    setNumPages(numPages);
  }

  return (
    <>
      {/* Chế độ xem toàn màn hình */}
      {viewPage && (
        <Transition show={viewPage} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => {}}>
            <div className="fixed inset-0 flex items-center justify-center bg-black/80">
              <IoCloseCircle
                className="absolute top-4 right-4 text-white/50 text-4xl cursor-pointer hover:scale-110 transition"
                onClick={() => setViewPage(false)}
              />
              {pageNumber > 1 && (
                <IoIosArrowDropleftCircle
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-6xl text-white/40 hover:text-white cursor-pointer transition active:scale-90"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                />
              )}
              {numPages !== null && pageNumber < numPages && (
                <IoIosArrowDroprightCircle
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl text-white/40 hover:text-white cursor-pointer transition active:scale-90"
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, numPages))
                  }
                />
              )}
              <DialogPanel className="w-screen h-screen flex items-center justify-center">
                <Document file={pdfUrl}>
                  {numPages !== null && (
                    <Page
                      className="rounded-lg overflow-hidden"
                      // width={window.innerWidth * 0.8}
                      height={window.innerHeight * 0.95}
                      pageNumber={Math.min(pageNumber, numPages)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  )}
                </Document>
              </DialogPanel>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Chế độ xem bình thường - bỏ max-h-screen cho page pdf */}
      <div
        ref={containerRef}
        className="w-full flex flex-col items-center overflow-hidden"
      >
        <div className="w-full relative flex items-center justify-center gap-4 mb-7 group border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {/* {pdfFile ? ( */}
          <Document
            className="w-full"
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {numPages !== null && (
              <Page
                width={containerWidth}
                pageNumber={Math.min(pageNumber, numPages)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            )}
          </Document>
          {/* ) : (
              <p>Loading PDF...</p>
            )} */}
          {pageNumber > 1 && (
            <GrPrevious
              className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            />
          )}
          {numPages !== null && pageNumber < numPages && (
            <GrNext
              className="absolute right-0 top-1/2 -translate-y-1/2 text-5xl text-black/20 hover:text-black/40 cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
            />
          )}
          <div className="absolute top-3 left-3 bg-black/40 px-4 py-1 rounded-md text-lg text-white font-medium">
            {pageNumber} / {numPages ?? "..."}
          </div>
          <div
            className="absolute top-3 right-3 p-2 bg-black/40 text-2xl cursor-pointer transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100 rounded-full"
            onClick={() => setViewPage(true)}
          >
            <MdOutlineZoomOutMap className="text-white hover:scale-95" />
          </div>
        </div>

        {/* Thumbnails */}
        {numPages && (
          <div className="w-full overflow-x-auto pb-2 custom-scrollbar mt-5">
            <div className="flex gap-4 rounded-lg flex-nowrap">
              {[...Array(numPages)].map((_, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 cursor-pointer border-2 rounded-md overflow-hidden ${
                    index + 1 === pageNumber
                      ? "border-gray-400"
                      : "border-transparent"
                  }`}
                  onClick={() => setPageNumber(index + 1)}
                >
                  <Document file={pdfUrl}>
                    <Page
                      scale={scale}
                      pageNumber={index + 1}
                      width={80}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                  <div className="absolute left-2 bottom-2 px-2 bg-black/50 text-white text-sm font-medium rounded-md">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PdfPresentation;
