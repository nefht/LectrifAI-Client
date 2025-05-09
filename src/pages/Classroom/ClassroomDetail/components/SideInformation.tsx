import { PiCirclesThreePlusBold, PiRanking } from "react-icons/pi";
import { useAuth } from "../../../../hooks/useAuth";
import { MdOutlinePlayLesson } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { CgRename } from "react-icons/cg";
import { IoPeopleOutline } from "react-icons/io5";
import AddStudentModal from "./AddStudentsModal";
import { useEffect, useState } from "react";
import AddQuizModal from "./AddQuizModal";
import AddLectureVideoModal from "./AddLectureVideoModal";
import { useToast } from "../../../../hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import classroomService from "../../services/classroomService";
import { useNavigate } from "react-router";
import RenameClassroomModal from "./RenameClassroomModal";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
interface SideInformationProps {
  classroomInfo: any;
  setClassroomInfo: React.Dispatch<React.SetStateAction<any>>;
}

function SideInformation({
  classroomInfo,
  setClassroomInfo,
}: SideInformationProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    setInviteLink(`${CLIENT_URL}/classroom/join/${classroomInfo.inviteToken}`);
  }, [classroomInfo.inviteToken, CLIENT_URL]);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => showToast("success", "Link copied!"))
      .catch((err) => console.error("Could not copy link:", err));
  };

  const handleResetInviteLink = useMutation({
    mutationFn: async () => {
      const response = await classroomService.resetInviteLink(
        classroomInfo._id
      );
      setInviteLink(response.inviteLink);
      showToast("success", "Invite link reset successfully");
    },
    onError: () => {
      showToast("error", "Failed to reset invite link. Please try again.");
    },
  });

  return (
    <>
      <RenameClassroomModal
        open={isRenameModalOpen}
        setOpen={setIsRenameModalOpen}
        classroomInfo={classroomInfo}
      />
      <AddStudentModal
        open={isAddUserModalOpen}
        setOpen={setIsAddUserModalOpen}
        classroomInfo={classroomInfo}
      />
      <AddQuizModal
        open={isAddQuizModalOpen}
        setOpen={setIsAddQuizModalOpen}
        classroomInfo={classroomInfo}
      />
      <AddLectureVideoModal
        open={isAddLectureModalOpen}
        setOpen={setIsAddLectureModalOpen}
        classroomInfo={classroomInfo}
      />
      <div className="flex flex-col w-full px-8 py-4 bg-header border border-purple-200 shadow-md rounded-md">
        <h2 className="font-semibold text-xl text-center mb-4">
          {classroomInfo.classroomName}
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Classroom's owner:</span>{" "}
          {classroomInfo?.userId?.fullName}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">No. Students:</span>{" "}
          {classroomInfo?.students?.length} people
        </p>
        {inviteLink && classroomInfo?.userId?._id === user?.id && (
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium text-sm text-gray-600">Invite link:</p>
            <button
              className="bg-blue-200 px-2 py-0.5 border border-blue-300 rounded-md font-medium text-sm text-blue-500"
              onClick={copyToClipboard}
            >
              Copy
            </button>
            <button
              disabled={handleResetInviteLink.isPending}
              onClick={() => handleResetInviteLink.mutate()}
              className="bg-purple-200 px-2 py-0.5 border border-purple-300 rounded-md font-medium text-sm text-purple-500"
            >
              Reset
            </button>
          </div>
        )}
        <div className="flex flex-col items-start w-full mt-2 pt-3 border-t border-t-purple-200 text-sm">
          {classroomInfo?.userId?._id === user?.id && (
            <div className="flex flex-col w-full pb-2 mb-2 border-b border-b-purple-200">
              <div
                className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
                onClick={() => setIsRenameModalOpen(true)}
              >
                <p className="text-gray-800">Rename class</p>
                <CgRename className="text-xl text-black/50 group-hover:text-black/90" />
              </div>
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
              <div
                className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
                onClick={() => setIsAddLectureModalOpen(true)}
              >
                <p className="text-gray-800"> Add lecture</p>
                <MdOutlinePlayLesson className="text-md text-black/50 group-hover:text-black/90" />
              </div>
            </div>
          )}
          <div
            onClick={() =>
              navigate(`/classroom/students-list/${classroomInfo._id}`)
            }
            className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
          >
            <p className="text-gray-800">List of students</p>
            <IoPeopleOutline className="text-lg text-black/50 group-hover:text-black/90" />
          </div>
          <div
            onClick={() => navigate(`/classroom/ranking/${classroomInfo._id}`)}
            className="group flex items-center justify-between w-full hover:bg-black/10 hover:font-medium rounded-md p-2 cursor-pointer"
          >
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
