import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { PiChatsCircle } from "react-icons/pi";
import instantLectureService from "../../services/instantLectureService";
import { useNavigate } from "react-router";

interface SearchModalProps {
  isOpen: boolean;
  closeModal: () => void;
  lectures: any[]; // Danh sách bài giảng
  setLectures: React.Dispatch<React.SetStateAction<any[]>>; // Cập nhật lecture list
}

function SearchModal({
  isOpen,
  closeModal,
  lectures,
  setLectures,
}: SearchModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredLectures, setFilteredLectures] = useState<any[]>(lectures);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLectures(lectures);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return; // Nếu không có từ khóa, không làm gì

    try {
      const response = await instantLectureService.searchInstantLectures(query);
      setFilteredLectures(response); // Lưu kết quả tìm kiếm
    } catch (err) {
      console.error("Error searching lectures:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
      onClick={closeModal} // Không làm mờ background
    >
      <div
        className="w-full h-full flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-md">
          <div className="relative flex items-center gap-2 mb-4 border-b border-b-gray-200 pb-2">
            <MdSearch className="text-xl text-gray-600" />
            <input
              type="text"
              className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-0"
              placeholder="Searching for lectures chat..."
              value={searchQuery}
              onChange={handleChange}
            />
            <button
              onClick={closeModal}
              className="ml-auto text-xl text-gray-600"
            >
              <MdClose />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredLectures.length === 0 ? (
              <p className="text-gray-500">
                No lectures found. Please try another keyword.
              </p>
            ) : (
              filteredLectures.map((lecture, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => {
                    closeModal();
                    navigate(`/lecture/instant-presenter/${lecture._id}`);
                  }}
                >
                  <PiChatsCircle className="text-gray-800"/>
                  <p className="text-gray-900 truncate">
                    {lecture.lectureName}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
