import { lectureSpeeds, lectureLengths } from "../constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";
import RadioGroupInput from "../../../../components/RadioGroupInput/RadioGroupInput";
import { EGeneratedLectureForm } from "../constants/generate-lecture-form";
import { useLectureVideo } from "../hooks/useLectureVideo";

function LectureContentSettings() {
  const { lectureOptions, handleGetLectureOptions } = useLectureVideo();

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
    </div>
  );
}

export default LectureContentSettings;
