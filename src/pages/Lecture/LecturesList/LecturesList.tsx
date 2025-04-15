import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import lectureVideoService from "../../LectureTools/services/lectureVideoService";
import { HiDotsVertical } from "react-icons/hi";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// Tạo fake shareMode
const getRandomShareMode = () => {
  const modes = ["private", "public", "group"];
  return modes[Math.floor(Math.random() * modes.length)];
};

function LecturesList({ searchTerm }: { searchTerm: string }) {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchAllLectureVideos = async () => {
      const response = await lectureVideoService.getAllLectureVideos({
        page,
        limit,
        search: searchTerm,
      });

      // Gán shareMode fake vào mỗi lecture
      const withShareMode = response.data.map((lecture: any) => ({
        ...lecture,
        shareMode: getRandomShareMode(),
      }));

      setLectures(withShareMode);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalResults(response.pagination.total || 0);
    };

    fetchAllLectureVideos();
  }, [page, searchTerm]);

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalResults);

  const renderButton = (p: number) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      aria-current={p === page ? "page" : undefined}
      className={`$${
        p === page
          ? "z-10 bg-indigo-600 text-white"
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
    <div className="overflow-x-auto px-4 md:px-10 xl:px-48 pb-10">
      <Table striped hoverable>
        <TableHead className="text-white">
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold text-center">
            #
          </TableHeadCell>
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold">
            Lecture Name
          </TableHeadCell>
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold text-center">
            Interactive Quiz
          </TableHeadCell>
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold text-center">
            Share Mode
          </TableHeadCell>
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold text-center">
            Created At
          </TableHeadCell>
          <TableHeadCell className="bg-indigo-700 text-sm xl:text-base font-semibold"></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {lectures.map((lecture, index) => {
            const mode =
              lecture.shareMode.charAt(0).toUpperCase() +
              lecture.shareMode.slice(1);
            const rowBg = index % 2 === 0 ? "bg-indigo-50" : "bg-white";

            return (
              <TableRow
                key={index}
                onClick={() =>
                  navigate(`/lecture/detail/${lecture._id.$oid || lecture._id}`)
                }
                className={`${rowBg} dark:border-gray-700 hover:cursor-pointer hover:bg-indigo-100 transition-colors`}
              >
                <TableCell className="text-center">
                  {startIndex + index}
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {lecture.lectureName}
                </TableCell>
                <TableCell className="text-center">
                  {lecture.interactiveQuiz ? (
                    <div className="flex justify-center items-center">
                      <FaCheckCircle className="text-green-500 text-xl" />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center">
                      <FaTimesCircle className="text-red-500 text-xl" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      mode === "Public"
                        ? "bg-green-100 text-green-700"
                        : mode === "Group"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {mode}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(
                    lecture.createdAt?.$date || lecture.createdAt
                  ).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button>
                      <HiDotsVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-indigo-100 text-indigo-800 font-semibold"
                                  : "text-gray-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Rename
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-indigo-100 text-indigo-800 font-semibold"
                                  : "text-gray-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Share
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-red-100 text-red-600 font-semibold"
                                  : "text-red-500"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
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
  );
}

export default LecturesList;
