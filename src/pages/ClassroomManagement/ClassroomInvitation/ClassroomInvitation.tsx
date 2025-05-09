import { useEffect, useState } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import decorImg from "../../../assets/images/login/decor-bg.svg";
import { useNavigate, useParams } from "react-router";
import classroomService from "../../Classroom/services/classroomService";
import { useToast } from "../../../hooks/useToast";
import { useMutation } from "@tanstack/react-query";

function ClassroomInvitation() {
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [classroomInfo, setClassroomInfo] = useState<any>({});

  useEffect(() => {
    const fetchClassroomInfo = async () => {
      try {
        if (!token) return;
        const response = await classroomService.getClassroomByInviteToken(
          token
        );
        setClassroomInfo(response);
      } catch (error) {
        showToast("error", "Invalid link.");
        console.error("Error fetching classroom info:", error);
      }
    };

    fetchClassroomInfo();
  }, [token]);

  const handleJoinClassroom = useMutation({
    mutationFn: async () => {
      const response = await classroomService.joinClassroomByInviteToken(
        token!
      );
      showToast("success", "You have joined the classroom successfully.");
      navigate(`/classroom/detail/${response.classroom._id}`);
      return response;
    },
    onError: (error) => {
      // showToast("error", "Failed to join classroom. Please try again.");
      showToast("error", error.message ?? error);
      console.error("Error joining classroom:", error);
    },
  });

  return (
    <div className="w-screen h-full-screen relative flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-500 px-4">
      <img
        src={decorImg}
        alt="Decoration Login"
        className="absolute bottom-0 w-full z-0"
      />
      <div className="border border-gray-200 rounded-xl shadow-lg bg-white px-3 md:px-6 lg:px-10 xl:px-20 py-8 max-w-1/2 flex flex-col items-center justify-center gap-2 p-4 z-10 mb-20">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Classroom Invitation
        </h1>
        <p className="text-gray-600 text-center">
          You have been invited to join this classroom.
        </p>
        <div className="w-full flex items-center justify-center mt-4 mb-7 p-3 border border-gray-200 rounded-lg shadow-md bg-white">
          <div className="">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl bg-purple-100 text-purple-600">
              <SiGoogleclassroom className="text-2xl md:text-4xl" />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center ml-4">
            <h2 className="font-semibold text-base md:text-lg">
              {classroomInfo.classroomName}
            </h2>
            <p className="text-gray-500 text-sm">
              Number of members: {classroomInfo.numberOfStudents}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleJoinClassroom.mutate()}
          className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
        >
          Join Classroom
        </button>
      </div>
    </div>
  );
}

export default ClassroomInvitation;
