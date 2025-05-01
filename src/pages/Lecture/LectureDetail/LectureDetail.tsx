import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import lectureVideoService from "../../LectureTools/services/lectureVideoService";
import Notebook from "./components/Notebook/Notebook";
import { motion } from "framer-motion";
import { FaBook, FaRegFilePowerpoint, FaTimes } from "react-icons/fa";
import ChatBot from "../../../components/ChatBot/ChatBot";
import { useHeader } from "../../../hooks/useHeader";
import { useToast } from "../../../hooks/useToast";
import { IoShareSocial } from "react-icons/io5";
import { Tooltip } from "flowbite-react";
import { BiSolidRename } from "react-icons/bi";
import {
  MdDeleteForever,
  MdOutlineDelete,
  MdOutlineQuiz,
} from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import ShareUserModal from "../../../components/ShareUserModal/ShareUserModal";
import RenameModal from "../components/RenameModal";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import uploadedSlideService from "../../../services/uploadedSlideService";
import { useAuth } from "../../../hooks/useAuth";

function LectureDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const { setHeaderClass } = useHeader();
  const [lectureVideo, setLectureVideo] = useState<any>({});
  const [lectureScriptId, setLectureScriptId] = useState<string>("");
  const [lectureScript, setLectureScript] = useState<any>({});
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(new Set<number>());
  // Modal share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [listPermissions, setListPermissions] = useState<any[]>([]);
  // Modal rename
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  // Modal delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Current user permission
  const [userPermission, setUserPermission] = useState("");

  useEffect(() => {
    setHeaderClass("bg-white shadow-none");
  });

  useEffect(() => {
    const fetchLectureVideo = async () => {
      try {
        if (id) {
          const response = await lectureVideoService.getLectureVideo(id);
          const lectureScript = response.lectureScriptId.lectureScript.slides;

          setLectureScriptId(response?.lectureScriptId?._id);
          setLectureScript(lectureScript);
          setLectureVideo(response);
          console.log(response);
          setUserPermission(response.permissionType);
        }
      } catch (error: any) {
        console.error("Failed to get lecture video:", error);
      }
    };

    fetchLectureVideo();
  }, [id]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const timestamps = lectureVideo.quizTimestamps || [];
    let newIndex = 0;

    for (let i = 0; i < timestamps.length; i++) {
      if (
        currentTime >= timestamps[i] &&
        (i === timestamps.length - 1 || currentTime < timestamps[i + 1])
      ) {
        newIndex = i + 1; // Fix script index khớp với slide
      }
    }

    if (newIndex !== currentScriptIndex && newIndex < lectureScript.length) {
      setCurrentScriptIndex(newIndex);
    }

    if (
      lectureScript[newIndex - 1]?.quiz &&
      currentTime >= timestamps[newIndex - 1] && // Fix quiz xuất hiện đúng thời điểm
      !quizAnswered.has(newIndex) &&
      !showQuiz
    ) {
      console.log("Pausing video for quiz...");
      videoRef.current.pause();
      setShowQuiz(true);
      setQuizAnswered((prev) => new Set(prev).add(newIndex));
    }
  };

  useEffect(() => {
    if (showQuiz && videoRef.current) {
      videoRef.current.pause();
    }
  }, [showQuiz]);

  const handleAnswerSelect = (option: string) => {
    if (!showQuiz || selectedOption) return;

    setSelectedOption(option);
    setTimeout(() => {
      setShowQuiz(false);
      setSelectedOption(null);
      videoRef.current?.play();
    }, 3000);
  };

  const handleOpenShare = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const response = await lectureVideoService.getLectureVideoPermissions(id);
      setListPermissions(response || []);
      setIsShareModalOpen(true);
    },
  });

  const handleRenameSuccess = (newName: string) => {
    setLectureVideo((prev: any) => ({ ...prev, lectureName: newName }));
    setIsRenameModalOpen(false);
    showToast("success", "Rename successfully!");
  };

  const handleDeleteLecture = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await lectureVideoService.deleteLectureVideo(id);
      showToast("success", "Delete successfully!");
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      navigate("/storage");
    },
  });

  const handleDownloadOriginalFile = useMutation({
    mutationFn: async () => {
      const response = await uploadedSlideService.downloadSlide(
        lectureVideo.fileId
      );
      showToast("success", "Download successfully!");
    },
  });
  return (
    <>
      <ShareUserModal
        type="lecture-video"
        open={isShareModalOpen}
        setOpen={setIsShareModalOpen}
        selectedItem={lectureVideo}
        listPermissions={listPermissions}
      />
      <RenameModal
        open={isRenameModalOpen}
        setOpen={setIsRenameModalOpen}
        selectedLecture={lectureVideo}
        onRenameSuccess={handleRenameSuccess}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete Lecture Video",
          content: "Are you sure you want to delete this lecture?",
        }}
        handleDelete={() => handleDeleteLecture.mutate(id ?? lectureVideo._id)}
      />
      <div className="flex flex-col w-full">
        <div className="relative flex w-full h-full">
          {/* VIDEO LECTURE */}
          <motion.div
            animate={{
              width: isNotebookOpen ? "60%" : "100%",
            }}
            transition={{ duration: 0 }}
            className={`flex flex-col gap-6 ${isNotebookOpen ? "" : "p-8"}`}
          >
            <div
              className={`flex items-center justify-center relative w-full overflow-hidden ${
                isNotebookOpen ? "rounded-none" : "rounded-lg"
              }`}
            >
              <video
                ref={videoRef}
                src={lectureVideo.videoUrl}
                className={`${
                  isNotebookOpen
                    ? "w-full rounded-none"
                    : "md:w-[60%] rounded-lg"
                }`}
                controls
                onTimeUpdate={handleTimeUpdate}
                onSeeked={handleTimeUpdate}
              ></video>
            </div>
            <div className="md:ml-6 flex flex-col gap-3">
              <p className="font-semibold text-2xl">
                {lectureVideo.lectureName || "Lecture Video"}
              </p>
              <div
                className={`flex items-center justify-between ${
                  isNotebookOpen ? "mr-6" : "md:mr-20"
                }`}
              >
                <div className="inline-flex items-center text-sm">
                  <p className="font-medium">Created At:&nbsp;</p>
                  <p className="text-gray-600">
                    {new Date(lectureVideo.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="inline-flex gap-2 items-center">
                  {(userPermission === "EDITOR" ||
                    user?.id === lectureVideo.userId) && (
                    <>
                      <Tooltip content="Share">
                        <div
                          onClick={() => handleOpenShare.mutate()}
                          className="p-1.5 rounded-md bg-green-600/90 hover:bg-green-600 cursor-pointer"
                        >
                          <IoShareSocial className="text-white text-xl" />
                        </div>
                      </Tooltip>
                      <Tooltip content="Rename">
                        <div
                          onClick={() => setIsRenameModalOpen(true)}
                          className="p-1.5 rounded-md bg-violet-600 hover:bg-violet-700 cursor-pointer"
                        >
                          <BiSolidRename className="text-white text-xl" />
                        </div>
                      </Tooltip>
                      <Tooltip content="Edit Quiz">
                        <a
                          target="_blank"
                          href={`/lecture/edit-quiz/${lectureScriptId}`}
                        >
                          <div className="p-1.5 rounded-md bg-gray-600 hover:bg-gray-700 cursor-pointer">
                            <MdOutlineQuiz className="text-white text-xl" />
                          </div>
                        </a>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip content="Download Original File">
                    <button
                      disabled={handleDownloadOriginalFile.isPending}
                      onClick={() => handleDownloadOriginalFile.mutate()}
                      className="p-1.5 rounded-md bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                    >
                      <FaRegFilePowerpoint className="text-white text-xl" />
                    </button>
                  </Tooltip>
                  {user?.id === lectureVideo.userId && (
                    <Tooltip content="Delete">
                      <div
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-1 rounded-md bg-red-700 hover:bg-red-800 cursor-pointer"
                      >
                        <MdOutlineDelete className="text-white text-2xl" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            {/* SCRIPT HIỂN THỊ THEO SLIDE */}
            <div
              className={`p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300 md:ml-6 ${
                isNotebookOpen ? "mx-6 mb-20" : "md:mr-20 mb-20"
              }`}
            >
              <p className="text-lg font-semibold">Lecture Script:</p>
              <p className="mt-2 text-gray-700">
                {lectureScript[currentScriptIndex]?.script || "Loading..."}
              </p>
            </div>
          </motion.div>

          {/* MODAL QUIZ */}
          {showQuiz && lectureScript[currentScriptIndex - 1]?.quiz && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-xl shadow-lg w-[650px]">
                <p className="text-lg font-semibold text-center">
                  {lectureScript[currentScriptIndex - 1].quiz.question}
                </p>
                {selectedOption ===
                lectureScript[currentScriptIndex - 1]?.quiz?.answer ? (
                  <p
                    className={`${
                      selectedOption ? "block" : "hidden"
                    } text-green-600 font-medium my-1`}
                  >
                    Congratulations! You has answered correctly.
                  </p>
                ) : (
                  <p
                    className={`${
                      selectedOption ? "block" : "hidden"
                    } text-red-600 font-medium my-1`}
                  >
                    Incorrect answer! Try again next time.
                  </p>
                )}
                <div className="mt-3 space-y-2">
                  {lectureScript[currentScriptIndex - 1].quiz.options.map(
                    (option: string, idx: number) => (
                      <button
                        key={idx}
                        className={`block w-full p-3 border rounded-md text-left cursor-pointer transition ${
                          selectedOption
                            ? option ===
                              lectureScript[currentScriptIndex - 1].quiz.answer
                              ? "bg-green-500 text-white"
                              : selectedOption === option
                              ? "bg-red-500 text-white"
                              : "bg-gray-100"
                            : "bg-gray-100"
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={selectedOption !== null}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FLOAT BUTTON (Toggle Notebook) */}
          {!isNotebookOpen && (
            <motion.button
              onClick={() => setIsNotebookOpen(true)}
              whileHover={{ scale: 1.1 }}
              className="fixed bottom-20 md:bottom-24 right-6 w-10 h-10 md:w-14 md:h-14 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sky-700 transition z-50"
            >
              <FaBook className="text-lg md:text-2xl" />
            </motion.button>
          )}

          {/* NOTEBOOK */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isNotebookOpen ? "0%" : "100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`fixed right-0 top-header w-full md:w-[40%] h-full-screen bg-white shadow-lg transition-all ${
              isNotebookOpen ? "block" : "hidden"
            }`}
          >
            {/* CLOSE BUTTON (Inside Notebook) */}
            {isNotebookOpen && (
              <motion.button
                onClick={() => setIsNotebookOpen(false)}
                whileHover={{ scale: 1.1 }}
                className="absolute top-4 right-4 p-2 text-gray-700 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition"
              >
                <FaTimes size={20} />
              </motion.button>
            )}
            <Notebook />
          </motion.div>

          {/* CHATBOT */}
          <ChatBot lectureScriptId={lectureScriptId} />
        </div>
      </div>
    </>
  );
}

export default LectureDetail;
