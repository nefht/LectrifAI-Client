import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";

const mainTools = [
  // Tạo slide từ topic người dùng nhập
  {
    name: "Presentation Maker",
    description: "Create presentations in minutes with AI",
    href: "/slide/generate",
    icon: ChartPieIcon,
  },
  //	Chuyển văn bản trong tài liệu thành slide.
  {
    name: "Document to PPT Converter",
    description: "Turn documents into PPT with AI",
    href: "/slide/document-to-pptx-convert",
    icon: CursorArrowRaysIcon,
  },
  // Chuyển ảnh thành slide (Giữ nguyên nội dung hình ảnh và thêm chú thích)
  {
    name: "Image to Slide Converter",
    description: "Convert images to slides with more information",
    href: "/slide/image-to-slide",
    icon: SquaresPlusIcon,
  },
  // Cải thiện giao diện slide với hỗ trợ AI
  {
    name: "Slide Enhancer",
    description: "Improve slide interface with AI support",
    href: "/slide/enhance",
    icon: FingerPrintIcon,
  },
  // // Gộp nhiều slide thành một với cùng style
  // {
  //   name: "Slide Merger",
  //   description: "Merge multiple slides into one",
  //   href: "/slide/enhance",
  //   icon: FingerPrintIcon,
  // },
];
const otherTools = [
  {
    name: "Create Slideshows",
    description: "Create presentations manually",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Addon for Google Slides",
    description: "Create presentations in Google Slides",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
];
const callsToAction = [
  { name: "Instruction", href: "#", icon: PlayCircleIcon },
  { name: "Templates", href: "#", icon: PhoneIcon },
];

const SlideToolsConstants = {
  mainTools,
  otherTools,
  callsToAction,
};

export default SlideToolsConstants;
