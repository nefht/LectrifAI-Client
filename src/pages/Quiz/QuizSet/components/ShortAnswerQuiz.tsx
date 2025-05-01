import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import { MdEditNote, MdDone, MdDeleteOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { QuizQuestion } from "../../constants/quiz-data";
import quizService from "../../services/quizService";
import { useToast } from "../../../../hooks/useToast";
import DeleteModal from "../../../../components/NotificationModal/DeleteModal";
import { editablePermissionTypes } from "../constants/permission-type";

interface ShortAnswerQuizProps {
  index: number;
  quiz: QuizQuestion;
  isEditQuestion: number | null;
  setIsEditQuestion: (index: number | null) => void;
  quizData: QuizQuestion[];
  setQuizData: (data: any) => void;
  autoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showAllAnswers: boolean;
  userPermission: string;
  ownerPermission: boolean;
}

const ShortAnswerQuiz = ({
  index,
  quiz,
  isEditQuestion,
  setIsEditQuestion,
  quizData,
  setQuizData,
  autoResize,
  showAllAnswers,
  userPermission,
  ownerPermission
}: ShortAnswerQuizProps) => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const [quizEditData, setQuizEditData] = useState({
    question: quiz.question,
    answer: quiz.answer,
    explanation: quiz.explanation,
    points: quiz.points,
  });

  // State for deleting
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQuizEditData((prev) => ({ ...prev, [name]: value }));
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
          <div key={index} className="flex items-center gap-8">
            <div className="mb-auto flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-600 font-semibold text-lg">
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
                {(editablePermissionTypes.includes(userPermission) || ownerPermission)&& (
                  <>
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
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 mb-1">
                {isEditQuestion === index ? (
                  <div className="flex items-center gap-1 text-purple-600 font-semibold text-[12px]">
                    <input
                      type="number"
                      name="points"
                      min={1}
                      max={10}
                      className="p-0 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px] overflow-hidden max-w-12"
                      value={quizEditData.points}
                      onChange={handleInputChange}
                    ></input>
                    points
                  </div>
                ) : (
                  <div className="py-0.5 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px]">
                    {quiz.points} points
                  </div>
                )}
                <p className="text-gray-400 font-semibold text-[12px]">
                  SHORT ANSWER
                </p>
              </div>
              {isEditQuestion === index ? (
                <textarea
                  rows={1}
                  name="question"
                  className="rounded-md mt-2 mr-4 px-2 py-1 text-gray-800 font-semibold mb-3 border border-purple-400 focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                  onInput={autoResize}
                  value={quizEditData.question}
                  placeholder="Enter your question here..."
                  onChange={handleInputChange}
                >
                  {quiz.question}
                </textarea>
              ) : (
                <p className="mt-2 text-gray-800 font-semibold mb-3">
                  {quiz.question}
                </p>
              )}
              {isEditQuestion !== index && (
                <textarea
                  rows={1}
                  className="rounded-md mr-4 px-4 py-2 text-gray-800 mb-3 bg-purple-100 border-none focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                  value={userAnswer}
                  onInput={autoResize}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                />
              )}
              {(showAnswer || showAllAnswers) && (
                <div className="mr-4 mt-2 text-gray-700 px-4 py-3 bg-purple-100 border border-purple-300 rounded-md">
                  <div className="font-semibold">
                    <ReactMarkdown>{`Answer: ${quiz.answer}`}</ReactMarkdown>
                  </div>
                  {quiz.explanation && (
                    <div className="mt-1 text-gray-600">
                      <ReactMarkdown>{quiz.explanation}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
              {isEditQuestion === index && (
                <>
                  <textarea
                    rows={1}
                    name="answer"
                    className="mr-4 mt-3 font-semibold text-gray-700 px-4 py-3 bg-purple-100 border border-purple-300 rounded-md focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                    onInput={autoResize}
                    placeholder="Answer..."
                    value={quizEditData.answer || ""}
                    onChange={handleInputChange}
                  >
                    {quiz.answer}
                  </textarea>
                  <textarea
                    rows={1}
                    name="explanation"
                    className="mr-4 mt-3 text-gray-700 px-4 py-3 bg-purple-100 border border-purple-300 rounded-md focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                    onInput={autoResize}
                    placeholder="Explanation..."
                    value={quizEditData.explanation || ""}
                    onChange={handleInputChange}
                  >
                    {quiz.explanation}
                  </textarea>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortAnswerQuiz;
