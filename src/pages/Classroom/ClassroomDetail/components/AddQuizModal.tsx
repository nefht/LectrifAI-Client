import { Avatar } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { MdClose } from "react-icons/md";

interface AddQuizModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddQuizModal({ open, setOpen }: AddQuizModalProps) {
  const [quizzes, setQuizzes] = useState<any[]>([
    // Giả lập danh sách người dùng
    {
      id: "1",
      fullName: "Nguyen Huong Thao",
      account: "maiconht",
      profile: null,
    },
    { id: "2", fullName: "Thảo Hương Nguyễn", account: "nefht", profile: null },
    {
      id: "3",
      fullName: "Nguyen Huong Thao",
      account: "thaonh",
      profile: null,
    },
    { id: "4", fullName: "Nguyen Quynh Mai", account: "nqmai", profile: null },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredQuizzes([]); // Nếu không có từ khóa, không hiển thị danh sách
      return;
    }
    const response = quizzes.filter((quiz) =>
      quiz.quizName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredQuizzes(response); // Lưu kết quả tìm kiếm
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const toggleSelectUser = (user: any) => {
    setSelectedQuizzes((prevSelected) => {
      if (prevSelected.find((u) => u.id === user.id)) {
        return prevSelected.filter((u) => u.id !== user.id); // Nếu user đã chọn, hủy chọn
      } else {
        return [...prevSelected, user]; // Nếu chưa chọn, thêm vào danh sách chọn
      }
    });
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedQuizzes((prevSelected) =>
      prevSelected.filter((user) => user.id !== userId)
    );
  };

  const handleAddStudents = () => {
    // Thêm người dùng đã chọn vào lớp
    console.log("Students added:", selectedQuizzes);
    setOpen(false); // Đóng modal sau khi thêm
  };

  return (
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
              selectedQuizzes.length > 0 ? "mb-3" : ""
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
            {selectedQuizzes.map((user) => (
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
            {filteredQuizzes.length === 0 ? (
              <p className="text-gray-500">
                No users found. Please try another keyword.
              </p>
            ) : (
              filteredQuizzes.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => toggleSelectUser(user)}
                >
                  <Avatar
                    rounded={true}
                    img={user.profile}
                    alt="User profile"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.account}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="sm:flex sm:flex-row-reverse pt-4">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Add
            </button>
            <button
              type="button"
              data-autofocus
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuizModal;
