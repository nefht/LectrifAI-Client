import { useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import { useHeader } from "../../hooks/useHeader";
import ClassroomSidebar from "./components/ClassroomSidebar";
import JoinedClassroomCard from "./components/JoinedClassroomCard";
import MyClassroomCard from "./components/MyClassroomCard";

function ClassroomManagement() {
  const { setHeaderClass } = useHeader();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setHeaderClass("bg-header shadow-md border-b border-b-gray-200");
  }, []);

  return (
    <div className="flex h-full">
      <div
        className="fixed top-20 left-0 w-7 h-16 group bg-purple-200 rounded-r-xl flex items-center shadow-lg cursor-pointer hover:bg-purple-300/80 transition-all duration-200 ease-in-out hover:text-purple-500 active:scale-90"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaCaretRight className="text-3xl text-purple-400 group-hover:text-purple-500" />
      </div>
      <ClassroomSidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
      <div className="flex w-full items-center justify-center">
        {/* <div
          className={`grid grid-cols-1 gap-x-8 gap-y-10 ${
            isSidebarOpen
              ? "p-10 md:pl-28 xl:pl-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-14 xl:px-20 py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
        >
          <JoinedClassroomCard />
          <JoinedClassroomCard />
          <JoinedClassroomCard />
          <JoinedClassroomCard />
          <JoinedClassroomCard />
          <JoinedClassroomCard />
          <JoinedClassroomCard />
        </div> */}
        <div
          className={`grid grid-cols-1 gap-x-8 gap-y-10 ${
            isSidebarOpen
              ? "p-10 md:pl-28 xl:pl-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "px-14 xl:px-20 py-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
        >
          <MyClassroomCard />
          <MyClassroomCard />
          <MyClassroomCard />
          <MyClassroomCard />
          <MyClassroomCard />
          <MyClassroomCard />
          <MyClassroomCard />
        </div>
      </div>
    </div>
  );
}

export default ClassroomManagement;
