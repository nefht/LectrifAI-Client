import { useState, useRef, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import DeleteModal from "../../../../components/NotificationModal/DeleteModal";

interface QuizProps {
  quiz?: {
    question: string;
    options: string[];
    answer: string;
  };
  onQuizChange: (updatedQuiz: {
    question: string;
    options: string[];
    answer: string;
  }) => void;
  onAddQuiz: () => void;
  onDeleteQuiz: () => void;
}

function QuizQuestion({
  quiz,
  onQuizChange,
  onAddQuiz,
  onDeleteQuiz,
}: QuizProps) {
  const [quizData, setQuizData] = useState(quiz || null);
  const questionRef = useRef<HTMLTextAreaElement | null>(null);
  const optionRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Cập nhật quizData khi quiz thay đổi
  useEffect(() => {
    setQuizData(
      quiz || { question: "", options: ["", "", "", ""], answer: "" }
    );
  }, [quiz]);

  // Tự động điều chỉnh chiều cao của textarea khi nội dung thay đổi
  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.style.height = "auto";
      questionRef.current.style.height =
        questionRef.current.scrollHeight + "px";
    }
  }, [quizData?.question]);

  useEffect(() => {
    optionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
      }
    });
  }, [quizData?.options]);

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!quizData) return;
    const updatedQuiz = { ...quizData, question: event.target.value };
    setQuizData(updatedQuiz);
    onQuizChange(updatedQuiz);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!quizData) return;
    const updatedOptions = [...quizData.options];
    updatedOptions[index] = value;
    const updatedQuiz = { ...quizData, options: updatedOptions };
    setQuizData(updatedQuiz);
    onQuizChange(updatedQuiz);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!quizData) return;
    const updatedQuiz = { ...quizData, answer: event.target.value };
    setQuizData(updatedQuiz);
    onQuizChange(updatedQuiz);
  };

  if (!quizData) {
    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={onAddQuiz}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Add Quiz
        </button>
      </div>
    );
  }

  const handleDeleteQuizQuestion = () => {
    if (quizData.question) {
      setIsDeleteModalOpen(true);
    } else {
      onDeleteQuiz();
    }
  };

  return (
    <>
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete quiz question",
          content: "Are you sure you want to delete this quiz question?",
        }}
        handleDelete={onDeleteQuiz}
      />
      <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
        <div className="flex justify-between">
          {/* Câu hỏi */}
          <label className="font-semibold text-gray-900 dark:text-white">
            Question:
          </label>
          <div
            className="p-1 bg-transparent hover:bg-red-600/50 rounded-lg active:scale-90 cursor-pointer"
            onClick={handleDeleteQuizQuestion}
          >
            <MdDeleteOutline className="text-white text-xl " />
          </div>
        </div>
        <textarea
          required
          ref={questionRef}
          value={quizData.question}
          onChange={handleQuestionChange}
          className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white resize-none overflow-hidden focus:ring-indigo-600 focus:border-indigo-600"
          placeholder="Enter quiz question..."
          rows={1}
        ></textarea>

        {/* Danh sách câu trả lời */}
        <div className="mt-2 space-y-2">
          {quizData.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <textarea
                required
                ref={(el) => (optionRefs.current[index] = el)}
                value={option}
                rows={1}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`w-full p-2 border rounded-md transition dark:text-white resize-none overflow-hidden focus:ring-indigo-600 focus:border-indigo-600
                          ${
                            option.trim() === ""
                              ? "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              : option === quizData.answer
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-red-500 text-white border-red-600"
                          }
                          dark:bg-opacity-70 dark:border-opacity-50 placeholder:text-gray-400`}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Dropdown chọn đáp án đúng */}
        <div className="mt-2">
          <label className="text-gray-700 dark:text-white">
            Correct Answer:
          </label>
          <select
            required
            value={quizData.answer}
            onChange={handleAnswerChange}
            className="text-sm w-full p-2 mt-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-indigo-600 focus:border-indigo-600"
          >
            <option value="" disabled className="hidden"></option>
            {quizData.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default QuizQuestion;
