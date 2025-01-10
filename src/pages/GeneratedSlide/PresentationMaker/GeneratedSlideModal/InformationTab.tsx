import { EGeneratedSlideForm } from "../../constants/generated-slide-form";

const writingTones = [
  {
    label: "Undefined",
    value: "undefined",
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
  errors?: Record<string, string>;
}

export default function InformationTab({
  presentationOptions,
  handleGetPresentationOptions,
  languages,
  errors,
}: InformationTabProps) {
  return (
    <div className=" border-gray-900/10 w-full pt-8 lg:pl-8 lg:pt-0">
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
                id={EGeneratedSlideForm.TOPIC}
                name={EGeneratedSlideForm.TOPIC}
                value={presentationOptions[EGeneratedSlideForm.TOPIC]}
                title="Topic"
                type="text"
                //   required={true}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 ${
                  errors?.[EGeneratedSlideForm.TOPIC]
                    ? "outline-red-600"
                    : "outline-gray-300"
                } placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6`}
                onChange={(e) => handleGetPresentationOptions(e)}
              />
              {errors?.[EGeneratedSlideForm.TOPIC] && (
                <p className="mt-2 text-[14px] text-red-600">
                  {errors?.[EGeneratedSlideForm.TOPIC]}
                </p>
              )}
            </div>
          </div>
        )}

        {/*================== WRITING TONE ==================*/}
        <div className="sm:col-span-2 sm:col-start-1">
          <label
            htmlFor={EGeneratedSlideForm.WRITING_TONE}
            className="block text-sm/6 font-medium text-gray-900"
          >
            Writing tone
          </label>
          <div className="mt-2">
            <select
              id={EGeneratedSlideForm.WRITING_TONE}
              name={EGeneratedSlideForm.WRITING_TONE}
              value={presentationOptions[EGeneratedSlideForm.WRITING_TONE]}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
              onChange={(e) => handleGetPresentationOptions(e)}
            >
              {writingTones.map((tone) => (
                <option key={tone.value} value={tone.value}>
                  {tone.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*================== LANGUAGE ==================*/}
        <div className="sm:col-span-2">
          <label
            htmlFor={EGeneratedSlideForm.LANGUAGE}
            className="block text-sm/6 font-medium text-gray-900"
          >
            Language
          </label>
          <div className="mt-2">
            <select
              id={EGeneratedSlideForm.LANGUAGE}
              name={EGeneratedSlideForm.LANGUAGE}
              value={presentationOptions[EGeneratedSlideForm.LANGUAGE]}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
              onChange={(e) => handleGetPresentationOptions(e)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*================== NUMBER OF SLIDES ==================*/}
        <div className="sm:col-span-2">
          <label
            htmlFor={EGeneratedSlideForm.NUMBER_OF_SLIDES}
            className="block text-sm/6 font-medium text-gray-900"
          >
            Number of slides
          </label>
          <div className="mt-2">
            <input
              id={EGeneratedSlideForm.NUMBER_OF_SLIDES}
              name={EGeneratedSlideForm.NUMBER_OF_SLIDES}
              value={presentationOptions[EGeneratedSlideForm.NUMBER_OF_SLIDES]}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
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
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
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
