import { useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { useHeader } from "../../../hooks/useHeader";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { GeneratedSlideProcessProvider } from "./context/GeneratedSlideContext";
import { useSlideExport } from "../../../hooks/useSlideExport";

function GenerateSlideProcess() {
  const path = "/slide/generate-process";
  const { id } = useParams();
  const location = useLocation();
  const mode = location.state;
  const processStepsPaths =
    mode == "modal"
      ? [
          { pathName: `${path}/outline/${id}`, stepName: "Review outline" },
          { pathName: `${path}/download/${id}`, stepName: "Download slide" },
        ]
      : [
          { pathName: `${path}/input`, stepName: "Input data" },
          { pathName: `${path}/template`, stepName: "Select template" },
          { pathName: `${path}/outline/${id}`, stepName: "Review outline" },
          { pathName: `${path}/download/${id}`, stepName: "Download slide" },
        ];
  const reviewOutlinePath = `${path}/outline/${id}`;
  const { setHeaderClass } = useHeader();
  const { exportPptx } = useSlideExport();

  // Custom header CSS
  useEffect(() => {
    setHeaderClass("bg-header text-white border-none shadow-none");
    window.scrollTo(0, 0);
  }, [location]);

  // Navigation between steps
  const navigation = (orientation: string) => {
    const index = processStepsPaths.findIndex(
      (path) => path.pathName === location.pathname
    );
    if (orientation === "next") {
      if (index < processStepsPaths.length - 1) {
        return processStepsPaths[index + 1].pathName;
      }
    } else if (orientation === "back") {
      if (index > 0) {
        return processStepsPaths[index - 1].pathName;
      }
    }
    return processStepsPaths[index].pathName;
  };

  return (
    <GeneratedSlideProcessProvider>
      {/* Step navigation */}
      <div className="flex justify-center items-center md:space-x-4 pt-2 md:pt-10 bg-header overflow-x-hidden">
        {processStepsPaths.map((step, index) => (
          <div
            key={index}
            className={`flex items-center text-[14px] lg:text-sm font-semibold ${
              location.pathname === step.pathName
                ? "text-purple-700/80"
                : "text-gray-400"
            }`}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                location.pathname === step.pathName
                  ? "bg-purple-700/80 text-white"
                  : "border border-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span className="hidden md:block ml-2">{step.stepName}</span>
            {index < processStepsPaths.length - 1 && (
              <div className="lg:w-24 border-t ml-4 border-gray-400/70" />
            )}
          </div>
        ))}
      </div>

      <div
        className={`flex flex-col gap-2 items-center w-full h-auto min-h-screen bg-header px-8 pt-8 md:pt-10 ${
          location.pathname === reviewOutlinePath
            ? "sm:px-20"
            : "sm:px-20 lg:px-40 xl:px-60 2xl:px-96"
        }`}
      >
        <Outlet />
        <div className="flex gap-2 items-center justify-end w-full mt-10 mb-20">
          {location.pathname !== processStepsPaths[0].pathName && (
            <Link
              to={navigation("back")}
              className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-black hover:text-gray-700 ${
                location.pathname ===
                  processStepsPaths[processStepsPaths.length - 1].pathName &&
                "text-white text-center bg-black hover:bg-gray-800 hover:text-white"
              }`}
            >
              {location.pathname ===
                processStepsPaths[processStepsPaths.length - 1].pathName && (
                <FaArrowLeftLong className="text-lg" />
              )}
              Go back
            </Link>
          )}
          {location.pathname !==
            processStepsPaths[processStepsPaths.length - 1].pathName && (
            <Link
              to={navigation("next")}
              className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
            >
              Continue
              <FaArrowRightLong className="text-xl" />
            </Link>
          )}
          {location.pathname ===
            processStepsPaths[processStepsPaths.length - 1].pathName && (
            <button
              className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
              onClick={exportPptx}
            >
              Download presentation
              <LuDownload className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </GeneratedSlideProcessProvider>
  );
}

export default GenerateSlideProcess;
