import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import SlideToolsConstants from "./constants/slide-tools";
import LectureToolsConstants from "./constants/lecture-tools";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { TbSettingsFilled } from "react-icons/tb";

interface HeaderDropdownOptionProps {
  displayMode: "header" | "dialog"; // Chế độ hiển thị
  optionTitle: string; // Tiêu đề của dropdown
}

function HeaderDropdownOption({
  displayMode,
  optionTitle,
}: HeaderDropdownOptionProps) {
  let itemConstants = null;
  let titleIcon = null;
  switch (optionTitle) {
    case "Slide Tools":
      itemConstants = SlideToolsConstants;
      titleIcon = (
        <FaWandMagicSparkles className="text-lg text-purple-800/60 dark:text-indigo-800/90" />
      );
      break;
    case "Lecture Tools":
      itemConstants = LectureToolsConstants;
      titleIcon = (
        <FaChalkboardTeacher className="text-lg text-purple-800/60 dark:text-indigo-800/90" />
      );
      break;
    case "Templates":
      itemConstants = null;
      titleIcon = (
        <HiTemplate className="text-lg text-purple-800/60 dark:text-indigo-800/90" />
      );
      break;
    default:
      break;
  }
  return displayMode === "header" ? (
    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
      <Popover className="relative">
        {({ open }) => (
          <>
            <PopoverButton
              className={`flex items-center gap-x-1 xl:text-sm/6 text-ssm/6 font-semibold ${
                open
                  ? "text-purple-900 dark:text-indigo-300"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {optionTitle}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </PopoverButton>
            <PopoverPanel
              transition
              className={`absolute -left-8 top-full z-10 mt-3 w-screen ${
                itemConstants?.otherTools &&
                itemConstants?.otherTools?.length > 0
                  ? "max-w-3xl"
                  : "max-w-md"
              } overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in`}
            >
              <div
                className={`p-4 ${
                  itemConstants?.otherTools &&
                  itemConstants?.otherTools?.length > 0
                    ? "grid grid-cols-2 divide-x divide-gray-900/5"
                    : "grid grid-cols-1"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2 pb-2 mr-4 border-b border-gray-300">
                    {titleIcon}
                    <div className="font-semibold text-gray-900">
                      {optionTitle?.toLocaleUpperCase()}
                    </div>
                  </div>
                  {itemConstants?.mainTools.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 xl:text-sm/6 text-ssm/6 hover:bg-gray-100"
                    >
                      <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          aria-hidden="true"
                          className="size-6 text-gray-600 group-hover:text-purple-600 dark:group-hover:text-indigo-600"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {itemConstants?.otherTools &&
                  itemConstants?.otherTools?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-2 pb-2 ml-4 mr-4 border-b border-gray-300">
                        <TbSettingsFilled className="text-lg text-purple-800/60 dark:text-indigo-800/90" />
                        <div className="font-semibold text-gray-900">
                          OTHER TOOLS
                        </div>
                      </div>
                      {itemConstants?.otherTools.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 xl:text-sm/6 text-ssm/6 hover:bg-gray-50"
                        >
                          <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 text-gray-600 group-hover:text-purple-600 dark:group-hover:text-indigo-600"
                            />
                          </div>
                          <div className="flex-auto">
                            <a
                              href={item.href}
                              className="block font-semibold text-gray-900"
                            >
                              {item.name}
                              <span className="absolute inset-0" />
                            </a>
                            <p className="mt-1 text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div
                className={`grid ${
                  itemConstants?.callsToAction &&
                  itemConstants?.callsToAction?.length > 1
                    ? "grid-cols-2"
                    : "grid-cols-1"
                } divide-x divide-gray-900/5 bg-gray-50`}
              >
                {itemConstants?.callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 xl:text-sm/6 text-ssm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
    </PopoverGroup>
  ) : (
    <Disclosure as="div" className="-mx-3">
      <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          {titleIcon}
          {optionTitle}
        </div>
        <ChevronDownIcon
          aria-hidden="true"
          className="size-5 flex-none group-data-[open]:rotate-180"
        />
      </DisclosureButton>
      <DisclosurePanel className="mt-2 space-y-2">
        {[
          ...(itemConstants?.mainTools || []),
          ...(itemConstants?.otherTools || []),
          ...(itemConstants?.callsToAction || []),
        ].map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
          >
            {item.name}
          </DisclosureButton>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}

export default HeaderDropdownOption;
