import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { useHeader } from "../../../hooks/useHeader";
import { useTheme } from "../../../hooks/useTheme";

const path = "/lecture/generate-video-process";
const processStepsPaths = [
  `${path}/input`,
  `${path}/review`,
  `${path}/download`,
];

function LectureVideoGeneratedProcess() {
  const location = useLocation();
  const { toggleTheme } = useTheme();
  const { setHeaderClass } = useHeader();
  useEffect(() => {
    setHeaderClass("bg-transparent border-none shadow-none");
    toggleTheme("dark");
    return () => {
      toggleTheme("light");
    };
  });
  
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
    <>
      <Outlet />
      <div className="flex gap-2 items-center justify-end w-full pt-8 pb-20 pr-10 md:pr-20 xl:pr-60 dark:bg-indigo-950">
        {location.pathname !== processStepsPaths[0] && (
          <Link
            to={navigation("back")}
            className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 ${
              location.pathname ===
                processStepsPaths[processStepsPaths.length - 1] &&
              "text-white text-center bg-black hover:bg-gray-800 hover:text-white"
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
            className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 dark:bg-indigo-600 shadow-sm hover:bg-purple-500 dark:hover:bg-indigo-500"
          >
            Continue
            <FaArrowRightLong className="text-xl" />
          </Link>
        )}
        {location.pathname ===
          processStepsPaths[processStepsPaths.length - 1] && (
          <button className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 dark:bg-indigo-600 shadow-sm hover:bg-purple-500 dark:hover:bg-indigo-500">
            Download lecture video
            <LuDownload className="text-xl" />
          </button>
        )}
      </div>
    </>
  );
}

export default LectureVideoGeneratedProcess;
