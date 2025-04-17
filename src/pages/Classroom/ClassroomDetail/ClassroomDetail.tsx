import { useEffect, useState } from "react";

import { FaCaretDown, FaCaretUp, FaChalkboardTeacher } from "react-icons/fa";
import { GrTest } from "react-icons/gr";
import SideInformation from "./components/SideInformation";
import { useNavigate } from "react-router";
import StartQuizModal from "./components/StartQuizModal";

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
  const navigate = useNavigate();
  const [isStartQuizModalOpen, setIsStartQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState();
  const [classroomInfo, setClassroomInfo] = useState({
    _id: "67feb30f6ad903b1e114bc0e",
    classroomName: "INT2201 - Cấu trúc dữ liệu và Giải thuật (2025-2026)",
    userId: {
      _id: "67c35cca742cf7772ee0e8c8",
      fullName: "Nguyen Huong Thao",
      email: "291thao@gmail.com",
      account: "maiconht",
    },
    students: ["67e156e12a0b77e87653a0af"],
    createdAt: "2025-04-15T19:27:11.343Z",
    updatedAt: "2025-04-15T19:32:45.062Z",
    __v: 1,
  });

  const [classroomMaterials, setClassroomMaterials] = useState([
    {
      _id: "67feb645cf0b551c9b50d7ec",
      classroomId: "67feb30f6ad903b1e114bc0e",
      quizId: {
        _id: "67fd1883e14ec39018f66ec4",
        quizName: "Clustal Omega",
      },
      startTime: "2025-03-02T02:46:17.456Z",
      endTime: "2025-05-02T02:46:17.456Z",
      __v: 0,
      createdAt: "2025-03-29T19:40:53.389Z",
      updatedAt: "2025-04-15T19:40:53.389Z",
    },
    {
      _id: "67feb702ca170408aaacee19",
      classroomId: "67feb30f6ad903b1e114bc0e",
      lectureVideoId: {
        _id: "67f2a3dcfd3534a7c8456174",
        lectureName: "Quản lý dữ liệu trong Docker: Volumes và Bind Mounts",
      },
      lectureScriptId: "67f2a15ffd3534a7c8456168",
      __v: 0,
      createdAt: "2025-04-01T19:44:02.977Z",
      updatedAt: "2025-04-15T19:44:02.977Z",
    },
    {
      _id: "67feb645cf0b551c9b50d7ed",
      classroomId: "67feb30f6ad903b1e114bc0e",
      quizId: {
        _id: "67fccfd441bfced4428b2dd9",
        quizName: "Bài tập Xác suất (lớp 12)",
      },
      duration: 3600,
      __v: 0,
      createdAt: "2025-04-09T19:40:53.389Z",
      updatedAt: "2025-04-15T19:40:53.389Z",
    },
    {
      _id: "67feb702ca170408aaacee19",
      classroomId: "67feb30f6ad903b1e114bc0e",
      lectureVideoId: {
        _id: "67f2a3dcfd3534a7c8456174",
        lectureName: "Quản lý dữ liệu trong Docker: Volumes và Bind Mounts",
      },
      lectureScriptId: "67f2a15ffd3534a7c8456168",
      __v: 0,
      createdAt: "2025-04-15T19:44:02.977Z",
      updatedAt: "2025-04-15T19:44:02.977Z",
    },
    {
      _id: "67feb645cf0b551c9b50d7ec",
      classroomId: "67feb30f6ad903b1e114bc0e",
      quizId: {
        _id: "67fd1883e14ec39018f66ec4",
        quizName: "Clustal Omega",
      },
      startTime: "2025-03-02T02:46:17.456Z",
      endTime: "2025-05-02T02:46:17.456Z",
      __v: 0,
      createdAt: "2025-04-06T19:40:53.389Z",
      updatedAt: "2025-04-15T19:40:53.389Z",
    },
    {
      _id: "67feb645cf0b551c9b50d7ed",
      classroomId: "67feb30f6ad903b1e114bc0e",
      quizId: {
        _id: "67fccfd441bfced4428b2dd9",
        quizName: "Bài tập Xác suất (lớp 12)",
      },
      duration: 3600,
      __v: 0,
      createdAt: "2025-04-09T19:40:53.389Z",
      updatedAt: "2025-04-15T19:40:53.389Z",
    },

    {
      _id: "67feb702ca170408aaacee19",
      classroomId: "67feb30f6ad903b1e114bc0e",
      lectureVideoId: {
        _id: "67f2a3dcfd3534a7c8456174",
        lectureName: "Quản lý dữ liệu trong Docker: Volumes và Bind Mounts",
      },
      lectureScriptId: "67f2a15ffd3534a7c8456168",
      __v: 0,
      createdAt: "2025-04-20T19:44:02.977Z",
      updatedAt: "2025-04-15T19:44:02.977Z",
    },
  ]);
  const [groupedData, setGroupedData] = useState(
    groupByWeek(classroomMaterials)
  );

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    Object.keys(groupedData).forEach((weekKey) => {
      initialOpenState[weekKey] = true; // Mở tất cả các tuần
    });
    setOpenWeek(initialOpenState);
  }, [groupedData]);

  const [openWeek, setOpenWeek] = useState<Record<string, boolean>>({});

  const toggleWeek = (weekKey: string | number) => {
    setOpenWeek((prev) => ({
      ...prev,
      [weekKey]: !prev[weekKey],
    }));
  };

  return (
    <>
      <StartQuizModal
        open={isStartQuizModalOpen}
        setOpen={setIsStartQuizModalOpen}
        quizInfo={selectedQuiz}
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
                className={`transition-all duration-700 ease-in-out overflow-hidden ${
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
                            onClick={() => {
                              setIsStartQuizModalOpen(true);
                              setSelectedQuiz(item);
                              console.log(item);
                            }}
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
