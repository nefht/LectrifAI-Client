import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface DropdownProps {
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function DropdownInput({
  label,
  options,
  defaultValue,
  selectedValue,
  onChange,
}: DropdownProps) {
  return (
    <div className="w-full">
      <label className="text-white font-semibold">{label}</label>
      <Listbox value={selectedValue} onChange={onChange}>
        <div className="relative mt-2">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 dark:focus:outline-indigo-600 sm:text-sm/6">
            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              <span className="block truncate">
                {options.find((opt) => opt.value === selectedValue)?.label ||
                  defaultValue || `Select ${label}`}
              </span>
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-purple-600 dark:hover:bg-indigo-600 hover:text-white"
              >
                <div className="flex items-center">
                  <span className="block truncate font-normal">
                    {option.label}
                  </span>
                </div>
                {selectedValue === option.value && (
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
  );
}
