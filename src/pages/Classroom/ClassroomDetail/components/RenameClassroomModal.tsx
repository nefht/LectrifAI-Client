import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import classroomService from "../../services/classroomService";
import { useToast } from "../../../../hooks/useToast";

interface RenameClassroomModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomInfo: any;
  setUserClassrooms?: React.Dispatch<React.SetStateAction<any>>;
}

function RenameClassroomModal({
  open,
  setOpen,
  classroomInfo,
  setUserClassrooms,
}: RenameClassroomModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [classroomName, setClassroomName] = useState<string>("");

  useEffect(() => {
    if (open && classroomInfo) {
      setClassroomName(classroomInfo.classroomName || "");
    }
  }, [open, classroomInfo]);

  const handleRenameClassroom = useMutation({
    mutationFn: async () => {
      if (!classroomName.trim()) {
        showToast("warning", "Classroom name cannot be empty");
        return;
      }

      try {
        const response = await classroomService.renameClassroom(
          classroomInfo._id,
          classroomName
        );

        if (id) {
          queryClient.invalidateQueries({
            queryKey: ["classroom", classroomInfo._id],
          });
        } else {
          if (setUserClassrooms) {
            setUserClassrooms((oldData: any) =>
              oldData.map((data: any) => {
                if (data._id === classroomInfo._id) {
                  return {
                    ...data,
                    classroomName: classroomName,
                  };
                } else {
                  return { ...data };
                }
              })
            );
          }
        }
        showToast("success", "Classroom renamed successfully");
        handleCloseModal();
      } catch (error) {
        console.error(error);
        showToast("error", "Failed to rename classroom");
      }
    },
    onError: () => {
      showToast("error", "Failed to rename classroom");
    },
  });

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
            <div
              className={`fixed inset-0 z-50 ${open ? "block" : "hidden"}`}
              onClick={() => setOpen(false)}
            >
              <div
                className="w-full h-full flex justify-center items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-5 py-4 rounded-xl shadow-xl w-full max-w-md">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Rename Classroom
                  </Dialog.Title>

                  <div className="mb-4 flex flex-col">
                    <label
                      htmlFor="classroomName"
                      className="self-start block text-sm font-medium text-gray-800 mb-1"
                    >
                      Classroom Name
                    </label>
                    <input
                      required
                      maxLength={50}
                      type="text"
                      id="classroomName"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter classroom name"
                      value={classroomName}
                      onChange={(e) => {
                        setClassroomName(e.target.value);
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="sm:flex sm:flex-row-reverse pt-4 border-t border-gray-200">
                    <button
                      disabled={handleRenameClassroom.isPending}
                      onClick={() => handleRenameClassroom.mutate()}
                      type="button"
                      className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto bg-purple-600 hover:bg-purple-700"
                    >
                      {handleRenameClassroom.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      disabled={handleRenameClassroom.isPending}
                      type="button"
                      data-autofocus
                      onClick={handleCloseModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default RenameClassroomModal;
