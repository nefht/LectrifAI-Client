import { IoPeopleSharp } from "react-icons/io5";
import imgUrl from "../../../assets/images/home/background.png";
import { Avatar } from "flowbite-react";

function JoindedClassroomCard() {
  return (
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
      <div className="flex ỉtems-center px-3 py-3 gap-3">
        <Avatar rounded />
        <div className="flex flex-col">
          <p className="font-medium text-sm">Nguyễn Hương Thảo</p>
          <p className="text-gray-500 text-ssm">maiconht</p>
        </div>
      </div>
    </div>
  );
}

export default JoindedClassroomCard;
