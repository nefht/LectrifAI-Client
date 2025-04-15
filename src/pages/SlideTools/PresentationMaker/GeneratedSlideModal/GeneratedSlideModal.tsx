import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { IoDocumentText } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import helperService from "../../../../services/helperService";
import InformationTab from "./InformationTab";
import TemplatesTab from "./TemplatesTab";
import {
  EGeneratedSlideForm,
  GeneratedSlideFormModal,
} from "../../constants/generated-slide-form";
import { validateRequiredFields } from "../../../../utils/ComponentBase";
import { useToast } from "../../../../hooks/useToast";
import {
  templateSamples,
  templateStyles,
} from "../../constants/template-constants";
import generatedSlideService from "../../service/generatedSlideService";
import { useSlideData } from "../../hooks/useSlideData";
import CustomSpinner from "../../../../components/LoadingSpinner/CustomSpinner";

interface GeneratedSlideModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function GeneratedSlideModal({
  open,
  setOpen,
}: GeneratedSlideModalProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedTab, setSelectedTab] = useState("Information");
  const [languages, setLanguages] = useState([
    { code: "eng", name: "English" },
  ]);
  const { setSlideData } = useSlideData();

  // Form options
  const [presentationOptions, setPresentationOptions] =
    useState<GeneratedSlideFormModal>({
      [EGeneratedSlideForm.TOPIC]: "",
      [EGeneratedSlideForm.WRITING_TONE]: "",
      [EGeneratedSlideForm.LANGUAGE]: "",
      [EGeneratedSlideForm.NUMBER_OF_SLIDES]: 0,
      [EGeneratedSlideForm.TEMPLATE_STYLE]: templateStyles[0].value || "",
      [EGeneratedSlideForm.TEMPLATE_CODE]:
        templateSamples?.find(
          (sample) => sample.style === templateStyles[0].value
        )?.samples[0].code || "",
      [EGeneratedSlideForm.SPECIFIC_REQUIREMENTS]: "",
    });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lấy danh sách ngôn ngữ
  useEffect(() => {
    const fetLanguages = async () => {
      const response = await helperService.getAllLanguages();
      setLanguages(response);
    };
    fetLanguages();
  }, []);

  // Đổi tab
  const handleSetSelectedTab = (event: any) => {
    setSelectedTab(event.target.title);
  };

  // Lấy giá trị form
  const handleGetPresentationOptions = (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    let options = { ...presentationOptions, [name]: value };
    setPresentationOptions(options);
    console.log(presentationOptions);

    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // // Validate form
  // const validateForm = () => {
  //   const requiredFields = [
  //     EGeneratedSlideForm.TOPIC,
  //     EGeneratedSlideForm.NUMBER_OF_SLIDES,
  //   ];
  //   const fieldLabels = {
  //     [EGeneratedSlideForm.TOPIC]: "Topic",
  //     [EGeneratedSlideForm.NUMBER_OF_SLIDES]: "Number of slides",
  //   };
  //   const newErrors = validateRequiredFields(
  //     presentationOptions,
  //     requiredFields,
  //     fieldLabels
  //   );

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // Submit form
  const handleSubmit = useMutation({
    mutationFn: async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        const response = await generatedSlideService.generateSlideContent(
          presentationOptions
        );
        if (response) {
          setSlideData(response);
          const slideId = response._id;
          navigate(`/slide/generate-process/outline/${slideId}`, {
            state: { mode: "modal", message: "Generate slide content successfully!" },
          });
        } else {
          showToast("error", "Failed to generate presentation.");
        }
      } catch (error) {
        console.error("Error generating presentation:", error);
        showToast(
          "error",
          (error as Error)?.message || "An unknown error occurred."
        );
      }
    },
  });

  // Đóng modal
  const handleCloseModal = () => {
    setPresentationOptions({
      [EGeneratedSlideForm.TOPIC]: "",
      [EGeneratedSlideForm.WRITING_TONE]: "",
      [EGeneratedSlideForm.LANGUAGE]: "",
      [EGeneratedSlideForm.NUMBER_OF_SLIDES]: 0,
      [EGeneratedSlideForm.TEMPLATE_STYLE]: templateStyles[0].value || "",
      [EGeneratedSlideForm.TEMPLATE_CODE]:
        templateSamples?.find(
          (sample) => sample.style === templateStyles[0].value
        )?.samples[0].code || "",
      [EGeneratedSlideForm.SPECIFIC_REQUIREMENTS]: "",
    });
    setOpen(false);
    setErrors({});
  };

  // Tabs trong modal
  const modalTabs = [
    {
      title: "Information",
      icon: <IoDocumentText />,
      tab: (
        <InformationTab
          presentationOptions={presentationOptions as GeneratedSlideFormModal}
          handleGetPresentationOptions={handleGetPresentationOptions}
          languages={languages}
          // errors={errors}
        />
      ),
    },
    {
      title: "Templates",
      icon: <FaImages />,
      tab: (
        <TemplatesTab
          presentationOptions={presentationOptions as GeneratedSlideFormModal}
          handleGetPresentationOptions={handleGetPresentationOptions}
        />
      ),
    },
  ];

  return (
    <>
      <CustomSpinner
        isLoading={handleSubmit.isPending}
        message="Generating Slides..."
      />
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-500/50"
              onClick={handleCloseModal}
            />

            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-500"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transform transition ease-in duration-500"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <DialogPanel className="pointer-events-auto relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] lg:max-h-full overflow-auto hide-scrollbar">
                <form
                  className="px-10 py-8"
                  onSubmit={(e) => handleSubmit.mutate(e)}
                >
                  <div className="space-y-8">
                    <div className="border-b border-gray-900/10 pb-2 font-degular font-semibold text-[28px] mb-4">
                      Create your presentation
                    </div>

                    <div className="flex flex-col lg:flex-row">
                      <ul className="flex flex-row flex-wrap gap-x-2 gap-y-4 lg:flex-col text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                        {modalTabs.map((tab) => (
                          <li key={tab.title}>
                            <button
                              type="button"
                              title={tab.title}
                              className={`inline-flex gap-2 items-center px-4 py-3 rounded-lg bg-gray-50 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                                selectedTab === tab.title
                                  ? "text-white bg-purple-700 dark:bg-purple-600"
                                  : "hover:text-gray-900 hover:bg-gray-100"
                              }`}
                              onClick={(e) => handleSetSelectedTab(e)}
                            >
                              {tab.icon}
                              {tab.title}
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Hiển thị nội dung tab */}
                      {modalTabs.map((tab, index) => {
                        if (tab.title === selectedTab)
                          return (
                            <div key={index} className="w-full h-full">
                              {tab.tab}
                            </div>
                          );
                        return null;
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-y-4 sm:flex-row items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="text-sm/6 font-semibold text-gray-900"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                    >
                      <SparklesIcon className="size-5" />
                      Generate presentation
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
