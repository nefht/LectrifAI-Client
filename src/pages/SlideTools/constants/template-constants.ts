import minimalist1 from "../../../assets/images/templates/minimalist-1.webp";
import minimalist2 from "../../../assets/images/templates/minimalist-2.webp";
import minimalist3 from "../../../assets/images/templates/minimalist-3.webp";
import minimalist4 from "../../../assets/images/templates/minimalist-4.webp";
import minimalist5 from "../../../assets/images/templates/minimalist-5.jpg";

export const templateStyles = [
  { label: "Minimalist", value: "minimalist" },
  { label: "Colorful", value: "colorful" },
  { label: "Geometric", value: "geometric" },
  { label: "Professional", value: "professional" },
];

export const templateSamples = [
  {
    style: "minimalist",
    samples: [
      {
        code: "minimalist-01",
        image: minimalist3,
      },
      {
        code: "minimalist-02",
        image: minimalist2,
      },
      {
        code: "minimalist-03",
        image: minimalist1,
      },
      {
        code: "minimalist-04",
        image: minimalist4,
      },
      {
        code: "minimalist-05",
        image: minimalist5,
      },
    ],
  },
  {
    style: "colorful",
    samples: [
      {
        code: "colorful-1",
        image: "/images/templates/colorful/cover.png",
      },
      {
        code: "colorful-2",
        image: "/images/templates/colorful/cover.png",
      },
      {
        code: "colorful-3",
        image: "/images/templates/colorful/cover.png",
      },
    ],
  },
  {
    style: "geometric",
    samples: [
      {
        code: "geometric-1",
        image: "/images/templates/geometric/cover.png",
      },
      {
        code: "geometric-2",
        image: "/images/templates/geometric/cover.png",
      },
      {
        code: "geometric-3",
        image: "/images/templates/geometric/cover.png",
      },
    ],
  },
  {
    style: "professional",
    samples: [
      {
        code: "professional-1",
        image: "/images/templates/professional/cover.png",
      },
      {
        code: "professional-2",
        image: "/images/templates/professional/cover.png",
      },
      {
        code: "professional-3",
        image: "/images/templates/professional/cover.png",
      },
    ],
  },
];
