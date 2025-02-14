import { useEffect, useState } from "react";
import SlidePresentation from "../../../../shared/templates/SlidePresentation";
import { useTheme } from "../../../../hooks/useTheme";
import { useHeader } from "../../../../hooks/useHeader";

function ReviewLectureScript() {
  // const { toggleTheme } = useTheme();
  // const { setHeaderClass } = useHeader();
  // useEffect(() => {
  //   toggleTheme("dark");
  //   setHeaderClass("border-none");
  //   return () => {
  //     toggleTheme("light");
  //   };
  // });
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lectureScript, setLectureScript] = useState<string[]>([
    "Welcome everyone! Today, we’ll explore the topic of [Insert Topic]. We’ll cover key concepts, examples, and practical applications. Let’s get started!",
    "Here’s an overview of what we’ll discuss today. We’ll begin with an introduction, move through key points, and wrap up with a summary and Q&A.",
    "Let’s start with the basics. [Insert key concept] is essential because [explain why it matters]. A simple example of this is [give example].",
    "Here’s a deeper dive into [subtopic]. It involves [explain concept]. A common misconception is [address a common mistake].",
    "Now, let’s look at some real-world applications. [Concept] is used in [industry/application], for example, [give real-world use case].",
    "Time for a quick review! Can anyone summarize [key point]? Let’s discuss how this connects to [previous topic].",
    "Moving forward, we introduce [next key topic]. This differs from [previous topic] because [highlight differences].",
    "Here’s a visual representation of [concept]. Notice how [explain key observation]. This helps us understand [implication].",
    "Let’s take a look at a case study. In [example case], [concept] was applied successfully to [describe outcome].",
    "Time for an interactive moment! Think about [question related to topic]. How would you approach this problem?",
    "Wrapping up, here’s a quick summary of what we’ve covered. The key takeaways are [list 2-3 main points].",
    "Thank you for your attention! Now, let’s open the floor for questions. Feel free to ask about anything we discussed today.",
  ]);

  // Hàm callback để nhận slides và currentSlide từ SlidePresentation
  const handleSlidesUpdate = (
    newSlides: JSX.Element[],
    newCurrentSlide: number
  ) => {
    setSlides(newSlides);
    setCurrentSlide(newCurrentSlide);
  };

  return (
    <div className="w-full h-full dark:bg-dark dark:bg-gradient-to-b from-dark to-indigo-950">
      <div className="flex flex-col text-center items-center justify-center px-8 md:px-24 xl:px-40 pt-12 md:pt-20">
        <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl dark:text-white">
          Review lecture script
        </h1>
        <p className="font-degular text-xl dark:text-gray-400 mt-4">
          Take a look at your lecture scripts before turning it into a video.
        </p>
      </div>
      <div className="w-full h-auto flex flex-col lg:flex-row gap-x-4 px-8 py-10 lg:px-20 lg:py-20">
        <div className="w-full lg:w-2/3 min-h-32">
          <SlidePresentation
            templateCode=""
            data={{} as any}
            onSlidesUpdate={handleSlidesUpdate}
          ></SlidePresentation>
        </div>
        <div className="flex flex-col w-full mt-8 lg:mt-0 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap items-center divide-gray-200 divide-x rtl:divide-x-reverse dark:divide-gray-600">
              <div className="flex items-center space-x-1 rtl:space-x-reverse pe-4">
                <p className="text-gray-800 dark:text-white font-semibold">
                  Lecture Script
                </p>
              </div>
              <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse ps-4">
                <p className="text-gray-600 dark:text-gray-300 font-semibold">
                  Slide {currentSlide + 1}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-1.5 px-3 text-sm font-medium text-center text-white bg-purple-700 dark:bg-indigo-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-indigo-900 hover:bg-purple-800 dark:hover:bg-indigo-800"
            >
              Save
            </button>
            <div
              id="tooltip-fullscreen"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Show full screen
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
          <div className="flex flex-grow pl-4 pr-2 py-2 bg-white rounded-b-lg dark:bg-gray-800">
            <textarea
              id="editor"
              className="flex-grow block w-full min-h-40 pl-0 pr-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 custom-scrollbar"
              placeholder="Write an article..."
              required
              value={lectureScript[currentSlide]}
              onChange={(e) => {
                const newLectureScript = [...lectureScript];
                newLectureScript[currentSlide] = e.target.value;
                setLectureScript(newLectureScript);
              }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewLectureScript;
