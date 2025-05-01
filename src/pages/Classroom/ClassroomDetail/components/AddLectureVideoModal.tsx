import { useState } from "react";
import { MdSearch, MdClose, MdOutlineMenuBook } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiBook2Line } from "react-icons/ri";
import { useParams } from "react-router";
import classroomService from "../../services/classroomService";
import { useToast } from "../../../../hooks/useToast";
import lectureVideoService from "../../../LectureTools/services/lectureVideoService";

interface AddLectureVideoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomInfo: any;
}

function AddLectureVideoModal({
  open,
  setOpen,
  classroomInfo,
}: AddLectureVideoModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredLectures, setFilteredLectures] = useState<any[]>([]);
  const [selectedLectures, setSelectedLectures] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLectures([]);
      return;
    }

    try {
      const response = await lectureVideoService.getAllLectureVideos({
        search: query,
      });
      setFilteredLectures(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setFilteredLectures([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const toggleSelectLecture = (lecture: any) => {
    setSelectedLectures((prevSelected) => {
      if (prevSelected.find((l) => l._id === lecture._id)) {
        return prevSelected.filter((l) => l._id !== lecture._id);
      } else {
        return [...prevSelected, lecture];
      }
    });
  };

  const removeSelectedLecture = (lectureId: string) => {
    setSelectedLectures((prevSelected) =>
      prevSelected.filter((lecture) => lecture._id !== lectureId)
    );
  };

  const handleAddLectures = useMutation({
    mutationFn: async () => {
      const lectureVideos = selectedLectures.map((lecture) => ({
        lectureVideoId: lecture._id,
        lectureScriptId: lecture.lectureScriptId,
      }));

      const addedLectures = await classroomService.addLecturesToClassroom(
        classroomInfo._id,
        lectureVideos
      );

      if (id) {
        queryClient.invalidateQueries({
          queryKey: ["classroomMaterials", classroomInfo._id],
        });
      }
      showToast("success", "Lecture videos added successfully!");
      handleCloseModal();
    },
    onError: () => {
      showToast("error", "Failed to add lecture videos. Please try again.");
    },
  });

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedLectures([]);
    setSearchQuery("");
    setFilteredLectures([]);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        open ? "block" : "hidden"
      } bg-gray-600 bg-opacity-50`}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full h-full flex justify-center items-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-2xl">
          <h3 className="text-lg font-medium mb-3">
            Add Lecture Videos to Classroom
          </h3>

          <div className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-2 mb-3">
            <MdSearch className="text-xl text-gray-600" />
            <input
              type="text"
              className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-0"
              placeholder="Search for lecture videos..."
              value={searchQuery}
              onChange={handleChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="ml-auto text-xl text-gray-600"
              >
                <MdClose />
              </button>
            )}
          </div>

          {/* Selected lectures */}
          {selectedLectures.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Selected Lecture Videos
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedLectures.map((lecture) => (
                  <div
                    key={lecture._id}
                    className="border border-gray-200 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-800">
                        {lecture.lectureName}
                      </div>
                      <button
                        onClick={() => removeSelectedLecture(lecture._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdClose />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lecture search results */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-4">
            <h4 className="font-medium text-sm text-gray-700">
              Search Results
            </h4>
            {filteredLectures.length === 0 && searchQuery ? (
              <p className="text-gray-500 text-sm">
                No lecture videos found. Please try another keyword.
              </p>
            ) : filteredLectures.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Search for lecture videos to add to your classroom.
              </p>
            ) : (
              filteredLectures.map((lecture) => {
                const isSelected = selectedLectures.some(
                  (l) => l._id === lecture._id
                );
                return (
                  <div
                    key={lecture._id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition duration-150 ${
                      isSelected ? "bg-purple-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleSelectLecture(lecture)}
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <RiBook2Line
                        className={`text-3xl ${
                          isSelected ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-gray-900">{lecture.lectureName}</p>
                        <p className="text-sm text-gray-500 truncate">
                          Created At:{" "}
                          {new Date(lecture.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-purple-600 text-sm font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleAddLectures.mutate()}
              disabled={
                selectedLectures.length === 0 || handleAddLectures.isPending
              }
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                selectedLectures.length === 0
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Add{" "}
              {selectedLectures.length > 0
                ? `(${selectedLectures.length})`
                : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLectureVideoModal;
