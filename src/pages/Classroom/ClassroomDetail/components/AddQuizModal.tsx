import { useState, useEffect } from "react";
import { MdSearch, MdClose, MdSettings, MdOutlineQuiz } from "react-icons/md";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import quizService from "../../../Quiz/services/quizService";
import classroomService from "../../services/classroomService";
import { useToast } from "../../../../hooks/useToast";
import { formatDuration } from "../ClassroomDetail";

interface AddQuizModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomInfo: any;
}

interface QuizSettings {
  quizId: string;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
  validationError?: string;
}

function AddQuizModal({ open, setOpen, classroomInfo }: AddQuizModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<any[]>([]);
  const [quizSettings, setQuizSettings] = useState<
    Record<string, QuizSettings>
  >({});
  const [showSettingsFor, setShowSettingsFor] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredQuizzes([]);
      return;
    }

    try {
      const response = await quizService.getAllQuizzes({ search: query });
      setFilteredQuizzes(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setFilteredQuizzes([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const toggleSelectQuiz = (quiz: any) => {
    setSelectedQuizzes((prevSelected) => {
      if (prevSelected.find((q) => q._id === quiz._id)) {
        return prevSelected.filter((q) => q._id !== quiz._id);
      } else {
        // Khởi tại settings cho quiz mới được chọn
        setQuizSettings((prev) => ({
          ...prev,
          [quiz._id]: {
            quizId: quiz._id,
            startTime: null,
            endTime: null,
            duration: null,
            durationHours: 0,
            durationMinutes: 0,
            durationSeconds: 0,
          },
        }));
        return [...prevSelected, quiz];
      }
    });
  };

  const removeSelectedQuiz = (quizId: string) => {
    setSelectedQuizzes((prevSelected) =>
      prevSelected.filter((quiz) => quiz._id !== quizId)
    );

    // Bỏ settings của quiz
    setQuizSettings((prev) => {
      const newSettings = { ...prev };
      delete newSettings[quizId];
      return newSettings;
    });

    // Đóng settings của quiz
    if (showSettingsFor === quizId) {
      setShowSettingsFor(null);
    }
  };

  const toggleSettings = (quizId: string) => {
    setShowSettingsFor(showSettingsFor === quizId ? null : quizId);
  };

  // Validate startTime, endTime và update settings
  const validateAndUpdateQuizSetting = (
    quizId: string,
    field: string,
    value: any
  ) => {
    console.log(value);
    setQuizSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [quizId]: {
          ...prev[quizId],
          [field]: value,
        },
      };

      // Chỉ validate nếu có cả startTime và endTime
      const startTime = updatedSettings[quizId].startTime;
      const endTime = updatedSettings[quizId].endTime;

      if (startTime && endTime) {
        const startDateTime = new Date(startTime).getTime();
        const endDateTime = new Date(endTime).getTime();

        updatedSettings[quizId].validationError =
          startDateTime >= endDateTime
            ? "Start time must be before end time"
            : undefined;
      } else {
        // Xóa validation nếu có thời gian không được set
        updatedSettings[quizId].validationError = undefined;
      }

      return updatedSettings;
    });
  };

  const updateDurationField = (
    quizId: string,
    field: string,
    value: string
  ) => {
    // Đàm bảo value không âm
    const numValue = Math.max(0, parseInt(value) || 0);

    setQuizSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [quizId]: {
          ...prev[quizId],
          [field]: numValue,
        },
      };

      // Tính total duration
      const hours = updatedSettings[quizId].durationHours || 0;
      const minutes = updatedSettings[quizId].durationMinutes || 0;
      const seconds = updatedSettings[quizId].durationSeconds || 0;

      updatedSettings[quizId].duration = hours * 3600 + minutes * 60 + seconds;

      return updatedSettings;
    });
  };

  // Check xem có quiz nào lỗi validation không
  const hasValidationErrors = () => {
    return Object.values(quizSettings).some(
      (settings) => settings.validationError
    );
  };

  const handleAddQuizzes = useMutation({
    mutationFn: async () => {
      // Check validation
      if (hasValidationErrors()) {
        showToast(
          "error",
          "Please fix the validation errors before adding quizzes."
        );
        return;
      }

      const formattedQuizzes = selectedQuizzes.map((quiz) => {
        const settings = quizSettings[quiz._id];
        return {
          quizId: quiz._id,
          startTime: settings.startTime
            ? new Date(settings.startTime)
            : undefined,
          endTime: settings.endTime ? new Date(settings.endTime) : undefined,
          duration: settings.duration || undefined,
        };
      });

      const addedQuizzes = await classroomService.addQuizzesToClassroom(
        classroomInfo._id,
        formattedQuizzes
      );

      if (id) {
        queryClient.invalidateQueries({
          queryKey: ["classroomMaterials", classroomInfo._id],
        });
      }
      showToast("success", "Quizzes added successfully!");
      handleCloseModal();
      return addedQuizzes;
      console.log("RESPONSE", addedQuizzes);
    },
    onError: (error) => {
      console.error("Error adding quizzes:", error);
      showToast("error", "Failed to add quizzes. Please try again.");
      showToast("error", error.message);
    },
  });

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedQuizzes([]);
    setQuizSettings({});
    setSearchQuery("");
    setFilteredQuizzes([]);
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
          <h3 className="text-lg font-medium mb-3">Add Quizzes to Classroom</h3>

          <div className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-2 mb-3">
            <MdSearch className="text-xl text-gray-600" />
            <input
              type="text"
              className="w-full p-2 border-none rounded-md focus:outline-none focus:ring-0"
              placeholder="Search for quizzes..."
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

          {/* Selected quizzes with settings */}
          {selectedQuizzes.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Selected Quizzes
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="border border-gray-200 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-800">
                        {quiz.quizName}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSettings(quiz._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Quiz Settings"
                        >
                          <MdSettings />
                        </button>
                        <button
                          onClick={() => removeSelectedQuiz(quiz._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdClose />
                        </button>
                      </div>
                    </div>

                    {showSettingsFor === quiz._id && (
                      <div className="mt-2 space-y-2 p-2 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Time (optional)
                          </label>
                          <input
                            type="datetime-local"
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 text-sm ${
                              quizSettings[quiz._id]?.validationError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            }`}
                            value={quizSettings[quiz._id]?.startTime || ""}
                            onChange={(e) =>
                              validateAndUpdateQuizSetting(
                                quiz._id,
                                "startTime",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Time (optional)
                          </label>
                          <input
                            type="datetime-local"
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 text-sm ${
                              quizSettings[quiz._id]?.validationError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            }`}
                            value={quizSettings[quiz._id]?.endTime || ""}
                            onChange={(e) =>
                              validateAndUpdateQuizSetting(
                                quiz._id,
                                "endTime",
                                e.target.value
                              )
                            }
                          />
                          {quizSettings[quiz._id]?.validationError && (
                            <p className="mt-1 text-sm text-red-600">
                              {quizSettings[quiz._id]?.validationError}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Duration (optional)
                          </label>
                          <div className="flex gap-2 mt-1">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Hours
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="23"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-sm"
                                value={
                                  quizSettings[quiz._id]?.durationHours || ""
                                }
                                onChange={(e) =>
                                  updateDurationField(
                                    quiz._id,
                                    "durationHours",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Minutes
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-sm"
                                value={
                                  quizSettings[quiz._id]?.durationMinutes || ""
                                }
                                onChange={(e) =>
                                  updateDurationField(
                                    quiz._id,
                                    "durationMinutes",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Seconds
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 text-sm"
                                value={
                                  quizSettings[quiz._id]?.durationSeconds || ""
                                }
                                onChange={(e) =>
                                  updateDurationField(
                                    quiz._id,
                                    "durationSeconds",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          {(quizSettings[quiz._id]?.duration ?? 0) > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Total duration:{" "}
                              {formatDuration(
                                quizSettings[quiz._id]?.duration ?? 0
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz search results */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-4">
            <h4 className="font-medium text-sm text-gray-700">
              Search Results
            </h4>
            {filteredQuizzes.length === 0 && searchQuery ? (
              <p className="text-gray-500 text-sm">
                No quizzes found. Please try another keyword.
              </p>
            ) : filteredQuizzes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Search for quizzes to add to your classroom.
              </p>
            ) : (
              filteredQuizzes.map((quiz) => {
                const isSelected = selectedQuizzes.some(
                  (q) => q._id === quiz._id
                );
                return (
                  <div
                    key={quiz._id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition duration-150 ${
                      isSelected ? "bg-purple-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleSelectQuiz(quiz)}
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <MdOutlineQuiz
                        className={`text-3xl ${
                          isSelected ? "text-purple-600" : "text-gray-400"
                        }`}
                      />

                      <div>
                        <p className="text-gray-900">{quiz.quizName}</p>
                        <p className="text-sm text-gray-500 truncate">
                          Created At:{" "}
                          {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
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
              onClick={() => handleAddQuizzes.mutate()}
              disabled={
                selectedQuizzes.length === 0 ||
                handleAddQuizzes.isPending ||
                hasValidationErrors()
              }
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                selectedQuizzes.length === 0 || hasValidationErrors()
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Add{" "}
              {selectedQuizzes.length > 0 ? `(${selectedQuizzes.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuizModal;