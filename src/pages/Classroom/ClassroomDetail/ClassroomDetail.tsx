import { useEffect, useState } from "react";

import { FaCaretDown, FaCaretUp, FaChalkboardTeacher } from "react-icons/fa";
import { GrTest } from "react-icons/gr";
import SideInformation from "./components/SideInformation";
import { useNavigate, useParams } from "react-router";
import StartQuizModal from "./components/StartQuizModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImFilesEmpty } from "react-icons/im";
import classroomService from "../services/classroomService";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import { IoMdSettings } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { Menu } from "@headlessui/react";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import AdjustQuizSettingModal from "./components/AdjustQuizSettingsModal";

export const formatDuration = (durationInSeconds: number) => {
  if (!durationInSeconds || durationInSeconds <= 0) return "No limit"; // Nếu không có thời gian, trả về "No limit"
  const days = Math.floor(durationInSeconds / (24 * 3600)); // Tính số ngày
  const hours = Math.floor((durationInSeconds % (24 * 3600)) / 3600); // Tính số giờ
  const minutes = Math.floor((durationInSeconds % 3600) / 60); // Tính số phút
  const seconds = durationInSeconds % 60; // Tính số giây

  let daysTime = "";
  let hoursTime = "";
  let minutesTime = "";
  let secondsTime = "";

  if (days > 0) {
    daysTime = `${days} day${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    hoursTime = `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    minutesTime = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  if (seconds > 0) {
    secondsTime = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  const durationTime =
    `${daysTime} ${hoursTime} ${minutesTime} ${secondsTime}`.trim();

  return durationTime;
};

// Hàm để tính ngày bắt đầu và ngày kết thúc trong tuần từ ngày createdAt
const getWeekStartAndEnd = (date: any) => {
  const startDate = new Date(date);
  const dayOfWeek = startDate.getDay();

  // Tính ngày chủ nhật (ngày cuối tuần)
  const sunday = new Date(startDate);
  sunday.setDate(startDate.getDate() - dayOfWeek + 6);

  // Tính ngày thứ hai (ngày đầu tuần)
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - dayOfWeek);

  return { monday, sunday };
};

// Hàm để phân loại dữ liệu theo tuần
const groupByWeek = (data: { createdAt: string }[]) => {
  const groupedData: Record<string, any[]> = {};

  data.forEach((item) => {
    const { monday, sunday } = getWeekStartAndEnd(item.createdAt);
    const weekKey = `${monday.getDate()}-${
      monday.getMonth() + 1
    }-${monday.getFullYear()} - ${sunday.getDate()}-${
      sunday.getMonth() + 1
    }-${sunday.getFullYear()}`;

    if (!groupedData[weekKey]) {
      groupedData[weekKey] = [];
    }

    groupedData[weekKey].push(item);
  });

  return groupedData;
};

function ClassroomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isStartQuizModalOpen, setIsStartQuizModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    message: "Do you want to start the quiz?",
    buttonText: "Start",
  });
  // Modal xóa lecture
  const [isDeleteLectureModalOpen, setIsDeleteLectureModalOpen] =
    useState(false);
  // Modal xóa quiz
  const [isDeleteQuizModalOpen, setIsDeleteQuizModalOpen] = useState(false);
  // Modal thay đổi settings của quiz
  const [isChangeQuizSettingsModalOpen, setIsChangeQuizSettingsModalOpen] =
    useState(false);
  // Lecture được chọn
  const [selectedLecture, setSelectedLecture] = useState({} as any);
  // Quiz được chọn
  const [selectedQuiz, setSelectedQuiz] = useState({} as any);
  // Thông tin class
  const [classroomInfo, setClassroomInfo] = useState<any>({});
  // Quizzes, lectures của class
  const [classroomMaterials, setClassroomMaterials] = useState([] as any[]);
  const [quizStatuses, setQuizStatuses] = useState<Record<string, any>>(
    {} as any
  ); // Lưu trạng thái các quiz
  const [groupedData, setGroupedData] = useState(
    groupByWeek(classroomMaterials)
  );
  const [openWeek, setOpenWeek] = useState<Record<string, boolean>>({});

  const { data: materials = [] } = useQuery({
    queryKey: ["classroomMaterials", id],
    queryFn: async () => {
      if (!id) return {};
      const response = await classroomService.getClassroomMaterialsById(id);
      setClassroomMaterials(response);
      setGroupedData(groupByWeek(response));
      return response || {};
    },
    enabled: !!id,
  });

  const { data: classroomData } = useQuery({
    queryKey: ["classroom", id],
    queryFn: async () => {
      if (!id) return {};
      const response = await classroomService.getClassroomById(id);
      setClassroomInfo(response);
      return response || {};
    },
    enabled: !!id,
  });

  useEffect(() => {
    // Lấy trạng thái quiz cho tất cả quiz ngay khi mount
    const fetchQuizStatuses = async () => {
      try {
        const statuses: Record<string, any> = {};
        // Duyệt qua tất cả các quiz trong classroomMaterials
        for (const item of classroomMaterials) {
          if (item.quizId) {
            console.log(item);
            const response =
              await classroomService.getAnswerStatusByClassroomQuizId(item._id);
            statuses[item._id] = {
              status: response?.studentAnswerStatus,
              studentAnswerId: response?.studentAnswerId,
            }; // Gán trạng thái vào quiz
          }
        }
        setQuizStatuses(statuses);
      } catch (error) {
        console.error("Error fetching quiz statuses:", error);
      }
    };

    fetchQuizStatuses();
  }, [classroomMaterials]);

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    Object.keys(groupedData).forEach((weekKey) => {
      initialOpenState[weekKey] = true; // Mở tất cả các tuần
    });
    setOpenWeek(initialOpenState);
  }, [groupedData]);

  const toggleWeek = (weekKey: string | number) => {
    setOpenWeek((prev) => ({
      ...prev,
      [weekKey]: !prev[weekKey],
    }));
  };

  const handleOpenStartQuizModal = async (item: any) => {
    if (classroomInfo?.userId?._id !== user?.id) {
      const currentTime = Date.now();
      if (item.endTime && currentTime > new Date(item.endTime).getTime()) {
        showToast("warning", "Quiz has expired!");
        return;
      }
      if (item.startTime && currentTime < new Date(item.startTime).getTime()) {
        showToast("warning", "Quiz has not opened yet!");
        return;
      }
    }

    try {
      const studentAnswerStatus = quizStatuses[item._id].status;
      console.log("Student answer status:", studentAnswerStatus);
      switch (studentAnswerStatus) {
        case "not started":
          setModalMessage({
            message: "Do you want to start the quiz?",
            buttonText: "Start",
          });
          break;
        case "disconnected":
        case "in-progress":
          setModalMessage({
            message: "You are doing this quiz. Would you like to continue?",
            buttonText: "Continue",
          });
          break;
        case "submitted":
        case "graded":
          setModalMessage({
            message: "Quiz submitted. Would you like to review your work?",
            buttonText: "Review",
          });
          break;
        default:
          setModalMessage({
            message: "Do you want to start the quiz?",
            buttonText: "Start",
          });
          break;
      }
      setSelectedQuiz(item);
      setIsStartQuizModalOpen(true);
      console.log(item);
    } catch (error) {
      console.error("Error opening quiz modal:", error);
    }
  };

  const handleStartTest = useMutation({
    mutationFn: async () => {
      if (modalMessage.buttonText === "Start") {
        const classroomQuizId = selectedQuiz._id;
        const response = await classroomService.startQuiz(classroomQuizId);
        navigate(`/classroom/doing-quiz/${response.studentAnswerId}`);
      } else {
        navigate(
          `/classroom/doing-quiz/${
            quizStatuses[selectedQuiz._id].studentAnswerId
          }`
        );
      }
    },
    onError: (error) => {
      console.error("Error starting quiz:", error);
    },
  });

  const handleDeleteClassroomLecture = useMutation({
    mutationFn: async () => {
      const response = await classroomService.deleteClassroomQuiz(
        selectedLecture._id
      );
      console.log(response);
      showToast("success", "Lecture deleted successfully!");
      setClassroomMaterials((prev) =>
        prev.filter((item) => item._id !== selectedLecture._id)
      );
    },
    onError: () => {
      showToast("error", "Failed to delete lecture. Please try again later.");
    },
  });

  const handleDeleteClassroomQuiz = useMutation({
    mutationFn: async () => {
      const response = await classroomService.deleteClassroomQuiz(
        selectedQuiz._id
      );
      console.log(response);
      showToast("success", "Quiz deleted successfully!");
      setClassroomMaterials((prev) =>
        prev.filter((item) => item._id !== selectedQuiz._id)
      );
    },
    onError: () => {
      showToast("error", "Failed to delete quiz. Please try again later.");
    },
  });

  return (
    <>
      <StartQuizModal
        open={isStartQuizModalOpen}
        setOpen={setIsStartQuizModalOpen}
        quizInfo={selectedQuiz}
        message={modalMessage}
        handleStartTest={() => handleStartTest.mutate()}
      />
      <DeleteModal
        open={isDeleteLectureModalOpen}
        setOpen={setIsDeleteLectureModalOpen}
        modalInformation={{
          title: "Remove Lecture",
          content: `Are you sure you want to remove this lecture from classroom? This action is permanent and cannot be undone.`,
        }}
        disabledButton={handleDeleteClassroomLecture.isPending}
        handleDelete={() => {
          handleDeleteClassroomLecture.mutate();
        }}
      />
      <DeleteModal
        open={isDeleteQuizModalOpen}
        setOpen={setIsDeleteQuizModalOpen}
        modalInformation={{
          title: "Remove Quiz",
          content: `Are you sure you want to remove this quiz from classroom? This action is permanent and cannot be undone.`,
        }}
        disabledButton={handleDeleteClassroomQuiz.isPending}
        handleDelete={() => {
          handleDeleteClassroomQuiz.mutate();
        }}
      />
      <AdjustQuizSettingModal
        open={isChangeQuizSettingsModalOpen}
        setOpen={setIsChangeQuizSettingsModalOpen}
        quizInfo={selectedQuiz}
        classroomId={id!}
      />
      <div className="md:px-10 lg:px-16 xl:px-24 py-10 flex flex-col-reverse md:flex-row">
        <div className="w-full px-10 sm:px-20 md:px-0 md:w-[60%] xl:w-2/3">
          {Object.keys(groupedData).map((weekKey) => (
            <div key={weekKey} className="mb-6">
              <div
                className="flex items-center gap-4 cursor-pointer pb-2 border-b border-b-gray-300"
                onClick={() => toggleWeek(weekKey)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  {openWeek[weekKey] ? (
                    <FaCaretUp className="text-xl text-gray-600" />
                  ) : (
                    <FaCaretDown className="text-xl text-gray-600" />
                  )}
                </div>
                <div className="font-semibold text-gray-700 text-lg">
                  {weekKey}
                </div>
              </div>
              <div
                className={`transition-all duration-700 ease-in-out pb-10${
                  openWeek[weekKey] ? "max-h-[500px]" : "max-h-0" // Đặt max height nếu mở
                }`}
              >
                {openWeek[weekKey] && (
                  <div className="mt-4">
                    {groupedData[weekKey].map((item) => (
                      <div key={item._id} className="mb-4">
                        {item.quizId ? (
                          <div
                            className="group relative flex items-center w-full p-4 bg-gray-50 border border-gray-200 shadow-md rounded-md cursor-pointer"
                            onClick={() => handleOpenStartQuizModal(item)}
                          >
                            {user?.id === classroomInfo?.userId?._id && (
                              <Menu as="div" className="absolute top-3 right-3">
                                <Menu.Button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 bg-teal-200/80 border border-teal-200 rounded-md hover:scale-105"
                                >
                                  <IoMdSettings className="text-lg text-teal-800" />
                                </Menu.Button>

                                <Menu.Items
                                  transition
                                  anchor="bottom start"
                                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                >
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsChangeQuizSettingsModalOpen(
                                              true
                                            );
                                            setSelectedQuiz(item);
                                          }}
                                          className={`${
                                            active ? "bg-gray-100" : ""
                                          } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                                        >
                                          <IoMdSettings className="text-md" />
                                          Adjust settings
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteQuizModalOpen(true);
                                            setSelectedQuiz(item);
                                          }}
                                          className={`${
                                            active ? "bg-gray-100" : ""
                                          } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                                        >
                                          <MdDeleteOutline className="text-md" />
                                          Remove
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Menu>
                            )}
                            <div>
                              <div className="p-4 bg-teal-200 border border-teal-300 rounded-md mr-5">
                                <GrTest className="text-2xl text-teal-900" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-md font-medium mb-1">
                                {item?.quizId.quizName}
                              </p>
                              {!item.startTime && !item.endTime ? (
                                <></>
                              ) : (
                                <p className="text-sm text-gray-600">
                                  Open within:{" "}
                                  {item?.startTime
                                    ? new Date(item?.startTime)?.toLocaleString(
                                        "vi-VN"
                                      )
                                    : "~"}{" "}
                                  -{" "}
                                  {new Date(item?.endTime)?.toLocaleString(
                                    "vi-VN"
                                  ) ?? "~"}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Time limit:{" "}
                                {formatDuration(item?.duration) ?? "No limit"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="group relative flex items-center w-full p-4 bg-gray-50 border border-gray-200 shadow-md rounded-md cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/lecture/detail/${item.lectureVideoId._id}`,
                                {
                                  state: {
                                    mode: "classroom",
                                  },
                                }
                              );
                            }}
                          >
                            {user?.id === classroomInfo?.userId?._id && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDeleteLectureModalOpen(true);
                                  setSelectedLecture(item);
                                }}
                                className="absolute top-3 right-3 p-1 bg-fuchsia-200/80 border border-fuchsia-200 rounded-md hover:scale-105"
                              >
                                <MdDeleteOutline className="text-lg text-fuchsia-800" />
                              </div>
                            )}
                            <div>
                              <div className="p-4 bg-fuchsia-200 border border-fuchsia-300 rounded-md mr-5">
                                <FaChalkboardTeacher className="text-2xl text-fuchsia-900" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-md font-medium mb-1">
                                {item?.lectureVideoId.lectureName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Uploaded at:{" "}
                                {new Date(item.createdAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {classroomMaterials.length === 0 && (
            <div className="flex items-center justify-center w-full h-28 rounded-xl border border-dashed border-purple-600 bg-purple-200/50 text-purple-800 gap-2">
              <ImFilesEmpty className="text-xl" />
              <p className="text-xl font-semibold"> No materials yet!</p>
            </div>
          )}
        </div>

        <div className="w-full px-10 sm:px-20 md:px-0 mb-10 md:mb-0 md:w-[40%] xl:w-1/3 md:pl-8 lg:pl-16 lg:pr-8">
          <SideInformation
            classroomInfo={classroomInfo}
            setClassroomInfo={setClassroomInfo}
          />
        </div>
      </div>
    </>
  );
}

export default ClassroomDetail;
