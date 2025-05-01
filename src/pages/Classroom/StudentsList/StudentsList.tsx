import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { IoArrowBackOutline } from "react-icons/io5";
import classroomService from "../services/classroomService";
import { useToast } from "../../../hooks/useToast";
import { Avatar, Spinner } from "flowbite-react";
import { useAuth } from "../../../hooks/useAuth";

function StudentsList() {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classroomInfo, setClassroomInfo] = useState<any>({});
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Get query params with defaults
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "fullName";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Local state for search input (to avoid immediate API calls on each keystroke)
  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateQueryParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateQueryParams = (updates: any) => {
    const newParams = {
      page,
      limit,
      search,
      sortField,
      sortOrder,
      ...updates,
    };

    // Remove undefined or empty values
    Object.keys(newParams).forEach(
      (key) =>
        (newParams[key] === undefined || newParams[key] === "") &&
        delete newParams[key]
    );

    setSearchParams(newParams);
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["studentsList", id, page, limit, search, sortField, sortOrder],
    queryFn: async () => {
      if (!id) return;
      const response = await classroomService.getStudentsList(
        id,
        page,
        limit,
        search,
        sortField,
        sortOrder
      );
      setClassroomInfo(response.classroom);
      console.log(response);
      return response;
    },
    enabled: !!id,
  });

  const handleRemoveStudents = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const response = await classroomService.removeStudentsFromClassroom(
        id,
        removedStudentIds
      );
      setRemovedStudentIds([]);
      showToast("success", "Students removed successfully");
      return response;
    },
    onSuccess: () => {
      setIsSelecting(false);
      refetch();
    },
    onError: (error) => {
      showToast("error", error.message || "Failed to remove students");
    },
  });

  const toggleStudentSelection = (studentId: string) => {
    if (removedStudentIds.includes(studentId)) {
      setRemovedStudentIds(removedStudentIds.filter((id) => id !== studentId));
    } else {
      setRemovedStudentIds([...removedStudentIds, studentId]);
    }
  };

  const startSelecting = () => {
    setIsSelecting(true);
    setRemovedStudentIds([]);
  };

  const cancelSelecting = () => {
    setIsSelecting(false);
    setRemovedStudentIds([]);
  };

  const handleSort = (field: any) => {
    const newOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";
    updateQueryParams({ sortField: field, sortOrder: newOrder });
  };

  const getSortIcon = (columnName: any) => {
    if (sortField !== columnName) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortOrder === "asc") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-purple-500 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-purple-500 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const renderPagination = () => {
    if (!data || !data.pagination) return null;

    const { total, page, limit, totalPages } = data.pagination;
    if (total === 0) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;

    // Calculate range of pages to show
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => updateQueryParams({ page: i })}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            page === i
              ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          } border`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => updateQueryParams({ page: Math.max(1, page - 1) })}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              updateQueryParams({ page: Math.min(totalPages, page + 1) })
            }
            disabled={page === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() =>
                  updateQueryParams({ page: Math.max(1, page - 1) })
                }
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                } border border-gray-300`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {startPage > 1 && (
                <>
                  <button
                    onClick={() => updateQueryParams({ page: 1 })}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 border border-gray-300"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}

              {pageNumbers}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => updateQueryParams({ page: totalPages })}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 border border-gray-300"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  updateQueryParams({ page: Math.min(totalPages, page + 1) })
                }
                disabled={page === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                } border border-gray-300`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  //   if (isLoading)
  //     return (
  //       <div className="flex justify-center items-center h-64">
  //         <Spinner size="xl" color="purple" />
  //       </div>
  //     );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
        Failed to load students: {error.message}
      </div>
    );

  const students = data?.students || [];
  const totalStudents = data?.pagination?.total || 0;

  return (
    <div className="bg-white">
      <div className="flex flex-col md:flex-row md:items-center mb-4 pt-6 px-10 md:px-4 md:gap-8 border-b border-purple-200 bg-purple-100 shadow-sm">
        <button
          onClick={() => navigate(`/classroom/detail/${id}`)}
          className="flex items-center gap-2 text-gray-600 text-md font-semibold hover:underline cursor-pointer mb-4"
        >
          <IoArrowBackOutline />
          Back
        </button>
        {/** Classroom information */}
        <div className="flex flex-col mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {classroomInfo.classroomName}
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:gap-10">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Classroom's owner:</span>{" "}
              {classroomInfo?.userId?.fullName}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">No. Students:</span>{" "}
              {classroomInfo?.students?.length} people
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-10 md:px-20 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Students List
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search students..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {user?.id === classroomInfo?.userId?._id && (
              <>
                {!isSelecting ? (
                  <button
                    onClick={startSelecting}
                    className="bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium px-6 py-2 rounded-lg shadow-sm"
                    disabled={students.length === 0}
                  >
                    Remove Students
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={cancelSelecting}
                      className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRemoveStudents.mutate()}
                      disabled={
                        removedStudentIds.length === 0 ||
                        handleRemoveStudents.isPending
                      }
                      className={`bg-red-500 hover:bg-red-600 transition-colors text-white font-medium px-4 py-2 rounded-lg shadow-sm flex items-center justify-center ${
                        removedStudentIds.length === 0 ||
                        handleRemoveStudents.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {handleRemoveStudents.isPending && (
                        <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                      Remove ({removedStudentIds.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {totalStudents === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200 shadow-lg">
            <p className="text-gray-600">
              {search
                ? "No students found matching your search."
                : "No students have joined this classroom yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-scroll hide-scrollbar rounded-lg border border-gray-200 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isSelecting ? (
                    <th className="w-12 px-6 py-3 text-left">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </span>
                    </th>
                  ) : (
                    <>
                      <th className="w-12 px-6 py-3 text-left">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </span>
                      </th>
                    </>
                  )}
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("fullName")}
                  >
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </span>
                      {getSortIcon("fullName")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </span>
                      {getSortIcon("email")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("account")}
                  >
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </span>
                      {getSortIcon("account")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student: any) => (
                  <tr
                    key={student._id}
                    className={`hover:bg-purple-50 cursor-pointer transition-colors`}
                    onClick={
                      isSelecting
                        ? () => toggleStudentSelection(student._id)
                        : () => navigate(`/user-profile/${student._id}`)
                    }
                  >
                    {isSelecting ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={removedStudentIds.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {students.indexOf(student) + 1 + (page - 1) * limit}
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3 items-center text-sm font-medium text-gray-900">
                        <Avatar img={student.avatarUrl} rounded size="sm" />
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.account}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsList;
