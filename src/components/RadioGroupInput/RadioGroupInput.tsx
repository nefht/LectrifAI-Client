import { RadioGroup } from "@headlessui/react";

interface RadioGroupProps {
  label: string;
  required?: boolean;
  options: { label: string; value: string | boolean }[];
  selectedValue: string | number | boolean;
  onChange: (value: string | number) => void;
}

export default function RadioGroupInput({
  label,
  required = false,
  options,
  selectedValue,
  onChange,
}: RadioGroupProps) {
  return (
    <div className="w-full">
      <p className="text-white font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <RadioGroup value={selectedValue} onChange={onChange}>
        <div
          className={`grid gap-2 ${
            options.length < 3 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {options.map((option, index) => (
            <RadioGroup.Option
              key={index}
              value={option.value}
              className={({ checked }) =>
                `flex items-center p-2 w-full bg-white border ${
                  checked
                    ? "border-2 border-purple-600 bg-white dark:border-indigo-600"
                    : "border-gray-200"
                } rounded-md text-sm cursor-pointer focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                      checked
                        ? "border-purple-600 bg-purple-600 dark:border-indigo-600 dark:bg-indigo-600"
                        : "border-gray-400"
                    }`}
                  >
                    {checked && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="ml-3 text-gray-900">{option.label}</span>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
