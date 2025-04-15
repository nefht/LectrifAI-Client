import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";

const mainTools = [
  {
    name: "Lecture Video Generator",
    description: "Create lecture video from your slides",
    href: "/lecture/generate-video",
    icon: ChartPieIcon,
  },
  {
    name: "Instant Lecture Presenter",
    description: "Automatically present lectures from uploaded files",
    href: "/lecture/instant-presenter",
    icon: FingerPrintIcon,
  },
  // {
  //   name: "Lesson Plan Organizer",
  //   description: "Plan your lessons faster with AI",
  //   href: "#",
  //   icon: CursorArrowRaysIcon,
  // },
];
const otherTools = [
  {
    name: "Quizzes Maker",
    description: "Create quizzes for your students",
    href: "/quiz-maker",
    icon: ChartPieIcon,
  },
  {
    name: "Classroom Management",
    description: "Manage your classroom",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
];
const callsToAction = [
  { name: "Instruction", href: "#", icon: PlayCircleIcon },
];

const LectureToolsConstants = {
  mainTools,
  otherTools,
  callsToAction,
};

export default LectureToolsConstants;
