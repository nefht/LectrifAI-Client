import {
  FaBell,
  FaCaretLeft,
  FaChalkboardTeacher,
  FaRegPlusSquare,
} from "react-icons/fa";
import { FaAnglesLeft } from "react-icons/fa6";
import { IoIosLogIn } from "react-icons/io";
import { SiGoogleclassroom } from "react-icons/si";

interface ClassroomSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

function ClassroomSidebar({
  open,
  setOpen,
  selectedTab,
  setSelectedTab,
}: ClassroomSidebarProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <div className="z-40 fixed top-0 left-0 w-72 h-screen bg-header shadow-sm border-r border-r-purple-200/80 flex flex-col pt-20 px-4">
        {/* <div className="absolute top-20 right-[-24px] w-6 h-12 bg-purple-200 rounded-r-xl flex items-center shadow-lg cursor-pointer hover:bg-purple-300/80 transition-all duration-200 ease-in-out hover:text-purple-500">
          <FaCaretLeft className="text-3xl text-purple-400"/>
        </div> */}
        <div className="group flex items-center justify-between pb-4 mb-3 border-b border-b-purple-200">
          <div className="font-degular font-semibold text-[22px]/relaxed gradient-text">
            Classroom Management
          </div>
          <FaAnglesLeft
            className="-me-2 text-xl text-violet-900/50 group-hover:text-purple-900/60 active:scale-90 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <div
          className={`group w-full p-3 flex items-center gap-3 hover:bg-dark/5 cursor-pointer
            ${selectedTab === "Joined Classrooms" ? "bg-black/5" : ""}`}
          onClick={() => setSelectedTab("Joined Classrooms")}
        >
          <SiGoogleclassroom className="text-xl text-violet-900/50 group-hover:text-gray-900" />
          <div className="font-medium text-gray-800">Joined Classrooms</div>
        </div>
        <div
          className={`group w-full p-3 flex items-center gap-3 hover:bg-dark/5 cursor-pointer
            ${selectedTab === "My Classrooms" ? "bg-black/5" : ""}`}
          onClick={() => setSelectedTab("My Classrooms")}
        >
          <FaChalkboardTeacher className="text-xl text-violet-900/50 group-hover:text-gray-900" />
          <div className="font-medium text-gray-800">My Classrooms</div>
        </div>
        {/* <div
          className="group w-full p-3 flex items-center justify-between gap-3 hover:bg-dark/5 cursor-pointer"
          onClick={() => setSelectedTab("Notifications")}
        >
          <div className="flex items-center gap-3">
            <FaBell className="text-xl text-violet-900/50 group-hover:text-gray-900" />
            <div className="font-medium text-gray-800">Notifications</div>
          </div>
          <div className="flex items-center justify-center rounded-full w-6 h-6 text-sm text-purple-600 font-medium bg-purple-300">
            3
          </div>
        </div> */}
        <div className="w-full border-b border-b-purple-200 my-2"></div>
        <div
          className={`group w-full p-3 flex items-center gap-3 hover:bg-dark/5 cursor-pointer
            ${selectedTab === "Create Classroom" ? "bg-black/5" : ""}`}
          onClick={() => setSelectedTab("Create Classroom")}
        >
          <FaRegPlusSquare className="text-xl text-violet-900/50 group-hover:text-gray-900" />
          <div className="font-medium text-gray-800">Create Classroom</div>
        </div>
        {/* <div className="group w-full p-3 flex items-center gap-3 hover:bg-dark/5 cursor-pointer">
          <IoIosLogIn className="text-2xl text-violet-900/70 group-hover:text-gray-900" />
          <div className="font-medium text-gray-800">Join Classroom</div>
        </div> */}
      </div>
      <div className="hidden md:block w-72 bg-transparent pt-20 px-4"></div>
    </>
  );
}

export default ClassroomSidebar;
