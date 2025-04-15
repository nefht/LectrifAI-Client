import PptxGenJS from "pptxgenjs";
import titleSlideImg from "../../../assets/templates/minimalist-01/title-slide.png"
import contentSlideImg from "../../../assets/templates/minimalist-01/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-01/content-slide-2.png";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

const exportMinimalist01 = (slideData: SlideData, fileName?: string) => {
  let pptx = new PptxGenJS();

  // Title Slide
  let slide = pptx.addSlide();
  slide.background = { path: titleSlideImg };
  slide.addText(slideData?.title, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 40,
    bold: true,
    color: "#000000",
    align: "center",
    fontFace: "Arial",
  });
  slide.addText("Here goes your presentation!", {
    x: 1,
    y: 3.5,
    w: 8,
    h: 1,
    fontSize: 18,
    color: "#000000",
    align: "center",
    fontFace: "Arial",
  });

  slideData?.slides?.forEach((slideData, index) => {
    let slide = pptx.addSlide();
    slide.background = {
      path: index % 2 === 0 ? contentSlideImg : contentSlide2Img,
    };

    // Heading
    slide.addText(slideData?.heading.toUpperCase(), {
      x: 0.5,
      y: 0.4,
      w: "90%",
      h: 0.5,
      fontSize: 18,
      bold: true,
      fontFace: "Arial",
    });

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
      totalBulletPoints > 6
        ? totalBulletPoints * 0.25
        : totalBulletPoints * 0.4;

    // Chuyển đổi bullet points thành mảng các đối tượng
    let bulletPointsData = slideData?.bulletPoints?.map(
      (bulletPoint: string | string[], index: number) => {
        if (Array.isArray(bulletPoint)) {
          return bulletPoint?.map((subBullet: string, subIndex: number) => ({
            text: subBullet,
            options: {
              bullet: { code: "25CB" }, // Hình dạng bullet: tròn
              fontSize: subBulletPointFontSize,
              indentLevel: 2, // Indent level cho sub-bullet
            },
          }));
        } else {
          return {
            text: bulletPoint,
            options: {
              bullet: true, // Kiểu bullet chuẩn
              fontSize: bulletPointFontSize,
              indentLevel: 1, // Indent level cho bullet point
            },
          };
        }
      }
    );

    // Thêm bullet points vào slide
    slide.addText(bulletPointsData?.flat(), {
      x: 0.5,
      y: 1,
      w: "90%",
      h: textHeight,
      color: "#000000",
      margin: 1,
      fontFace: "Arial",
    });

    const imagesNum = (slideData?.imageUrls ?? []).length;
    // Add Images
    (slideData?.imageUrls ?? []).forEach((image, imgIndex: number) => {
      const wRatio = image.width / (image.width + image.height);
      const hRatio = image.height / (image.width + image.height);
      slide.addImage({
        path: image.imageUrl,
        x: 1 + (imagesNum > 2 ? 3 : 4) * imgIndex,
        y: "55%",
        w: wRatio,
        h: hRatio,
        sizing: {
          type: "contain",
          ...(wRatio > hRatio ? { w: 3, h: 2 } : { w: 2, h: 2 }),
        },
      });
    });
  });

  // Save the PowerPoint file
  pptx.writeFile({ fileName: fileName ?? "GeneratedPresentation.pptx" });
};

export default exportMinimalist01;