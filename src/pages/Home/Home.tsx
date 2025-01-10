import { useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import TrackVisibility from "react-on-screen";
import "animate.css";
import styles from "./Home.module.css";
import backgroundImage from "../../assets/images/homepage/background.png";
import backgroundLeftDecoration from "../../assets/images/homepage/bg-decor-left.svg";
import backgroundRightDecoration from "../../assets/images/homepage/bg-decor-right.svg";
import astronautImg from "../../assets/images/homepage/astronaut-planet.svg";
import floatingDecor1 from "../../assets/images/homepage/floating-decor-1.svg";
import floatingDecor2 from "../../assets/images/homepage/floating-decor-2.svg";
import { ThemeContext } from "../../context/ThemeContext";
import { useHeader } from "../../hooks/useHeader";

const cx = classNames.bind(styles);

function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setHeaderClass } = useHeader();
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [
    "create Slides",
    "generate Lecture videos",
    "create Quizzes",
  ];
  const period = 2000;

  useEffect(() => {});

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className={cx("background")}>
      <div className={cx("test")}></div>
      {theme === "light" && (
        <>
          <img
            className={cx("background-decor-left")}
            src={backgroundLeftDecoration}
            alt=""
          />
          <img
            className={cx("background-decor-right")}
            src={backgroundRightDecoration}
            alt=""
          />
        </>
      )}
      <TrackVisibility className={cx("content")}>
        {({ isVisible }) => (
          <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
            <span className={cx("tagline")}>Welcome to LectrifAI</span>
            <div className={cx("title")}>
              {`Hi! I'm LectrifAI. I can`}{" "}
              <span
                className={cx("text-rotate")}
                data-period="1000"
                data-rotate='[ "create Slides", "generate Lecture videos", "create Quizzes" ]'
              >
                <span className={cx("wrap")}>{text}</span>
              </span>
            </div>
            <p className={cx("description")}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        )}
      </TrackVisibility>
      {theme === "dark" ? (
        <TrackVisibility className={cx("astronaut")}>
          {({ isVisible }) => (
            <div
              className={isVisible ? "animate__animated animate__zoomIn" : ""}
            >
              <img src={astronautImg} alt="Floating decoration" />
            </div>
          )}
        </TrackVisibility>
      ) : (
        <>
          <TrackVisibility className={cx("floating-1")}>
            {({ isVisible }) => (
              <div
                className={isVisible ? "animate__animated animate__zoomIn" : ""}
              >
                <img src={floatingDecor1} alt="Floating decoration" />
              </div>
            )}
          </TrackVisibility>
          <TrackVisibility className={cx("floating-2")}>
            {({ isVisible }) => (
              <div
                className={isVisible ? "animate__animated animate__zoomIn" : ""}
              >
                <img src={floatingDecor2} alt="Floating decoration" />
              </div>
            )}
          </TrackVisibility>
        </>
      )}
    </div>
  );
}

export default Home;
