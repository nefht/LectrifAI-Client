import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useToast } from "../../../hooks/useToast";
import lectureVideoService from "../../LectureTools/services/lectureVideoService";
import PdfPresentation from "../../../shared/templates/PdfPresentation";
import QuizQuestion from "../../LectureTools/LectureVideoGenerator/components/QuizQuestions";
import { useHeader } from "../../../hooks/useHeader";

function EditLectureQuiz() {
  const { id } = useParams();
  const {setHeaderClass} = useHeader();
  const { showToast } = useToast();
  const location = useLocation();
  const state = location.state;
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
  const [lectureName, setLectureName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (state?.message) {
      showToast("success", state.message);
    }
    setHeaderClass("bg-header shadow-none")
  }, []);

  // Get lecture script
  useEffect(() => {
    const fetchLectureScript = async () => {
      try {
        if (id) {
          const response = await lectureVideoService.getLectureScript(id);
          const fileId = response.fileId;
          const slide = await lectureVideoService.getUploadedSlide(fileId);

          setPdfUrl(slide.fileUrl);
          setLectureScript(response.lectureScript.slides);
          setLectureName(response.lectureScript.lectureName);
        } else {
          console.error("Lecture ID is undefined");
        }
      } catch (error) {
        console.error("Failed to get lecture script:", error);
        showToast("error", "Failed to load lecture data");
      }
    };

    fetchLectureScript();
  }, [id]);

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

  const handleUpdateQuizzes = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (id) {
          const updatedLectureScript = {
            lectureName: lectureName,
            slides: [...lectureScript],
          };
          await lectureVideoService.editLectureQuiz(id, {
            lectureScript: updatedLectureScript,
          });
        } else {
          console.error("Lecture ID is undefined");
        }
      } catch (error) {
        console.error("Failed to update quizzes:", error);
        showToast("error", "Failed to update quizzes");
        throw error;
      }
    },
    onSuccess: () => {
      showToast("success", "Quizzes updated successfully!");
    },
  });

  return (
    <div className="w-full h-full bg-header dark:bg-gradient-to-b from-dark to-indigo-950">
      <div className="flex flex-col text-center items-center justify-center px-8 md:px-24 xl:px-40 pt-12 md:pt-20">
        <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl dark:text-white">
          Edit Lecture Quizzes
        </h1>
        <p className="font-degular text-xl dark:text-gray-400 mt-4">
          Add, edit or remove quizzes for your lecture slides.
        </p>
      </div>
      <div className="w-full h-auto flex flex-col lg:flex-row gap-x-4 px-8 py-10 lg:px-20 lg:py-20">
        <div className="w-full lg:w-[60%] min-h-32">
          <PdfPresentation onPageChange={handlePageChange} pdfUrl={pdfUrl} />
        </div>
        <form
          className="lg:w-[40%] flex flex-col w-full mt-8 lg:mt-0 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          onSubmit={(e) => handleUpdateQuizzes.mutate(e)}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap items-center divide-gray-200 divide-x rtl:divide-x-reverse dark:divide-gray-600">
              <div className="flex items-center space-x-1 rtl:space-x-reverse pe-4">
                <p className="text-gray-800 dark:text-white font-semibold">
                  {lectureName}
                </p>
              </div>
              <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse ps-4">
                <p className="text-gray-600 dark:text-gray-300 font-semibold">
                  Slide {currentSlide + 1}
                </p>
              </div>
            </div>
            <button
              disabled={handleUpdateQuizzes.isPending}
              type="submit"
              className="inline-flex items-center py-1.5 px-3 text-sm font-medium text-center text-white bg-purple-700 dark:bg-indigo-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-indigo-900 hover:bg-purple-800 dark:hover:bg-indigo-800"
            >
              {handleUpdateQuizzes.isPending ? (
                <FaSpinner className="text-xl text-gray-200 animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </div>

          <div className="p-4 bg-white h-full rounded-lg dark:bg-gray-800">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Quiz
              </h2>
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
                    type="button"
                    onClick={handleAddQuiz}
                    className="w-full py-3 text-purple-900 font-semibold rounded-md border-2 border-dashed border-purple-500 bg-purple-200 hover:bg-purple-200/90 transition"
                  >
                    Add Quiz
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Script
                <span className="text-ssm text-gray-500"> (uneditable)</span>
              </h2>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                {lectureScript[currentSlide]?.script ||
                  "No content for this slide"}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLectureQuiz;
