import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/minimalist-01/title-slide.png";
import tocImg from "../../../assets/templates/minimalist-01/toc.png";
import contentSlideImg from "../../../assets/templates/minimalist-01/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-01/content-slide-2.png";
import { ExportSlideData } from "../constants/export-slide-data";

function MinimalistTemplate01(data: any) {
  let mainTitleIndex = 1;
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
          w: 8,
          h: 1.5,
          fontSize: 40,
          bold: true,
          color: "#000000", // Màu chữ sáng để nổi bật trên nền ảnh
          align: "center",
          fontFace: "Arial",
        }}
      >
        {data.title}
      </Text>
      <Text
        style={{
          x: 1,
          y: 3.5,
          w: 8,
          h: 1,
          fontSize: 18,
          color: "#000000", // Màu chữ phụ
          align: "center",
          fontFace: "Arial",
        }}
      >
        {"Here goes your presentation!"}
      </Text>
    </Slide>,
  ];

  // Table of Contents slide
  const tableOfContent = (slideData: ExportSlideData) => {
    const totalTitles = slideData.bulletPoints.length;
    const textHeight = totalTitles > 6 ? totalTitles * 0.25 : totalTitles * 1;
    if (totalTitles > 6) {
      return [
        <Slide
          key="toc"
          style={{ backgroundImage: { kind: "path", path: tocImg } }}
        >
          <Text
            style={{
              x: 0.5,
              y: 0.5,
              w: "90%",
              h: 0.5,
              fontSize: 20,
              bold: true,
            }}
          >
            {slideData.heading.toUpperCase()}
          </Text>

          <Text style={{ x: 1, y: 1, w: "80%", h: textHeight, fontSize: 15 }}>
            {slideData.bulletPoints.map((bulletPoint, index) => {
              return (
                <Text.Bullet
                  key={index}
                  style={{
                    fontSize: 15,
                    bold: true,
                  }}
                >
                  {index + 1 + ". " + bulletPoint}
                </Text.Bullet>
              );
            })}
          </Text>
        </Slide>,
      ];
    } else {
      return [
        <Slide
          key="toc"
          style={{ backgroundImage: { kind: "path", path: tocImg } }}
        >
          <Text
            style={{
              x: 0.5,
              y: 0.5,
              w: "90%",
              h: 0.5,
              fontSize: 24,
              bold: true,
            }}
          >
            {slideData.heading.toUpperCase()}
          </Text>

          <Text
            style={{
              x: 1,
              y: 1.5,
              w: "80%",
              h: textHeight,
              fontSize: 20,
            }}
          >
            {slideData.bulletPoints.map((bulletPoint, index) => (
              <Text.Bullet key={index} style={{ fontSize: 20, bold: true }}>
                {index + 1 + ". " + bulletPoint}
              </Text.Bullet>
            ))}
          </Text>
        </Slide>,
      ];
    }
  };

  // Main section title slide
  const mainSectionTitleSlide = (slideData: ExportSlideData) => {
    return [
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: tocImg } }}
      >
        <Text
          style={{
            x: 1,
            y: 1.7,
            w: 8,
            h: 1.5,
            fontSize: 36,
            bold: true,
            align: "center",
          }}
        >
          <Text.Bullet style={{ fontSize: 42 }}>
            {mainTitleIndex++ + "."}
          </Text.Bullet>
          <Text.Bullet>{slideData.heading.toUpperCase()}</Text.Bullet>
        </Text>
      </Slide>,
    ];
  };

  const contentSlideV1 = (slideData: ExportSlideData) => {
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

    const bulletPointFontSize = totalBulletPoints > 4 ? 15 : 17;
    const subBulletPointFontSize = totalBulletPoints > 4 ? 13 : 15;

    const textHeight =
      totalBulletPoints > 6 ? totalBulletPoints * 0.25 : totalBulletPoints * 1;

    const imagesNum = (slideData.imageUrls ?? []).length;

    return [
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: contentSlideImg } }}
      >
        {/* Heading */}
        <Text
          style={{
            x: 0.5,
            y: 0.5,
            w: "90%",
            h: 0.5,
            fontSize: 20,
            bold: true,
          }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text style={{ x: 1, y: 1, w: "80%", h: textHeight, fontSize: 15 }}>
          {slideData.bulletPoints.map((bulletPoint, index) => {
            if (Array.isArray(bulletPoint)) {
              return bulletPoint.map((subBullet, subIndex) => (
                <Text.Bullet
                  key={`${index}-${subIndex}`}
                  style={{
                    // x: 2,
                    // y: 2 + (index + subIndex) * 0.5,
                    // w: 8,
                    // h: 1,
                    fontSize: subBulletPointFontSize,
                  }}
                >
                  {/* ◦ {subBullet} */}
                  {`◦   ` + subBullet}
                </Text.Bullet>
              ));
            } else {
              return (
                <Text.Bullet
                  key={index}
                  style={{
                    // x: 1,
                    // y: 2 + index * 0.5,
                    // w: 8,
                    // h: 1,
                    // breakLine: true,
                    fontSize: bulletPointFontSize,
                  }}
                >
                  {/* • {bulletPoint} */}
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
                  x: 1 + (imagesNum > 2 ? 3 : 4) * index,
                  y: "65%",
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
      </Slide>,
    ];
  };

  const contentSlideV2 = (slideData: ExportSlideData) => {
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

    const bulletPointFontSize = totalBulletPoints > 4 ? 14 : 17;
    const subBulletPointFontSize = totalBulletPoints > 4 ? 12 : 15;

    const textHeight =
      totalBulletPoints > 6 ? totalBulletPoints * 0.25 : totalBulletPoints * 1;

    const imagesNum = (slideData.imageUrls ?? []).length;

    return [
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: contentSlide2Img } }}
      >
        {/* Heading */}
        <Text
          style={{
            x: 0.5,
            y: 0.5,
            w: "90%",
            h: 0.5,
            fontSize: 20,
            bold: true,
          }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text style={{ x: 1, y: 1, w: "80%", h: textHeight, fontSize: 15 }}>
          {slideData.bulletPoints.map((bulletPoint, index) => {
            if (Array.isArray(bulletPoint)) {
              return bulletPoint.map((subBullet, subIndex) => (
                <Text.Bullet
                  key={`${index}-${subIndex}`}
                  style={{
                    // x: 2,
                    // y: 2 + (index + subIndex) * 0.5,
                    // w: 8,
                    // h: 1,
                    fontSize: subBulletPointFontSize,
                  }}
                >
                  {/* ◦ {subBullet} */}
                  {`◦   ` + subBullet}
                </Text.Bullet>
              ));
            } else {
              return (
                <Text.Bullet
                  key={index}
                  style={{
                    // x: 1,
                    // y: 2 + index * 0.5,
                    // w: 8,
                    // h: 1,
                    // breakLine: true,
                    fontSize: bulletPointFontSize,
                  }}
                >
                  {/* • {bulletPoint} */}
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
                  x: 1 + (imagesNum > 2 ? 3 : 4) * index,
                  y: "65%",
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
      </Slide>,
    ];
  };

  return [
    ...titleSlide,
    ...(data.slides
      ? data.slides.map((slideData: ExportSlideData, index: any) => {
          if (slideData.bulletPoints.length === 0) {
            return mainSectionTitleSlide(slideData); // Main section title slide
          } else if (index === 0) {
            return tableOfContent(slideData); // First slide: Table of Content
          } else if (index % 2 === 0) {
            return contentSlideV1(slideData); // Even index slides: Content Slide V1
          } else if (index % 2 !== 0) {
            return contentSlideV2(slideData); // Odd index slides: Content Slide V2
          } else if (index === data.slides.length - 1) {
            return contentSlideV1(slideData); // Last slide: Thank you
          }
          return null;
        })
      : []),
  ];
}

export default MinimalistTemplate01;
