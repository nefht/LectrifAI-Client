import DropdownInput from "../../../components/DropdownInput/DropdownInput";
import { academicLevels } from "../../LectureTools/LectureVideoGenerator/constants/lecture-settings";
import { EQuizMakerOptions } from "../constants/quiz-maker-options";
import { questionTypes } from "../constants/quiz-settings";
import { useQuizOptions } from "../hooks/useQuizOptions";

interface QuizFromTopicProps {
  languages: any[];
}

function QuizFromTopic({ languages }: QuizFromTopicProps) {
  const { quizMakerOptions, handleGetQuizMakerOptions } = useQuizOptions();

  return (
    <div className="flex flex-col px-10 gap-6 mt-2">
      <div className="flex flex-col gap-2 border-b border-b-gray-200 pb-6">
        <h2 className="font-semibold text-gray-800">
          1. Enter your topic here <span className="text-red-500">*</span>
        </h2>
        <input
          type="text"
          required
          placeholder="e.g. Artificial Intelligence, Machine Learning"
          className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          name="topic"
          value={quizMakerOptions[EQuizMakerOptions.TOPIC]}
          onChange={handleGetQuizMakerOptions}
        />
      </div>
      <div className="flex flex-col gap-2 border-b border-b-gray-200 pb-6">
        <h2 className="font-semibold text-gray-800 mb-2">
          2. Customize your resource <span className="text-red-500">*</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4 md:gap-y-8 text-ssm/6 text-gray-700">
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
              className="mt-2 grid w-full border-none grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6"
              min={1}
              max={40}
              placeholder="Number of questions"
              required
              name="numberOfQuestions"
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
          maxLength={1000}
          name="specificRequirements"
          value={quizMakerOptions[EQuizMakerOptions.SPECIFIC_REQUIREMENTS]}
          onChange={handleGetQuizMakerOptions}
        />
      </div>
    </div>
  );
}

export default QuizFromTopic;
