import { useEffect, useState } from "react";

import { FaCaretDown, FaCaretUp, FaChalkboardTeacher } from "react-icons/fa";
import { GrTest } from "react-icons/gr";
import SideInformation from "./components/SideInformation";
import { useNavigate, useParams } from "react-router";
import StartQuizModal from "./components/StartQuizModal";
import classroomService from "../services/classroomService";
import { useMutation } from "@tanstack/react-query";

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
  const navigate = useNavigate();
  const [isStartQuizModalOpen, setIsStartQuizModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    message: "Do you want to start the quiz?",
    buttonText: "Start",
  });
  const [selectedQuiz, setSelectedQuiz] = useState({} as any);
  const [classroomInfo, setClassroomInfo] = useState({});

  const [classroomMaterials, setClassroomMaterials] = useState([] as any[]);
  const [quizStatuses, setQuizStatuses] = useState<Record<string, any>>(
    {} as any
  ); // Lưu trạng thái các quiz
  const [groupedData, setGroupedData] = useState(
    groupByWeek(classroomMaterials)
  );
  const [openWeek, setOpenWeek] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      const fetchClassroomMaterials = async () => {
        try {
          const response = await classroomService.getClassroomMaterialsById(id);
          setClassroomMaterials(response);
          setGroupedData(groupByWeek(response));
          console.log(response);
        } catch (error) {
          console.error("Error fetching classroom materials:", error);
        }
      };

      const fetchClassroomInfo = async () => {
        try {
          const response = await classroomService.getClassroomById(id);
          setClassroomInfo(response);
          console.log(response);
        } catch (error) {
          console.error("Error fetching classroom info:", error);
        }
      };

      fetchClassroomMaterials();
      fetchClassroomInfo();
    }
  }, [id]);

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

  return (
    <>
      <StartQuizModal
        open={isStartQuizModalOpen}
        setOpen={setIsStartQuizModalOpen}
        quizInfo={selectedQuiz}
        message={modalMessage}
        handleStartTest={() => handleStartTest.mutate()}
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
                            className="flex items-center w-full p-4 bg-gray-50 border border-gray-200 shadow-md rounded-md cursor-pointer"
                            onClick={() => handleOpenStartQuizModal(item)}
                          >
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
                            className="flex items-center w-full p-4 bg-gray-50 border border-gray-200 shadow-md rounded-md cursor-pointer"
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
