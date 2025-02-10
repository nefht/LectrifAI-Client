import { ChangeEvent, useEffect } from "react";
import { useLocation } from "react-router";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { AiFillFileMarkdown } from "react-icons/ai";
import { useGeneratedSlide } from "../hooks/useGeneratedSlide";
import { EGeneratedSlideForm } from "../../constants/generated-slide-form";

function InputContent() {
  const location = useLocation();
  const file = location.state?.file;
  const { presentationOptions, handleGetPresentationOptions } =
    useGeneratedSlide();

  const fileAssets = [
    // .pdf
    {
      type: "application/pdf",
      fileExtension: ".pdf",
      icon: <FaFilePdf />,
      color: "red-500",
    },
    // .doc
    {
      type: "application/msword",
      fileExtension: ".doc",
      icon: <FaFileWord />,
      color: "blue-600",
    },
    // .docx
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileExtension: ".docx",
      icon: <FaFileWord />,
      color: "blue-600",
    },
    // .txt
    {
      type: "text/plain",
      icon: <IoDocumentText />,
      fileExtension: ".txt",
      color: "green-500",
    },
    // .md
    {
      type: "text/markdown",
      icon: <AiFillFileMarkdown />,
      fileExtension: ".md",
      color: "purple-800",
    },
  ];

  useEffect(() => {
    if (file) {
      handleGetPresentationOptions({
        target: { name: [EGeneratedSlideForm.CONTENT], value: file },
      });
    }
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleGetPresentationOptions({
        target: { name: [EGeneratedSlideForm.CONTENT], value: files[0] },
      });
    }
  };

  const placeholder = `World War II was a catastrophic global conflict lasting from 1939 to 1945, involving the majority of the world's nations and reshaping the political, economic, and social fabric of the 20th century. Sparked by Germany's invasion of Poland on September 1, 1939, the war divided nations into two main alliances: the Axis Powers, consisting of Germany, Italy, and Japan, and the Allies, including the United States, the Soviet Union, the United Kingdom, China, and France.

The war saw unprecedented advancements in military technology, including tanks, aircraft, and submarines, as well as devastating weaponry like atomic bombs. Major theaters of conflict included Europe, the Pacific, North Africa, and Asia. The Holocaust, orchestrated by Nazi Germany, led to the systematic extermination of six million Jews, along with millions of others, in one of history’s darkest chapters.
  
Turning points included the Battle of Stalingrad, the Allied invasion of Normandy on D-Day, and the Pacific battles of Midway and Iwo Jima. The war concluded after Germany's surrender in May 1945, followed by Japan’s surrender in September after the atomic bombings of Hiroshima and Nagasaki. The war resulted in an estimated 70-85 million deaths, widespread destruction, and the displacement of millions.

Post-war consequences were profound. The United Nations was established to promote global peace and security, and the world witnessed the onset of the Cold War between the United States and the Soviet Union. Decolonization accelerated as empires weakened, and the geopolitical landscape was fundamentally altered, shaping the international order we know today. World War II remains a defining moment in human history, emphasizing both the depths of human suffering and the resilience of nations in pursuit of peace.`;

  return (
    <>
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Enter your content
      </h1>
      {presentationOptions[EGeneratedSlideForm.CONTENT] instanceof File ? (
        <>
          <p className="font-degular text-xl">
            This is the file you uploaded, continue or click the file to upload
            another file
          </p>
          <label
            htmlFor="file-upload"
            className="flex mt-10 border border-gray-200 bg-white px-8 py-6 rounded-xl shadow-lg hover:bg-purple-200 hover:border-purple-400 hover:cursor-pointer"
          >
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={(e) => handleFileChange(e)}
            />
            <div className="flex items-center mr-8">
              {fileAssets.map((asset, index) =>
                presentationOptions[EGeneratedSlideForm.CONTENT] instanceof
                File ? (
                  <div
                    key={index}
                    className={`text-5xl text-gray-700 text-${asset.color}`}
                  >
                    {asset.type ===
                      presentationOptions[EGeneratedSlideForm.CONTENT]?.type ||
                    asset.fileExtension ===
                      presentationOptions[
                        EGeneratedSlideForm.CONTENT
                      ]?.name.substring(
                        presentationOptions[
                          EGeneratedSlideForm.CONTENT
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
                {presentationOptions[EGeneratedSlideForm.CONTENT]?.name}
              </p>
              <p className="mt-2 text-gray-700">
                Size:{" "}
                {presentationOptions[EGeneratedSlideForm.CONTENT]
                  ? (
                      presentationOptions[EGeneratedSlideForm.CONTENT]?.size /
                      1024
                    ).toFixed(2)
                  : "N/A"}{" "}
                KB
              </p>
            </div>
          </label>
        </>
      ) : (
        <>
          <p className="font-degular text-xl">
            Paste or type your text to get started
          </p>
          <textarea
            rows={30}
            className="block mt-6 p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder={placeholder}
          ></textarea>
        </>
      )}
    </>
  );
}

export default InputContent;
