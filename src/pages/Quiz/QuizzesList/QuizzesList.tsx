import { useEffect, useState } from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { HiDotsVertical } from "react-icons/hi";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import quizService from "../services/quizService";
import { useAuth } from "../../../hooks/useAuth";
import ShareUserModal from "../../../components/ShareUserModal/ShareUserModal";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import EditInfoModal from "../QuizSet/components/EditInfoModal";

function capitalizeFirstLetter(str: string) {
  if (typeof str !== "string" || str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

function QuizzesList({ searchTerm }: { searchTerm: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // Modal share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [listPermissions, setListPermissions] = useState<any[]>([]);
  // Modal delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Modal rename
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // User permission
  const [userPermission, setUserPermission] = useState("");

  // useEffect(() => {
  //   const fetchAllQuizzes = async () => {
  //     const response = await quizService.getAllQuizzes({
  //       page,
  //       limit,
  //       search: searchTerm,
  //     });

  //     setQuizzes(response.data);
  //     setTotalPages(response.pagination.totalPages || 1);
  //     setTotalResults(response.pagination.total || 0);
  //   };

  //   fetchAllQuizzes();
  // }, [page, searchTerm]);

  const fetchAllQuizzes = useQuery({
    queryKey: ["quizzes", page, limit, searchTerm],
    queryFn: async () => {
      if (searchTerm !== "") {
        setPage(1);
      };
      const response = await quizService.getAllQuizzes({
        page,
        limit,
        search: searchTerm,
      });

      setQuizzes(response.data);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalResults(response.pagination.total || 0);

      return response;
    },
  });

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalResults);

  useEffect(() => {
    const permissionType = selectedQuiz?.permissions?.find(
      (p: any) => p?.userId === user?.id
    )?.permissionType;

    if (permissionType) {
      setUserPermission(permissionType);
    } else if (
      selectedQuiz?.owner?._id === user?.id ||
      selectedQuiz?.userId === user?.id
    ) {
      setUserPermission("OWNER");
    }
  }, [selectedQuiz]);

  const renderButton = (p: number) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      aria-current={p === page ? "page" : undefined}
      className={`$${
        p === page
          ? "z-10 bg-violet-600 text-white"
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

  const getShareMode = (quiz: any) => {
    if (quiz.isPublic) {
      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700 border border-green-200`}
        >
          Public
        </span>
      );
    }

    if (user && quiz?.permissions && quiz?.permissions.length > 0) {
      // Lấy permissionType của current user
      const mode = quiz?.permissions?.find(
        (p: any) => p.userId === user?.id
      )?.permissionType;

      // List users được share
      const sharedUsers = quiz?.permissions?.filter(
        (p: any) => p.permissionType !== "OWNER"
      );

      const owner = quiz?.owner;
      if (owner._id !== user.id && mode === "EDITOR") {
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200`}
          >
            Editor
          </span>
        );
      } else if (owner._id !== user.id && mode === "VIEWER") {
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200`}
          >
            Viewer
          </span>
        );
      } else if (owner._id === user.id && sharedUsers.length > 0) {
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200`}
          >
            Share
          </span>
        );
      }
    }
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200`}
      >
        Private
      </span>
    );
  };

  const handleOpenShare = useMutation({
    mutationFn: async (quiz: any) => {
      const response = await quizService.getQuizPermissions(quiz._id);
      setListPermissions(response);
      setSelectedQuiz(quiz);
      setIsShareModalOpen(true);
      console.log(quiz);
    },
  });

  const hasEditPermissions = (quiz: any) => {
    if (!user) return false;

    // User là owner
    if (quiz?.owner?._id === user.id) return true;

    // User có EDITOR permission
    if (quiz?.permissions && quiz?.permissions.length > 0) {
      return quiz.permissions.some(
        (permission: any) =>
          permission.userId === user.id &&
          (permission.permissionType === "EDITOR" ||
            permission.permissionType === "OWNER")
      );
    }

    return false;
  };

  const handleDeleteQuiz = useMutation({
    mutationFn: async (quizId: string) => {
      await quizService.deleteQuiz(quizId);
      setIsDeleteModalOpen(false);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
    },
    onSuccess: () => {
      showToast("success", "Quiz deleted successfully");
    },
  });

  return (
    <>
      <ShareUserModal
        type="quiz"
        open={isShareModalOpen}
        setOpen={setIsShareModalOpen}
        selectedItem={selectedQuiz}
        listPermissions={listPermissions}
        currentListPage={page}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete Quiz",
          content: "Are you sure you want to delete this quiz?",
        }}
        handleDelete={() =>
          handleDeleteQuiz.mutate(selectedQuiz._id.$oid || selectedQuiz._id)
        }
      />
      <EditInfoModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        quizSetInfo={selectedQuiz}
        userPermission={userPermission}
        currentListPage={page}
      />
      <div className="overflow-x-auto px-4 md:px-10 xl:px-48 pb-10">
        <Table striped hoverable>
          <TableHead className="text-white">
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              #
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold">
              Quiz Name
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Academic Level
            </TableHeadCell>
            {/* <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Language
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Question Type
            </TableHeadCell> */}
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Share Mode
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Created At
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold text-center">
              Owner
            </TableHeadCell>
            <TableHeadCell className="bg-violet-700 text-sm xl:text-base font-semibold"></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {quizzes.map((quiz, index) => {
              const canEdit = hasEditPermissions(quiz);
              let isOwner;
              if (user) {
                isOwner =
                  quiz?.owner?._id === user.id || quiz?.userId === user.id;
              }

              return (
                <TableRow
                  key={index}
                  onClick={() => navigate(`/quiz/${quiz._id.$oid || quiz._id}`)}
                  className=" dark:border-gray-700 hover:cursor-pointer hover:bg-violet-100 transition-colors"
                >
                  <TableCell className="text-center">
                    {startIndex + index}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {quiz.quizName}
                  </TableCell>
                  <TableCell className="text-center">
                    {quiz.academicLevel}
                  </TableCell>
                  <TableCell className="text-center">
                    {getShareMode(quiz)}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(
                      quiz.createdAt?.$date || quiz.createdAt
                    ).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    <div className="flex items-center gap-1">
                      <div className="w-8">
                        <Avatar
                          img={quiz?.owner?.avatarUrl}
                          rounded
                          size="xs"
                        />
                      </div>
                      {quiz?.owner?.account}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canEdit && (
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button>
                          <HiDotsVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setIsEditModalOpen(true);
                                    setSelectedQuiz(quiz);
                                  }}
                                  className={`${
                                    active
                                      ? "bg-violet-100 text-violet-800 font-semibold"
                                      : "text-gray-700"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleOpenShare.mutate(quiz)}
                                  className={`${
                                    active
                                      ? "bg-violet-100 text-violet-800 font-semibold"
                                      : "text-gray-700"
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  Share
                                </button>
                              )}
                            </Menu.Item>
                            {isOwner && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setIsDeleteModalOpen(true);
                                      setSelectedQuiz(quiz);
                                    }}
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
                            )}
                          </div>
                        </Menu.Items>
                      </Menu>
                    )}
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
    </>
  );
}

export default QuizzesList;
