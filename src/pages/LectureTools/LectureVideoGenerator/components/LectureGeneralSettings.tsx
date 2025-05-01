import { useEffect, useState } from "react";
import {
  academicLevels,
  voiceTypes,
  voiceStyles,
  backgroundMusics,
  lectureLengths,
} from "../constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import SearchDropdownInput from "../../../../components/DropdownInput/SearchDropdownInput";
import { useLectureVideo } from "../hooks/useLectureVideo";
import { EGeneratedLectureForm } from "../constants/generate-lecture-form";
import { TTSLanguagesList } from "../../constants/languages-list";
import RadioGroupInput from "../../../../components/RadioGroupInput/RadioGroupInput";

function LectureGeneralSettings() {
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
    <div className="w-full lg:w-2/3 xl:w-3/5 my-2">
      <p className="font-semibold text-base text-white my-2">
        Lecture script settings
      </p>
      <p className="text-sm/6 text-gray-400 mb-6">
        Customize your lecture script with the below options.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-8">
        <DropdownInput
          label="Academic Level"
          required
          options={academicLevels}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.ACADEMIC_LEVEL]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.ACADEMIC_LEVEL,
                value: selectedValue,
              },
            })
          }
        />
        <DropdownInput
          label="Language"
          required
          options={TTSLanguagesList}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.LANGUAGE]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.LANGUAGE,
                value: selectedValue,
              },
            })
          }
        />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 mt-8">
        <DropdownInput
          label="Teaching Style"
          required
          options={voiceStyles}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.VOICE_STYLE]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.VOICE_STYLE,
                value: selectedValue,
              },
            })
          }
        />
        <DropdownInput
          label="Lecture Length"
          required
          options={lectureLengths}
          selectedValue={lectureOptions?.[EGeneratedLectureForm.LECTURE_LENGTH]}
          onChange={(selectedValue) =>
            handleGetLectureOptions({
              target: {
                name: EGeneratedLectureForm.LECTURE_LENGTH,
                value: selectedValue,
              },
            })
          }
        />
        <div className="z-10">
          <RadioGroupInput
            label="Interactive Quiz"
            required
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            selectedValue={
              lectureOptions?.[EGeneratedLectureForm.INTERACTIVE_QUIZ]
            }
            onChange={(selectedValue) =>
              handleGetLectureOptions({
                target: {
                  name: EGeneratedLectureForm.INTERACTIVE_QUIZ,
                  value: selectedValue,
                },
              })
            }
          />
        </div>
      </div>
      {/* <div className="pt-8 flex gap-x-6">
        <div className="grow">
          <SearchDropdownInput
            label="Background Music"
            options={backgroundMusics}
            selectedValue={
              lectureOptions?.[EGeneratedLectureForm.BACKGROUND_MUSIC]
            }
            onChange={(selectedValue) =>
              handleGetLectureOptions({
                target: {
                  name: EGeneratedLectureForm.BACKGROUND_MUSIC,
                  value: selectedValue,
                },
              })
            }
          />
        </div>
        <div className="w-1/3">
          <DropdownInput
            label="Teaching Style"
            required
            options={voiceStyles}
            selectedValue={lectureOptions?.[EGeneratedLectureForm.VOICE_STYLE]}
            onChange={(selectedValue) =>
              handleGetLectureOptions({
                target: {
                  name: EGeneratedLectureForm.VOICE_STYLE,
                  value: selectedValue,
                },
              })
            }
          />
        </div>
      </div> */}
    </div>
  );
}

export default LectureGeneralSettings;
