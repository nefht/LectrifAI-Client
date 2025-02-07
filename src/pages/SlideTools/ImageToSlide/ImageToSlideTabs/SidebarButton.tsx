import { useDrag } from "react-dnd";
import { IoCloudUpload, IoSettingsSharp } from "react-icons/io5";
import { HiTemplate } from "react-icons/hi";
import { TabProps } from "../ImageToSlide";
interface SidebarButtonProps {
  imageToSlideTabs: TabProps[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  handleChangeTab: (tab: TabProps) => void;
}

export const SidebarButton = ({
  imageToSlideTabs,
  setIsSidebarOpen,
  toggleSidebar,
  handleChangeTab,
}: SidebarButtonProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "button",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex group fixed bottom-3 left-3 lg:hidden w-12 h-12"
    >
      {/* Sidebar button */}
      <div
        onClick={toggleSidebar}
        className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 z-50 absolute hover:cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6 group-hover:rotate-90 transition-all duration-[0.6s]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      {/* Upload */}
      <div
        onClick={() => {
          setIsSidebarOpen(true);
          handleChangeTab(imageToSlideTabs[0]);
        }}
        className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:translate-x-16 group-hover:translate-y-2 flex p-2 hover:p-3 bg-green-300 scale-100 hover:bg-green-400 text-white hover:cursor-pointer"
      >
        <IoCloudUpload />
      </div>
      {/* Setting */}
      <div
        onClick={() => {
          setIsSidebarOpen(true);
          handleChangeTab(imageToSlideTabs[1]);
        }}
        className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-12 flex p-2 hover:p-3 bg-blue-300 hover:bg-blue-400 text-white hover:cursor-pointer"
      >
        <IoSettingsSharp />
      </div>
      {/* Templates */}
      <div
        onClick={() => {
          setIsSidebarOpen(true);
          handleChangeTab(imageToSlideTabs[2]);
        }}
        className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-10 group-hover:translate-x-12 flex p-2 hover:p-3 bg-yellow-300 hover:bg-yellow-400 text-white hover:cursor-pointer"
      >
        <HiTemplate />
      </div>
    </div>
  );
};
