import { Dialog, Transition } from "@headlessui/react";
import { Avatar, Tooltip } from "flowbite-react";
import React, { useState, useEffect, Fragment } from "react";
import { MdSearch } from "react-icons/md";
import { MdClose } from "react-icons/md";
import userService from "../../../../services/userSevice";
import { IoMdCheckmark } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classroomService from "../../services/classroomService";
import { useToast } from "../../../../hooks/useToast";
import { useParams } from "react-router";

interface AddStudentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomInfo: any;
  setUserClassrooms?: React.Dispatch<React.SetStateAction<any>>;
}

function AddStudentModal({
  open,
  setOpen,
  classroomInfo,
  setUserClassrooms,
}: AddStudentModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    setStudents(classroomInfo.students || []);
  }, [classroomInfo]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    try {
      const response = await userService.getAllUsers(query);
      setFilteredUsers(response);
    } catch (error) {
      console.error("Search failed:", error);
      setFilteredUsers([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const toggleSelectUser = (user: any) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.find((u) => u.id === user.id)) {
        return prevSelected.filter((u) => u.id !== user.id); // Nếu user đã chọn, hủy chọn
      } else {
        return [...prevSelected, user]; // Nếu chưa chọn, thêm vào danh sách chọn
      }
    });
    console.log(user);
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user.id !== userId)
    );
  };

  const handleAddStudents = useMutation({
    mutationFn: async () => {
      if (selectedUsers.length === 0) {
        showToast("warning", "Please select at least one student");
        return;
      }
      try {
        const studentIds = selectedUsers.map((user) => user.id);
        const response = await classroomService.addStudentsToClassroom(
          classroomInfo._id,
          studentIds
        );

        if (id) {
          queryClient.invalidateQueries({
            queryKey: ["classroom", classroomInfo._id],
          });
        } else {
          if (setUserClassrooms) {
            setUserClassrooms((oldData: any) =>
              oldData.map((data: any) => {
                if (data._id === classroomInfo._id) {
                  return {
                    ...data,
                    students: response.students,
                  };
                } else {
                  return { ...data };
                }
              })
            );
          }
        }
        showToast("success", "Students added successfully");
        handleCloseModal();
      } catch (error) {
        console.log(error);
      }
    },
    onError: () => {
      showToast("error", "Failed to add students");
    },
  });

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUsers([]);
    setFilteredUsers([]);
    setSearchQuery("");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setOpen(false)}
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
                <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-md">
                  <div
                    className={`relative flex items-center gap-2 border-b border-b-gray-200 pb-2 ${
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
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-1 bg-purple-200 text-purple-800 px-2 py-1 rounded-md"
                      >
                        <span className="font-medium">{user.account}</span>
                        <button
                          onClick={() => removeSelectedUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdClose />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* User search results */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-gray-500">
                        No users found. Please try another keyword.
                      </p>
                    ) : (
                      filteredUsers.map((user) => {
                        const isInClass = students.some(
                          (student) => student === user.id
                        );
                        const isSelected = selectedUsers.some(
                          (u) => u.id === user.id
                        );
                        return (
                          <div
                            key={user.id}
                            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150 ${
                              isInClass
                                ? "cursor-none pointer-events-none bg-purple-100"
                                : ""
                            }`}
                            onClick={() => toggleSelectUser(user)}
                          >
                            <Avatar
                              rounded={true}
                              img={user.avatarUrl}
                              alt="User profile"
                            />
                            <div className="flex flex-col items-start">
                              <p className="text-gray-900 truncate">
                                {user.fullName}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.account}
                              </p>
                            </div>
                            {(isInClass || isSelected) && (
                              <div className="absolute top-0 right-3 h-full flex items-center justify-center">
                                <IoMdCheckmark className="text-purple-600 text-xl" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="sm:flex sm:flex-row-reverse pt-4">
                    <button
                      disabled={
                        selectedUsers.length === 0 ||
                        handleAddStudents.isPending
                      }
                      onClick={() => handleAddStudents.mutate()}
                      type="button"
                      className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                        selectedUsers.length === 0
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      Add
                    </button>
                    <button
                      disabled={handleAddStudents.isPending}
                      type="button"
                      data-autofocus
                      onClick={handleCloseModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default AddStudentModal;
