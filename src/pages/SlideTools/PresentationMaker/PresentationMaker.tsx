import { useState } from "react";
import classNames from "classnames/bind";
import { RiQuestionLine } from "react-icons/ri";
import styles from "./PresentationMaker.module.css";
import slideDecor1 from "../../../assets/images/presentation-maker/slide-decor-1.svg";
import slideDecor2 from "../../../assets/images/presentation-maker/ai-generator1.webp";
import GeneratedSlideModal from "./GeneratedSlideModal/GeneratedSlideModal";

const cx = classNames.bind(styles);

function PresentationMaker() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <GeneratedSlideModal open={modalOpen} setOpen={setModalOpen} />
      <div className="flex flex-col px-5 py-1 lg:py-5 xl:px-40 animate-slidein">
        <div className=" flex flex-col lg:flex-row">
          <div className="flex flex-col flex-1 p-4 lg:p-8 font-degular">
            <span
              className={`text-2xl lg:text-5xl font-semibold ${cx("title-1")}`}
            >
              AI Presentation Maker
            </span>
            <p
              className={`text-base text-justify lg:text-lg 2xl:text-xl/relaxed mt-2 lg:mt-4 2xl:mt-6 mb-4 lg:mb-6 ${cx(
                "description-1"
              )}`}
            >
              When lack of inspiration or time constraints are something you’re
              worried about, it’s a good idea to seek help. Slidesgo comes to
              the rescue with its latest functionality—the AI Presentation
              Maker! With a few clicks, you’ll have wonderful slideshows that
              suit your own needs. And it’s totally free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                className="flex items-center justify-center w-full sm:w-2/5 text-white rounded-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-semibold px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                type="button"
                onClick={handleOpenModal}
              >
                <p className="xl:text-xl"> Get started</p>
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
              <button
                className="flex items-center justify-center rounded-full w-full sm:w-2/5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
              >
                <RiQuestionLine className="mr-2" />{" "}
                <p className="xl:text-xl">How does it work?</p>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <img src={slideDecor1} alt="" />
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row">
          <div className="flex-1 lg:pt-20">
            <img src={slideDecor2} alt="" />
          </div>
          <div className="flex flex-col flex-1 p-5 lg:p-20 font-degular">
            <span
              className={`text-xl lg:text-4xl font-semibold ${cx("title-2")}`}
            >
              Generate presentations in minutes
            </span>
            <p
              className={`text-base text-justify lg:text-lg 2xl:text-xl/relaxed mt-2 lg:mt-4 mb-4 lg:mb-6 ${cx(
                "description-2"
              )}`}
            >
              When lack of inspiration or time constraints are something you’re
              worried about, it’s a good idea to seek help. Slidesgo comes to
              the rescue with its latest functionality—the AI Presentation
              Maker! With a few clicks, you’ll have wonderful slideshows that
              suit your own needs. And it’s totally free!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PresentationMaker;
