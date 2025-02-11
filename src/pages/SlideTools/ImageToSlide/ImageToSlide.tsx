import { useEffect, useState } from "react";
import { IoCloudUpload, IoSettingsSharp } from "react-icons/io5";
import { HiTemplate } from "react-icons/hi";
import Draggable from "react-draggable";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { IoMdClose } from "react-icons/io";
import { useHeader } from "../../../hooks/useHeader";
import styles from "./ImageToSlide.module.css";
import UploadTab from "./ImageToSlideTabs/UploadTab";
import SettingTab from "./ImageToSlideTabs/SettingTab";
import helperService from "../../../services/helperService";
import { SidebarButton } from "./ImageToSlideTabs/SidebarButton";
import ImageTemplatesTab from "./ImageToSlideTabs/ImageTemplatesTab";
import { ImageToSlideProvider } from "./context/ImageToSlideContext";

export interface TabProps {
  name: string;
  icon: JSX.Element;
  tabDetail: JSX.Element;
}

function ImageToSlide() {
  const [languages, setLanguages] = useState([
    { code: "eng", name: "English" },
  ]);
  const imageToSlideTabs = [
    {
      name: "Upload",
      icon: <IoCloudUpload className="text-base" />,
      tabDetail: <UploadTab />,
    },
    {
      name: "Setting",
      icon: <IoSettingsSharp className="text-base" />,
      tabDetail: <SettingTab languages={languages} />,
    },
    {
      name: "Templates",
      icon: <HiTemplate className="text-base" />,
      tabDetail: <ImageTemplatesTab />,
    },
  ];
  const { setHeaderClass } = useHeader();
  const [currentTab, setCurrentTab] = useState(imageToSlideTabs[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setHeaderClass("border-none bg-purple-200");

    // Handle screen resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lấy danh sách ngôn ngữ
  useEffect(() => {
    const fetLanguages = async () => {
      const response = await helperService.getAllLanguages();
      setLanguages(response);
    };
    fetLanguages();
  }, []);

  const handleChangeTab = (tab: TabProps) => {
    setCurrentTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ImageToSlideProvider>
      <div className="flex w-full h-full bg-gradient-to-b from-header to-background overflow-hidden">
        <div
          className={`lg:flex xl:w-1/3 lg:relative flex fixed bg-white w-screen sm:w-[50vw] h-full-screen transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="md:flex px-2 py-4">
            <ul className="flex-column space-y space-y-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              {imageToSlideTabs.map((tab, index) => (
                <li key={index} onClick={() => handleChangeTab(tab)}>
                  <a
                    href="#"
                    className={`flex flex-col items-center px-2 py-2 rounded-lg ${
                      tab.name === currentTab.name
                        ? "text-white bg-purple-700 rounded-lg active w-full dark:bg-purple-600"
                        : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col w-full max-h-full-screen px-4 pt-4 bg-white overflow-y-scroll custom-scrollbar">
            <p
              className={`text-center font-degular font-bold text-lg md:text-2xl ${styles["gradient-text"]}`}
            >
              Image to Slide converter
            </p>
            <p className="text-xs md:text-sm text-center text-gray-800 pb-4 mb-4 border-b border-gray-200">
              Paste your images to convert to slides
            </p>
            {currentTab.tabDetail}

            <div className="sticky bottom-0 w-full py-6 bg-white">
              <button
                type="submit"
                className="flex items-center justify-center w-full gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
              >
                <SparklesIcon className="size-5" />
                Generate presentation
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar button */}
        <Draggable>
          <div className="flex group fixed bottom-3 left-3 lg:hidden w-12 h-12">
            <div className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 z-50 absolute hover:cursor-pointer">
              {isSidebarOpen ? (
                <IoMdClose
                  className="w-6 h-6 group-hover:rotate-90 transition-all duration-[0.6s]"
                  onClick={toggleSidebar}
                  onTouchEnd={toggleSidebar}
                />
              ) : (
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
              )}
            </div>
            <div
              onClick={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[0]);
              }}
              onTouchEnd={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[0]);
              }}
              className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:translate-x-16 group-hover:translate-y-2 flex p-2 hover:p-3 bg-green-300 scale-100 hover:bg-green-400 text-white hover:cursor-pointer"
            >
              <IoCloudUpload />
            </div>
            <div
              onClick={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[1]);
              }}
              onTouchEnd={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[1]);
              }}
              className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-12 flex p-2 hover:p-3 bg-blue-300 hover:bg-blue-400 text-white hover:cursor-pointer"
            >
              <IoSettingsSharp />
            </div>
            <div
              onClick={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[2]);
              }}
              onTouchEnd={() => {
                setIsSidebarOpen(true);
                handleChangeTab(imageToSlideTabs[2]);
              }}
              className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-10 group-hover:translate-x-12 flex p-2 hover:p-3 bg-yellow-300 hover:bg-yellow-400 text-white hover:cursor-pointer"
            >
              <HiTemplate />
            </div>
          </div>
        </Draggable>
        {/* <SidebarButton
          imageToSlideTabs={imageToSlideTabs}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleChangeTab={handleChangeTab}
        /> */}

        {/* Slide preview */}
        <iframe
          src="https://docs.google.com/presentation/d/1VJpqD1qkAJT0E2vcDRYDzMzDlybyFYQY/preview#slide=id.p1"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Google Slides Viewer"
          className="w-full h-full-screen"
        ></iframe>
      </div>
    </ImageToSlideProvider>
  );
}

export default ImageToSlide;
