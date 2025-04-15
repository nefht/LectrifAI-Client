import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TTSLanguagesList } from "../../constants/languages-list";
import {
  voiceTypes,
  voiceStyles,
} from "../../LectureVideoGenerator/constants/lecture-settings";
import DropdownInput from "../../../../components/DropdownInput/DropdownInput";

interface SettingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setSettings: (settings: any) => void;
}

function SettingModal({ isOpen, closeModal, setSettings }: SettingModalProps) {
  const storedSettings = JSON.parse(
    localStorage.getItem("instantLectureSettings") || "{}"
  );
  const [selectedSettings, setSelectedSettings] = useState<any>({
    teachingStyle: storedSettings.teachingStyle || "friendly",
    languageCode: storedSettings.languageCode || "vi-VN",
    voiceStyle: storedSettings.voiceStyle || "FEMALE",
  });

  const handleSaveChanges = () => {
    setSettings(selectedSettings);
    localStorage.setItem(
      "instantLectureSettings",
      JSON.stringify(selectedSettings)
    );
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lecture Settings</h2>
              <IoMdClose
                className="text-2xl text-gray-600 cursor-pointer"
                onClick={closeModal}
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <DropdownInput
                label="Language"
                options={TTSLanguagesList}
                selectedValue={selectedSettings.languageCode}
                onChange={(selectedValue) =>
                  setSelectedSettings((prev: any) => ({
                    ...prev,
                    languageCode: selectedValue,
                  }))
                }
              />
              <DropdownInput
                label="Voice Type"
                options={voiceTypes}
                selectedValue={selectedSettings.voiceType}
                onChange={(selectedValue) =>
                  setSelectedSettings((prev: any) => ({
                    ...prev,
                    voiceType: selectedValue,
                  }))
                }
              />
              <DropdownInput
                label="Teaching Style"
                options={voiceStyles}
                selectedValue={selectedSettings.teachingStyle}
                onChange={(selectedValue) =>
                  setSelectedSettings((prev: any) => ({
                    ...prev,
                    teachingStyle: selectedValue,
                  }))
                }
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SettingModal;
