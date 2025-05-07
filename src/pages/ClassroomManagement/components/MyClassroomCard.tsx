import { useMemo, useState } from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { PiCirclesThreePlusBold } from "react-icons/pi";
import { BiUserPlus } from "react-icons/bi";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router";
import imgUrl from "../../../assets/images/home/background.png";
import {
  MdDeleteOutline,
  MdOutlinePlayLesson,
  MdOutlineQuiz,
} from "react-icons/md";
import DeleteModal from "../../../components/NotificationModal/DeleteModal";
import ClassroomCardBackground from "./ClassroomCardBackground";
import AddStudentModal from "../../Classroom/ClassroomDetail/components/AddStudentsModal";
import AddQuizModal from "../../Classroom/ClassroomDetail/components/AddQuizModal";
import AddLectureVideoModal from "../../Classroom/ClassroomDetail/components/AddLectureVideoModal";
import { useMutation } from "@tanstack/react-query";
import classroomManagementService from "../services/classroomManagementService";
import { useToast } from "../../../hooks/useToast";
import RenameClassroomModal from "../../Classroom/ClassroomDetail/components/RenameClassroomModal";

interface MyClassroomCardProps {
  classroom: any;
  setUserClassrooms: React.Dispatch<React.SetStateAction<any>>;
}

function MyClassroomCard({
  classroom,
  setUserClassrooms,
}: MyClassroomCardProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClassroom = useMutation({
    mutationFn: async () => {
      if (!classroom._id) return;
      const response = await classroomManagementService.deleteClassroom(
        classroom._id
      );
      showToast("success", "Classroom deleted successfully!");
      setUserClassrooms((prevClassrooms: any) =>
        prevClassrooms.filter((classroom: any) => classroom._id !== response._id)
      );
      setIsDeleteModalOpen(false);
      return response;
    },
    onError: (error) => {
      showToast("error", "Failed to delete classroom. Please try again later.");
    },
  });

  return (
    <>
      <RenameClassroomModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        classroomInfo={classroom}
        setUserClassrooms={setUserClassrooms}
      />
      <AddStudentModal
        open={isAddStudentModalOpen}
        setOpen={setIsAddStudentModalOpen}
        classroomInfo={classroom}
        setUserClassrooms={setUserClassrooms}
      />
      <AddQuizModal
        open={isAddQuizModalOpen}
        setOpen={setIsAddQuizModalOpen}
        classroomInfo={classroom}
      />
      <AddLectureVideoModal
        open={isAddLectureModalOpen}
        setOpen={setIsAddLectureModalOpen}
        classroomInfo={classroom}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete Classroom",
          content: `Are you sure you want to delete this question? This action is permanent and cannot be undone.`,
        }}
        disabledButton={handleDeleteClassroom.isPending}
        handleDelete={() => handleDeleteClassroom.mutate()}
      />
      <div className="flex flex-col w-56 min-[470px]:w-44 min-[550px]:w-56 xl:w-56 xl:max-h-78 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div
          className="w-full border-b border-b-gray-300 cursor-pointer"
          onClick={() => navigate(`/classroom/detail/${classroom._id}`)}
        >
          {/* <img src={imgUrl} alt="" className="w-full h-full" /> */}
          <div className="w-full h-32">
            <ClassroomCardBackground classroomId={classroom._id} />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 py-2">
          <h2 className="font-semibold text-md">{classroom.classroomName}</h2>
          <div className="flex ỉtems-center gap-3">
            <div className="flex items-center justify-center">
              <IoPeopleSharp className="text-gray-700" />
            </div>
            <p className="text-sm text-gray-500">
              {classroom.students.length} students
            </p>
          </div>
        </div>
        <div className="mt-auto flex ỉtems-center justify-between px-3 py-2 border-t border-t-gray-200 divide-x divide-gray-300">
          <div
            onClick={() => setIsEditModalOpen(true)}
            className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <FaRegEdit className="" />
          </div>
          {/* <LuUserPlus /> */}
          <div
            onClick={() => setIsAddStudentModalOpen(true)}
            className="w-full flex items-center justify-center py-1 text-gray-500 hover:text-gray-900 cursor-pointer"
          >
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
                    onClick={() => {
                      setIsAddLectureModalOpen(true);
                    }}
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
                    onClick={() => {
                      setIsAddQuizModalOpen(true);
                    }}
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
