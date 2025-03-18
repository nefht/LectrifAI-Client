import { lectureSpeeds, lectureLengths } from "../constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import RadioGroupInput from "../../../../components/RadioGroupInput/RadioGroupInput";

function LectureContentSettings() {
  return (
    <div className="w-full lg:w-2/3 xl:w-3/5 my-2 mt-6">
      <p className="font-semibold text-base text-white my-2">
        Lecture content information
      </p>
      <p className="text-sm/6 text-gray-400 mb-6">
        Customize your lecture content settings with the below options.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
        <DropdownInput
          label="Lecture Speed"
          options={lectureSpeeds}
          selectedValue=""
          onChange={() => {}}
        />
        <DropdownInput
          label="Lecture Length"
          options={lectureLengths}
          selectedValue=""
          onChange={() => {}}
        />
        <RadioGroupInput
          label="Interactive Quiz"
          options={[
            { label: "Yes", value: "0" },
            { label: "No", value: "1" },
          ]}
          selectedValue={"0"}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}

export default LectureContentSettings;
