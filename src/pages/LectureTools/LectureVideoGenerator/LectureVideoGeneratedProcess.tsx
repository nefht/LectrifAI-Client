import { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { useMutation } from "@tanstack/react-query";
import { MdMenuBook } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useHeader } from "../../../hooks/useHeader";
import { useTheme } from "../../../hooks/useTheme";
import lectureVideoService from "../services/lectureVideoService";
import { useToast } from "../../../hooks/useToast";
import { useLectureVideo } from "./hooks/useLectureVideo";
import { EGeneratedLectureForm } from "./constants/generate-lecture-form";
import CustomSpinner from "../../../components/LoadingSpinner/CustomSpinner";

const path = "/lecture/generate-video-process";

function LectureVideoGeneratedProcess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleTheme } = useTheme();
  const { setHeaderClass } = useHeader();
  const { showToast } = useToast();
  const { lectureOptions, lectureVideoSettings } = useLectureVideo();

  const processStepsPaths = [
    {
      pathName: `${path}/input`,
      handleFunction: async () => {
        try {
          const scriptSettings = {
            [EGeneratedLectureForm.FILE_ID]:
              lectureOptions[EGeneratedLectureForm.FILE_ID],
            [EGeneratedLectureForm.ACADEMIC_LEVEL]:
              lectureOptions[EGeneratedLectureForm.ACADEMIC_LEVEL],
            [EGeneratedLectureForm.LANGUAGE]:
              lectureOptions[EGeneratedLectureForm.LANGUAGE],
            [EGeneratedLectureForm.VOICE_TYPE]:
              lectureOptions[EGeneratedLectureForm.VOICE_TYPE],
            // [EGeneratedLectureForm.BACKGROUND_MUSIC]:
            //   lectureOptions[EGeneratedLectureForm.BACKGROUND_MUSIC],
            [EGeneratedLectureForm.VOICE_STYLE]:
              lectureOptions[EGeneratedLectureForm.VOICE_STYLE],
            [EGeneratedLectureForm.LECTURE_SPEED]:
              lectureOptions[EGeneratedLectureForm.LECTURE_SPEED],
            [EGeneratedLectureForm.LECTURE_LENGTH]:
              lectureOptions[EGeneratedLectureForm.LECTURE_LENGTH],
            [EGeneratedLectureForm.INTERACTIVE_QUIZ]:
              lectureOptions[EGeneratedLectureForm.INTERACTIVE_QUIZ],
            [EGeneratedLectureForm.SPECIFIC_REQUIREMENTS]:
              lectureOptions[EGeneratedLectureForm.SPECIFIC_REQUIREMENTS],
          };
          const response = await lectureVideoService.createLectureScript(
            scriptSettings
          );
          console.log(response);
          navigate(`${path}/review/${response._id}`, {
            state: { message: "Lecture script created successfully" },
          });
        } catch (error: any) {
          console.error(error);
          showToast("warning", error.message);
        }
      },
    },
    {
      pathName: `${path}/review/${id}`,
      handleFunction: async () => {
        try {
          const lectureScriptId = id;
          if (lectureScriptId) {
            const videoSettings = {
              [EGeneratedLectureForm.FILE_ID]:
                lectureVideoSettings[EGeneratedLectureForm.FILE_ID],
              [EGeneratedLectureForm.LECTURE_SCRIPT_ID]: lectureScriptId,
              [EGeneratedLectureForm.LANGUAGE_CODE]:
                lectureVideoSettings[EGeneratedLectureForm.LANGUAGE_CODE],
              [EGeneratedLectureForm.VOICE_TYPE]:
                lectureVideoSettings[EGeneratedLectureForm.VOICE_TYPE],
              [EGeneratedLectureForm.LECTURE_SPEED]:
                lectureVideoSettings[EGeneratedLectureForm.LECTURE_SPEED],
            };
            const response = await lectureVideoService.createLectureVideo(
              videoSettings
            );
            console.log(response);
            navigate(`${path}/download/${response._id}`, {
              state: { message: "Lecture video created successfully!" },
            });
          }
        } catch (error: any) {
          console.error(error);
          showToast("error", "Error creating lecture video.");
        }
      },
    },
    {
      pathName: `${path}/download/${id}`,
      handleFunction: () => {},
    },
  ];

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

  const handleContinue = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const currentStep = processStepsPaths.find(
        (step) => step.pathName === location.pathname
      );
      if (currentStep && currentStep.handleFunction) {
        await currentStep.handleFunction();
      }
    },
    onError: (error) => {
      showToast("error", "Error processing the request.");
      console.error("Error:", error);
    }
  });

  return (
    <>
      <Outlet />
      <CustomSpinner isLoading={handleContinue.isPending} />
      <form
        onSubmit={(e) => handleContinue.mutate(e)}
        className="flex gap-2 items-center justify-end w-full pt-8 pb-20 pr-10 md:pr-20 xl:pr-60 dark:bg-indigo-950"
      >
        {location.pathname !== processStepsPaths[0].pathName && (
          <Link
            to={navigation("back")}
            className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 ${
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
          <button
            // to={navigation("next")}
            type="submit"
            disabled={handleContinue.isPending}
            className="z-10 flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 dark:bg-indigo-600 shadow-sm hover:bg-purple-500 dark:hover:bg-indigo-500"
          >
            Continue
            <FaArrowRightLong className="text-xl" />
          </button>
        )}
        {location.pathname ===
          processStepsPaths[processStepsPaths.length - 1].pathName && (
          <button
            className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 dark:bg-indigo-600 shadow-sm hover:bg-purple-500 dark:hover:bg-indigo-500"
            onClick={() => navigate(`/lecture/detail/${id}`)}
          >
            Start learning
            <MdMenuBook className="text-xl" />
          </button>
        )}
      </form>
    </>
  );
}

export default LectureVideoGeneratedProcess;
