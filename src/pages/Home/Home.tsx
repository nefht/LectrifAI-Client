import { useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import TrackVisibility from "react-on-screen";
import "animate.css";
import styles from "./Home.module.css";
import backgroundImage from "../../assets/images/home/background.png";
import backgroundLeftDecoration from "../../assets/images/home/bg-decor-left.svg";
import backgroundRightDecoration from "../../assets/images/home/bg-decor-right.svg";
import astronautImg from "../../assets/images/home/astronaut-planet.svg";
import floatingDecor1 from "../../assets/images/home/floating-decor-1.svg";
import floatingDecor2 from "../../assets/images/home/floating-decor-2.svg";
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
      {theme === "light" && (
        <>
          <img
            className="w-1/2 xl:w-auto max-h-full min-[900px]:max-h-max xl:max-h-full absolute left-0 bottom-0"
            src={backgroundLeftDecoration}
            alt=""
          />
          <img
            className="w-3/4 xl:w-auto max-h-full absolute right-0 bottom-0"
            src={backgroundRightDecoration}
            alt=""
          />
        </>
      )}
      <TrackVisibility className="absolute top-24 left-8 pr-8 xl:pr-0 md:top-[10%] lg:top-[15%] xl:top-[20%] md:left-20 lg:w-2/3 xl:w-1/2 z-10">
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
              Streamline your content creation with our AI-driven platform.
              Generate slides from topics, documents, or images, and
              effortlessly convert them into engaging lecture videos with AI
              voice narration. Personalize content, enhance visuals, and create
              interactive learning experiences—all in one smart, efficient, and
              user-friendly tool!
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
