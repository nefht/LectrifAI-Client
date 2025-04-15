import { useState } from "react";
import { MdEditNote, MdDone, MdDeleteOutline } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoKeyOutline } from "react-icons/io5";
import DeleteModal from "../../../../components/NotificationModal/DeleteModal";
import { QuizQuestion } from "../../constants/quiz-data";
import quizService from "../../services/quizService";
import { useToast } from "../../../../hooks/useToast";

interface MultipleChoiceQuizProps {
  index: number;
  quiz: QuizQuestion;
  isEditQuestion: number | null;
  setIsEditQuestion: (index: number | null) => void;
  quizData: QuizQuestion[];
  setQuizData: (data: any) => void;
  autoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showAllAnswers: boolean;
}

const MultipleChoiceQuiz = ({
  index,
  quiz,
  isEditQuestion,
  setIsEditQuestion,
  quizData,
  setQuizData,
  autoResize,
  showAllAnswers,
}: MultipleChoiceQuizProps) => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSelected, setIsSelected] = useState("");

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const [quizEditData, setQuizEditData] = useState({
    question: quiz.question,
    options: quiz.options,
    answer: quiz.answer,
    explanation: quiz.explanation,
    points: quiz.points,
  });
  // State for deleting
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedOptions = [...quizEditData.options];
    updatedOptions[index] = e.target.value;
    setQuizEditData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleAnswerChange = (option: string) => {
    setQuizEditData((prev) => ({ ...prev, answer: option }));
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizEditData((prev) => ({ ...prev, points: Number(e.target.value) }));
  };

  const handleSaveChanges = useMutation({
    mutationFn: async (index: number) => {
      if (!id) return;
      const updatedQuiz = {
        ...quiz,
        ...quizEditData,
      };
      const updatedQuizData = [...quizData];
      updatedQuizData[index] = updatedQuiz;
      const response = await quizService.updateQuiz(id, {
        quizzes: updatedQuizData,
      });

      setQuizData(updatedQuizData);
      setIsEditQuestion(null);
      setIsSelected("");
    },
    onSuccess: () => {
      showToast("success", "Quiz updated successfully!");
    },
    onError: () => {
      showToast("error", "Failed to update quiz!");
    },
  });

  const handleDeleteQuestion = useMutation({
    mutationFn: async (index: number) => {
      if (!id) return;
      const updatedQuizData = [...quizData].filter((_, i) => i !== index);
      const response = await quizService.updateQuiz(id, {
        quizzes: updatedQuizData,
      });
      setQuizData(updatedQuizData);
      setIsDeleteModalOpen(false);
    },
    onSuccess: () => {
      showToast("success", "Quiz deleted successfully!");
    },
    onError: () => {
      showToast("error", "Failed to delete quiz!");
    },
  });

  return (
    <>
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        disabledButton={handleDeleteQuestion.isPending}
        modalInformation={{
          title: "Delete question",
          content: "Are you sure you want to delete this question?",
        }}
        handleDelete={() => handleDeleteQuestion.mutate(index)}
      />
      <div className="group flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg pl-6 pr-3 py-5 w-full mb-4">
        <div className="flex flex-col gap-4">
          <div key={index} className="flex items-center gap-4 md:gap-8">
            <div className="mb-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full text-purple-600 font-semibold md:text-lg">
              {index + 1}
            </div>
            <div className="relative flex flex-col w-full">
              <div className="hidden absolute top-0 right-0 group-hover:flex gap-1 cursor-pointer">
                <div
                  className="p-1 rounded-lg bg-green-300/70 transition duration-200 active:scale-95"
                  onClick={handleShowAnswer}
                >
                  <IoKeyOutline className="text-xl text-green-600" />
                </div>
                <div className="p-1 rounded-lg bg-purple-300/70 transition duration-200 active:scale-95">
                  {isEditQuestion === index ? (
                    handleSaveChanges.isPending ? (
                      <FaSpinner className="text-xl text-purple-600 animate-spin" />
                    ) : (
                      <MdDone
                        className="text-xl text-purple-600"
                        onClick={() => handleSaveChanges.mutate(index)}
                      />
                    )
                  ) : (
                    <MdEditNote
                      className="text-xl text-purple-600"
                      onClick={() => setIsEditQuestion(index)}
                    />
                  )}
                </div>
                {isEditQuestion === index && (
                  <div className="p-1 rounded-lg bg-purple-300/70 transition duration-200 active:scale-95">
                    <IoMdClose
                      className="text-xl text-purple-600"
                      onClick={() => setIsEditQuestion(null)}
                    />
                  </div>
                )}
                <div
                  className="p-1 rounded-lg bg-red-300/70 transition duration-200 active:scale-95"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <MdDeleteOutline className="text-xl text-red-600" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-1">
                {isEditQuestion === index ? (
                  <div className="flex items-center gap-1 text-purple-600 font-semibold text-[12px]">
                    <input
                      type="number"
                      max={10}
                      className="p-0 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px] overflow-hidden max-w-12"
                      value={quizEditData.points}
                      onChange={handlePointsChange}
                    ></input>
                    points
                  </div>
                ) : (
                  <div className="py-0.5 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px]">
                    {quiz.points} points
                  </div>
                )}
                <p className="text-gray-400 font-semibold text-[12px]">
                  MULTIPLE CHOICE
                </p>
              </div>
              {isEditQuestion === index ? (
                <textarea
                  rows={1}
                  name="question"
                  className="rounded-md mt-2 mr-4 px-2 py-1 text-gray-800 font-semibold mb-3 border border-purple-400 focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                  onInput={autoResize}
                  value={quizEditData.question}
                  onChange={handleInputChange}
                  placeholder="Enter your question here..."
                >
                  {quiz.question}
                </textarea>
              ) : (
                <p className="mt-2 text-gray-800 font-semibold mb-3">
                  {quiz.question}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {isEditQuestion === index ? (
                  <>
                    {quizEditData.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-3 mr-4">
                        <input
                          type="radio"
                          name={`answer-${index}`}
                          checked={quizEditData.answer === option}
                          className={`w-5 h-5 text-green-500 border-gray-300 focus:ring-green-400`}
                          onClick={() => handleAnswerChange(option)}
                        />
                        <textarea
                          rows={1}
                          className="w-full rounded-md px-2 py-1 text-gray-800 border border-purple-400 focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                          value={option}
                          onChange={(e) => handleOptionChange(e, i)}
                          onInput={autoResize}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {quiz.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`answer-${index}`}
                          className={`w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 ${
                            showAnswer || showAllAnswers
                              ? option === quiz.answer
                                ? "bg-green-400"
                                : "bg-red-500"
                              : ""
                          }`}
                          onChange={() => setIsSelected(option)}
                          disabled={showAnswer}
                          checked={isSelected === option}
                        />
                        <p className="text-gray-600">{option}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {(showAnswer || showAllAnswers) && (
                <div className="mr-4 mt-5 text-gray-700 px-4 py-3 bg-purple-100 border border-purple-300 rounded-md">
                  <p className="font-semibold">
                    <ReactMarkdown>{`Answer: ${quiz.answer}`}</ReactMarkdown>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <ReactMarkdown>{quiz.explanation}</ReactMarkdown>
                  </p>
                </div>
              )}
              {isEditQuestion === index && (
                <textarea
                  rows={1}
                  name="explanation"
                  placeholder="Enter explanation here..."
                  className="mr-4 mt-5 text-gray-700 px-4 py-3 bg-purple-100 border border-purple-300 rounded-md focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                  onInput={autoResize}
                  value={quizEditData.explanation || ""}
                  onChange={handleInputChange}
                >
                  {quiz.explanation}
                </textarea>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultipleChoiceQuiz;
