import { useLocation } from "react-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SiTicktick } from "react-icons/si";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EGeneratedSlideForm } from "../../constants/generated-slide-form";
import {
  templateSamples,
  templateStyles,
} from "../../constants/template-constants";

interface TemplatesTabProps {
  presentationOptions: any;
  handleGetPresentationOptions: (event: {
    target: { name: string; value: any };
  }) => void;
}

const locations = [
  {
    pathname: "/slide/generate",
    wrapperStyle: "lg:pl-8 lg:pt-0 pt-8",
    containerStyle: "gap-y-8 mt-8",
    stylesStyle: "sm:flex",
    templatesStyle: "grid-cols-3 gap-4",
  },
  {
    pathname: "/slide/generate-process/template",
    wrapperStyle: "lg:pl-8 lg:pt-0 pt-0",
    containerStyle: "gap-y-8 mt-8",
    stylesStyle: "sm:flex",
    templatesStyle: "grid-cols-3 gap-4",
  },
  {
    pathname: "/slide/image-to-slide",
    wrapperStyle: "p-0",
    containerStyle: "gap-y-4",
    stylesStyle: "",
    templatesStyle: "flex grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-3",
  },
];

export default function TemplatesTab({
  presentationOptions,
  handleGetPresentationOptions,
}: TemplatesTabProps) {
  const location = useLocation();

  const getStyles = (type: keyof (typeof locations)[0]) => {
    // sử dụng keyof để lấy các thuộc tính từ locations
    return locations.find(
      (currentLocation) => currentLocation.pathname === location.pathname
    )?.[type];
  };

  return (
    <div
      className={`border-gray-900/10 w-full ${
        getStyles("wrapperStyle") || ""
      }`}
    >
      {location.pathname === "/slide/generate" && (
        <>
          <h2 className="text-base/7 font-semibold text-gray-900">Templates</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Select the template you want to use to generate your presentation.
          </p>
        </>
      )}
      <div
        className={`grid grid-cols-1 gap-x-6 sm:grid-cols-6 ${
          getStyles("containerStyle") || ""
        }`}
      >
        {/*================== TEMPLATE ==================*/}
        <div className="col-span-full">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Template style
          </h3>
          {location.pathname !== "/slide/image-to-slide" ? (
            <ul
              className={`${
                getStyles("stylesStyle") || ""
              } items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-900/25 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            >
              {templateStyles.map((style, index) => (
                <li
                  className={`w-full ${
                    index === templateStyles.length - 1
                      ? "border-none"
                      : "border-b"
                  } border-gray-900/25 sm:border-b-0 sm:border-r dark:border-gray-600`}
                  key={style.value}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={`style-${style.value}`}
                      type="radio"
                      value={style.value}
                      name={EGeneratedSlideForm.TEMPLATE_STYLE}
                      checked={
                        presentationOptions[
                          EGeneratedSlideForm.TEMPLATE_STYLE
                        ] === style.value
                      }
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-purple-600 checked:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                      onChange={(e) => handleGetPresentationOptions(e)}
                    />
                    <label
                      htmlFor={`style-${style.value}`}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {style.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Menu as="div" className="relative inline-block text-left w-full">
              <div>
                <MenuButton className="inline-flex w-full justify-between items-center rounded-lg bg-white px-4 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-purple-400">
                  {templateStyles.find(
                    (style) =>
                      style.value ===
                      presentationOptions?.[EGeneratedSlideForm.TEMPLATE_STYLE]
                  )?.label || "Select Template Style"}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 h-6 w-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems className="absolute left-0 z-10 mt-2 w-full origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  {templateStyles.map((style) => (
                    <MenuItem key={style.value}>
                      {({ active }) => (
                        <button
                          className={`block w-full px-4 py-2 text-sm text-left ${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          }`}
                          onClick={() =>
                            handleGetPresentationOptions({
                              target: {
                                name: EGeneratedSlideForm.TEMPLATE_STYLE,
                                value: style.value,
                              },
                            })
                          }
                        >
                          {style.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          )}
        </div>

        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm/6 font-medium text-gray-900 mb-4"
          >
            Choosing template
          </label>
          <div className={`grid ${getStyles("templatesStyle")}`}>
            {templateSamples.map((templateSample) => {
              if (
                templateSample.style ===
                presentationOptions[EGeneratedSlideForm.TEMPLATE_STYLE]
              ) {
                return templateSample.samples.map(
                  (sample: { code: string; image: string }) => (
                    <div
                      key={sample.code}
                      className={`relative w-full border-2 rounded-md border-purple-500 hover:cursor-pointer ${
                        sample.code ===
                        presentationOptions[EGeneratedSlideForm.TEMPLATE_CODE]
                          ? "bg-purple-200"
                          : ""
                      }`}
                      onClick={() =>
                        handleGetPresentationOptions({
                          target: {
                            name: EGeneratedSlideForm.TEMPLATE_CODE,
                            value: sample.code,
                          },
                        })
                      }
                    >
                      {sample.code ===
                        presentationOptions[
                          EGeneratedSlideForm.TEMPLATE_CODE
                        ] && (
                        <SiTicktick className="absolute m-1 top-0 right-0 text-purple-700" />
                      )}
                      <img
                        src={sample.image}
                        alt={sample.code}
                        className="w-full h-full object-contain block rounded-md"
                      />
                    </div>
                  )
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
