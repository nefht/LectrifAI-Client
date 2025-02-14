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
    <div className="w-full h-full-screen"><video src=""></video></div>
  );
}

export default DownloadLectureVideo;
