import {
  academicLevels,
  voiceTypes,
  voiceStyles,
  backgroundMusics,
} from "../constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import SearchDropdownInput from "../../../../components/DropdownInput/SearchDropdownInput";

function LectureGeneralSettings() {
  return (
    <div className="w-full lg:w-2/3 xl:w-3/5 my-2">
      <p className="font-semibold text-base text-white my-2">
        General information
      </p>
      <p className="text-sm/6 text-gray-400 mb-6">
        Customize your lecture video with the below options.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
        <DropdownInput
          label="Academic Level"
          options={academicLevels}
          selectedValue=""
          onChange={() => {}}
        />
        <DropdownInput
          label="Voice Type"
          options={voiceTypes}
          selectedValue=""
          onChange={() => {}}
        />
        <DropdownInput
          label="Voice Style"
          options={voiceStyles}
          selectedValue=""
          onChange={() => {}}
        />
      </div>
      <div className="pt-8 flex gap-x-6">
       <div className="grow">
          <SearchDropdownInput
            label="Background Music"
            options={backgroundMusics}
            selectedValue=""
            onChange={() => {}}
          />
       </div>
        <div className="w-1/3">
          <DropdownInput
            label="Language"
            options={[{ label: "English", value: "en" }]}
            selectedValue=""
            onChange={() => {}}
          />
        </div>
        </div>
    </div>
  );
}

export default LectureGeneralSettings;
