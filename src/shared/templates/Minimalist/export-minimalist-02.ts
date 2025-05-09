import PptxGenJS from "pptxgenjs";
import titleSlideImg from "../../../assets/templates/minimalist-02/title-slide.png";
import contentSlideImg from "../../../assets/templates/minimalist-02/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-02/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/minimalist-02/content-slide-3.png";
import endSlideImg from "../../../assets/templates/minimalist-02/end-slide.png";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

const exportMinimalist02 = (slideData: SlideData, fileName?: string) => {
  let pptx = new PptxGenJS();

  // Title Slide
  let slide = pptx.addSlide();
  slide.background = { path: titleSlideImg };
  slide.addText(slideData?.title, {
    x: "47%",
    y: "50%",
    w: "50%",
    h: 1.5,
    fontSize: 34,
    bold: true,
    color: "#FFFFFF",
    align: "center",
    fontFace: "Candara",
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: "40%",
    y: "95%",
    w: "60%",
    h: 0.05,
    fill: { color: "FFFFFF" },
  });

  // Last index of slides
  let lastIndex = slideData?.slides?.length - 1;

  slideData?.slides?.forEach((slideData: any, index: number) => {
    let slide = pptx.addSlide();
    const containImage = slideData?.imageUrls?.length > 0;
    slide.background = {
      path:
        index % 3 === 0
          ? contentSlideImg
          : index % 3 === 1
          ? contentSlide2Img
          : containImage
          ? contentSlide2Img
          : contentSlide3Img,
    };

    // Check if it's the last slide
    if (index === lastIndex) {
      // End slide with specific background
      slide.background = { path: endSlideImg }; // Use the end slide image for the last slide
      slide.addText(slideData?.heading, {
        x: 0.5,
        y: "40%",
        w: "90%",
        h: 0.5,
        fontSize: 40,
        bold: true,
        color: "#FFFFFF",
        align: "center",
        fontFace: "Candara",
      });
    } else {
      // Heading
      if (index % 3 === 0) {
        slide.addText(slideData?.heading.toUpperCase(), {
          x: 0.3,
          y: 0.25,
          w: "90%",
          h: 0.5,
          fontSize: 20,
          bold: true,
          align: "center",
          fontFace: "Candara",
        });
      } else if (index % 3 === 1) {
        slide.addText(slideData?.heading.toUpperCase(), {
          x: 1,
          y: 0.25,
          w: "85%",
          h: 0.5,
          fontSize: 20,
          bold: true,
          align: "center",
          fontFace: "Candara",
        });
      } else if (index % 3 === 2) {
        if (containImage) {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: 1,
            y: 0.25,
            w: "85%",
            h: 0.5,
            fontSize: 20,
            bold: true,
            align: "center",
            fontFace: "Candara",
          });
        } else {
          slide.addText(slideData?.heading.toUpperCase(), {
            x: 0.3,
            y: "40%",
            w: "30%",
            h: 0.5,
            fontSize: 28,
            bold: true,
            align: "left",
            fontFace: "Candara",
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
                bullet: { code: "25CB" },
                fontSize: subBulletPointFontSize,
                indentLevel: 2,
                lineSpacingMultiple: 1.3,
              },
            }));
          } else {
            return {
              text: bulletPoint,
              options: {
                bullet: true,
                fontSize: bulletPointFontSize,
                indentLevel: 1,
                lineSpacingMultiple: 1.3,
              },
            };
          }
        }
      );

      if (index % 3 === 2) {
        if (containImage) {
          // Add bullet points to slide
          slide.addText(bulletPointsData?.flat(), {
            x: 0.7,
            y: 1,
            w: "90%",
            h: textHeight,
            color: "#000000",
            margin: 1,
            fontFace: "Candara",
          });
        } else {
          slide.addText(bulletPointsData?.flat(), {
            x: "47%",
            y: 1.7,
            w: "50%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
          });
        }
      } else {
        slide.addText(bulletPointsData?.flat(), {
          x: 0.7,
          y: 1,
          w: "90%",
          h: textHeight,
          color: "#000000",
          margin: 1,
          fontFace: "Candara",
        });
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

export default exportMinimalist02;
