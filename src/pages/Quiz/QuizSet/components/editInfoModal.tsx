import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MdEditSquare } from "react-icons/md";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import { academicLevels } from "../../../LectureTools/LectureVideoGenerator/constants/lecture-settings";
import { useToast } from "../../../../hooks/useToast";
import quizService from "../../services/quizService";

interface EditInfoModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  quizSetInfo: any;
  setQuizSetInfo: (value: any) => void;
}

function EditInfoModal({
  open,
  setOpen,
  quizSetInfo,
  setQuizSetInfo,
}: EditInfoModalProps) {
  const { id } = useParams();
  const { showToast } = useToast();

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuizSetInfo((prevInfo: any) => ({ ...prevInfo, [name]: value }));
  };

  const handleUpdateQuizSet = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      if (!id) return;
      e.preventDefault();
      const response = await quizService.updateQuizInfo(
        id,
        quizSetInfo.quizName,
        quizSetInfo.academicLevel
      );
      setOpen(false);
    },
    onSuccess: () => {
      showToast("success", "Quiz set information updated successfully.");
    },
    onError: (error) => {
      showToast("error", "Failed to update quiz set information.");
      console.error("Error updating quiz set information:", error);
    },
  });

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <form
        className="fixed inset-0 w-screen overflow-y-auto"
        onSubmit={(e) => handleUpdateQuizSet.mutate(e)}
      >
        <div className="flex min-h-full max-h-[90vh] items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-center">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-purple-200 sm:mx-0 sm:size-10">
                  <MdEditSquare
                    aria-hidden="true"
                    className="text-xl text-purple-600/90"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Edit Quiz Set Information
                  </DialogTitle>
                  <div className="">
                    <p className="text-sm text-gray-500">
                      Make sure to fill in all required fields.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="">
                  <label
                    htmlFor="quizName"
                    className="dark:text-white font-semibold"
                  >
                    Quiz Name
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    name="quizName"
                    maxLength={50}
                    required
                    className="mt-2 border-none w-full rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
                    value={quizSetInfo.quizName}
                    onChange={handleInfoChange}
                  />
                </div>
                <DropdownInput
                  label="Academic Level"
                  required={true}
                  options={academicLevels}
                  selectedValue={
                    quizSetInfo.academicLevel || academicLevels[0].value
                  }
                  onChange={(selectedValue) => {
                    setQuizSetInfo((prevInfo: any) => ({
                      ...prevInfo,
                      academicLevel: selectedValue,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                disabled={handleUpdateQuizSet.isPending}
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
              >
                Confirm
              </button>
              <button
                disabled={handleUpdateQuizSet.isPending}
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
      </form>
    </Dialog>
  );
}

export default EditInfoModal;
