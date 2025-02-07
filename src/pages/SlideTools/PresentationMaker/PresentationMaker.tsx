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
      <div className={cx("container")}>
        <div className={cx("card-1")}>
          <div className={cx("content-1")}>
            <span>AI Presentation Maker</span>
            <p>
              When lack of inspiration or time constraints are something you’re
              worried about, it’s a good idea to seek help. Slidesgo comes to
              the rescue with its latest functionality—the AI Presentation
              Maker! With a few clicks, you’ll have wonderful slideshows that
              suit your own needs. And it’s totally free!
            </p>
            <div className={cx("buttons")}>
              <button
                className={cx("button-1")}
                type="button"
                onClick={handleOpenModal}
              >
                Get started
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
              <button className={cx("button-2")} type="button">
                <RiQuestionLine className={cx("button-2-icon")} /> How does it
                work?
              </button>
            </div>
          </div>
          <div className={cx("decor-1")}>
            <img src={slideDecor1} alt="" />
          </div>
        </div>

        <div className={cx("card-2")}>
          <div className={cx("decor-2")}>
            <img src={slideDecor2} alt="" />
          </div>
          <div className={cx("content-2")}>
            <span>Generate presentations in minutes</span>
            <p>
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
