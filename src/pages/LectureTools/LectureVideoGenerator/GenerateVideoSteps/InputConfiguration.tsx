import { useEffect, useState } from "react";
import { useHeader } from "../../../../hooks/useHeader";
import { useTheme } from "../../../../hooks/useTheme";
import { FaFileImage, FaFilePowerpoint } from "react-icons/fa6";
import LectureGeneralSettings from "../components/LectureGeneralSettings";
import LectureContentSettings from "../components/LectureContentSettings";

function InputConfiguration() {
  // const { setHeaderClass } = useHeader();
  // const { toggleTheme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File>(); // Lưu danh sách URL ảnh
  const fileAssets = [
    // .pptx
    {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      fileExtension: ".pptx",
      icon: <FaFilePowerpoint />,
      color: "orange-500",
    },
    // image
    {
      type: "image/jpeg",
      fileExtension: ".jpg",
      icon: <FaFileImage />,
      color: "green-500",
    },
    {
      type: "image/png",
      fileExtension: ".png",
      icon: <FaFileImage />,
      color: "indigo-700",
    },
    {
      type: "image/gif",
      fileExtension: ".gif",
      icon: <FaFileImage />,
      color: "purple-500",
    },
    {
      type: "image/svg+xml",
      fileExtension: ".svg",
      icon: <FaFileImage />,
      color: "pink-500",
    },
  ];

  // useEffect(() => {
  //   setHeaderClass("bg-transparent border-none shadow-none");
  //   toggleTheme("dark");
  //   return () => {
  //     toggleTheme("light");
  //   };
  // });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setUploadedFile(files?.[0]);
    console.log(files?.[0]);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-dark bg-gradient-to-b from-dark to-indigo-950 px-10 md:px-24 xl:px-40 pt-12 md:pt-20 pb-4">
      <h1 className="font-degular font-semibold text-center text-white text-2xl md:text-3xl xl:text-4xl">
        Generate your lecture video
      </h1>
      <p className="text-lg text-gray-400 text-center mt-4 mb-6">
        Upload your slides, customize the style, and let our system do the rest.
      </p>

      {/* Upload Area */}
      <div className="w-full lg:w-2/3 xl:w-3/5 my-2">
        <p className="font-semibold text-base text-white mb-2">
          Upload your file
        </p>
        {uploadedFile ? (
          <>
            <p className="text-base text-gray-400 mb-6">
              This is the file you uploaded, continue or click the file to
              upload another file.
            </p>
            <label
              htmlFor="file-upload"
              className="flex border border-gray-200 bg-gray-200 px-8 py-6 rounded-xl shadow-lg hover:bg-gray-200 hover:border-gray-400 hover:cursor-pointer"
            >
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pptx,image/*"
                className="sr-only"
                onChange={(e) => handleFileChange(e)}
              />
              <div className="flex items-center mr-8">
                {fileAssets.map((asset, index) =>
                  uploadedFile instanceof File ? (
                    <div
                      key={index}
                      className={`text-6xl text-gray-700 text-${asset.color}`}
                    >
                      {asset.type === uploadedFile?.type ||
                      asset.fileExtension ===
                        uploadedFile?.name.substring(
                          uploadedFile?.name.lastIndexOf(".")
                        )
                        ? asset.icon
                        : null}
                    </div>
                  ) : null
                )}
              </div>
              <div>
                <p className="text-lg">{uploadedFile?.name}</p>
                <p className="mt-2 text-gray-700">
                  Size:{" "}
                  {uploadedFile ? (uploadedFile.size / 1024).toFixed(2) : "N/A"}{" "}
                  KB
                </p>
              </div>
            </label>
          </>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full my-4 h-64 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-white/10 hover:bg-purple-100 dark:border-indigo-600 dark:hover:border-indigo-500 dark:hover:bg-white/15"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-purple-500 dark:text-indigo-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-purple-500 dark:text-indigo-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-purple-500 dark:text-indigo-400">
                PPTX, or images
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".pptx,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* General information */}
      <LectureGeneralSettings />
      <LectureContentSettings />
    </div>
  );
}

export default InputConfiguration;
