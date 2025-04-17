import { useState, useEffect, useRef } from "react";
import { IoFlag, IoFlagOutline } from "react-icons/io5";

// Hàm format thời gian theo định dạng HH:MM
const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

function DoingQuizSet() {
  const [quizName, setQuizName] = useState("Clustal Omega");
  const [quizData, setQuizData] = useState([
    {
      questionType: "multiple choice",
      question: "Mục đích chính của gói phần mềm Clustal Omega là gì?",
      options: [
        "Dự đoán cấu trúc protein",
        "Thực hiện gióng hàng đa trình tự (Multiple Sequence Alignment)",
        "Phân tích cây phát sinh loài",
        "Tìm kiếm trình tự tương đồng",
      ],
      points: 1,
    },
    {
      questionType: "multiple choice",
      question:
        "Kể từ phiên bản 1.1.0 (năm 2012), ngoài trình tự protein, Clustal Omega đã hỗ trợ thêm loại trình tự nào?",
      options: [
        "Chỉ trình tự RNA",
        "Trình tự DNA và RNA",
        "Trình tự Carbohydrate",
        "Trình tự Lipid",
      ],
      points: 2,
    },
    {
      questionType: "short answer",
      question:
        "Clustal Omega là một gói phần mềm được phát triển để giải quyết vấn đề gì khi số lượng trình tự có sẵn ngày càng tăng?",
      options: [],
      points: 3,
    },
    {
      questionType: "short answer",
      question:
        "So với các phiên bản Clustal trước đó như Clustal W, ưu điểm chính của Clustal Omega khi xử lý bộ dữ liệu lớn là gì?",
      options: [],
      points: 3,
    },
    {
      questionType: "multiple choice",
      question:
        "Thuật toán nào được Clustal Omega sử dụng để xây dựng cây hướng dẫn (guide tree) cho số lượng lớn trình tự, giúp giảm độ phức tạp tính toán từ O(N^2) xuống O(N log N)?",
      options: ["UPGMA", "Neighbor-Joining", "mBed", "HHalign"],
      points: 7,
    },
    {
      questionType: "multiple choice",
      question:
        "Động cơ gióng hàng (alignment engine) cốt lõi trong Clustal Omega dựa trên việc gióng hàng các cấu trúc nào sau đây, thay vì sử dụng phương pháp lập trình động truyền thống trực tiếp trên trình tự?",
      options: [
        "Cấu trúc bậc hai (Secondary Structures)",
        "Mô hình Markov ẩn cấu hình (Profile Hidden Markov Models - HMMs)",
        "Ma trận thay thế (Substitution Matrices)",
        "Cây phát sinh loài (Phylogenetic Trees)",
      ],
      points: 8,
    },
    {
      questionType: "multiple choice",
      question:
        "Phương pháp mBed, được Clustal Omega sử dụng để xây dựng cây hướng dẫn nhanh cho các bộ dữ liệu lớn, có độ phức tạp tính toán là bao nhiêu?",
      options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"],
      points: 7,
    },
    {
      questionType: "short answer",
      question:
        "Giải thích sự đánh đổi chính (trade-off) khi sử dụng các tùy chọn lặp lại (iteration schemes) trong Clustal Omega so với việc chạy ở chế độ mặc định, dựa trên kết quả benchmark (ví dụ: BAliBASE, Prefab).",
      options: [],
      points: 8,
    },
    {
      questionType: "short answer",
      question:
        "Trong quá trình gióng hàng của Clustal Omega (ví dụ phiên bản 1.2.3), giai đoạn nào tiêu thụ nhiều bộ nhớ nhất khi xử lý các trình tự hoặc cấu hình con (sub-profiles) rất dài, và yếu tố nào quyết định chính mức tiêu thụ bộ nhớ này?",
      options: [],
      points: 9,
    },
    {
      questionType: "short answer",
      question:
        "Tại sao việc sử dụng cây phát sinh loài (phylogenetic tree) được tạo ra từ chính gióng hàng tham chiếu làm cây hướng dẫn (guide tree) trong Clustal Omega lại cho kết quả chất lượng thấp trên benchmark BAliBASE?",
      options: [],
      points: 10,
    },
  ]);
  const [timeLeft, setTimeLeft] = useState(70); // Duration

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

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const scrollToQuestion = (index: number) => {
    if (questionRefs.current[index]) {
      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Cập nhật câu trả lời
  const handleQuestionCompletion = (index: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);

    setCompletedQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        done: answer ? true : false,
      };
      return updated;
    });
  };

  // Toggle mark flag
  const toggleMarkFlag = (index: number) => {
    setCompletedQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        mark: !updated[index].mark, // Đổi trạng thái mark
      }; // Đổi trạng thái flag
      return updated;
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-row-reverse gap-4 md:gap-2 lg:gap-6 px-6 lg:px-16 xl:px-24 2xl:px-32 py-10">
      <div className="mb-10 md:w-1/4">
        <div className="sticky top-20 right-10 flex flex-col items-center">
          {/* Thời gian đếm ngược */}
          <div className="mb-4 text-center bg-purple-200 border border-purple-300 px-2 lg:px-4 py-2 rounded-md shadow-md">
            <h2 className="font-semibold text-gray-800">
              <span className="hidden md:block text-md lg:text-lg xl:text-xl">
                Time Remaining:
              </span>
              <span
                className={`text-lg lg:text-xl xl:text-2xl ${
                  timeLeft > 60 ? "" : "text-red-800"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </h2>
          </div>

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
          <div className="mt-4 w-full flex items-center justify-center">
            <button className="flex gap-1 bg-purple-600 font-medium text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-500 transition-all duration-200 ring-2 ring-purple-300 hover:ring-purple-400 active:scale-95">
              Submit <span className="hidden md:block">Quiz</span>
            </button>
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
              <div
                className="z-40 absolute top-5 right-5 text-lg cursor-pointer"
                onClick={() => toggleMarkFlag(index)}
              >
                {completedQuestions[index].mark ? (
                  <IoFlag className="text-red-800" />
                ) : (
                  <IoFlagOutline className="text-red-800" />
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div key={index} className="flex items-center gap-4 md:gap-8">
                  <div className="mb-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full text-purple-600 font-semibold md:text-lg">
                    {index + 1}
                  </div>
                  <div className="relative flex flex-col w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="py-0.5 px-2 bg-purple text-purple-600 font-semibold bg-purple-100 border border-purple-300 rounded-md text-[12px]">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        {quiz.options.map((option, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`answer-${index}`}
                              className={`w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 `}
                              onChange={() =>
                                handleQuestionCompletion(index, option)
                              }
                              // checked={userAnswers[index] === option}
                            />
                            <p className="text-gray-600">{option}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        rows={1}
                        className="rounded-md mr-4 px-4 py-2 text-gray-800 mb-3 bg-purple-100 border-none focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
                        value={userAnswers[index]}
                        onInput={autoResize}
                        onChange={(e) =>
                          handleQuestionCompletion(index, e.target.value)
                        }
                        placeholder="Your answer..."
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DoingQuizSet;
