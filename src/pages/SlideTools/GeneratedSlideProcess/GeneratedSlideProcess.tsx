import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useHeader } from "../../../hooks/useHeader";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { GeneratedSlideProcessProvider } from "./context/GeneratedSlideContext";

const path = "/slide/generate-process";
const processStepsPaths = [
  `${path}/input`,
  `${path}/template`,
  `${path}/outline`,
  `${path}/download`,
];

function GenerateSlideProcess() {
  const { setHeaderClass } = useHeader();
  const location = useLocation();

  // Custom header CSS
  useEffect(() => {
    setHeaderClass("bg-header text-white border-none shadow-none");
    window.scrollTo(0, 0);
  }, [location]);

  // Navigation between steps
  const navigation = (orientation: string) => {
    const index = processStepsPaths.findIndex(
      (path) => path === location.pathname
    );
    if (orientation === "next") {
      if (index < processStepsPaths.length - 1) {
        return processStepsPaths[index + 1];
      }
    } else if (orientation === "back") {
      if (index > 0) {
        return processStepsPaths[index - 1];
      }
    }
    return processStepsPaths[index];
  };

  return (
    <GeneratedSlideProcessProvider>
      <div className="flex flex-col gap-2 items-center w-full h-auto min-h-screen bg-header px-20 pt-10 lg:px-40 xl:px-60 2xl:px-96">
        <Outlet />
        <div className="flex gap-2 items-center justify-end w-full mt-10 mb-20">
          {location.pathname !== processStepsPaths[0] && (
            <Link
              to={navigation("back")}
              className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-black shadow-sm hover:text-gray-700 ${
                location.pathname ===
                  processStepsPaths[processStepsPaths.length - 1] &&
                "text-white bg-black hover:bg-gray-800 hover:text-white"
              }`}
            >
              {location.pathname ===
                processStepsPaths[processStepsPaths.length - 1] && (
                <FaArrowLeftLong className="text-lg" />
              )}
              Go back
            </Link>
          )}
          {location.pathname !==
            processStepsPaths[processStepsPaths.length - 1] && (
            <Link
              to={navigation("next")}
              className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
            >
              Continue
              <FaArrowRightLong className="text-xl" />
            </Link>
          )}
          {location.pathname ===
            processStepsPaths[processStepsPaths.length - 1] && (
            <Link
              to={navigation("next")}
              className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
            >
              Download presentation
              <LuDownload className="text-xl" />
            </Link>
          )}
        </div>
      </div>
    </GeneratedSlideProcessProvider>
  );
}

export default GenerateSlideProcess;
