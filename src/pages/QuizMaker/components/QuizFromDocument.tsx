import { MdUploadFile } from "react-icons/md";
import DropdownInput from "../../../components/DropdownInput/DropdownInput";
import { academicLevels } from "../../LectureTools/LectureVideoGenerator/constants/lecture-settings";
import { EQuizMakerOptions } from "../constants/quiz-maker-options";
import { useQuizOptions } from "../hooks/useQuizOptions";
import { questionTypes } from "../constants/quiz-settings";
import { FaFilePdf } from "react-icons/fa";

interface QuizFromDocumentProps {
  languages: any[];
}

function QuizFromDocument({ languages }: QuizFromDocumentProps) {
  const { quizMakerOptions, handleGetQuizMakerOptions } = useQuizOptions();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleGetQuizMakerOptions({
        target: {
          name: EQuizMakerOptions.FILE,
          value: file,
        },
      });
    }
  };

  return (
    <div className="flex flex-col px-10 gap-6 mt-2">
      <div className="flex flex-col gap-2 border-b border-b-gray-200 pb-6">
        <h2 className="font-semibold text-gray-800">
          1. Upload your document or paste text here{" "}
          <span className="text-red-500">*</span>
        </h2>
        <div className="relative">
          {!quizMakerOptions[EQuizMakerOptions.FILE] && (
            <textarea
              required
              name={EQuizMakerOptions.DOCUMENT_TEXT}
              className="w-full h-36 p-4 border border-gray-300 rounded-lg resize-none focus:ring-1 focus:ring-purple-500"
              placeholder="Paste up to 8,000 words"
              value={quizMakerOptions[EQuizMakerOptions.DOCUMENT_TEXT]}
              maxLength={8000}
              onChange={handleGetQuizMakerOptions}
            />
          )}
          {!quizMakerOptions[EQuizMakerOptions.DOCUMENT_TEXT] && (
            <>
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center gap-2 cursor-pointer absolute left-4 bottom-4 px-3 py-2 border border-purple-600/80 text-gray-700 font-semibold text-sm rounded-lg ${
                  quizMakerOptions[EQuizMakerOptions.FILE] ? "hidden" : "block"
                }`}
              >
                <MdUploadFile className="text-xl text-purple-700" />
                Upload a PDF
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
              {/* Hiển thị thông tin file nếu đã tải lên */}
              {quizMakerOptions[EQuizMakerOptions.FILE] && (
                <div
                  className="flex items-center gap-4 w-full p-4 cursor-pointer border border-purple-300 bg-purple-50 rounded-lg"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <FaFilePdf className="text-2xl text-red-500" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-700">
                      {quizMakerOptions[EQuizMakerOptions.FILE].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size:{" "}
                      {(
                        quizMakerOptions[EQuizMakerOptions.FILE].size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-b border-b-gray-200 pb-6">
        <h2 className="font-semibold text-gray-800 mb-2">
          2. Customize your resource <span className="text-red-500">*</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-8 text-ssm/6 text-gray-700">
          <DropdownInput
            label="Academic Level"
            required={true}
            options={academicLevels}
            selectedValue={quizMakerOptions[EQuizMakerOptions.ACADEMIC_LEVEL]}
            onChange={(selectedValue) => {
              handleGetQuizMakerOptions({
                target: {
                  name: EQuizMakerOptions.ACADEMIC_LEVEL,
                  value: selectedValue,
                },
              });
            }}
          />
          <DropdownInput
            label="Language"
            required={true}
            options={languages}
            selectedValue={quizMakerOptions[EQuizMakerOptions.LANGUAGE]}
            onChange={(selectedValue) => {
              handleGetQuizMakerOptions({
                target: {
                  name: EQuizMakerOptions.LANGUAGE,
                  value: selectedValue,
                },
              });
            }}
          />
          <DropdownInput
            label="Question Type"
            required={true}
            options={questionTypes}
            selectedValue={quizMakerOptions[EQuizMakerOptions.QUESTION_TYPE]}
            onChange={(selectedValue) => {
              handleGetQuizMakerOptions({
                target: {
                  name: EQuizMakerOptions.QUESTION_TYPE,
                  value: selectedValue,
                },
              });
            }}
          />
          <div className="w-full">
            <label className="dark:text-white font-semibold">
              Number of Questions <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name={EQuizMakerOptions.NUMBER_OF_QUESTIONS}
              className="mt-2 grid w-full border-none grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
              min={1}
              max={30}
              placeholder="Number of questions"
              required
              value={quizMakerOptions[EQuizMakerOptions.NUMBER_OF_QUESTIONS]}
              onChange={handleGetQuizMakerOptions}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-b border-b-gray-200 pb-6">
        <h2 className="font-semibold text-gray-800 mb-2">
          3. Add your own requirements (optional)
        </h2>
        <textarea
          className="w-full h-36 p-4 border border-gray-300 rounded-lg resize-none focus:ring-1 focus:ring-purple-500"
          placeholder="Your text here..."
          maxLength={8000}
          name={EQuizMakerOptions.SPECIFIC_REQUIREMENTS}
          value={quizMakerOptions[EQuizMakerOptions.SPECIFIC_REQUIREMENTS]}
          onChange={handleGetQuizMakerOptions}
        />
      </div>
    </div>
  );
}

export default QuizFromDocument;
