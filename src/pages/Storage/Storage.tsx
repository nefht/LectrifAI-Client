import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import SlidesList from "../Slide/SlidesList/SlidesList";
import LecturesList from "../Lecture/LecturesList/LecturesList";
import QuizzesList from "../Quiz/QuizzesList/QuizzesList";
import { useHeader } from "../../hooks/useHeader";

function Storage() {
  const { setHeaderClass } = useHeader();
  const tabs: Array<"slides" | "lectures" | "quizzes"> = [
    "slides",
    "lectures",
    "quizzes",
  ];
  const [selectedTab, setSelectedTab] = useState<
    "slides" | "lectures" | "quizzes"
  >(tabs[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const baseStyle =
    "font-medium rounded-lg text-ssm md:text-sm lg:text-base px-3 md:px-6 py-2 md:py-2.5 text-center transition-all duration-300";
  const activeStyle =
    "text-white bg-gradient-to-br from-purple-600 to-indigo-500 shadow-md";
  const inactiveStyle = "text-gray-700 bg-gray-100 hover:bg-gray-200";

  const tabComponents = {
    slides: <SlidesList searchTerm={searchTerm} />,
    lectures: <LecturesList searchTerm={searchTerm} />,
    quizzes: <QuizzesList searchTerm={searchTerm} />,
  };

  useEffect(() => {
    setHeaderClass("bg-white shadow-lg");
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="sticky top-[4rem] bg-white flex flex-wrap items-center gap-4 w-full h-28 px-4 md:px-10 xl:px-48 py-4 z-20 mb-4">
        <h2 className="md:mr-10 text-2xl md:text-4xl font-degular font-semibold">
          Storage
        </h2>

        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`${baseStyle} ${
              selectedTab === tab ? activeStyle : inactiveStyle
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        {/* Search input */}
        <div className="ml-auto relative w-full md:w-96 lg:w-1/3 xl:w-1/4">
          <input
            type="text"
            placeholder="Search slides, lectures or quizzes..."
            className="w-full text-ssm md:text-sm text-base pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      {tabComponents[selectedTab]}
    </div>
  );
}

export default Storage;
