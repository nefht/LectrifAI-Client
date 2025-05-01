import { Avatar, Tooltip } from "flowbite-react";
import React, { useState, useEffect, Fragment } from "react";
import { MdSearch } from "react-icons/md";
import { MdClose } from "react-icons/md";
import userService from "../../services/userSevice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lectureVideoService from "../../pages/LectureTools/services/lectureVideoService";
import { useToast } from "../../hooks/useToast";
import { Dialog, Transition } from "@headlessui/react";
import quizService from "../../pages/Quiz/services/quizService";

interface ShareUserModalProps {
  type: "lecture-video" | "quiz";
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: any;
  listPermissions: any[];
  currentListPage?: number;
}

type SharingMode = "PRIVATE" | "PUBLIC" | "SHARE";

function ShareUserModal({
  type,
  open,
  setOpen,
  selectedItem,
  listPermissions,
  currentListPage,
}: ShareUserModalProps) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>(
    listPermissions || []
  );
  const [sharedItem, setSharedItem] = useState<any>(selectedItem);
  const [sharingMode, setSharingMode] = useState<SharingMode>("SHARE");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  useEffect(() => {
    console.log("Selected item:", selectedItem);
    if (listPermissions && listPermissions.length > 0) {
      setSelectedUsers(listPermissions);
      if (selectedItem.isPublic) {
        setSharingMode("PUBLIC");
      } else {
        setSharingMode("SHARE");
      }
    } else if (selectedItem && selectedItem.isPublic) {
      setSharingMode("PUBLIC");
    } else {
      setSharingMode("PRIVATE");
    }
    if (selectedItem) {
      setSharedItem(selectedItem);
    }
  }, [listPermissions, selectedItem]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    try {
      const response = await userService.getAllUsers(query);
      const usersList = response?.filter(
        (user: any) => user.id !== selectedItem.userId
      );
      setFilteredUsers(usersList);
    } catch (error) {
      console.error("Search failed:", error);
      setFilteredUsers([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value); // Trigger search when user types
  };

  const toggleSelectUser = (user: any) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.find((u) => u.userId === user.id)) {
        return prevSelected.filter((u) => u.userId !== user.id); // Nếu user đã chọn, hủy chọn
      } else {
        return [
          ...prevSelected,
          {
            userId: user.id,
            account: user.account,
            permissionType: "VIEWER",
          },
        ];
      }
    });
    console.log("Selected users:", selectedUsers);
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user.userId !== userId)
    );
  };

  const handlePermissionChange = (
    userId: string,
    permissionType: "VIEWER" | "EDITOR"
  ) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.map((user) =>
        user.userId === userId ? { ...user, permissionType } : user
      )
    );

    console.log("Updated selected users:", selectedUsers);
  };

  const changeSharingMode = (mode: SharingMode) => {
    setSharingMode(mode);
    // Nếu chuyển sang chế độ private, xóa danh sách người được chia sẻ
    // if (mode === "PRIVATE") {
    //   setSelectedUsers([]);
    // }
  };

  const getButtonClass = (mode: SharingMode) => {
    const baseClass =
      "py-2 transition-all duration-200 border border-gray-300 font-medium text-sm";
    const activeClass = "bg-purple-600 text-white border-purple-600";
    const inactiveClass = "bg-white text-gray-700 hover:bg-gray-100";

    if (mode === sharingMode) {
      return `${baseClass} ${activeClass}`;
    }
    return `${baseClass} ${inactiveClass}`;
  };

  const handleShare = useMutation({
    mutationFn: async () => {
      let sharedWith = [...selectedUsers];
      if (isPrivate) {
        sharedWith = [];
      }
      if (type === "lecture-video") {
        const response = await lectureVideoService.shareLectureVideo(
          selectedItem._id,
          isPublic,
          sharedWith
        );
        console.log(response);
        if (currentListPage) {
          queryClient.invalidateQueries({
            queryKey: ["lectureVideos", currentListPage, 10, ""],
          });
        }
      }
      if (type === "quiz") {
        const response = quizService.shareQuiz(
          selectedItem._id,
          isPublic,
          sharedWith
        );
        console.log(response);
        if (currentListPage) {
          queryClient.invalidateQueries({
            queryKey: ["quizzes", currentListPage, 10, ""],
          });
        }
      }
      showToast("success", "Set access permissions successfully!");
      handleCloseModal();
    },
    onError: () => {
      showToast("error", "Failed to set access permissions.");
    },
  });

  const handleCloseModal = () => {
    setSelectedUsers([]);
    setSearchQuery("");
    setFilteredUsers([]);
    setOpen(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={handleCloseModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
            <div
              className={`fixed inset-0 z-50 ${open ? "block" : "hidden"}`}
              onClick={() => setOpen(false)} // Không làm mờ background
            >
              <div
                className="w-full h-full flex justify-center items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
                  <div className="text-lg font-semibold mb-2">
                    {selectedItem &&
                      (sharedItem?.lectureName ?? sharedItem?.quizName)}
                  </div>
                  <div className="text-gray-500 mb-4">
                    Set access permissions for this material.
                  </div>
                  <div className="grid grid-cols-3 mb-4">
                    <button
                      className={`${getButtonClass("PRIVATE")} rounded-l-lg`}
                      onClick={() => {
                        changeSharingMode("PRIVATE");
                        setIsPublic(false);
                        setIsPrivate(true);
                      }}
                    >
                      Private
                    </button>
                    <button
                      className={getButtonClass("PUBLIC")}
                      onClick={() => {
                        changeSharingMode("PUBLIC");
                        setIsPublic(true);
                        setIsPrivate(false);
                      }}
                    >
                      Public
                    </button>
                    <button
                      className={`${getButtonClass("SHARE")} rounded-r-lg`}
                      onClick={() => {
                        changeSharingMode("SHARE");
                        setIsPublic(false);
                        setIsPrivate(false);
                      }}
                    >
                      Share
                    </button>
                  </div>
                  {sharingMode !== "PRIVATE" && (
                    <>
                      <div
                        className={`mt-4 relative flex items-center gap-2 border-b border-b-gray-200 pb-2 ${
                          selectedUsers.length > 0 ? "mb-3" : ""
                        }`}
                      >
                        <MdSearch className="text-xl text-gray-600" />
                        <input
                          type="text"
                          className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-0"
                          placeholder="Search for users..."
                          value={searchQuery}
                          onChange={handleChange}
                        />
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-auto text-xl text-gray-600"
                        >
                          <MdClose />
                        </button>
                      </div>

                      {/* Tags for selected users */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {selectedUsers?.map((user, index) => {
                          if (
                            user?.userId !== selectedItem?.owner?._id &&
                            user?.userId !== selectedItem?.userId &&
                            user?.userId !== selectedItem?.userId?._id
                          ) {
                            console.log("user", user);
                            console.log("selectedItem", selectedItem);
                            console.log(
                              user.userId === selectedItem?.userId?._id
                            );
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-1 bg-purple-200 text-purple-800 px-2 py-1 rounded-md"
                              >
                                <span className="font-medium">
                                  {user?.account}
                                </span>
                                <button
                                  onClick={() =>
                                    removeSelectedUser(user?.userId)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <MdClose />
                                </button>
                              </div>
                            );
                          }
                        })}
                      </div>

                      {/* User search results */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {filteredUsers?.length === 0 ? (
                          <p className="text-gray-500">
                            No users found. Please try another keyword.
                          </p>
                        ) : (
                          filteredUsers?.map((user, index) => {
                            const isSelected = selectedUsers.find(
                              (u) => u.userId === user.id
                            );
                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer transition duration-150 ${
                                  isSelected
                                    ? "bg-purple-50 hover:bg-purple-100"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() => toggleSelectUser(user)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    rounded={true}
                                    img={user?.avatarUrl}
                                    alt="User profile"
                                  />
                                  <div className="flex flex-col items-start">
                                    <p className="text-gray-900 truncate">
                                      {user?.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {user?.account}
                                    </p>
                                  </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  {isSelected && (
                                    <select
                                      className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      value={isSelected.permissionType}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          user.id,
                                          e.target.value as "VIEWER" | "EDITOR"
                                        )
                                      }
                                    >
                                      <option value="VIEWER">Viewer</option>
                                      <option value="EDITOR">Editor</option>
                                    </select>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="sm:flex sm:flex-row-reverse pt-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
                      onClick={() => handleShare.mutate()}
                      disabled={handleShare.isPending}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleCloseModal}
                      disabled={handleShare.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ShareUserModal;
