import PptxGenJS from "pptxgenjs";
import titleSlideImg from "../../../assets/templates/colorful-01/title-slide.png";
import contentSlideImg from "../../../assets/templates/colorful-01/content-slide.png";
import contentSlide2Img from "../../../assets/templates/colorful-01/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/colorful-01/content-slide-3.png";
import contentSlide4Img from "../../../assets/templates/colorful-01/content-slide-4.png";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

const exportColorful01 = (slideData: SlideData, fileName?: string) => {
  let pptx = new PptxGenJS();

  // Title Slide
  let slide = pptx.addSlide();
  slide.background = { path: titleSlideImg };
  slide.addText(slideData?.title, {
    x: 1,
    y: 1.9,
    w: "80%",
    h: 1.5,
    fontSize: 40,
    bold: true,
    color: "#664B34",
    align: "center",
    fontFace: "Candara",
    lineSpacingMultiple: 1.3,
  });

  let lastIndex = slideData?.slides?.length - 1;
  slideData?.slides?.forEach((slideData, index) => {
    let slide = pptx.addSlide();
    slide.background = {
      path:
        index === lastIndex
          ? titleSlideImg
          : index % 4 === 0
          ? contentSlideImg
          : index % 4 === 1
          ? contentSlide2Img
          : index % 4 === 2
          ? contentSlide3Img
          : contentSlide4Img,
    };

    // Kiểm tra nếu là slide cuối cùng
    if (index === lastIndex) {
      // Slide cảm ơn chỉ render Heading
      slide.addText(slideData?.heading, {
        x: 0.5,
        y: "40%", // Giữa slide
        w: "90%", // Toàn bộ chiều rộng
        h: 0.5,
        fontSize: 40,
        bold: true,
        color: "#664B34",
        align: "center",
        fontFace: "Candara",
      });
    } else {
      // Heading
      slide.addText(slideData?.heading.toUpperCase(), {
        x: 0.5,
        y: 0.4,
        w: "90%",
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: "#664B34",
        fontFace: "Candara",
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
        totalBulletPoints >= 6
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
                lineSpacingMultiple: 1.3,
              },
            }));
          } else {
            return {
              text: bulletPoint,
              options: {
                bullet: true, // Kiểu bullet chuẩn
                fontSize: bulletPointFontSize,
                indentLevel: 1, // Indent level cho bullet point
                lineSpacingMultiple: 1.3,
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
        margin: 1,
        fontFace: "Arial",
        color: "#624738",
      });

      const imagesNum = (slideData?.imageUrls ?? []).length;
      // Add Images
      (slideData?.imageUrls ?? []).forEach((image, imgIndex: number) => {
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

export default exportColorful01;
