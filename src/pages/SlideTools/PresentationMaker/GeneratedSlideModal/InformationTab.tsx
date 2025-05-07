import { EGeneratedSlideForm } from "../../constants/generated-slide-form";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";

export const writingTones = [
  {
    label: "Normal",
    value: "Normal",
  },
  {
    label: "Fun",
    value: "fun",
  },
  {
    label: "Creative",
    value: "creative",
  },
  {
    label: "Casual",
    value: "casual",
  },
  {
    label: "Professional",
    value: "professional",
  },
  {
    label: "Formal",
    value: "formal",
  },
];

interface InformationTabProps {
  presentationOptions: any;
  handleGetPresentationOptions: (event: {
    target: { name: string; value: any };
  }) => void;
  languages: { code: string; name: string }[];
  // errors?: Record<string, string>;
}

export default function InformationTab({
  presentationOptions,
  handleGetPresentationOptions,
  languages,
}: // errors,
InformationTabProps) {
  return (
    <div className=" border-gray-900/10 w-full pt-2 md:pt-8 lg:pl-8 lg:pt-0">
      {location.pathname === "/slide/generate" && (
        <>
          <h2 className="text-base/7 font-semibold text-gray-900">
            General Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            You should fill some basic information required for the presentation
            to be created.
          </p>
        </>
      )}

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/*================== TOPIC ==================*/}
        {location.pathname === "/slide/generate" && (
          <div className="col-span-full">
            <label
              htmlFor={EGeneratedSlideForm.TOPIC}
              className="block text-sm/6 font-medium text-gray-900"
            >
              Topic <span className="text-red-700">*</span>
            </label>
            <div className="mt-2">
              <input
                required
                id={EGeneratedSlideForm.TOPIC}
                name={EGeneratedSlideForm.TOPIC}
                value={presentationOptions[EGeneratedSlideForm.TOPIC]}
                title="Topic"
                type="text"
                className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6 border-none`}
                onChange={(e) => handleGetPresentationOptions(e)}
              />
              {/* {errors?.[EGeneratedSlideForm.TOPIC] && (
                <p className="mt-2 text-[14px] text-red-600">
                  {errors?.[EGeneratedSlideForm.TOPIC]}
                </p>
              )} */}
            </div>
          </div>
        )}

        {/*================== WRITING TONE ==================*/}
        <div className="sm:col-span-2">
          <DropdownInput
            label="Writing tone"
            required={true}
            options={writingTones}
            selectedValue={
              presentationOptions[EGeneratedSlideForm.WRITING_TONE]
            }
            onChange={(selectedTone) =>
              handleGetPresentationOptions({
                target: {
                  name: EGeneratedSlideForm.WRITING_TONE,
                  value: selectedTone,
                },
              })
            }
          />
        </div>

        {/*================== LANGUAGE ==================*/}
        <div className="sm:col-span-2">
          <DropdownInput
            label="Language"
            required={true}
            options={languages.map((lang) => ({
              label: lang.name,
              value: lang.name,
            }))}
            selectedValue={presentationOptions[EGeneratedSlideForm.LANGUAGE]}
            onChange={(selectedLanguage) =>
              handleGetPresentationOptions({
                target: {
                  name: EGeneratedSlideForm.LANGUAGE,
                  value: selectedLanguage,
                },
              })
            }
          />
        </div>

        {/*================== NUMBER OF SLIDES ==================*/}
        <div className="sm:col-span-2">
          <label
            htmlFor={EGeneratedSlideForm.NUMBER_OF_SLIDES}
            className="block text-sm/6 font-medium text-gray-900"
          >
            Number of slides <span className="text-red-700">*</span>
          </label>
          <div className="mt-2">
            <input
              required
              id={EGeneratedSlideForm.NUMBER_OF_SLIDES}
              name={EGeneratedSlideForm.NUMBER_OF_SLIDES}
              value={presentationOptions[EGeneratedSlideForm.NUMBER_OF_SLIDES]}
              type="number"
              min={1}
              max={40}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6 border-none"
              onChange={(e) => handleGetPresentationOptions(e)}
            />
          </div>
        </div>

        {/*================== SPECIFIC REQUIREMENTS ==================*/}
        {location.pathname === "/slide/generate" && (
          <div className="col-span-full">
            <label
              htmlFor={EGeneratedSlideForm.SPECIFIC_REQUIREMENTS}
              className="block text-sm/6 font-medium text-gray-900"
            >
              Specific requirements
            </label>
            <div className="mt-2">
              <textarea
                id={EGeneratedSlideForm.SPECIFIC_REQUIREMENTS}
                name={EGeneratedSlideForm.SPECIFIC_REQUIREMENTS}
                value={
                  presentationOptions[EGeneratedSlideForm.SPECIFIC_REQUIREMENTS]
                }
                rows={3}
                maxLength={1000}
                placeholder="Your text here..."
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6 border-none"
                onChange={(e) => handleGetPresentationOptions(e)}
              />
            </div>
            <p className="mt-3 text-sm/6 text-gray-600">
              Write your own requirements of the presentation you want to
              create.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
