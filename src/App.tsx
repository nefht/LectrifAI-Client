import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/:id" element={<ResetPassword />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/lecture">
            <Route path="list" element={<LecturesList />} />
            <Route path="detail/:id" element={<LectureDetail />} />
          </Route>
          <Route path="/slide">
            <Route path="list" element={<SlidesList />} />
            <Route path="detail/:id" element={<SlideDetail />} />
            <Route path="generate" element={<PresentationMaker />} />
            <Route
              path="document-to-pptx-convert"
              element={<DocumentToPptxConverter />}
            />
            <Route path="generate-process" element={<GenerateSlideProcess />}>
              <Route path="input" element={<InputContent />} />
              <Route path="template" element={<SelectStyle />} />
              <Route path="outline" element={<ReviewOutline />} />
              <Route path="download" element={<DownloadSlide />} />
            </Route>
            <Route path="image-to-slide" element={<ImageToSlide />} />
            <Route path="enhance" />
          </Route>
          <Route path="/lecture">
            <Route path="list" element={<LecturesList />} />
            <Route path="detail/:id" element={<LectureDetail />} />
            <Route path="generate-video" element={<LectureVideoGenerator />} />
            <Route
              path="generate-video-process"
              element={<LectureVideoGeneratedProcess />}
            >
              <Route path="input" element={<InputConfiguration />} />
              <Route path="review" element={<ReviewLectureScript />} />
              <Route path="download" element={<DownloadLectureVideo />} />
            </Route>
            <Route path="instant-presenter" element={<InstantLecturePresenter />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
