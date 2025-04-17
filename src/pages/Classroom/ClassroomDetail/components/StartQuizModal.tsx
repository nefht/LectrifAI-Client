import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { formatDuration } from "../ClassroomDetail";
import { useNavigate } from "react-router";

interface StartQuizModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  quizInfo: any;
}

function StartQuizModal({ open, setOpen, quizInfo }: StartQuizModalProps) {
  const navigate = useNavigate();
  if (!open) return null;

  const handleStartTest = () => {
    navigate("/classroom/doing-quiz/das")
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full max-h-[90vh] items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="w-full px-4 py-7">
              <h2 className="text-center font-semibold text-xl mb-2">
                {quizInfo.quizId.quizName}
              </h2>
              <p className="text-center text-gray-600 mb-4 font-medium">
                Time limit: {formatDuration(quizInfo?.duration) ?? "No limit"}
              </p>
              <p className="text-center text-gray-800">
                Do you want to start the test?
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                //   disabled={handleUpdateQuizSet.isPending}
                onClick={handleStartTest}
                className="inline-flex w-full justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
              >
                Start
              </button>
              <button
                //   disabled={handleUpdateQuizSet.isPending}
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default StartQuizModal;
