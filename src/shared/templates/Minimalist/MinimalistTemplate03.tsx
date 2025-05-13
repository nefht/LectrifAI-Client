import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/minimalist-03/title-slide.png";
import contentSlideImg from "../../../assets/templates/minimalist-03/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-03/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/minimalist-03/content-slide-3.png";
import contentSlide4Img from "../../../assets/templates/minimalist-03/content-slide-4.png";
import contentSlide5Img from "../../../assets/templates/minimalist-03/content-slide-5.png";
import endSlideImg from "../../../assets/templates/minimalist-03/end-slide.png";

import { ExportSlideData } from "../constants/export-slide-data";

function MinimalistTemplate03(data: any) {
  console.log(data);
  // Title slide
  const titleSlide = [
    <Slide
      key={0}
      style={{ backgroundImage: { kind: "path", path: titleSlideImg } }}
    >
      <Text
        style={{
          x: 1,
          y: 1.5,
          w: "80%",
          h: 1.5,
          fontSize: 40,
          bold: true,
          color: "#664B34", // Màu chữ sáng để nổi bật trên nền ảnh
          align: "center",
          fontFace: "Candara",
        }}
      >
        {data.title.toUpperCase()}
      </Text>
    </Slide>,
  ];

  const contentSlide = (slideData: ExportSlideData, index: number) => {
    const totalBulletPoints = slideData.bulletPoints.reduce(
      (acc, bulletPoint) => {
        // Kiểm tra nếu bulletPoint là mảng (sub-bullet points)
        if (Array.isArray(bulletPoint)) {
          return acc + bulletPoint.length;
        } else {
          return acc + 1;
        }
      },
      0
    );

    let bulletPointFontSize = totalBulletPoints > 4 ? 15 : 17;
    let subBulletPointFontSize = totalBulletPoints > 4 ? 13 : 15;

    if (slideData?.imageUrls?.length > 0) {
      bulletPointFontSize -= 2;
      subBulletPointFontSize -= 2;
    }

    const textHeight =
      totalBulletPoints > 6 ? totalBulletPoints * 0.25 : totalBulletPoints * 1;

    const imagesNum = (slideData.imageUrls ?? []).length;

    const contentSlideImage =
      index % 5 === 0
        ? contentSlideImg
        : index % 5 === 1
        ? contentSlide2Img
        : index % 5 === 2
        ? contentSlide3Img
        : index % 5 === 3
        ? contentSlide4Img
        : contentSlide5Img;

    return [
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: contentSlideImage } }}
      >
        {/* Heading */}
        <Text
          style={{
            x: 0.5,
            y: 0.4,
            w: "90%",
            h: 0.5,
            color: "#664B34",
            fontSize: 20,
            bold: true,
            fontFace: "Candara",
          }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text
          style={{
            x: 0.7,
            y: 1,
            w: "85%",
            h: textHeight,
            fontSize: 15,
            color: "#624738",
          }}
        >
          {slideData.bulletPoints.map((bulletPoint, index) => {
            if (Array.isArray(bulletPoint)) {
              return bulletPoint.map((subBullet, subIndex) => (
                <Text.Bullet
                  key={`${index}-${subIndex}`}
                  style={{
                    fontSize: subBulletPointFontSize,
                  }}
                >
                  {`      ◦     ` + subBullet}
                </Text.Bullet>
              ));
            } else {
              return (
                <Text.Bullet
                  key={index}
                  style={{
                    fontSize: bulletPointFontSize,
                  }}
                >
                  {`•   ` + bulletPoint}
                </Text.Bullet>
              );
            }
          })}
        </Text>
        {/* Images */}
        {slideData.imageUrls &&
          slideData.imageUrls.map((image, index) => {
            const wRatio = image.width / (image.width + image.height);
            const hRatio = image.height / (image.width + image.height);
            return (
              <Image
                key={index}
                src={{ kind: "path", path: image.imageUrl }}
                style={{
                  x: 0.5 + (imagesNum > 2 ? 3 : 4) * index,
                  y: "60%",
                  w: wRatio * 4,
                  h: hRatio * 4,
                  sizing: {
                    fit: "contain",
                    ...(wRatio > hRatio
                      ? { imageWidth: 3, imageHeight: 2 }
                      : { imageWidth: 2, imageHeight: 2 }),
                  },
                }}
              />
            );
          })}

        {/* Images source */}
        {slideData.imageUrls && (
          <Text
            style={{
              x: 0.1,
              y: "95%",
              w: "90%",
              h: 0.5,
              fontSize: 5,
              color: "#664B34",
              fontFace: "Candara",
            }}
          >
            {slideData.imageUrls.map((image, index) => {
              return <Text.Bullet key={index}>{image.source ? `Image source: ${image.source}` : ""}</Text.Bullet>;
            })}
          </Text>
        )}
      </Slide>,
    ];
  };

  const endSlide = (slideData: ExportSlideData) => {
    return (
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: endSlideImg } }}
      >
        <Text
          style={{
            x: 0.5,
            y: "40%",
            w: "90%",
            h: 0.5,
            fontSize: 44,
            bold: true,
            align: "center",
            color: "#664B34",
            fontFace: "Candara",
          }}
        >
          {slideData.heading}
        </Text>
      </Slide>
    );
  };

  return [
    ...titleSlide,
    ...(data.slides
      ? data.slides.map((slideData: ExportSlideData, index: any) => {
          if (index === data.slides.length - 1) {
            return endSlide(slideData);
          } else {
            return contentSlide(slideData, index);
          }
        })
      : []),
  ];
}

export default MinimalistTemplate03;
