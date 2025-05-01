import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
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
import { editablePermissionTypes } from "../constants/permission-type";

interface CreateRoomModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

function CreateRoomModal({ open, setOpen }: CreateRoomModalProps) {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    timeLimitHours: 0,
    timeLimitMinutes: 0,
    timeLimitSeconds: 0,
    maxPlayers: 0,
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRoom = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id) return;
      // Convert time to seconds
      const timeInSeconds =
        (roomData.timeLimitHours || 0) * 3600 +
        (roomData.timeLimitMinutes || 0) * 60 +
        (roomData.timeLimitSeconds || 0);

      const response = await quizService.createMultiplePlayersRoom(
        id,
        timeInSeconds,
        roomData.maxPlayers
      );
      console.log("response", response);
      navigate(`/quiz-room/${response._id}`);
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
        onSubmit={(e) => handleCreateRoom.mutate(e)}
      >
        <div className="flex min-h-full max-h-[90vh] items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-t-lg">
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
                    Create Quiz Room
                  </DialogTitle>
                  <div className="">
                    <p className="text-sm text-gray-500">
                      Create a room for multiple players.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="">
                  <label
                    htmlFor="timeLimit"
                    className="dark:text-white font-semibold"
                  >
                    Time limit
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="mt-2 flex">
                    <input
                      min={0}
                      type="number"
                      name="timeLimitHours"
                      value={roomData.timeLimitHours}
                      onChange={handleChangeForm}
                      placeholder="00"
                      className="w-16 border-none rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <span className="mx-2 mt-auto mb-2">hours</span>
                    <input
                      type="number"
                      name="timeLimitMinutes"
                      value={roomData.timeLimitMinutes}
                      onChange={handleChangeForm}
                      placeholder="00"
                      min={1}
                      className="w-16 border-none rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <span className="mx-2 mt-auto mb-2">minutes</span>
                    <input
                      min={0}
                      type="number"
                      name="timeLimitSeconds"
                      value={roomData.timeLimitSeconds}
                      onChange={handleChangeForm}
                      placeholder="00"
                      className="w-16 border-none rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <span className="mx-2 mt-auto mb-2">seconds</span>
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="maxPlayers"
                    className="dark:text-white font-semibold"
                  >
                    Max players
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="number"
                    name="maxPlayers"
                    required
                    min={1}
                    value={roomData.maxPlayers}
                    onChange={handleChangeForm}
                    className="mt-2 border-none w-full rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
              >
                Create
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
          </DialogPanel>
        </div>
      </form>
    </Dialog>
  );
}

export default CreateRoomModal;
