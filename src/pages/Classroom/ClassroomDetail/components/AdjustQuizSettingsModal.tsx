import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classroomService from "../../services/classroomService";
import { formatDuration } from "../ClassroomDetail";
import { useToast } from "../../../../hooks/useToast";
import { formatToLocalISOString } from "../../../../utils/ComponentBase";

interface AdjustQuizSettingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  quizInfo: any;
  classroomId: string;
}

interface QuizSettings {
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
}

function AdjustQuizSettingModal({
  open,
  setOpen,
  quizInfo,
  classroomId,
}: AdjustQuizSettingModalProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    startTime: null,
    endTime: null,
    duration: null,
    durationHours: 0,
    durationMinutes: 0,
    durationSeconds: 0,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (quizInfo && open) {
      const startTimeFormatted = quizInfo.startTime
        ? formatToLocalISOString(quizInfo.startTime)
        : null;

      const endTimeFormatted = quizInfo.endTime
        ? formatToLocalISOString(quizInfo.endTime)
        : null;

      // Parse duration thành hours, minutes, seconds
      const duration = quizInfo.duration || 0;
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;

      setQuizSettings({
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        duration: duration,
        durationHours: hours,
        durationMinutes: minutes,
        durationSeconds: seconds,
      });

      setValidationError(null);
    }
  }, [quizInfo, open]);

  useEffect(() => {
    // Validate thời gian mở < thời gian đóng
    if (quizSettings.startTime && quizSettings.endTime) {
      const startTime = new Date(quizSettings.startTime).getTime();
      const endTime = new Date(quizSettings.endTime).getTime();

      if (startTime >= endTime) {
        setValidationError("Start time must be before end time");
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [quizSettings.startTime, quizSettings.endTime]);

  const updateQuizSetting = (field: string, value: any) => {
    setQuizSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateDurationField = (field: string, value: string) => {
    // Đảm bảo value không âm
    const numValue = Math.max(0, parseInt(value) || 0);

    setQuizSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [field]: numValue,
      };

      // Tính total duration
      const hours = updatedSettings.durationHours || 0;
      const minutes = updatedSettings.durationMinutes || 0;
      const seconds = updatedSettings.durationSeconds || 0;

      updatedSettings.duration = hours * 3600 + minutes * 60 + seconds;

      return updatedSettings;
    });
  };

  const handleUpdateQuizSettings = useMutation({
    mutationFn: async () => {
      const updatedSettings = {
        startTime: quizSettings.startTime
          ? new Date(quizSettings.startTime)
          : undefined,
        endTime: quizSettings.endTime
          ? new Date(quizSettings.endTime)
          : undefined,
        duration: quizSettings.duration ?? undefined,
      };
      console.log("Updated settings:", updatedSettings);

      const response = await classroomService.updateClassroomQuiz(
        quizInfo._id,
        updatedSettings
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["classroomMaterials", classroomId],
      });

      showToast("success", "Quiz settings updated successfully!");
      handleCloseModal();
      return response;
    },
    onError: (error) => {
      console.error("Error updating quiz settings:", error);
      showToast("error", "Failed to update quiz settings. Please try again.");
    },
  });

  const handleCloseModal = () => {
    setOpen(false);
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
        <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Adjust Quiz Settings</h3>

          {quizInfo && (
            <div className="mb-4">
              <div className="font-semibold mb-2 text-teal-800">
                {"Quiz: " + quizInfo?.quizId?.quizName || "Quiz"}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time (optional)
                  </label>
                  <input
                    type="datetime-local"
                    className={`block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 text-sm ${
                      validationError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    }`}
                    value={quizSettings.startTime || ""}
                    onChange={(e) =>
                      updateQuizSetting("startTime", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time (optional)
                  </label>
                  <input
                    type="datetime-local"
                    className={`block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 text-sm ${
                      validationError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    }`}
                    value={quizSettings.endTime || ""}
                    onChange={(e) =>
                      updateQuizSetting("endTime", e.target.value)
                    }
                  />
                  {validationError && (
                    <p className="mt-1 text-ssm text-red-600">
                      {validationError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (optional)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-sm"
                        value={quizSettings.durationHours}
                        onChange={(e) =>
                          updateDurationField("durationHours", e.target.value)
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
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-sm"
                        value={quizSettings.durationMinutes}
                        onChange={(e) =>
                          updateDurationField("durationMinutes", e.target.value)
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
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-sm"
                        value={quizSettings.durationSeconds}
                        onChange={(e) =>
                          updateDurationField("durationSeconds", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {(quizSettings.duration ?? 0) > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Total duration:{" "}
                      {formatDuration(quizSettings?.duration ?? 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleUpdateQuizSettings.mutate()}
              disabled={
                handleUpdateQuizSettings.isPending ||
                !!validationError ||
                (!quizSettings.startTime &&
                  !quizSettings.endTime &&
                  !quizSettings.duration)
              }
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                validationError
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              } disabled:bg-teal-400`}
            >
              {handleUpdateQuizSettings.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjustQuizSettingModal;
