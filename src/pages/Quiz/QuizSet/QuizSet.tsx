import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { IoLanguage, IoShareSocialOutline } from "react-icons/io5";
import {
  FaEye,
  FaEyeSlash,
  FaPlay,
  FaPlus,
  FaRegFileAlt,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { AiOutlineNumber } from "react-icons/ai";
import { Avatar, Tooltip } from "flowbite-react";
import { LuClipboardEdit, LuPresentation } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdDoNotDisturb,
  MdFormatListNumbered,
  MdOutlineFileDownload,
} from "react-icons/md";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import ShortAnswerQuiz from "./components/ShortAnswerQuiz";
import MultipleChoiceQuiz from "./components/MultipleChoiceQuiz";
import { QuizQuestion } from "../constants/quiz-data";
import { ExportDocHelper } from "../../../shared/documents/export-docx";
import { Menu } from "@headlessui/react";
import LearningQuiz from "../LearningQuiz/LearningQuiz";
import quizService from "../services/quizService";
import { useToast } from "../../../hooks/useToast";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import { useAuth } from "../../../hooks/useAuth";
import {
  editablePermissionTypes,
  ownerPermissionTypes,
} from "./constants/permission-type";
import EditInfoModal from "./components/EditInfoModal";
import CreateRoomModal from "./components/CreateRoomModal";
import ShareUserModal from "../../../components/ShareUserModal/ShareUserModal";

function capitalizeFirstLetter(str: string) {
  if (typeof str !== "string" || str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

function QuizSet() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [quizSetInfo, setQuizSetInfo] = useState<any>({});
  const [userPermission, setUserPermission] = useState("");
  const [ownerPermission, setOwnerPermission] = useState(false);
  const [isEditQuestion, setIsEditQuestion] = useState<number | null>(null);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [startLearning, setStartLearning] = useState(false);

  // Modal edit Quiz set info
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Modal share quiz
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [listPermissions, setListPermissions] = useState<any[]>([]);
  // Modal delete Quiz set
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Modal create multiple players room
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchQuizData = async () => {
        const response = await quizService.getQuizById(id);
        setQuizData(response.quizData.quizzes);

        if (response.userId) {
          setQuizSetInfo(response);
          if (user && user.id === response.userId._id) {
            setOwnerPermission(true);
            setUserPermission("OWNER");
          } else {
            const permission = await quizService.getCurrentUserPermissionWithQuiz(
              id
            );
            setUserPermission(permission.permissionType);
          }
        }
      };

      // const getUserPermission = async () => {
      //   if (ownerPermission) {
      //   } else {
      //     const response = await quizService.getCurrentUserPermissionWithQuiz(
      //       id
      //     );
      //     setUserPermission(response.permissionType);
      //   }
      // };

      if (state?.message) {
        showToast("success", state.message);
      }

      fetchQuizData();
      // getUserPermission();
    }
  }, [id]);

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [isEditQuestion, quizData]);

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleStopLearning = () => {
    setStartLearning(false);
  };

  // Thêm câu hỏi mới
  const handleAddMultipleChoice = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""], // Reset các options
      answer: "null",
      explanation: "",
      points: 1,
      questionType: "multiple choice",
    } as QuizQuestion;

    setQuizData((prevData) => [...prevData, newQuestion]);
    setIsEditQuestion(quizData.length);
  };

  const handleAddShortAnswer = () => {
    const newQuestion = {
      question: "",
      options: [],
      answer: "",
      explanation: "",
      points: 1,
      questionType: "short answer",
    } as QuizQuestion;

    setQuizData((prevData) => [...prevData, newQuestion]);
    setIsEditQuestion(quizData.length);
  };

  const handleDeleteQuizSet = useMutation({
    mutationFn: async () => {
      if (
        id &&
        (editablePermissionTypes.includes(userPermission) ||
          user?.id === quizSetInfo.userId)
      ) {
        await quizService.deleteQuiz(id);
      }
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        showToast("success", "Delete quiz successfully!");
      }, 1000);
      navigate("/quiz");
    },
    onError: () => {
      setIsDeleteModalOpen(false);
      showToast("error", "Delete quiz unsuccessfully!");
    },
  });

  const handleOpenShare = useMutation({
    mutationFn: async () => {
      const response = await quizService.getQuizPermissions(quizSetInfo._id);
      setListPermissions(response);
      setIsShareModalOpen(true);
    },
  });

  return (
    <>
      {startLearning && (
        <LearningQuiz quizData={quizData} stopLearning={handleStopLearning} />
      )}
      <EditInfoModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        quizSetInfo={quizSetInfo}
        setQuizSetInfo={setQuizSetInfo}
        userPermission={userPermission}
      />
      <ShareUserModal
        type="quiz"
        open={isShareModalOpen}
        setOpen={setIsShareModalOpen}
        selectedItem={quizSetInfo}
        listPermissions={listPermissions}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        disabledButton={handleDeleteQuizSet.isPending}
        modalInformation={{
          title: "Delete quiz",
          content: "Are you sure you want to delete this quiz set?",
        }}
        handleDelete={() => handleDeleteQuizSet.mutate()}
      />
      <CreateRoomModal
        open={isCreateRoomModalOpen}
        setOpen={setIsCreateRoomModalOpen}
      />
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center px-10 md:px-20 lg:px-40 xl:px-72 py-10 md:py-20">
        {/* Quiz information */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg px-8 py-4 w-full mb-8">
          <div className="sm:flex justify-between">
            <h2 className="font-semibold text-md text-gray-700/80">QUIZ</h2>
            <div className="text-base text-gray-700/80">
              Created At:{" "}
              {new Date(quizSetInfo?.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="font-semibold text-2xl text-gray-800 mt-2 mb-5">
            {quizSetInfo?.quizName || "Quiz name"}
          </div>
          <div className="flex flex-wrap flex-col-reverse md:flex-row text-sm">
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              <div className="flex items-center gap-2">
                <HiOutlineAcademicCap className="text-xl text-gray-500" />
                <span className="text-gray-500">
                  {capitalizeFirstLetter(quizSetInfo?.academicLevel)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IoLanguage className="text-xl text-gray-500" />
                <span className="text-gray-500">{quizSetInfo?.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegQuestionCircle className="text-lg text-gray-500" />
                <span className="text-gray-500">
                  {capitalizeFirstLetter(quizSetInfo?.questionType)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AiOutlineNumber className="text-xl text-gray-500" />
                <span className="text-gray-500">
                  {quizData?.length} questions
                </span>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex items-center mb-3 md:justify-start gap-2">
              <Avatar rounded img={quizSetInfo?.userId?.avatarUrl} />
              <div className="flex flex-col text-gray-800">
                <p className="font-semibold">{quizSetInfo?.userId?.fullName}</p>
                <p className="">{quizSetInfo?.userId?.account}</p>
              </div>
            </div>
          </div>

          {/* Function Buttons */}
          <div className="flex justify-end flex-wrap gap-x-3 my-3">
            {(editablePermissionTypes.includes(userPermission) ||
              user?.id === quizSetInfo.userId) && (
              <button
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-purple-700 transition duration-200 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0"
                onClick={() => setIsEditModalOpen(true)}
              >
                <LuClipboardEdit /> Edit
              </button>
            )}
            {(ownerPermissionTypes.includes(userPermission) ||
              user?.id === quizSetInfo.userId) && (
              <button
                onClick={() => handleOpenShare.mutate()}
                className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-green-700 transition duration-200 active:ring-4 active:ring-green-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-green-200 focus:ring-offset-0"
              >
                <IoShareSocialOutline className="text-md" /> Share
              </button>
            )}
            <Menu as="div">
              <Menu.Button className="flex items-center justify-center gap-2 bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md mt-4 hover:bg-gray-400 transition duration-200 active:ring-4 active:ring-gray-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-offset-0">
                <MdOutlineFileDownload className="text-xl" />
                Export
              </Menu.Button>
              <Menu.Items className="absolute mt-2 max-w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                      onClick={() =>
                        ExportDocHelper.QuizDocumentWithAnswer(
                          quizData,
                          quizSetInfo?.quizName
                        )
                      }
                    >
                      <TiSortAlphabeticallyOutline className="text-md" />
                      Quiz with answers
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                      onClick={() =>
                        ExportDocHelper.QuizDocument(
                          quizData,
                          quizSetInfo?.quizName
                        )
                      }
                    >
                      <MdDoNotDisturb className="text-md" />
                      Quiz without answers
                    </button>
                  )}
                </Menu.Item>
                {quizSetInfo?.documentText && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                        onClick={() =>
                          ExportDocHelper.QuizOriginalText(
                            quizSetInfo?.documentText,
                            `${quizSetInfo?.quizName}_Original File`
                          )
                        }
                      >
                        <FaRegFileAlt className="text-sm" />
                        Download original file
                      </button>
                    )}
                  </Menu.Item>
                )}
                {quizSetInfo?.fileUrl && (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={quizSetInfo?.fileUrl}
                        target="_blank"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                      >
                        <FaRegFileAlt className="text-sm" />
                        Open original file
                      </a>
                    )}
                  </Menu.Item>
                )}
              </Menu.Items>
            </Menu>
            {(editablePermissionTypes.includes(userPermission) ||
              user?.id === quizSetInfo.userId) && (
              <button
                className="flex items-center justify-center gap-2 bg-red-600/90 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition duration-200 active:ring-4 active:ring-red-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-red-200 focus:ring-offset-0"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <MdDeleteOutline className="text-xl" /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Play Buttons */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 bg-white border border-gray-200 shadow-lg rounded-lg px-8 py-4 w-full mb-8">
          <button
            className="flex items-center justify-start gap-5 bg-[#8854c0] border-b-4 border-b-[#743bb1] sm:text-xl text-white font-semibold py-4 px-9 rounded-lg shadow-xl hover:bg-[#6f3ca5] transition duration-300 active:translate-y-1 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0"
            onClick={() => setStartLearning(true)}
          >
            <FaPlay className="text-2xl md:text-4xl" />
            <div className="flex flex-col items-start">
              <p className="text-ssm text-gray-100/80">PRACTICE MODE</p>
              <p className="text-lg">Start Quiz</p>
            </div>
          </button>
          <button className="flex items-center justify-start gap-5 bg-[#8854c0] border-b-4 border-b-[#743bb1] sm:text-xl text-white font-semibold py-4 px-9 rounded-lg shadow-xl hover:bg-[#6f3ca5] transition duration-300 active:translate-y-1 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0"
          onClick={() => setIsCreateRoomModalOpen(true)}>
            <LuPresentation className="text-2xl md:text-4xl" />
            <div className="flex flex-col items-start">
              <p className="text-ssm text-gray-100/80">GET LINK AND PLAY</p>
              <p className="text-lg">Multiple Play Mode</p>
            </div>
          </button>
        </div> */}
        <div className="z-40 fixed bottom-6 right-6 md:bottom-10 md:right-10">
          <Tooltip content="Practice Quiz">
            <button
              className="flex items-center justify-center gap-3 bg-[#8854c0] border-b-4 border-b-[#743bb1] text-white font-semibold py-3 px-4 md:py-5 md:px-6 rounded-full shadow-xl hover:bg-[#6f3ca5] transition duration-300 active:translate-y-1 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0"
              onClick={() => setStartLearning(true)}
            >
              <FaPlay className="text-xl sm:text-3xl md:text-4xl" />
            </button>
          </Tooltip>
        </div>

        {/* Quiz Content */}
        <div className="w-full">
          <div className="flex items-center justify-between gap-2 text-base">
            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <MdFormatListNumbered />
              {quizData?.length} questions
            </div>
            <button
              className="flex items-center gap-2 shadow-sm bg-gray-50 border border-gray-300 text-gray-800 font-semibold py-1.5 px-4 rounded-md mb-4 hover:bg-gray-300 transition duration-200 active:ring-4 active:ring-gray-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-offset-0"
              onClick={() => setShowAllAnswers(!showAllAnswers)}
            >
              {showAllAnswers ? (
                <>
                  <FaEyeSlash />
                  Hide answers
                </>
              ) : (
                <>
                  <FaEye />
                  Show answers
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quiz Question Cards */}
        {quizData.map((quiz, index) => {
          switch (quiz.questionType) {
            case "multiple choice":
              return (
                <MultipleChoiceQuiz
                  key={index}
                  index={index}
                  quiz={quiz}
                  isEditQuestion={isEditQuestion}
                  setIsEditQuestion={setIsEditQuestion}
                  quizData={quizData}
                  setQuizData={setQuizData}
                  autoResize={autoResize}
                  showAllAnswers={showAllAnswers}
                  userPermission={userPermission}
                  ownerPermission={ownerPermission}
                />
              );
            case "short answer":
              return (
                <ShortAnswerQuiz
                  key={index}
                  index={index}
                  quiz={quiz}
                  isEditQuestion={isEditQuestion}
                  setIsEditQuestion={setIsEditQuestion}
                  quizData={quizData}
                  setQuizData={setQuizData}
                  autoResize={autoResize}
                  showAllAnswers={showAllAnswers}
                  userPermission={userPermission}
                  ownerPermission={ownerPermission}
                />
              );
            default:
              return null;
          }
        })}
        {(editablePermissionTypes.includes(userPermission) ||
          user?.id === quizSetInfo.userId) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 w-full mb-8">
            <div
              className="relative flex items-center justify-center gap-2 w-full py-4 bg-purple-100 hover:bg-purple-200 border border-dashed border-purple-600 rounded-md cursor-pointer transition-transform duration-500 active:scale-90"
              onClick={handleAddMultipleChoice}
            >
              <FaPlus className="text-purple-600" />
              <p className="font-semibold text-purple-600 text-md">
                Multiple Choice Question
              </p>
            </div>
            <div
              className="relative flex items-center justify-center gap-2 w-full py-4 bg-indigo-100 hover:bg-indigo-200 border border-dashed border-indigo-600 rounded-md cursor-pointer transition-transform duration-500 active:scale-90"
              onClick={handleAddShortAnswer}
            >
              <FaPlus className="text-indigo-600" />
              <p className="font-semibold text-indigo-600 text-md">
                Short Answer Question
              </p>
            </div>
          </div>
        )}

        {/* <div className="w-full flex items-center justify-end gap-2 mb-8">
          <button className="flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-purple-700 transition duration-200 active:ring-4 active:ring-purple-400 active:ring-offset-0 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0">
            Save Quiz
          </button>
        </div> */}
      </div>
    </>
  );
}

export default QuizSet;
