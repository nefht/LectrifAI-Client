import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import { useHeader } from "../../../hooks/useHeader";
import { useTheme } from "../../../hooks/useTheme";

function LectureVideoGenerator() {
  const navigate = useNavigate();
  const { setHeaderClass } = useHeader();
  const { toggleTheme } = useTheme();
  const text = "Lecture Video Generator";

  const updateThemeAndHeader = () => {
    if (window.scrollY > 50) {
      toggleTheme("light");
      setHeaderClass("bg-white");
    } else {
      toggleTheme("dark");
      setHeaderClass("shadow-none border-none dark:bg-transparent");
    }
  };

  useEffect(() => {
    updateThemeAndHeader(); // Initial call
    window.addEventListener("scroll", updateThemeAndHeader);
    return () => {
      window.removeEventListener("scroll", updateThemeAndHeader);
      toggleTheme("light"); // Reset theme to light when unmounting
    };
  }, []);

  return (
    <>
      <div className="relative flex flex-col items-center py-40 w-full h-[135vh] bg-universe bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center px-10 md:px-20 lg:px-56 xl:px-72">
          <h1 className="text-center overflow-hidden text-4xl lg:text-5xl xl:text-6xl font-semibold font-degular leading-snug text-white">
            {text.match(/./gu)!.map((char, index) => (
              <span
                className="animate-text-reveal inline-block [animation-fill-mode:backwards]"
                key={`${char}-${index}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="text-xl text-purple-200 text-center mt-6">
            Effortlessly create professional lecture videos with AI-powered
            voiceovers and personalized scripts. Upload your slides, customize
            the style, and let our system do the rest—perfect for educators,
            trainers, and content creators.
          </p>
          <button
            type="button"
            className="flex gap-2 items-center justify-center mt-10 text-white text-xl bg-gradient-to-br from-purple-700 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-purple-700 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => navigate("/lecture/generate-video-process/input")}
          >
            Get started
            <FaArrowRight />
          </button>
        </div>
        <div className="absolute w-full h-1/2 top-1/2 left-0 right-0 bg-blur-gradient"></div>
      </div>
      <div className="w-full h-screen bg-white"></div>
    </>
  );
}

export default LectureVideoGenerator;
