import { useState, useEffect, useRef } from "react";
import { IoFlag, IoFlagOutline } from "react-icons/io5";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import classroomService from "../../services/classroomService";
import { useAuth } from "../../../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../../../../hooks/useToast";
import WarningModal from "../../../../components/NotificationModal/WarningModal";

const status = [
  "not started",
  "in-progress",
  "disconnected",
  "submitted",
  "graded",
];

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface StudentAnswerProps {
  studentAnswerId: string;
}

function StudentAnswer({ studentAnswerId }: StudentAnswerProps) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [quizName, setQuizName] = useState("Clustal Omega");
  const [quizData, setQuizData] = useState([] as any[]);
  const [timeLeft, setTimeLeft] = useState<number | null>(); // Duration
  const [completedQuestions, setCompletedQuestions] = useState(
    Array(quizData.length).fill({
      done: false,
      mark: false,
    })
  );
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(quizData.length).fill("")
  );
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [totalScore, setTotalScore] = useState<number | string>();
  const [quizTotalScore, setQuizTotalScore] = useState<number>(0);
  const [studentAnswerStatus, setStudentAnswerStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      studentAnswerStatus === "submitted" ||
      studentAnswerStatus === "graded"
    ) {
      return;
    }
  }, []);

  const fetchStudentAnswer = useQuery({
    queryKey: ["studentAnswer", studentAnswerId],
    queryFn: async () => {
      if (!studentAnswerId) return;

      const response = await classroomService.getStudentAnswerById(
        studentAnswerId
      );
      setQuizName(response?.quizName);
      setQuizData(response?.userAnswers);
      if (response?.endedAt) {
        const timeLeft = Math.floor(
          (new Date(response?.endedAt).getTime() - new Date().getTime()) / 1000
        );
        setTimeLeft(timeLeft);
      }
      if (response?.score) {
        setTotalScore(response?.score);
      }
      setCompletedQuestions(
        response?.userAnswers.map((item: any) => ({
          done: item.userAnswer ? true : false,
          mark: false,
        }))
      );
      setUserAnswers(response?.userAnswers.map((item: any) => item.userAnswer));
      setStudentAnswerStatus(response?.status);
      setQuizTotalScore(response?.quizTotalScore);

      return response;
    },
  });

  const scrollToQuestion = (index: number) => {
    if (questionRefs.current[index]) {
      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 flex flex-row-reverse gap-4 md:gap-4 lg:gap-6 px-6 lg:px-16 xl:px-24 2xl:px-32 py-10">
        <div className="mb-10 md:w-1/4">
          <div className="sticky top-20 right-10 flex flex-col items-center">
            {totalScore && (
              <div className="mb-4 text-center bg-green-200 border border-green-300 px-2 lg:px-4 py-2 rounded-md shadow-md">
                <h2 className="font-semibold text-gray-800">
                  <span className="hidden md:block text-md lg:text-lg xl:text-xl">
                    User score:
                  </span>
                  <span className="text-lg lg:text-xl xl:text-2xl text-green-800">
                    {totalScore} / {quizTotalScore}
                  </span>
                </h2>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-lg px-3 md:px-6 py-4 border border-gray-200">
              <h2 className="hidden md:block font-medium text-lg xl:text-xl text-center mb-4">
                {quizName}
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center gap-2 md:gap-3 lg:gap-2">
                {quizData.map((_, index) => (
                  <div
                    key={index}
                    className={`relative w-10 h-10 flex items-center justify-center rounded-md text-gray-700 text-lg cursor-pointer transition-all duration-300 ${
                      completedQuestions[index]?.done
                        ? "bg-purple-500 text-white font-semibold"
                        : "bg-gray-200/80 border border-gray-300 hover:bg-gray-400/60"
                    }`}
                    onClick={() => {
                      scrollToQuestion(index);
                    }}
                  >
                    {index + 1}
                    {completedQuestions[index].mark && (
                      <span className="absolute -m-1 top-0 right-0 flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-red-700"></span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:w-3/4">
          {quizData.map((quiz, index) => {
            return (
              <div
                key={index}
                ref={(el) => (questionRefs.current[index] = el)}
                className="relative scroll-mt-[80px] group flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg pl-6 pr-3 py-5 w-full mb-4"
              >
                <div className="flex flex-col gap-4">
                  <div key={index} className="flex items-center gap-4 md:gap-8">
                    <div className="mb-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full text-purple-600 font-semibold md:text-lg">
                      {index + 1}
                    </div>
                    <div className="relative flex flex-col w-full">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="py-0.5 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px]">
                          {(studentAnswerStatus === "graded" ||
                            quiz.userScore) &&
                            quiz?.userScore + " / "}{" "}
                          {quiz.points} points
                        </div>

                        <p className="text-gray-400 font-semibold text-[12px]">
                          {quiz.questionType === "multiple choice"
                            ? "MULTIPLE CHOICE"
                            : "SHORT ANSWER"}
                        </p>
                      </div>

                      <p className="mt-2 text-gray-800 font-semibold mb-3">
                        {quiz.question}
                      </p>

                      {quiz.questionType === "multiple choice" ? (
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 ${
                            studentAnswerStatus === "graded" ? "mb-2" : ""
                          }`}
                        >
                          {quiz.options.map((option: any, i: number) => (
                            <div key={i} className={`flex items-center gap-3`}>
                              <input
                                disabled={
                                  studentAnswerStatus === "submitted" ||
                                  studentAnswerStatus === "graded"
                                }
                                type="radio"
                                name={`answer-${index}`}
                                className={`w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 ${
                                  studentAnswerStatus === "graded" &&
                                  option !== quiz.userAnswer
                                    ? option === quiz.answer
                                      ? "bg-green-500"
                                      : "bg-red-600"
                                    : ""
                                }`}
                                checked={userAnswers[index] === option}
                              />
                              <p className="text-gray-600">{option}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-md mr-4 px-4 py-2 text-gray-800 mb-3 bg-purple-100 border-none focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden">
                          {userAnswers[index]}
                        </div>
                      )}
                      {(studentAnswerStatus === "graded" || quiz.userScore) && (
                        <>
                          <div className="mt-2 flex flex-col rounded-md mr-4 px-4 py-2 text-gray-800 mb-3 bg-green-100 border border-green-200">
                            <div className="font-medium text-gray-800">
                              <ReactMarkdown>{`Answer: ${quiz.answer}`}</ReactMarkdown>
                            </div>
                            <div className="text-gray-800 mt-1">
                              <ReactMarkdown>{`${quiz.explanation}`}</ReactMarkdown>
                            </div>
                          </div>
                          {quiz.questionType === "short answer" && (
                            <div className="mt-2 flex flex-col rounded-md mr-4 px-4 py-2 text-gray-800 mb-3 bg-gray-100 border border-gray-200">
                              <div className="font-medium text-gray-800">
                                <ReactMarkdown>{`You get score: ${quiz.userScore}`}</ReactMarkdown>
                              </div>
                              {quiz.feedback && (
                                <div className="text-gray-800 mt-1">
                                  <ReactMarkdown>{`${quiz.feedback}`}</ReactMarkdown>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentAnswer;
