import { useState } from "react";
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
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function SearchDropdownInput({
  label,
  options,
  selectedValue,
  onChange,
}: DropdownProps) {
  const [query, setQuery] = useState("");

  // Lọc danh sách options dựa trên từ khóa tìm kiếm
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full">
      <label className="text-white font-semibold">{label}</label>
      <Listbox value={selectedValue} onChange={onChange}>
        <div className="relative mt-2">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm">
            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              <span className="block truncate">
                {options.find((opt) => opt.value === selectedValue)?.label ||
                  "Select"}
              </span>
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          {/* Dropdown menu */}
          <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {/* Ô tìm kiếm */}
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-900"
              />
            </div>

            {/* Danh sách lựa chọn */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                >
                  <div className="flex items-center">
                    <span className="block truncate">{option.label}</span>
                  </div>
                  {selectedValue === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  )}
                </ListboxOption>
              ))
            ) : (
              <p className="text-gray-500 text-sm p-2 text-center">
                No results found
              </p>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
