import { IoPeopleSharp } from "react-icons/io5";
import { Avatar } from "flowbite-react";
import { useNavigate } from "react-router";
import imgUrl from "../../../assets/images/home/background.png";
import ClassroomCardBackground from "./ClassroomCardBackground";

interface JoindedClassroomCardProps {
  classroom: any;
}

function JoindedClassroomCard({ classroom }: JoindedClassroomCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-56 min-[470px]:w-44 min-[550px]:w-56 xl:w-56 xl:max-h-78 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div
        className="w-full border-b border-b-gray-300 cursor-pointer"
        onClick={() => navigate(`/classroom/detail/${classroom._id}`)}
      >
        <div className="w-full h-32 overflow-hidden">
          <ClassroomCardBackground classroomId={classroom._id} />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-2 border-b border-b-gray-200 flex-grow">
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
      <div className="flex ỉtems-center px-3 py-3 gap-3">
        <Avatar rounded img={classroom.userId.avatarUrl}/>
        <div className="flex flex-col">
          <p className="font-medium text-sm">{classroom.userId.fullName}</p>
          <p className="text-gray-500 text-ssm">{classroom.userId.account}</p>
        </div>
      </div>
    </div>
  );
}

export default JoindedClassroomCard;
