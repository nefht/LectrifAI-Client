import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/minimalist-01/title-slide.png";
import contentSlideImg from "../../../assets/templates/minimalist-01/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-01/content-slide-2.png";

function MinimalistTemplate02(data: any) {
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

  const contentSlideV1 = (slideData: {
    heading: string;
    bulletPoints: (string | string)[];
    imageSuggestions: string[];
    imageUrls: { title: string; imageUrl: string }[];
  }) => {
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
            w: "100%",
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
                    indentLevel: 2,
                  }}
                >
                  {/* ◦ {subBullet} */}
                  {subBullet}
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
                    indentLevel: 1,
                  }}
                >
                  {/* • {bulletPoint} */}
                  {bulletPoint}
                </Text.Bullet>
              );
            }
          })}
        </Text>
        {/* Images */}
        {/* {slideData.imageUrls &&
          slideData.imageUrls.map((image, index) => (
            <Image
              key={index}
              src={{ kind: "path", path: image.imageUrl }}
              style={{ x: 1 + index, y: "60%", h: "30%" }}
            />
          ))} */}
      </Slide>,
    ];
  };

  const contentSlideV2 = (slideData: {
    heading: string;
    bulletPoints: (string | string)[];
    imageSuggestions: string[];
    imageUrls: { title: string; imageUrl: string }[];
  }) => {
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
            w: "100%",
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
                    indentLevel: 2,
                  }}
                >
                  {/* ◦ {subBullet} */}
                  {subBullet}
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
                    indentLevel: 1,
                  }}
                >
                  {/* • {bulletPoint} */}
                  {bulletPoint}
                </Text.Bullet>
              );
            }
          })}
        </Text>
        {/* Images */}
        {/* {slideData.imageUrls &&
          slideData.imageUrls.map((image, index) => (
            <Image
              key={index}
              src={{ kind: "path", path: image.imageUrl }}
              style={{ x: 1 + index, y: "60%", h: "30%" }}
            />
          ))} */}
      </Slide>,
    ];
  };

  const contentSlideV3 = (slideData: {
    heading: string;
    bulletPoints: (string | string)[];
    imageSuggestions: string[];
    imageUrls: { title: string; imageUrl: string }[];
  }) => {
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
            w: "100%",
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
                    indentLevel: 2,
                  }}
                >
                  {/* ◦ {subBullet} */}
                  {subBullet}
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
                    indentLevel: 1,
                  }}
                >
                  {/* • {bulletPoint} */}
                  {bulletPoint}
                </Text.Bullet>
              );
            }
          })}
        </Text>
        {/* Images */}
        {/* {slideData.imageUrls &&
          slideData.imageUrls.map((image, index) => (
            <Image
              key={index}
              src={{ kind: "path", path: image.imageUrl }}
              style={{ x: 1 + index, y: "60%", h: "30%" }}
            />
          ))} */}
      </Slide>,
    ];
  };

  return [
    ...titleSlide,
    ...(data.slides
      ? data.slides.map(
          (
            slideData: {
              heading: string;
              bulletPoints: (string | string)[];
              imageSuggestions: string[];
              imageUrls: { title: string; imageUrl: string }[];
            },
            index: any
          ) =>
            index % 3 === 0
              ? contentSlideV1(slideData)
              : index % 3 === 1
              ? contentSlideV2(slideData)
              : contentSlideV3(slideData)
        )
      : []),
  ];
}

export default MinimalistTemplate02;
