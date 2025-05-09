import PptxGenJS from "pptxgenjs";
import titleSlideImg from "../../../assets/templates/colorful-02/title-slide.png";
import contentSlideImg from "../../../assets/templates/colorful-02/content-slide.png";
import contentSlide2Img from "../../../assets/templates/colorful-02/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/colorful-02/content-slide-3.png";
import contentSlide4Img from "../../../assets/templates/colorful-02/content-slide-4.png";
import endSlideImg from "../../../assets/templates/colorful-02/end-slide.png";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

const exportColorful02 = (slideData: SlideData, fileName?: string) => {
  let pptx = new PptxGenJS();

  // Title Slide
  let slide = pptx.addSlide();
  slide.background = { path: titleSlideImg };
  slide.addText(slideData?.title?.toUpperCase(), {
    x: 0.2,
    y: "33%",
    w: "75%",
    h: 1.5,
    fontSize: 34,
    bold: true,
    color: "#FFFFFF", // Màu chữ sáng để nổi bật trên nền ảnh
    align: "left",
    fontFace: "Candara",
  });

  const lastIndex = slideData?.slides?.length - 1;

  slideData?.slides?.forEach((slideData, index) => {
    let slide = pptx.addSlide();
    let backgroundImg;

    const containImage = (slideData?.imageUrls ?? []).length > 0;
    if (containImage) {
      if (index % 3 === 0) {
        backgroundImg = contentSlideImg;
      } else if (index % 3 === 1) {
        backgroundImg = contentSlide3Img;
      } else {
        backgroundImg = contentSlide4Img;
      }
    } else {
      if (index % 2 === 0) {
        backgroundImg = contentSlide4Img;
      } else {
        backgroundImg = contentSlide2Img;
      }
    }

    slide.background = { path: backgroundImg };

    // Check if it's the last slide
    if (index === lastIndex) {
      slide.background = { path: endSlideImg };
      slide.addText(slideData?.heading.toUpperCase(), {
        x: "30%",
        y: "35%",
        w: "40%",
        h: 0.5,
        fontSize: 40,
        bold: true,
        align: "center",
        color: "#FFFFFF",
        fontFace: "Candara",
        lineSpacingMultiple: 1.3,
      });
    } else {
      // Heading
      if (containImage) {
        if (index % 3 === 0) {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: 0.2,
            y: 0.25,
            w: "95%",
            h: 0.5,
            fontSize: 19,
            bold: true,
            align: "center",
            fontFace: "Candara",
            lineSpacingMultiple: 1.3,
          });
        } else if (index % 3 === 1) {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: 0.2,
            y: 0.2,
            w: "70%",
            h: 0.5,
            fontSize: 20,
            bold: true,
            align: "left",
            fontFace: "Candara",
                lineSpacingMultiple: 1.3,

          });
        } else {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: "74%",
            y: 1.2,
            w: "24%",
            h: 0.5,
            fontSize: 26,
            bold: true,
            align: "right",
            fontFace: "Candara",
            color: "#FFFFFF",
                lineSpacingMultiple: 1.3,

          });
        }
      } else {
        if (index % 2 === 0) {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: "74%",
            y: 1.2,
            w: "24%",
            h: 0.5,
            fontSize: 26,
            bold: true,
            align: "right",
            fontFace: "Candara",
            color: "#FFFFFF",
                lineSpacingMultiple: 1.3,

          });
        } else {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: 0.9,
            y: "40%",
            w: "21%",
            h: 0.5,
            fontSize: 22,
            bold: true,
            align: "left",
            fontFace: "Candara",
                lineSpacingMultiple: 1.3,

          });
        }
      }

      // Bullet Points
      let totalBulletPoints = slideData?.bulletPoints?.reduce(
        (acc: number, bulletPoint: string | string[]) => {
          if (Array.isArray(bulletPoint)) {
            return acc + bulletPoint?.length;
          } else {
            return acc + 1;
          }
        },
        0
      );

      let bulletPointFontSize = totalBulletPoints > 4 ? 14 : 15;
      let subBulletPointFontSize = totalBulletPoints > 4 ? 12 : 13;

      let textHeight =
        totalBulletPoints >= 6
          ? totalBulletPoints * 0.25
          : totalBulletPoints * 0.4;

      // Map bullet points to objects
      let bulletPointsData = slideData?.bulletPoints?.map(
        (bulletPoint: string | string[], index: number) => {
          if (Array.isArray(bulletPoint)) {
            return bulletPoint?.map((subBullet: string, subIndex: number) => ({
              text: subBullet,
              options: {
                bullet: { code: "25CB" }, // Bullet shape: circle
                fontSize: subBulletPointFontSize,
                indentLevel: 2, // Indent level for sub-bullet
                lineSpacingMultiple: 1.3,
              },
            }));
          } else {
            return {
              text: bulletPoint,
              options: {
                bullet: true, // Standard bullet
                fontSize: bulletPointFontSize,
                indentLevel: 1, // Indent level for bullet point
                lineSpacingMultiple: 1.3,
              },
            };
          }
        }
      );

      // Add bullet points to slide
      if (containImage) {
        if (index % 3 === 0) {
          slide.addText(bulletPointsData?.flat(), {
            x: 0.2,
            y: 1.2,
            w: "90%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
          });
        } else if (index % 3 === 1) {
          slide.addText(bulletPointsData?.flat(), {
            x: 0.1,
            y: 1,
            w: "70%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
          });
        } else {
          slide.addText(bulletPointsData?.flat(), {
            x: 0.1,
            y: 0.9,
            w: "70%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
          });
        }
      } else {
        if (index % 2 === 0) {
         slide.addText(bulletPointsData?.flat(), {
           x: 0.1,
           y: 0.9,
           w: "70%",
           h: textHeight,
           fontSize: 15,
           fontFace: "Candara",
         });
        } else {
         slide.addText(bulletPointsData?.flat(), {
           x: "30%",
           y: "20%",
           w: "65%",
           h: textHeight,
           fontSize: 15,
           fontFace: "Candara",
         });
        }
      }

      const imagesNum = (slideData?.imageUrls ?? []).length;
      // Add Images
      (slideData?.imageUrls ?? []).forEach((image: any, imgIndex: number) => {
        const wRatio = image.width / (image.width + image.height);
        const hRatio = image.height / (image.width + image.height);
        slide.addImage({
          path: image.imageUrl,
          x: 0.75 + (imagesNum > 2 ? 3 : 4) * imgIndex,
          y: "55%",
          w: wRatio,
          h: hRatio,
          sizing: {
            type: "contain",
            ...(wRatio > hRatio ? { w: 2.8, h: 1.8 } : { w: 1.8, h: 1.8 }),
          },
        });
      });
    }
  });

  // Save the PowerPoint file
  pptx.writeFile({ fileName: fileName ?? "GeneratedPresentation.pptx" });
};

export default exportColorful02;
