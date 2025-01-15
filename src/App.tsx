import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home/Home";
import LecturesList from "./pages/Lecture/LecturesList/LecturesList";
import LectureDetail from "./pages/Lecture/LectureDetail/LectureDetail";
import SlidesList from "./pages/Slide/SlidesList/SlidesList";
import SlideDetail from "./pages/Slide/SlideDetail/SlideDetail";
import GeneratedSlide from "./pages/GeneratedSlide/PresentationMaker/PresentationMaker";
import Layout from "./layout/Layout";
import DocumentToPptxConverter from "./pages/GeneratedSlide/DocumentToPptxConverter/DocumentToPptxConverter";
import GenerateSlideProcess from "./pages/GeneratedSlide/GeneratedSlideProcess/GeneratedSlideProcess";
import InputContent from "./pages/GeneratedSlide/GeneratedSlideProcess/GenerateSlideSteps/InputContent";
import SelectStyle from "./pages/GeneratedSlide/GeneratedSlideProcess/GenerateSlideSteps/SelectStyle";
import ReviewOutline from "./pages/GeneratedSlide/GeneratedSlideProcess/GenerateSlideSteps/ReviewOutline";
import DownloadSlide from "./pages/GeneratedSlide/GeneratedSlideProcess/GenerateSlideSteps/DownloadSlide";
import ImageToSlide from "./pages/GeneratedSlide/ImageToSlide/ImageToSlide";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";

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
            <Route path="generate" element={<GeneratedSlide />} />
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
