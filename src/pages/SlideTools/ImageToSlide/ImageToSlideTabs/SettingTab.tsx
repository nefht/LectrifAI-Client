import InformationTab from "../../PresentationMaker/GeneratedSlideModal/InformationTab";

interface SettingTabProps {
  languages: { code: string; name: string }[];
}
function SettingTab({ languages }: SettingTabProps) {
  return (
    <>
      <div className="w-full text-sm border-b border-gray-200 pb-4 mb-4">
        <p className="font-semibold mb-2 text-gray-800">Slide Layout</p>
        <div className="grid space-y-2">
          <label
            htmlFor="text-only"
            className="max-w-xs flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
          >
            <input
              type="radio"
              name="slide-layout"
              className="shrink-0 mt-0.5 border-gray-200 rounded-full text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
              id="text-only"
            />
            <span className="text-sm text-gray-800 ms-3 dark:text-neutral-400">
              Extract text only
            </span>
          </label>

          <label
            htmlFor="include-images"
            className="max-w-xs flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
          >
            <input
              type="radio"
              name="slide-layout"
              className="shrink-0 mt-0.5 border-gray-200 rounded-full text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
              id="include-images"
              checked={true}
            />
            <span className="text-sm text-gray-800 ms-3 dark:text-neutral-400">
              Include images in slides
            </span>
          </label>
        </div>
      </div>

      <div className="w-full text-sm border-b border-gray-200 pb-4 mb-4">
        <p className="font-semibold mb-2 text-gray-800">Language</p>
        <select
          // id={EGeneratedSlideForm.LANGUAGE}
          // name={EGeneratedSlideForm.LANGUAGE}
          // value={presentationOptions[EGeneratedSlideForm.LANGUAGE]}
          className="w-full rounded-lg border-none bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-purple-400"
          // onChange={(e) => handleGetPresentationOptions(e)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.name}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default SettingTab;
