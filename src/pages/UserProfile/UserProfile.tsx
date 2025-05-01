import { useEffect, useState } from "react";
import {
  FaUser,
  FaClock,
  FaVideo,
  FaFileAlt,
  FaQuestion,
  FaExternalLinkAlt,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPhoneAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import userService from "../../services/userSevice";
import lectureVideoService from "../LectureTools/services/lectureVideoService";
import quizService from "../Quiz/services/quizService";
import { MdPlayLesson, MdQuiz } from "react-icons/md";
import { Avatar } from "flowbite-react";

interface UserType {
  _id: string;
  fullName: string;
  email: string;
  account: string;
  avatarUrl: string | null;
  profile: ProfileType | null;
  createdAt: string;
}

interface ProfileType {
  _id: string;
  userId: string;
  bio: string;
  dateOfBirth: string | null;
  phoneNumber: string;
  isPublic: boolean;
}

interface LectureVideoType {
  _id: string;
  userId: string;
  lectureName: string;
  languageCode: string;
  voiceType: string;
  lectureSpeed: string;
  videoUrl: string;
  quizTimestamps: number[];
  interactiveQuiz: boolean;
  isPublic: boolean;
  createdAt: string;
}

interface QuizType {
  _id: string;
  userId: string;
  topic?: string;
  documentText?: string;
  fileUrl?: string;
  lectureVideoId?: string;
  quizName: string;
  academicLevel: string;
  language: string;
  questionType: string;
  isPublic: boolean;
  createdAt: string;
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [lectureVideos, setLectureVideos] = useState<LectureVideoType[]>([]);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [activeTab, setActiveTab] = useState<"videos" | "quizzes">("videos");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUserById = async () => {
      const response = await userService.getUserById(id!);
      setUser(response);
    };

    const fetchLectureVideosByUserId = async () => {
      const response = await lectureVideoService.getPublicLectureVideosByUserId(
        id!
      );
      setLectureVideos(response.data);
    };

    const fetchQuizzesByUserId = async () => {
      const response = await quizService.getPublicQuizzesByUserId(id!);
      setQuizzes(response.data);
    };

    fetchUserById();
    fetchLectureVideosByUserId();
    fetchQuizzesByUserId();
  }, [id]);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full-screen bg-gray-50">
        <div className="text-purple-600 text-xl">Loading profile...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Lấy danh sách video và quiz hiện tại dựa trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = lectureVideos.slice(indexOfFirstItem, indexOfLastItem);
  const currentQuizzes = quizzes.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán số trang cho video và quiz
  const totalVideosPages = Math.ceil(lectureVideos.length / itemsPerPage);
  const totalQuizzesPages = Math.ceil(quizzes.length / itemsPerPage);
  const totalPages =
    activeTab === "videos" ? totalVideosPages : totalQuizzesPages;

  // Chuyển trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-full-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                {user.avatarUrl ? (
                  <Avatar img={user.avatarUrl} rounded size="xl" />
                ) : (
                  <Avatar rounded size="xl" />
                )}
                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-purple-600">@{user.account}</p>
              </div>

              {/* Bio */}
              {user.profile && (
                <div className="mb-6">
                  <p className="text-gray-600 whitespace-pre-line">
                    {user.profile.bio}
                  </p>
                </div>
              )}

              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                {user.profile?.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <FaPhoneAlt className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{user.profile.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <MdPlayLesson className="mr-2 h-4 w-4 text-purple-500" />
                  <span>{lectureVideos.length} public lecture videos</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MdQuiz className="mr-2 h-4 w-4 text-purple-500" />
                  <span>{quizzes.length} public quizzes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:w-2/3">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "videos"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
                onClick={() => setActiveTab("videos")}
              >
                Lecture Videos
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "quizzes"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
                onClick={() => setActiveTab("quizzes")}
              >
                Quizzes
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "videos" ? (
              <div className="space-y-4">
                {currentVideos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {video.lectureName}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {video.languageCode === "vi"
                              ? "Vietnamese"
                              : "English"}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {video.voiceType.charAt(0).toUpperCase() +
                              video.voiceType.slice(1)}{" "}
                            Voice
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {video.lectureSpeed.charAt(0).toUpperCase() +
                              video.lectureSpeed.slice(1)}{" "}
                            Speed
                          </span>
                          {video.interactiveQuiz && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                              Interactive Quiz
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Created on {formatDate(video.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/lecture/detail/${video._id}`)}
                        className="flex items-center text-purple-600 hover:text-purple-800"
                      >
                        <FaExternalLinkAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalVideosPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 mx-1 rounded ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: totalVideosPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 mx-1 rounded ${
                            currentPage === index + 1
                              ? "bg-purple-600 text-white"
                              : "text-purple-600 hover:bg-purple-100"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalVideosPages}
                        className={`px-2 py-1 mx-1 rounded ${
                          currentPage === totalVideosPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {currentQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {quiz.quizName}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {quiz.language}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {quiz.academicLevel}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                            {quiz.questionType}
                          </span>
                          {quiz.topic && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                              Topic-based
                            </span>
                          )}
                          {quiz.lectureVideoId && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                              Video-based
                            </span>
                          )}
                          {quiz.documentText && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                              Document-based
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Created on {formatDate(quiz.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                        className="flex items-center text-purple-600 hover:text-purple-800"
                      >
                        <FaExternalLinkAlt className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalQuizzesPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 mx-1 rounded ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: totalQuizzesPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 mx-1 rounded ${
                            currentPage === index + 1
                              ? "bg-purple-600 text-white"
                              : "text-purple-600 hover:bg-purple-100"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalQuizzesPages}
                        className={`px-2 py-1 mx-1 rounded ${
                          currentPage === totalQuizzesPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
