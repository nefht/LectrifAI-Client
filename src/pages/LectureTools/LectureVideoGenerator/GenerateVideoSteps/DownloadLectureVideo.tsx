import { useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import { useHeader } from "../../../../hooks/useHeader";

function DownloadLectureVideo() {
  // const { setHeaderClass } = useHeader();
  // const { toggleTheme } = useTheme();
  // useEffect(() => {
  //   setHeaderClass("bg-transparent border-none shadow-none");
  //   toggleTheme("dark");
  //   return () => {
  //     toggleTheme("light");
  //   };
  // });
  return (
    <div className="flex flex-col items-center justify-center w-full bg-dark bg-gradient-to-b from-dark to-indigo-950 px-10 md:px-24 xl:px-40 pt-12 md:pt-20 pb-4">
      <h1 className="font-degular font-semibold text-center text-white text-2xl md:text-3xl xl:text-4xl">
        Download lecture video
      </h1>
      <p className="text-lg text-gray-400 text-center mt-4 mb-6">
        Your lecture video has been generated successfully. You can download it here.
      </p>
      <video
        src="https://lectrifai-storage.s3.ap-southeast-2.amazonaws.com/lecture-videos/fad76ce1-d266-46c9-aa6a-1443b1e6e34e.mp4"
        className="w-3/4 mt-6"
        controls
      ></video>
    </div>
  );
}

export default DownloadLectureVideo;
