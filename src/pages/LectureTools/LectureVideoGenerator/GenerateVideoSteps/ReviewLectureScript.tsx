import { useEffect, useState } from "react";
import PdfPresentation from "../../../../shared/templates/PdfPresentation";
import { useLocation, useParams } from "react-router";
import lectureVideoService from "../../services/lectureVideoService";
import QuizQuestion from "../components/QuizQuestions";
import { useLectureVideo } from "../hooks/useLectureVideo";
import { EGeneratedLectureForm } from "../constants/generate-lecture-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../hooks/useToast";
import { FaSpinner } from "react-icons/fa";

function ReviewLectureScript() {
  const { id } = useParams();
  const { showToast } = useToast();
  const location = useLocation();
  const state = location.state;
  const { lectureVideoSettings, setLectureVideoSettings } = useLectureVideo();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lectureScript, setLectureScript] = useState<
    {
      script: string;
      quiz: {
        question: string;
        options: string[];
        answer: string;
      } | null;
    }[]
  >([]);
  const [lectureName, setLectureName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (state?.message) {
      showToast("success", state.message);
    }
  }, []);

  // Get lecture script
  useEffect(() => {
    const fetchLectureScript = async () => {
      try {
        if (id) {
          const response = await lectureVideoService.getLectureScript(id);
          const fileId = response.fileId;
          const slide = await lectureVideoService.getUploadedSlide(fileId);
          const videoSettings = {
            [EGeneratedLectureForm.FILE_ID]: fileId,
            [EGeneratedLectureForm.LECTURE_SCRIPT_ID]: id,
            [EGeneratedLectureForm.LANGUAGE_CODE]: response.language,
            [EGeneratedLectureForm.VOICE_TYPE]: response.voiceType,
            [EGeneratedLectureForm.LECTURE_SPEED]: response.lectureSpeed,
          };
          console.log(response);

          console.log(videoSettings);

          setLectureVideoSettings(videoSettings);
          setPdfUrl(slide.fileUrl);
          setLectureScript(response.lectureScript.slides);
          setLectureName(response.lectureScript.lectureName);
        } else {
          console.error("Lecture ID is undefined");
        }
      } catch (error: any) {
        console.error("Failed to get lecture script:", error);
      }
    };

    fetchLectureScript();
  }, [id]);

  // // Hàm callback để nhận slides và currentSlide từ SlidePresentation
  // const handleSlidesUpdate = (
  //   newSlides: JSX.Element[],
  //   newCurrentSlide: number
  // ) => {
  //   setSlides(newSlides);
  //   setCurrentSlide(newCurrentSlide);
  // };

  const handlePageChange = (pageIndex: number) => {
    setCurrentSlide(pageIndex);
  };

  const handleQuizChange = (updatedQuiz: {
    question: string;
    options: string[];
    answer: string;
  }) => {
    const newLectureScript = [...lectureScript];
    newLectureScript[currentSlide].quiz = updatedQuiz;
    setLectureScript(newLectureScript);
  };

  const handleAddQuiz = () => {
    const newLectureScript = [...lectureScript];
    newLectureScript[currentSlide].quiz = {
      question: "",
      options: ["", "", "", ""],
      answer: "",
    };
    setLectureScript(newLectureScript);
  };

  const handleDeleteQuiz = () => {
    const newLectureScript = [...lectureScript];
    newLectureScript[currentSlide].quiz = null;
    setLectureScript(newLectureScript);
  };

  const handleUpdateLectureScript = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (id) {
          const updatedLectureScript = {
            lectureName: lectureName,
            slides: [...lectureScript],
          };
          const response = await lectureVideoService.updateLectureScript(id, {
            lectureScript: updatedLectureScript,
          });
        } else {
          console.error("Lecture ID is undefined");
        }
      } catch (error: any) {
        console.error("Failed to update lecture script:", error);
      }
    },
    onSuccess: () => {
      showToast("success", "Lecture script updated successfully!");
    },
  });

  return (
    <div className="w-full h-full dark:bg-dark dark:bg-gradient-to-b from-dark to-indigo-950">
      <div className="flex flex-col text-center items-center justify-center px-8 md:px-24 xl:px-40 pt-12 md:pt-20">
        <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl dark:text-white">
          Review lecture script
        </h1>
        <p className="font-degular text-xl dark:text-gray-400 mt-4">
          Take a look at your lecture scripts before turning it into a video.
        </p>
      </div>
      <div className="w-full h-auto flex flex-col lg:flex-row gap-x-4 px-8 py-10 lg:px-20 lg:py-20">
        <div className="w-full lg:w-2/3 min-h-32">
          {/* <SlidePresentation
            templateCode="minimalist-02"
            data={{} as any}
            onSlidesUpdate={handleSlidesUpdate}
          ></SlidePresentation> */}
          <PdfPresentation onPageChange={handlePageChange} pdfUrl={pdfUrl} />
        </div>
        <form
          className="lg:w-1/3 flex flex-col w-full mt-8 lg:mt-0 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          onSubmit={(e) => handleUpdateLectureScript.mutate(e)}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap items-center divide-gray-200 divide-x rtl:divide-x-reverse dark:divide-gray-600">
              <div className="flex items-center space-x-1 rtl:space-x-reverse pe-4">
                <p className="text-gray-800 dark:text-white font-semibold">
                  Lecture Script
                </p>
              </div>
              <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse ps-4">
                <p className="text-gray-600 dark:text-gray-300 font-semibold">
                  Slide {currentSlide + 1}
                </p>
              </div>
            </div>
            <button
              disabled={handleUpdateLectureScript.isPending}
              type="submit"
              className="inline-flex items-center py-1.5 px-3 text-sm font-medium text-center text-white bg-purple-700 dark:bg-indigo-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-indigo-900 hover:bg-purple-800 dark:hover:bg-indigo-800"
              // onClick={() => handleUpdateLectureScript.mutate()}
            >
              {handleUpdateLectureScript.isPending ? (
                <FaSpinner className="text-xl text-gray-200 animate-spin" />
              ) : (
                "Save"
              )}
            </button>
            <div
              id="tooltip-fullscreen"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Show full screen
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div className="flex flex-grow pl-4 pr-2 py-2 bg-white rounded-b-lg dark:bg-gray-800">
            <textarea
              id="editor"
              className="flex-1 block w-full min-h-40 pl-0 pr-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 custom-scrollbar"
              placeholder="Write an article..."
              required
              value={lectureScript[currentSlide]?.script}
              onChange={(e) => {
                const newLectureScript = [...lectureScript];
                newLectureScript[currentSlide].script = e.target.value;
                setLectureScript(newLectureScript);
              }}
            ></textarea>
          </div>
          {lectureScript[currentSlide]?.quiz ? (
            <QuizQuestion
              quiz={lectureScript[currentSlide].quiz}
              onQuizChange={handleQuizChange}
              onAddQuiz={handleAddQuiz}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ) : (
            <div className="flex justify-center m-1">
              <button
                onClick={handleAddQuiz}
                className="w-full py-3 text-white font-semibold rounded-md border-2 border-dashed border-indigo-500 bg-transparent hover:bg-white/5 transition"
              >
                Add Quiz
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ReviewLectureScript;
