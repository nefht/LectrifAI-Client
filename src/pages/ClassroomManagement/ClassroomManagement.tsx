import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { useHeader } from "../../hooks/useHeader";
import ClassroomSidebar from "./components/ClassroomSidebar";
import JoinedClassroomCard from "./components/JoinedClassroomCard";
import MyClassroomCard from "./components/MyClassroomCard";
import classroomManagementService from "./services/classroomManagementService";
import { FiSearch } from "react-icons/fi";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import CreateClassroom from "./components/CreateClassroom";
import { useQuery } from "@tanstack/react-query";

function ClassroomManagement() {
  const { setHeaderClass } = useHeader();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userClassrooms, setUserClassrooms] = useState([]);
  const [userClassroomsPagination, setUserClassroomsPagination] = useState({
    totalPages: 1,
    total: 0,
    page: 1,
  });
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [joinedClassroomsPagination, setJoinedClassroomsPagination] = useState({
    totalPages: 1,
    total: 0,
    page: 1,
  });
  const [selectedTab, setSelectedTab] = useState("Joined Classrooms");
  const [searchTerm, setSearchTerm] = useState("");
  // Phân trang
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    setHeaderClass("bg-header shadow-md border-b border-b-gray-200");
  }, []);

  // useEffect(() => {
  //   const fetchClassrooms = async () => {
  //     const response = await classroomManagementService.getAllClassrooms({
  //       page,
  //       limit,
  //       search: searchTerm,
  //     });
  //     console.log(response);
  //     setUserClassrooms(response.data);
  //     setUserClassroomsPagination(response.pagination);
  //   };

  //   const fetchJoinedClassrooms = async () => {
  //     const response = await classroomManagementService.getAllAddedClassrooms({
  //       page,
  //       limit,
  //       search: searchTerm,
  //     });
  //     console.log(response);
  //     setJoinedClassrooms(response.data);
  //     setJoinedClassroomsPagination(response.pagination);
  //   };

  //   fetchClassrooms();
  //   fetchJoinedClassrooms();
  // }, [page, searchTerm]);

  const fetchClassrooms = useQuery({
    queryKey: ["myClassrooms", page, limit, searchTerm],
    queryFn: async () => {
      const response = await classroomManagementService.getAllClassrooms({
        page,
        limit,
        search: searchTerm,
      });

      setUserClassrooms(response.data);
      setUserClassroomsPagination(response.pagination);
      
      return response || {};
    }
  })

  const fetchJoinedClassrooms = useQuery({
    queryKey: ["joinedClassrooms", page, limit, searchTerm],
    queryFn: async () => {
      const response = await classroomManagementService.getAllAddedClassrooms({
        page,
        limit,
        search: searchTerm,
      });

      setJoinedClassrooms(response.data);
      setJoinedClassroomsPagination(response.pagination);
      
      return response || {};
    }
  })

  useEffect(() => {
    if (selectedTab === "My Classrooms") {
      setTotalPages(userClassroomsPagination.totalPages || 1);
      setTotalResults(userClassroomsPagination.total || 0);
    }
    if (selectedTab === "Joined Classrooms") {
      setTotalPages(joinedClassroomsPagination.totalPages || 1);
      setTotalResults(joinedClassroomsPagination.total || 0);
    }
  }, [selectedTab]);

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalResults);

  const renderButton = (p: number) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      aria-current={p === page ? "page" : undefined}
      className={`$${
        p === page
          ? "z-10 bg-purple-600 text-white"
          : "text-gray-900 hover:bg-gray-50"
      } relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0`}
    >
      {p}
    </button>
  );
  const renderPageButtons = () => {
    const pageButtons = [];
    const maxPagesToShow = 7;
    const ellipsis = (
      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0">
        ...
      </span>
    );

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(renderButton(i));
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pageButtons.push(renderButton(i));
        pageButtons.push(ellipsis);
        pageButtons.push(renderButton(totalPages));
      } else if (page > totalPages - 4) {
        pageButtons.push(renderButton(1));
        pageButtons.push(ellipsis);
        for (let i = totalPages - 4; i <= totalPages; i++)
          pageButtons.push(renderButton(i));
      } else {
        pageButtons.push(renderButton(1));
        pageButtons.push(ellipsis);
        for (let i = page - 1; i <= page + 1; i++)
          pageButtons.push(renderButton(i));
        pageButtons.push(ellipsis);
        pageButtons.push(renderButton(totalPages));
      }
    }

    return pageButtons;
  };

  return (
    <div className="flex h-full">
      <div
        className="fixed top-20 left-0 w-7 h-16 group bg-purple-200 rounded-r-xl flex items-center shadow-lg cursor-pointer hover:bg-purple-300/80 transition-all duration-200 ease-in-out hover:text-purple-500 active:scale-90"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaCaretRight className="text-3xl text-purple-400 group-hover:text-purple-500" />
      </div>
      <ClassroomSidebar
        open={isSidebarOpen}
        setOpen={setIsSidebarOpen}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <div className="flex flex-col w-full items-center justify-center">
        {selectedTab !== "Create Classroom" && (
          <div className="w-full flex px-10 2xl:px-32 pt-6">
            <div className="ml-auto relative w-[80%] sm:w-1/2 md:w-96 ">
              <input
                type="text"
                placeholder="Search classrooms..."
                className="w-full text-ssm md:text-sm text-base pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        )}
        {(selectedTab === "My Classrooms" ||
          selectedTab === "Joined Classrooms") && (
          <div
            className={`grid grid-cols-1 gap-x-8 gap-y-10 pb-24 ${
              isSidebarOpen
                ? "p-10 sm:pl-80 md:pl-28 xl:pl-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "px-14 xl:px-20 py-10 grid-cols-1 min-[470px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}
          >
            {selectedTab === "My Classrooms" && (
              <>
                {userClassrooms?.map((classroom, index) => (
                  <MyClassroomCard
                    key={index}
                    classroom={classroom}
                    setUserClassrooms={setUserClassrooms}
                  />
                ))}
              </>
            )}
            {selectedTab === "Joined Classrooms" && (
              <>
                {joinedClassrooms?.map((classroom, index) => (
                  <JoinedClassroomCard key={index} classroom={classroom} />
                ))}
              </>
            )}
          </div>
        )}
        {selectedTab === "Create Classroom" && (
          <div className="w-full h-full flex">
            <CreateClassroom />
          </div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 &&
          (selectedTab === "My Classrooms" ||
            selectedTab === "Joined Classrooms") && (
            <div className="fixed bottom-0 mt-auto w-full flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 sm:px-6">
              <div className="w-full flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-1 sm:items-center sm:justify-between md:px-40">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalResults}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    aria-label="Pagination"
                    className="isolate inline-flex -space-x-px rounded-md shadow-xs"
                  >
                    <button
                      onClick={() => setPage(1)}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">First</span>
                      <ChevronDoubleLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => page > 1 && setPage(page - 1)}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    {renderPageButtons()}
                    <button
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Last</span>
                      <ChevronDoubleRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default ClassroomManagement;
