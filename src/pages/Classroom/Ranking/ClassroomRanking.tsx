import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaTrophy,
  FaMedal,
  FaUser,
  FaAngleLeft,
  FaAngleRight,
  FaEye,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import classroomService from "../services/classroomService";
import { Avatar } from "flowbite-react";
import DoingQuizSet from "../ClassroomDetail/components/DoingQuizSet";
import StudentAnswer from "./components/StudentAnswer";
import { useAuth } from "../../../hooks/useAuth";

interface RankingStudent {
  rank: number;
  studentId: string;
  fullName: string;
  account: string;
  email: string;
  avatarUrl: string;
  totalScore: number;
  quizCount: number;
}

interface StudentQuiz {
  studentAnswerId: string;
  quizId: string;
  quizName: string;
  score: number;
  totalScore: number;
  status: string;
  startedAt: string;
  submittedAt: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function ClassroomRanking() {
  const { user } = useAuth();
  const { id: classroomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingStudent[]>([]);
  const [classroom, setClassroom] = useState<any>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<RankingStudent | null>(
    null
  );
  const [studentQuizzes, setStudentQuizzes] = useState<StudentQuiz[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<
    "ranking" | "quizzes" | "quizDetail"
  >("ranking");
  const [selectedQuiz, setSelectedQuiz] = useState<StudentQuiz | null>(null);

  // Pagination states
  const [rankingPagination, setRankingPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [quizzesPagination, setQuizzesPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch classroom ranking data with pagination
  const fetchRankingData = async (page = 1) => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const response = await classroomService.getClassroomRanking(
        classroomId,
        page
      );

      setRankings(response.results);
      setRankingPagination(response.pagination);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch ranking data");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!classroomId) return;

        // Fetch classroom details to determine if user is owner
        const classroomResponse = await classroomService.getClassroomById(
          classroomId
        );
        setClassroom(classroomResponse);

        if (user && classroomResponse.userId._id === user.id) {
          setIsOwner(true);
        }

        // Fetch initial rankings data
        await fetchRankingData(1);
      } catch (err: any) {
        setError(err.message || "Failed to fetch classroom data");
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId, navigate]);

  const handlePageChange = async (page: number) => {
    await fetchRankingData(page);
  };

  const handleViewStudentQuizzes = async (
    student: RankingStudent,
    page = 1
  ) => {
    if (!isOwner || !classroomId) return;

    try {
      setQuizzesLoading(true);
      setSelectedStudent(student);

      const response = await classroomService.getStudentQuizDetails(
        classroomId,
        student.studentId,
        page
      );

      setStudentQuizzes(response.quizzes);
      setQuizzesPagination(response.pagination);
      setViewMode("quizzes");
      setQuizzesLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch student quiz details");
      setQuizzesLoading(false);
    }
  };

  const handleQuizzesPageChange = async (page: number) => {
    if (!selectedStudent || !classroomId) return;

    await handleViewStudentQuizzes(selectedStudent, page);
  };

  const handleViewQuizDetail = (quiz: StudentQuiz) => {
    setSelectedQuiz(quiz);
    setViewMode("quizDetail");
  };

  const handleBackToRanking = () => {
    setViewMode("ranking");
    setSelectedStudent(null);
  };

  const handleBackToQuizzes = () => {
    setViewMode("quizzes");
    setSelectedQuiz(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-xl" />;
    if (rank === 3) return <FaMedal className="text-amber-700 text-xl" />;
    return <span className="font-bold">{rank}</span>;
  };

  // Render pagination controls
  const renderPagination = (
    pagination: Pagination,
    onPageChange: (page: number) => void
  ) => {
    return (
      <div className="flex justify-center items-center mt-4 mb-6 space-x-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-3 py-1 rounded-md ${
            pagination.hasPrevPage
              ? "bg-purple-200 hover:bg-purple-300 text-purple-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaChevronLeft />
        </button>

        {/* Page numbers */}
        <div className="flex space-x-1">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - pagination.currentPage) <= 1
            )
            .map((page, index, array) => {
              // Add ellipsis
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-3 py-1 text-gray-500">...</span>
                    <button
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 hover:bg-purple-200 text-purple-800"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 hover:bg-purple-200 text-purple-800"
                  }`}
                >
                  {page}
                </button>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-3 py-1 rounded-md ${
            pagination.hasNextPage
              ? "bg-purple-200 hover:bg-purple-300 text-purple-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  // Render the students ranking list
  const renderRankingList = () => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-purple-50">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Classroom: {classroom?.classroomName}
          </h2>
          <h2 className="text-lg font-medium text-gray-900">
            Student Rankings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Displaying all students ranked by total score
          </p>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600 bg-red-50">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quizzes Completed
                  </th>
                  {isOwner && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No students have completed any quizzes yet
                    </td>
                  </tr>
                ) : (
                  rankings.map((student) => (
                    <tr
                      key={student.studentId}
                      className={`hover:bg-gray-50 ${
                        student.rank <= 3 ? "bg-purple-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderRankIcon(student.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar img={student.avatarUrl} rounded />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center text-sm font-medium text-gray-900">
                          {student.totalScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center text-sm font-medium text-gray-900">
                          {student.quizCount}
                        </div>
                      </td>
                      {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <p
                            onClick={() => handleViewStudentQuizzes(student)}
                            className="cursor-pointer flex items-center justify-center w-full h-full gap-1 text-purple-600 hover:text-purple-900"
                          >
                            <FaEye /> View Quizzes
                          </p>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination for ranking */}
        {!loading &&
          rankings.length > 0 &&
          renderPagination(rankingPagination, handlePageChange)}
      </div>
    );
  };

  // Render the quizzes for a selected student
  const renderStudentQuizzes = () => {
    if (!selectedStudent) return null;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-purple-50 flex justify-between items-center">
          <div>
            <button
              onClick={handleBackToRanking}
              className="text-purple-600 hover:text-purple-900 flex items-center gap-1 mb-2"
            >
              <FaAngleLeft /> Back to Rankings
            </button>
            <h2 className="text-lg font-medium text-gray-900">
              {selectedStudent.fullName}'s Quizzes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Total Score: {selectedStudent.totalScore} | Quizzes Completed:{" "}
              {selectedStudent.quizCount}
            </p>
          </div>
        </div>

        {quizzesLoading ? (
          <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentQuizzes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No quizzes completed yet
                    </td>
                  </tr>
                ) : (
                  studentQuizzes.map((quiz) => (
                    <tr key={quiz.studentAnswerId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MdQuiz className="mr-2 text-purple-500" />
                          <div className="text-sm font-medium text-gray-900">
                            {quiz.quizName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center text-sm font-medium text-gray-900">
                          {quiz.score} / {quiz.totalScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-lg 
                          ${
                            quiz.status === "graded" ||
                            (quiz.score && quiz.status !== "disconnected")
                              ? "bg-green-100 text-green-800"
                              : quiz.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {quiz.score && quiz.status !== "disconnected"
                            ? "graded"
                            : quiz.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quiz.startedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quiz.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <p
                          onClick={() => handleViewQuizDetail(quiz)}
                          className="cursor-pointer text-purple-600 hover:text-purple-900 flex justify-center items-center gap-1"
                        >
                          <FaEye /> View Details
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination for quizzes */}
        {!quizzesLoading &&
          studentQuizzes.length > 0 &&
          renderPagination(quizzesPagination, handleQuizzesPageChange)}
      </div>
    );
  };

  // Render quiz detail - Shows the DoingQuizSet component
  const renderQuizDetail = () => {
    if (!selectedQuiz) return null;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div className="px-4 py-5 sm:px-6 bg-purple-50">
          <button
            onClick={handleBackToQuizzes}
            className="text-purple-600 hover:text-purple-900 flex items-center gap-1 mb-2"
          >
            <FaAngleLeft /> Back to Quizzes
          </button>
          <h2 className="text-lg font-medium text-gray-900">
            {selectedQuiz.quizName} - Quiz Details
          </h2>
          <div className="flex mt-1 text-sm text-gray-800">
            <p className="font-medium mr-1"> Student: </p>
            {selectedStudent?.fullName} |{" "}
            <p className="font-medium mx-1">Email:</p> {selectedStudent?.email}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Score: {selectedQuiz.score} / {selectedQuiz.totalScore} | Status:{" "}
            {selectedQuiz.score ? "graded" : selectedQuiz.status}
          </p>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div
      className={`container mx-auto ${
        viewMode === "ranking" || viewMode === "quizzes"
          ? "px-4 2xl:px-28 pt-4 pb-8"
          : "px-0 pt-0 pb-0"
      }`}
    >
      {viewMode === "ranking" && renderRankingList()}
      {viewMode === "quizzes" && renderStudentQuizzes()}
      {viewMode === "quizDetail" && (
        <>
          {renderQuizDetail()}
          <StudentAnswer
            studentAnswerId={selectedQuiz?.studentAnswerId || ""}
          />
        </>
      )}
    </div>
  );
}

export default ClassroomRanking;
