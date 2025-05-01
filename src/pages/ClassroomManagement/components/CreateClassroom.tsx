import { Avatar } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../../../services/userSevice";
import { useToast } from "../../../hooks/useToast";
import classroomManagementService from "../services/classroomManagementService";

function CreateClassroom() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [classroomName, setClassroomName] = useState<string>("");
  const [addStudent, setAddStudent] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [classroom, setClassroom] = useState<any>(null);

  const handleSearchUsers = async (query: string) => {
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
    handleSearchUsers(e.target.value);
  };

  const toggleSelectUser = (user: any) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.find((u) => u.id === user.id)) {
        return prevSelected.filter((u) => u.id !== user.id); // Nếu user đã chọn, hủy chọn
      } else {
        return [...prevSelected, user]; // Nếu chưa chọn, thêm vào danh sách chọn
      }
    });
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user.id !== userId)
    );
  };

  const handleCreateClassroom = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const classroom = await classroomManagementService.createClassroom(
        classroomName
      );
      if (classroom) {
        setInviteLink(classroom.inviteLink);
        setClassroom(classroom.classroom);

        showToast("success", "Classroom created successfully!");

        if (addStudent) {
          const studentIds = selectedUsers.map((user) => user.id);
          await classroomManagementService.addStudentsToClassroom(
            classroom.classroom._id,
            studentIds
          );
          showToast("success", "Students added successfully!");
        }

        queryClient.invalidateQueries({
          queryKey: ["myClassrooms", 1, 8, ""],
        });
      }
    },
    onSuccess: () => {},
    onError: (error) => {
      showToast(
        "error",
        error.message || "An error occurred. Please try again."
      );
    },
  });

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => showToast("success", "Link copied!"))
      .catch((err) => console.error("Could not copy link:", err));
  };

  return (
    <div className="w-full h-full-screen bg-gray-50 flex items-center justify-center overflow-hidden pt-10">
      <form
        onSubmit={(e) => handleCreateClassroom.mutate(e)}
        className="max-h-[85vh] mb-10 w-2/3 lg:w-1/2 2xl:w-2/5 rounded-xl border border-gray-200 bg-white shadow-xl p-4 flex flex-col items-center justify-center gap-2 z-10"
      >
        {inviteLink ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">
              Invite to Classroom
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">
              Create Classroom
            </h1>
            <p className="text-gray-600 text-center">
              Enter your classroom name right below.
            </p>
          </>
        )}
        <div className="w-full px-10">
          <input
            required
            maxLength={50}
            value={classroomName}
            disabled={
              handleCreateClassroom.isPending || handleCreateClassroom.isSuccess
            }
            onChange={(e) => setClassroomName(e.target.value)}
            type="text"
            className="w-full bg-purple-100 rounded-md mt-2 px-3 py-2 text-gray-800 font-semibold mb-1 border border-purple-400 focus:ring-1 focus:ring-purple-600 resize-none overflow-hidden"
          />
        </div>
        {inviteLink ? (
          <>
            <div className="mb-4 px-4">
              <div className="flex items-center justify-between my-1">
                <span className="font-medium">Join link: </span>
                <button
                  className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded"
                  onClick={(e) => copyToClipboard(e)}
                >
                  Copy
                </button>
              </div>
              <div className="text-purple-700 break-all">{inviteLink}</div>
            </div>
            <a
              href={`/classroom/detail/${classroom._id}`}
              target="_blank"
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              Go to Classroom
            </a>
          </>
        ) : (
          <>
            <div className="px-10 mr-auto flex w-full">
              <div className="flex items-center h-5">
                <input
                  id="addStudent"
                  aria-describedby="addStudent"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 checked:border-purple-600 checked:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 focus:ring-3 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                  checked={addStudent}
                  onChange={() => setAddStudent((prev) => !prev)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="remember"
                  className="text-gray-600 dark:text-gray-300"
                >
                  Add students (you can do it later)
                </label>
              </div>
            </div>

            {addStudent && (
              <div className="w-full px-10">
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
                <div className="flex gap-2 mb-3 flex-wrap max-h-24 overflow-y-scroll">
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
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {filteredUsers.length === 0 ? (
                    <p className="text-gray-500">
                      No users found. Please try another keyword.
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150"
                        onClick={() => toggleSelectUser(user)}
                      >
                        <Avatar
                          rounded={true}
                          img={user.avatarUrl}
                          alt="User profile"
                        />
                        <div className="flex flex-col">
                          <p className="text-gray-900 truncate">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.account}
                          </p>
                        </div>
                        {selectedUsers.some(
                          (item) => item.account === user.account
                        ) && (
                          <div className="absolute top-0 right-3 h-full flex items-center justify-center">
                            <IoMdCheckmark className="text-purple-600 text-xl" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="mt-2 w-full flex items-center justify-center">
              <button
                type="submit"
                className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Create
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default CreateClassroom;
