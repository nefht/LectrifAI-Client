import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { FaCheckCircle, FaQuestionCircle, FaTimesCircle } from "react-icons/fa";
import { QuizQuestion } from "../constants/quiz-data";
import quizService from "../services/quizService";
import { Tooltip } from "flowbite-react";

interface LearningQuizProps {
  quizData: QuizQuestion[]; // Dữ liệu quiz
  stopLearning: () => void; // Hàm để đóng quiz
}

const LearningQuiz = ({ quizData, stopLearning }: LearningQuizProps) => {
  // Quiz đã shuffle
  const [shuffledQuizData, setShuffledQuizData] = useState<QuizQuestion[]>([]);
  // Chỉ số câu hỏi hiện tại
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Đáp án đã chọn
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // Trạng thái hiển thị đáp án
  const [showAnswer, setShowAnswer] = useState(false);
  // Số điểm đã đạt được
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  // Trạng thái quiz đã hoàn thành
  const [quizCompleted, setQuizCompleted] = useState(false);
  // Tổng số điểm của quiz
  const totalPoints = quizData.reduce(
    (acc, question) => acc + question.points,
    0
  );
  // Feedback check short answer
  const [feedbackAnswer, setFeedbackAnswer] = useState<{
    feedback: string;
    userScore: number;
  } | null>(null);

  // Chỉ shuffle một lần khi component lần đầu render
  useEffect(() => {
    const shuffledData = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuizData(shuffledData);
  }, [quizData, quizCompleted]);

  // Kiểm tra nếu shuffledQuizData không có câu hỏi
  const currentQuestion = shuffledQuizData[currentQuestionIndex] || null;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true); // Hiển thị phản hồi ngay khi chọn đáp án
    // Nếu câu trả lời là đúng, cộng điểm
    if (answer === currentQuestion?.answer) {
      setCorrectAnswersCount(correctAnswersCount + currentQuestion?.points);
    }
  };

  const handleNextQuestion = () => {
    // Chuyển sang câu hỏi tiếp theo nếu có
    if (currentQuestionIndex < shuffledQuizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset lại đáp án đã chọn
      setShowAnswer(false); // Reset trạng thái hiển thị đáp án
      setFeedbackAnswer(null); // Reset phản hồi
    } else {
      setQuizCompleted(true); // Hoàn thành quiz
    }
  };

  const handleRedoQuiz = () => {
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    const shuffledData = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuizData(shuffledData);
  };

  const handleCheckShortAnswer = useMutation({
    mutationFn: async () => {
      if (selectedAnswer) {
        const response = await quizService.checkShortAnswerQuiz(
          currentQuestion?.question,
          currentQuestion?.answer,
          currentQuestion?.explanation ?? "No explanation provided.",
          currentQuestion?.points,
          selectedAnswer
        );
        setFeedbackAnswer(response);
        setCorrectAnswersCount(correctAnswersCount + (response.userScore ?? 0));
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-16 pb-20 w-full max-w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-dark bg-gradient-to-b to-indigo-950 from-violet-950 z-50 shadow-lg">
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={stopLearning}
      >
        <FaTimesCircle className="text-3xl text-white/80 " />
      </div>

      {!quizCompleted && currentQuestion ? (
        <div className="md:w-3/4 lg:w-2/3 h-[70vh]">
          {/* Progress bar */}
          <div className="w-full mb-8 bg-purple-50/20 rounded">
            <div
              className="flex items-center justify-end bg-white h-2 rounded min-w-8 shadow-md"
              style={{
                width: `${
                  (currentQuestionIndex / shuffledQuizData.length) * 100
                }%`,
              }}
            >
              <div className="flex items-center justify-center font-bold text-lg text-purple-800 w-8 h-8 rounded-full bg-white">
                {currentQuestionIndex + 1}
              </div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-between p-10 bg-white rounded-lg overflow-scroll hide-scrollbar">
            {/* Question */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col-reverse gap-2 items-start sm:gap-0 sm:flex-row sm:items-center justify-between">
                <p className="text-ssm font-semibold text-gray-500">
                  {currentQuestion?.questionType?.toUpperCase()}
                  <span className="text-purple-800">
                    {" "}
                    + {currentQuestion?.points} pts
                  </span>
                </p>
                <div className="self-center px-2 py-1.5 text-ssm font-semibold shadow-sm shadow-purple-500/50 bg-purple-200 border-2 border-purple-400/60 rounded-md">
                  {correctAnswersCount} / {totalPoints} points
                </div>
              </div>
              <h2 className="md:text-lg lg:text-xl font-semibold text-gray-800 mb-4">
                Question: {currentQuestion?.question}
              </h2>
            </div>

            {/* Show answer feedback and explanation */}
            {showAnswer && currentQuestion && (
              <div className="text-sm mb-6">
                {selectedAnswer === currentQuestion.answer ? (
                  <p className="text-green-600">
                    Congratulation, you got it right!{" "}
                  </p>
                ) : (
                  <div className="text-red-600">
                    The right answer is:{" "}
                    <div className="font-medium">
                      <ReactMarkdown>{currentQuestion.answer}</ReactMarkdown>
                    </div>
                  </div>
                )}
                <div className="text-gray-700 mt-2">
                  <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
                </div>{" "}
              </div>
            )}

            {handleCheckShortAnswer.isPending && (
              <div className="w-full h-8 mb-5 flex items-center justify-center">
                <div className="w-5 h-5 mb-4 border-2 border-purple-500 rounded-full animate-ping"></div>
              </div>
            )}

            {/* Options or Short Answer */}
            {currentQuestion?.questionType === "multiple choice" ? (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {currentQuestion?.options?.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 cursor-pointer border border-gray-300 rounded-md text-gray-700 ${
                      showAnswer
                        ? option === currentQuestion.answer
                          ? "border-dashed bg-green-600 text-white font-semibold"
                          : option === selectedAnswer
                          ? "border-dashed bg-red-600 text-white font-semibold"
                          : ""
                        : "hover:bg-gray-200"
                    } ${
                      showAnswer ? "cursor-not-allowed pointer-events-none" : ""
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 relative">
                {feedbackAnswer && (
                  <div className="w-full p-4 bg-purple-100 border border-purple-300 rounded-md text-gray-700 mb-2">
                    {feedbackAnswer.feedback}
                    <p className="mt-1 font-semibold text-purple-700">
                      You get score: {feedbackAnswer.userScore}
                    </p>
                  </div>
                )}
                <textarea
                  rows={4}
                  value={selectedAnswer || ""}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute bottom-4 right-9 w-7">
                  <Tooltip content="Show answer" placement="top-end">
                    <FaQuestionCircle
                      onClick={() => handleAnswerSelect(selectedAnswer || "")}
                      className="text-green-600 text-2xl cursor-pointer hover:text-green-800 active:scale-90 transition-transform duration-200"
                    />
                  </Tooltip>
                </div>

                {/* Icon check ở góc dưới bên phải */}
               <div className="absolute bottom-4 right-1 w-7">
                  <Tooltip content="Check answer" placement="top-end">
                    <FaCheckCircle
                      onClick={() => handleCheckShortAnswer.mutate()}
                      className={`text-purple-600 text-2xl cursor-pointer hover:text-purple-800 active:scale-90 transition-transform duration-200 ${
                        feedbackAnswer || handleCheckShortAnswer.isPending
                          ? "pointer-events-none text-gray-500"
                          : ""
                      }`}
                    />
                  </Tooltip>
               </div>
              </div>
            )}
          </div>
          {/* Next Question Button */}
          <div className="w-full flex items-center justify-center mt-6">
            <button
              disabled={handleCheckShortAnswer.isPending}
              onClick={handleNextQuestion}
              className="text-white bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-violet-300 dark:focus:ring-violet-800 shadow-lg shadow-violet-500/50 dark:shadow-lg dark:shadow-violet-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {handleCheckShortAnswer.isPending
                ? "Please wait for feedback..."
                : "Next Question"}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-completed text-center text-white">
          <h3 className="text-3xl font-semibold mb-4">Quiz Completed!</h3>
          <p className="text-xl mb-4">
            You answered correctly {correctAnswersCount} out of {totalPoints}{" "}
            points.
          </p>
          <button
            onClick={handleRedoQuiz}
            className="mt-6 bg-green-500 text-white py-2 px-6 rounded-lg shadow-green-500/50 font-semibold transition-transform duration-300 hover:bg-green-600 hover:shadow-lg active:scale-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningQuiz;
