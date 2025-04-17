import { useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import imgUrl from "../../../assets/images/home/background.png";
import { FaRegEdit } from "react-icons/fa";
import { PiCirclesThreePlusBold } from "react-icons/pi";
import { BiUserPlus } from "react-icons/bi";
import {
  MdDeleteOutline,
  MdOutlinePlayLesson,
  MdOutlineQuiz,
} from "react-icons/md";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import { Menu } from "@headlessui/react";

function MyClassroomCard() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <>
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete Classroom",
          content: `Are you sure you want to delete this question? This action is permanent and cannot be undone.`,
        }}
        handleDelete={() => {}}
      />
      <div className="flex flex-col xl:w-56 xl:max-h-72 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="w-full h-1/2 border-b border-b-gray-300">
          <img src={imgUrl} alt="" className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-2 px-4 py-2 border-b border-b-gray-200">
          <h2 className="font-semibold text-md">Phòng học của Hương Thảo</h2>
          <div className="flex ỉtems-center gap-3">
            <div className="flex items-center justify-center">
              <IoPeopleSharp className="text-gray-700" />
            </div>
            <p className="text-sm text-gray-500">67 students</p>
          </div>
        </div>
        <div className="flex ỉtems-center justify-between px-3 py-2 divide-x divide-gray-300">
          <div className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer">
            <FaRegEdit className="" />
          </div>
          {/* <LuUserPlus /> */}
          <div className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer">
            <BiUserPlus className="text-xl" />
          </div>
          <Menu
            as="div"
            className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <Menu.Button className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer">
              <PiCirclesThreePlusBold className="text-lg" />
            </Menu.Button>
            <Menu.Items
              transition
              anchor="bottom start"
              className="absolute mt-2 max-w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                    onClick={() => {}}
                  >
                    <MdOutlinePlayLesson className="text-md" />
                    Add lecture video
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center gap-2 px-4 py-2 text-gray-800 w-full text-left`}
                    onClick={() => {}}
                  >
                    <MdOutlineQuiz className="text-md" />
                    Add quiz
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div
            className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-red-800 cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <MdDeleteOutline className="text-lg" />
          </div>
        </div>
      </div>
    </>
  );
}

export default MyClassroomCard;
