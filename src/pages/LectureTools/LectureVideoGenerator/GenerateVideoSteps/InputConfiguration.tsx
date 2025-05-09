import { FaFileImage, FaFilePowerpoint, FaFilePdf } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import LectureGeneralSettings from "../components/LectureGeneralSettings";
import LectureContentSettings from "../components/LectureContentSettings";
import { useLectureVideo } from "../hooks/useLectureVideo";
import { EGeneratedLectureForm } from "../constants/generate-lecture-form";
import lectureVideoService from "../../services/lectureVideoService";
import { useToast } from "../../../../hooks/useToast";
import decor1 from "../../../../assets/images/lecture-video-generator/decor-1.svg";
import decor2 from "../../../../assets/images/lecture-video-generator/decor-2.svg";
import decor3 from "../../../../assets/images/lecture-video-generator/decor-3.svg";

function InputConfiguration() {
  const { lectureOptions, setLectureOptions, handleGetLectureOptions } =
    useLectureVideo();
  const { showToast } = useToast();
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
    // .pdf
    {
      type: "application/pdf",
      fileExtension: ".pdf",
      icon: <FaFilePdf />,
      color: "red-500",
    },
  ];

  const handleFileChange = useMutation({
    mutationFn: async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files[0]) {
        const uploadedFile = files[0];

        try {
          const response = await lectureVideoService.uploadSlide(uploadedFile);
          console.log(response);
          setLectureOptions({
            ...lectureOptions,
            [EGeneratedLectureForm.FILE]: uploadedFile,
            [EGeneratedLectureForm.FILE_ID]: response.file._id,
          });
          showToast("success", "File uploaded successfully.");
        } catch (error) {
          console.error("Failed to upload slide:", error);
          showToast("error", "Failed to upload slide.");
        }
      }
    },
  });

  return (
    <>
      <img
        src={decor1}
        alt=""
        className="fixed left-0 bottom-1/3 h-[70%] opacity-40"
      />
      {/* <img
        src={decor2}
        alt=""
        className="fixed left-1/4 top-1/2 h-[70%] opacity-55"
      /> */}
      <img
        src={decor3}
        alt=""
        className="fixed right-0 top-1/3 h-[70%] opacity-40"
      />
      <div className="flex flex-col items-center w-full min-h-screen bg-dark bg-gradient-to-b from-dark to-indigo-950 px-10 md:px-24 xl:px-40 pt-12 md:pt-20 pb-4">
        <h1 className="font-degular font-semibold text-center text-white text-2xl md:text-3xl xl:text-4xl">
          Generate your lecture video
        </h1>
        <p className="text-lg text-gray-400 text-center mt-4 mb-6">
          Upload your slides, customize the style, and let our system do the
          rest.
        </p>

        {/* Upload Area */}
        <div className="w-full lg:w-2/3 xl:w-3/5 my-2 z-10">
          <p className="font-semibold text-base text-white mb-2">
            Upload your file <span className="text-red-700">*</span>
          </p>
          {lectureOptions[EGeneratedLectureForm.FILE] ? (
            <>
              <p className="text-base text-gray-400 mb-6">
                This is the file you uploaded, continue or click the file to
                upload another file.
              </p>
              {handleFileChange.isPending ? (
                <div className="flex flex-col items-center justify-center w-full my-4 h-28 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-white/10 hover:bg-purple-100 dark:border-indigo-600 dark:hover:border-indigo-500 dark:hover:bg-white/15">
                  <div className="text-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-700"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex border border-gray-200 bg-gray-200 px-8 py-6 rounded-xl shadow-lg hover:bg-gray-200 hover:border-gray-400 hover:cursor-pointer"
                >
                  <input
                    required
                    disabled={handleFileChange.isPending}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf,.pptx"
                    className="sr-only"
                    onChange={(e) => handleFileChange.mutate(e)}
                  />
                  <div className="flex items-center mr-8">
                    {fileAssets.map((asset, index) =>
                      lectureOptions[EGeneratedLectureForm.FILE] instanceof
                      File ? (
                        <div
                          key={index}
                          className={`text-6xl text-gray-700 text-${asset.color}`}
                        >
                          {asset.type ===
                            lectureOptions[EGeneratedLectureForm.FILE]?.type ||
                          asset.fileExtension ===
                            lectureOptions[
                              EGeneratedLectureForm.FILE
                            ]?.name.substring(
                              lectureOptions[
                                EGeneratedLectureForm.FILE
                              ]?.name.lastIndexOf(".")
                            )
                            ? asset.icon
                            : null}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div>
                    <p className="text-lg">
                      {lectureOptions[EGeneratedLectureForm.FILE]?.name}
                    </p>
                    <p className="mt-2 text-gray-700">
                      Size:{" "}
                      {lectureOptions[EGeneratedLectureForm.FILE]
                        ? (
                            lectureOptions[EGeneratedLectureForm.FILE].size /
                            1024
                          ).toFixed(2)
                        : "N/A"}{" "}
                      KB
                    </p>
                  </div>
                </label>
              )}
            </>
          ) : (
            <>
              {handleFileChange.isPending ? (
                <div className="flex flex-col items-center justify-center w-full my-4 h-28 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-white/10 hover:bg-purple-100 dark:border-indigo-600 dark:hover:border-indigo-500 dark:hover:bg-white/15">
                  <div className="text-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-700"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-purple-500 dark:text-indigo-400">
                      PPTX, or PDF
                    </p>
                  </div>
                  <input
                    required
                    id="dropzone-file"
                    type="file"
                    accept=".pptx,.pdf"
                    onChange={(e) => handleFileChange.mutate(e)}
                    className="hidden"
                  />
                </label>
              )}
            </>
          )}
        </div>

        {/* General information */}
        <LectureGeneralSettings />
        <LectureContentSettings />
        
        <div className="col-span-full w-full lg:w-2/3 xl:w-3/5 my-2 mt-6 z-10">
          <label
            htmlFor="specificRequirements"
            className="block text-base font-medium text-white"
          >
            Specific requirements
          </label>
          <p className="mt-2 text-sm/6 text-gray-400">
            Write your own requirements of the presentation you want to create.
          </p>
          <div className="mt-4">
            <textarea
              id="specificRequirements"
              name="specificRequirements"
              rows={3}
              maxLength={1000}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6 border-none"
              onChange={handleGetLectureOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default InputConfiguration;
