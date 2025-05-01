import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import "./index.css";
import { useToast } from "./hooks/useToast";
import api from "./services/apiService";
import Home from "./pages/Home/Home";
import LecturesList from "./pages/Lecture/LecturesList/LecturesList";
import LectureDetail from "./pages/Lecture/LectureDetail/LectureDetail";
import SlidesList from "./pages/Slide/SlidesList/SlidesList";
import SlideDetail from "./pages/Slide/SlideDetail/SlideDetail";
import PresentationMaker from "./pages/SlideTools/PresentationMaker/PresentationMaker";
import Layout from "./layout/Layout";
import DocumentToPptxConverter from "./pages/SlideTools/DocumentToPptxConverter/DocumentToPptxConverter";
import GenerateSlideProcess from "./pages/SlideTools/GeneratedSlideProcess/GeneratedSlideProcess";
import InputContent from "./pages/SlideTools/GeneratedSlideProcess/GenerateSlideSteps/InputContent";
import SelectStyle from "./pages/SlideTools/GeneratedSlideProcess/GenerateSlideSteps/SelectStyle";
import ReviewOutline from "./pages/SlideTools/GeneratedSlideProcess/GenerateSlideSteps/ReviewOutline";
import DownloadSlide from "./pages/SlideTools/GeneratedSlideProcess/GenerateSlideSteps/DownloadSlide";
import ImageToSlide from "./pages/SlideTools/ImageToSlide/ImageToSlide";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import LectureVideoGenerator from "./pages/LectureTools/LectureVideoGenerator/LectureVideoGenerator";
import InputConfiguration from "./pages/LectureTools/LectureVideoGenerator/GenerateVideoSteps/InputConfiguration";
import LectureVideoGeneratedProcess from "./pages/LectureTools/LectureVideoGenerator/LectureVideoGeneratedProcess";
import ReviewLectureScript from "./pages/LectureTools/LectureVideoGenerator/GenerateVideoSteps/ReviewLectureScript";
import DownloadLectureVideo from "./pages/LectureTools/LectureVideoGenerator/GenerateVideoSteps/DownloadLectureVideo";
import InstantLecturePresenter from "./pages/LectureTools/InstantLecturePresenter/InstantLecturePresenter";
import Storage from "./pages/Storage/Storage";
import QuizMaker from "./pages/QuizMaker/QuizMaker";
import QuizSet from "./pages/Quiz/QuizSet/QuizSet";
import ClassroomManagement from "./pages/ClassroomManagement/ClassroomManagement";
import ClassroomDetail from "./pages/Classroom/ClassroomDetail/ClassroomDetail";
import DoingQuizSet from "./pages/Classroom/ClassroomDetail/components/DoingQuizSet";
import ClassroomInvitation from "./pages/ClassroomManagement/ClassroomInvitation/ClassroomInvitation";
import QuizRoom from "./pages/Quiz/QuizSet/QuizRoom/QuizRoom";
import JoinQuizRoom from "./pages/Quiz/QuizSet/QuizRoom/JoinQuizRoom";
import EditLectureQuiz from "./pages/Lecture/EditLectureQuiz/EditLectureQuiz";
import Profile from "./pages/Profile/Profile";
import StudentsList from "./pages/Classroom/StudentsList/StudentsList";
import UserProfile from "./pages/UserProfile/UserProfile";
import AccessDenied from "./pages/AccessDenied/AccessDenied";

function App() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          if (location.pathname === "/login") {
            return Promise.reject(error);
          }
          showToast("error", "Please login to continue");
          navigate("/login");
        }
        if (error.response && error.response.status === 403) {
          showToast("error", "You do not have access permission");
        }
        // if (error.response && error.response.status === 400) {
        //   showToast("error", error.reponse.data.error);
        //   console.log(error);
        // }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/edit-profile/:id" element={<Profile />} />
        <Route path="/slide">
          <Route path="list" element={<SlidesList searchTerm={""} />} />
          <Route path="detail/:id" element={<SlideDetail />} />
          <Route path="generate" element={<PresentationMaker />} />
          <Route
            path="document-to-pptx-convert"
            element={<DocumentToPptxConverter />}
          />
          <Route path="generate-process" element={<GenerateSlideProcess />}>
            <Route path="input" element={<InputContent />} />
            <Route path="template" element={<SelectStyle />} />
            <Route path="outline/:id" element={<ReviewOutline />} />
            <Route path="download/:id" element={<DownloadSlide />} />
          </Route>
          <Route path="image-to-slide" element={<ImageToSlide />} />
          <Route path="enhance" />
        </Route>
        <Route path="/lecture">
          <Route path="list" element={<LecturesList searchTerm={""} />} />
          <Route path="detail/:id" element={<LectureDetail />} />
          <Route path="edit-quiz/:id" element={<EditLectureQuiz />} />
          <Route path="generate-video" element={<LectureVideoGenerator />} />
          <Route
            path="generate-video-process"
            element={<LectureVideoGeneratedProcess />}
          >
            <Route path="input" element={<InputConfiguration />} />
            <Route path="review/:id" element={<ReviewLectureScript />} />
            <Route path="download/:id" element={<DownloadLectureVideo />} />
          </Route>
          <Route
            path="instant-presenter"
            element={<InstantLecturePresenter />}
          />
          <Route
            path="instant-presenter/:id"
            element={<InstantLecturePresenter />}
          />
        </Route>
        <Route path="/quiz-maker" element={<QuizMaker />} />
        <Route path="/quiz/:id" element={<QuizSet />} />
        <Route path="/quiz-room/:id" element={<QuizRoom />} />
        <Route path="/quiz-room/join/:token" element={<JoinQuizRoom />} />{" "}
        <Route path="/storage" element={<Storage />} />
        <Route path="/classroom">
          <Route path="management" element={<ClassroomManagement />} />
          <Route path="detail/:id" element={<ClassroomDetail />} />
          <Route path="doing-quiz/:id" element={<DoingQuizSet />} />
          <Route path="join/:token" element={<ClassroomInvitation />} />
          <Route path="students-list/:id" element={<StudentsList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Route>
    </Routes>
  );
}

export default App;
