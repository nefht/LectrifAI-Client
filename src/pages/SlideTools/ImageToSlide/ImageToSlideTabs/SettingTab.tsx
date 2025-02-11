import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { EGeneratedSlideForm } from "../../constants/generated-slide-form";
import InformationTab from "../../PresentationMaker/GeneratedSlideModal/InformationTab";
import { useImageToSlide } from "../hooks/useImageToSlide";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface SettingTabProps {
  languages: { code: string; name: string }[];
}
function SettingTab({ languages }: SettingTabProps) {
  const { presentationOptions, handleGetPresentationOptions } =
    useImageToSlide();
  return (
    <>
      <div className="w-full text-sm border-b border-gray-200 pb-4 mb-4">
        <p className="font-semibold mb-2 text-gray-800">Slide Layout</p>
        <div className="grid space-y-2">
          <label
            htmlFor="text-only"
            className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
          >
            <input
              type="radio"
              name={EGeneratedSlideForm.SLIDE_LAYOUT}
              className="shrink-0 mt-0.5 border-gray-200 rounded-full text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
              id="text-only"
              value={0}
              checked={
                presentationOptions[EGeneratedSlideForm.SLIDE_LAYOUT] === "0"
              }
              onChange={(e) => handleGetPresentationOptions(e)}
            />
            <span className="text-sm text-gray-800 ms-3 dark:text-neutral-400">
              Extract text only
            </span>
          </label>

          <label
            htmlFor="include-images"
            className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
          >
            <input
              type="radio"
              name={EGeneratedSlideForm.SLIDE_LAYOUT}
              className="shrink-0 mt-0.5 border-gray-200 rounded-full text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
              id="include-images"
              value={1}
              checked={
                presentationOptions[EGeneratedSlideForm.SLIDE_LAYOUT] === "1"
              }
              onChange={(e) => handleGetPresentationOptions(e)}
            />
            <span className="text-sm text-gray-800 ms-3 dark:text-neutral-400">
              Include images in slides
            </span>
          </label>
        </div>
      </div>

      <div className="w-full text-sm border-b border-gray-200 pb-4 mb-4">
        <p className="font-semibold mb-2 text-gray-800">Language</p>
        {/* <select
          id={EGeneratedSlideForm.LANGUAGE}
          name={EGeneratedSlideForm.LANGUAGE}
          value={presentationOptions[EGeneratedSlideForm.LANGUAGE]}
          className="w-full rounded-lg border-none bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-purple-400"
          onChange={(e) => handleGetPresentationOptions(e)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.name}>
              {lang.name}
            </option>
          ))}
        </select> */}
        <Listbox
          value={presentationOptions[EGeneratedSlideForm.LANGUAGE]}
          onChange={(selectedValue) =>
            handleGetPresentationOptions({
              target: {
                name: EGeneratedSlideForm.LANGUAGE,
                value: selectedValue,
              },
            })
          }
        >
          <div className="relative mt-2">
            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">
                  {presentationOptions[EGeneratedSlideForm.LANGUAGE] ||
                    "Select"}
                </span>
              </span>
              <ChevronUpDownIcon
                aria-hidden="true"
                className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {languages.map((language) => (
                <ListboxOption
                  key={language.code}
                  value={language.name}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-purple-600 dark:hover:bg-indigo-600 hover:text-white"
                >
                  <div className="flex items-center">
                    <span className="block truncate font-normal">
                      {language.name}
                    </span>
                  </div>
                  {presentationOptions[EGeneratedSlideForm.LANGUAGE] ===
                    language.name && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-600 dark:text-indigo-600">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </>
  );
}

export default SettingTab;
