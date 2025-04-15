import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaEarthAsia } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import styles from "./QuizMaker.module.css";
import QuizFromTopic from "./components/QuizFromTopic";
import QuizFromDocument from "./components/QuizFromDocument";
import footerDecor from "../../assets/images/quiz/footer-decor.svg";
import quizService from "../Quiz/services/quizService";
import { EQuizMakerOptions } from "./constants/quiz-maker-options";
import helperService from "../../services/helperService";
import CustomSpinner from "../../components/LoadingSpinner/CustomSpinner";
import { useToast } from "../../hooks/useToast";
import { useQuizOptions } from "./hooks/useQuizOptions";

function QuizMaker() {
  const navigate = useNavigate();
  const { quizMakerOptions, setQuizMakerOptions } = useQuizOptions();
  const { showToast } = useToast();
  const [languages, setLanguages] = useState<any>([]);
  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await helperService.getAllLanguages();
      const formattedLanguages = response.map((lang: any) => ({
        label: lang.name,
        value: lang.name,
      }));
      setLanguages(formattedLanguages);
    };
    fetchLanguages();
  }, []);

  const tabs = [
    {
      name: "Any Topic",
      icon: <FaEarthAsia />,
      component: <QuizFromTopic languages={languages} />,
      handleSubmit: async () => {
        const response = await quizService.createQuizWithTopic(
          quizMakerOptions?.[EQuizMakerOptions.TOPIC],
          null,
          quizMakerOptions?.[EQuizMakerOptions.ACADEMIC_LEVEL],
          quizMakerOptions?.[EQuizMakerOptions.LANGUAGE],
          quizMakerOptions?.[EQuizMakerOptions.QUESTION_TYPE],
          quizMakerOptions?.[EQuizMakerOptions.NUMBER_OF_QUESTIONS],
          quizMakerOptions?.[EQuizMakerOptions.SPECIFIC_REQUIREMENTS]
        );
        navigate(`/quiz/${response._id}`, {
          state: { message: "Quiz created successfully!" },
        });
      },
    },
    {
      name: "From Document",
      icon: <IoDocumentText />,
      component: <QuizFromDocument languages={languages} />,
      handleSubmit: async () => {
        let response;
        if (quizMakerOptions[EQuizMakerOptions.DOCUMENT_TEXT]) {
          response = await quizService.createQuizWithTopic(
            null,
            quizMakerOptions?.[EQuizMakerOptions.DOCUMENT_TEXT],
            quizMakerOptions?.[EQuizMakerOptions.ACADEMIC_LEVEL],
            quizMakerOptions?.[EQuizMakerOptions.LANGUAGE],
            quizMakerOptions?.[EQuizMakerOptions.QUESTION_TYPE],
            quizMakerOptions?.[EQuizMakerOptions.NUMBER_OF_QUESTIONS],
            quizMakerOptions?.[EQuizMakerOptions.SPECIFIC_REQUIREMENTS]
          );
        } else if (quizMakerOptions[EQuizMakerOptions.FILE]) {
          response = await quizService.createQuizWithFile(
            quizMakerOptions?.[EQuizMakerOptions.FILE],
            quizMakerOptions?.[EQuizMakerOptions.ACADEMIC_LEVEL],
            quizMakerOptions?.[EQuizMakerOptions.LANGUAGE],
            quizMakerOptions?.[EQuizMakerOptions.QUESTION_TYPE],
            quizMakerOptions?.[EQuizMakerOptions.NUMBER_OF_QUESTIONS],
            quizMakerOptions?.[EQuizMakerOptions.SPECIFIC_REQUIREMENTS]
          )
        }
        navigate(`/quiz/${response._id}`, {
          state: { message: "Quiz created successfully!" },
        });
      },
    },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0].name);

  const handleSubmit = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const submitTab = tabs.find((tab) => tab.name === selectedTab);
      await submitTab?.handleSubmit();
    },
    onError: (error) => {
      showToast("error", "Create quiz unsuccessfully!");
      console.error("Error creating quiz:", error);
    },
  });

  return (
    <>
      <CustomSpinner
        isLoading={handleSubmit.isPending}
        message="Generating Quiz"
      />
      <form
        className="flex flex-col w-full"
        onSubmit={(e) => handleSubmit.mutate(e)}
      >
        <div className="animate-slidein flex flex-col items-center justify-center w-full h-1/4 px-4 sm:px-10 md:px-20 lg:px-60 xl:px-72 2xl:px-96 mt-8 lg:mt-20">
          <h1
            className={`text-center text-4xl lg:text-5xl font-semibold font-degular ${styles["gradient-text"]}`}
          >
            Quizzes Maker
          </h1>
          <p className="text-lg md:text-xl text-center text-gray-800 my-8">
            Create quizzes effortlessly with our AI-powered tool. Upload your
            documents or paste text to generate quizzes in seconds. Fast,
            simple, and efficient - get started in just a few clicks!
          </p>
          <div className="w-full text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="w-full flex flex-wrap justify-between -mb-px">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 border-b-2 border-transparent rounded-t-lg text-md font-semibold cursor-pointer
                      ${
                        selectedTab === tab.name
                          ? "text-purple-600 border-b-purple-700 dark:text-purple-300 dark:border-purple-700 hover:text-purple-600 hover:border-purple-500 dark:hover:text-purple-300"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      }
                      `}
                  onClick={() => setSelectedTab(tab.name)}
                >
                  {tab.icon}
                  {tab.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            {tabs.map(
              (tab) =>
                selectedTab === tab.name && (
                  <div
                    key={tab.name}
                    className={`w-full p-4 bg-white rounded-lg`}
                  >
                    {tab.component}
                  </div>
                )
            )}
          </div>
        </div>
        <div className="relative w-full flex flex-col items-center justify-center pt-10 pb-20">
          <button
            type="submit"
            // onClick={() => handleSubmit.mutate()}
            className="z-20 flex items-center justify-center gap-2 mt-8 px-8 py-3 bg-purple-600 font-semibold text-lg text-white rounded-md hover:bg-purple-700 transition duration-200 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0"
          >
            <BsStars />
            Generate Quiz
          </button>
          <img
            src={footerDecor}
            alt="Footer Decoration"
            className="absolute bottom-0 left-0 w-full h-auto z-[-1]"
          />
        </div>
      </form>
    </>
  );
}

export default QuizMaker;
