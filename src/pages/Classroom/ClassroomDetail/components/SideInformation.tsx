import { PiCirclesThreePlusBold, PiRanking } from "react-icons/pi";
import { useAuth } from "../../../../hooks/useAuth";
import { MdOutlineForum, MdOutlinePlayLesson } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import AddStudentModal from "./AddStudentsModal";
import { useEffect, useState } from "react";
import AddQuizModal from "./AddQuizModal";

interface SideInformationProps {
  classroomInfo: any;
  setClassroomInfo: React.Dispatch<React.SetStateAction<any>>;
}

function SideInformation({
  classroomInfo,
  setClassroomInfo,
}: SideInformationProps) {
  const { user } = useAuth();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);

  return (
    <>
      <AddStudentModal
        open={isAddUserModalOpen}
        setOpen={setIsAddUserModalOpen}
      />
      <AddQuizModal open={isAddQuizModalOpen} setOpen={setIsAddQuizModalOpen} />
      <div className="flex flex-col w-full px-8 py-4 bg-header border border-purple-200 shadow-md rounded-md">
        <h2 className="font-semibold text-xl text-center mb-4">
          {classroomInfo.classroomName}
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Classroom's owner:</span>{" "}
          {classroomInfo?.userId?.fullName}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">No. Members:</span>{" "}
          {classroomInfo?.students?.length} people
        </p>
        <div className="flex flex-col items-start w-full mt-2 pt-3 border-t border-t-purple-200 text-sm">
          {classroomInfo?.userId?._id === user?.id && (
            <div className="flex flex-col w-full pb-2 mb-2 border-b border-b-purple-200">
              <div
                className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                <p className="text-gray-800">Add student</p>
                <BiUserPlus className="text-xl text-black/50 group-hover:text-black/90" />
              </div>
              <div
                className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
                onClick={() => setIsAddQuizModalOpen(true)}
              >
                <p className="text-gray-800"> Add quiz</p>
                <PiCirclesThreePlusBold className="text-lg text-black/50 group-hover:text-black/90" />
              </div>
              <div className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer">
                <p className="text-gray-800"> Add lecture</p>
                <MdOutlinePlayLesson className="text-md text-black/50 group-hover:text-black/90" />
              </div>
            </div>
          )}
          <div className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer">
            <p className="text-gray-800">List of students</p>
            <IoPeopleOutline className="text-lg text-black/50 group-hover:text-black/90" />
          </div>
          <div className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer">
            <p className="text-gray-800"> Ranking</p>
            <PiRanking className="text-xl text-black/50 group-hover:text-black/90" />
          </div>
          {/* <div className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer">
            <p className="text-gray-800"> Forum</p>
            <MdOutlineForum className="text-md text-black/50 group-hover:text-black/90" />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default SideInformation;
