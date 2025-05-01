import { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useHeader } from "../../../hooks/useHeader";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useSlideExport } from "../../../hooks/useSlideExport";
import { useToast } from "../../../hooks/useToast";
import generatedSlideService from "../service/generatedSlideService";
import { useGeneratedSlide } from "./hooks/useGeneratedSlide";
import { EGeneratedSlideForm } from "../constants/generated-slide-form";
import CustomSpinner from "../../../components/LoadingSpinner/CustomSpinner";
import { useSlideData } from "../hooks/useSlideData";

function GenerateSlideProcess() {
  const path = "/slide/generate-process";
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const { showToast } = useToast();
  const { presentationOptions, handleGetPresentationOptions } =
    useGeneratedSlide();
  const { slideData } = useSlideData();

  const getProcessPaths = () => {
    switch (state?.mode) {
      case "modal":
        return [
          {
            pathName: `${path}/outline/${id}`,
            stepName: "Review outline",
            handleFunction: async () => {
              try {
                if (!id) return;
                const response = await generatedSlideService.updateSlideContent(
                  id,
                  slideData
                );
                navigate(`${path}/download/${id}`, {
                  state: {
                    message: "Slide content updated successfully.",
                    mode: "modal",
                  },
                });
              } catch (error) {
                showToast("error", "Failed to update slide content.");
              }
            },
          },
          { pathName: `${path}/download/${id}`, stepName: "Download slide" },
        ];
        break;
      case "storage":
        return [
          {
            pathName: `${path}/download/${id}`,
            stepName: "Download your presentation",
          },
        ];
        break;
      default:
        return [
          {
            pathName: `${path}/input`,
            stepName: "Input data",
            handleFunction: async () => {
              if (presentationOptions[EGeneratedSlideForm.TOPIC_FILE]) {
                try {
                  const response = await generatedSlideService.uploadTopicFile(
                    presentationOptions[EGeneratedSlideForm.TOPIC_FILE]
                  );
                  handleGetPresentationOptions({
                    target: {
                      name: EGeneratedSlideForm.TOPIC_FILE_ID,
                      value: response.uploadedFile._id,
                    },
                  });
                  navigate(`${path}/template`, {
                    state: {
                      message: "File uploaded successfully.",
                    },
                  });
                } catch (error) {
                  showToast("error", "Failed to upload file.");
                }
              } else if (presentationOptions[EGeneratedSlideForm.CONTENT]) {
                navigate(`${path}/template`);
              } else {
                showToast("error", "Please upload a file or enter a topic.");
                return;
              }
            },
          },
          {
            pathName: `${path}/template`,
            stepName: "Select template",
            handleFunction: async () => {
              try {
                if (presentationOptions[EGeneratedSlideForm.TOPIC_FILE_ID]) {
                  const response =
                    await generatedSlideService.generateSlideContentFromFile({
                      [EGeneratedSlideForm.TOPIC_FILE_ID]:
                        presentationOptions[EGeneratedSlideForm.TOPIC_FILE_ID],
                      [EGeneratedSlideForm.WRITING_TONE]:
                        presentationOptions[EGeneratedSlideForm.WRITING_TONE],
                      [EGeneratedSlideForm.LANGUAGE]:
                        presentationOptions[EGeneratedSlideForm.LANGUAGE],
                      [EGeneratedSlideForm.NUMBER_OF_SLIDES]:
                        presentationOptions[
                          EGeneratedSlideForm.NUMBER_OF_SLIDES
                        ],
                      [EGeneratedSlideForm.TEMPLATE_CODE]:
                        presentationOptions[EGeneratedSlideForm.TEMPLATE_CODE],
                    });
                  navigate(`${path}/outline/${response._id}`, {
                    state: {
                      message: "Slide content generated successfully.",
                    },
                  });
                } 
                 if (presentationOptions[EGeneratedSlideForm.CONTENT]) {
                  const response =
                    await generatedSlideService.generateSlideContentFromDocumentText({
                      [EGeneratedSlideForm.CONTENT]:
                        presentationOptions[EGeneratedSlideForm.CONTENT],
                      [EGeneratedSlideForm.WRITING_TONE]:
                        presentationOptions[EGeneratedSlideForm.WRITING_TONE],
                      [EGeneratedSlideForm.LANGUAGE]:
                        presentationOptions[EGeneratedSlideForm.LANGUAGE],
                      [EGeneratedSlideForm.NUMBER_OF_SLIDES]:
                        presentationOptions[
                          EGeneratedSlideForm.NUMBER_OF_SLIDES
                        ],
                      [EGeneratedSlideForm.TEMPLATE_CODE]:
                        presentationOptions[EGeneratedSlideForm.TEMPLATE_CODE],
                    });
                  navigate(`${path}/outline/${response._id}`, {
                    state: {
                      message: "Slide content generated successfully.",
                    },
                  });
                }
              } catch (error) {
                showToast("error", "Failed to generate slide content.");
              }
            },
          },
          {
            pathName: `${path}/outline/${id}`,
            stepName: "Review outline",
            handleFunction: async () => {
              try {
                if (!id) return;
                const response = await generatedSlideService.updateSlideContent(
                  id,
                  slideData
                );
                navigate(`${path}/download/${id}`);
              } catch (error) {
                showToast("error", "Failed to update slide content.");
              }
            },
          },
          { pathName: `${path}/download/${id}`, stepName: "Download slide" },
        ];
        break;
    }
  };
  const processStepsPaths = getProcessPaths();
  const selectTemplatePath = `${path}/template`;
  const reviewOutlinePath = `${path}/outline/${id}`;
  const { setHeaderClass } = useHeader();
  const { exportPptx } = useSlideExport();

  // Custom header CSS
  useEffect(() => {
    setHeaderClass("bg-header text-white border-none shadow-none");
    window.scrollTo(0, 0);
  }, [location]);

  // Success message
  useEffect(() => {
    if (state?.message) {
      showToast("success", state.message);
    }
  }, [location.pathname]);

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
        (path) => path.pathName === location.pathname
      );
      if (currentStep?.handleFunction) {
        await currentStep.handleFunction();
      } else {
        navigate(navigation("next"));
      }
    },
  });

  return (
    <>
      <CustomSpinner
        isLoading={
          handleContinue.isPending && location.pathname === selectTemplatePath
        }
        message="Generating slide content..."
      />
      {/* Step navigation */}
      {processStepsPaths?.length > 1 && (
        <div className="flex justify-center items-center md:space-x-4 pt-2 md:pt-10 bg-header overflow-x-hidden">
          {processStepsPaths?.map((step, index) => (
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
              {index < processStepsPaths?.length - 1 && (
                <div className="lg:w-20 xl:w-24 border-t ml-4 border-gray-400/70" />
              )}
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => handleContinue.mutate(e)}
        className={`flex flex-col gap-2 items-center w-full h-auto min-h-screen bg-header px-8 pt-8 md:pt-10 ${
          location.pathname === reviewOutlinePath
            ? "sm:px-20"
            : "sm:px-20 lg:px-40 xl:px-60 2xl:px-96"
        }`}
      >
        <Outlet />
        <div className="flex gap-2 items-center justify-end w-full mt-10 mb-20">
          {/* {location.pathname !== processStepsPaths[0].pathName && ( */}
          {location.pathname === processStepsPaths[1]?.pathName && (
            <Link
              to={navigation("back")}
              className={`flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-black hover:text-gray-700 ${
                location.pathname ===
                  processStepsPaths[processStepsPaths?.length - 1].pathName &&
                "text-white text-center bg-black hover:bg-gray-800 hover:text-white"
              }`}
            >
              {location.pathname ===
                processStepsPaths[processStepsPaths?.length - 1].pathName && (
                <FaArrowLeftLong className="text-lg" />
              )}
              Go back
            </Link>
          )}
          {location.pathname !==
            processStepsPaths[processStepsPaths?.length - 1].pathName && (
            <button
              disabled={handleContinue.isPending}
              type="submit"
              className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
            >
              Continue
              <FaArrowRightLong className="text-xl" />
            </button>
          )}
          {/* {location.pathname ===
              processStepsPaths[processStepsPaths.length - 1].pathName && (
              <button
                className="flex gap-2 items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-purple-600 shadow-sm hover:bg-purple-500"
                onClick={exportPptx}
              >
                Download presentation
                <LuDownload className="text-xl" />
              </button>
            )} */}
        </div>
      </form>
    </>
  );
}

export default GenerateSlideProcess;
