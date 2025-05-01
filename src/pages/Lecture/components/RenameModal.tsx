import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import lectureVideoService from "../../LectureTools/services/lectureVideoService";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";

interface RenameModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedLecture: any;
  onRenameSuccess?: (newName: string) => void;
}

function RenameModal({
  open,
  setOpen,
  selectedLecture,
  onRenameSuccess,
}: RenameModalProps) {
  const { showToast } = useToast();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (selectedLecture) {
      setNewName(selectedLecture.lectureName || "");
    }
  }, [selectedLecture]);

  const renameLectureMutation = useMutation({
    mutationFn: async () => {
      const lectureId = selectedLecture._id.$oid || selectedLecture._id;
      const response = await lectureVideoService.updateLectureVideo(
        lectureId,
        newName
      );
      console.log(response);
    },
    onSuccess: () => {
      showToast("success", "Lecture renamed successfully");
      setOpen(false);
      if (onRenameSuccess) {
        onRenameSuccess(newName);
      }
    },
    onError: (error) => {
      showToast(
        "error",
        "Failed to rename lecture: " + (error.message || "Unknown error")
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") {
      showToast("error", "Lecture name cannot be empty");
      return;
    }
    renameLectureMutation.mutate();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Rename Lecture
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="lectureName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Lecture Name
                          </label>
                          <input
                            type="text"
                            name="lectureName"
                            id="lectureName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter lecture name"
                            autoFocus
                          />
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={renameLectureMutation.isPending}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                          >
                            {renameLectureMutation.isPending
                              ? "Renaming..."
                              : "Rename"}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default RenameModal;
