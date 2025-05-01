import {
  lectureSpeeds,
  lectureLengths,
  voiceStyles,
  voiceTypes,
} from "../constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import RadioGroupInput from "../../../../components/RadioGroupInput/RadioGroupInput";
import { EGeneratedLectureForm } from "../constants/generate-lecture-form";
import { useLectureVideo } from "../hooks/useLectureVideo";
import { useEffect, useState } from "react";
import { TTSLanguagesList } from "../../constants/languages-list";

function LectureContentSettings() {
  const { lectureOptions, handleGetLectureOptions } = useLectureVideo();
  const [availableVoiceTypes, setAvailableVoiceTypes] = useState([
    {
      value: "FEMALE",
      label: "Female",
    },
  ]);

   useEffect(() => {
      if (lectureOptions[EGeneratedLectureForm.LANGUAGE]) {
        const supportedGenders = TTSLanguagesList.find(
          (language) =>
            language.value === lectureOptions[EGeneratedLectureForm.LANGUAGE]
        )?.genders;
        setAvailableVoiceTypes(
          voiceTypes.filter((voiceType) =>
            supportedGenders?.includes(voiceType?.label)
          )
        );
      }
    }, [lectureOptions[EGeneratedLectureForm.LANGUAGE]]);

  return (
    <div className="w-full lg:w-2/3 xl:w-3/5 my-2 mt-6">
      <p className="font-semibold text-base text-white my-2">
        Lecture video settings
      </p>
      <p className="text-sm/6 text-gray-400 mb-6">
        Customize your lecture video settings with the below options.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-x-3 gap-y-8">
        <DropdownInput
          label="Voice Type"
          required
          options={availableVoiceTypes}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.VOICE_TYPE]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.VOICE_TYPE,
                value: selectedValue,
              },
            })
          }
        />
        <DropdownInput
          label="Lecture Speed"
          required
          options={lectureSpeeds}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.LECTURE_SPEED]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.LECTURE_SPEED,
                value: selectedValue,
              },
            })
          }
        />
      </div>
    </div>
  );
}

export default LectureContentSettings;
