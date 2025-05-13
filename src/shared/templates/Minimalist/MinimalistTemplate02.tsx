import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/minimalist-02/title-slide.png";
import contentSlideImg from "../../../assets/templates/minimalist-02/content-slide.png";
import contentSlide2Img from "../../../assets/templates/minimalist-02/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/minimalist-02/content-slide-3.png";
import endSlideImg from "../../../assets/templates/minimalist-02/end-slide.png";
import { ExportSlideData } from "../constants/export-slide-data";

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
          x: "47%",
          y: "45%",
          w: "50%",
          h: 1.5,
          fontSize: 32,
          bold: true,
          color: "#FFFFFF", // Màu chữ sáng để nổi bật trên nền ảnh
          align: "center",
          fontFace: "Candara",
        }}
      >
        {data.title}
      </Text>
      <Shape
        type="rect"
        style={{
          x: "40%",
          y: "95%",
          w: "60%",
          h: 0.05,
          backgroundColor: "#FFFFFF",
        }}
      />
    </Slide>,
  ];

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
            y: 0.3,
            w: "90%",
            h: 0.5,
            fontSize: 20,
            bold: true,
            align: "center",
            fontFace: "Candara",
          }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text
          style={{
            x: 0.5,
            y: 1,
            w: "90%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
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
              fontFace: "Candara",
            }}
          >
            {slideData.imageUrls.map((image, index) => {
              return (
                <Text.Bullet key={index}>
                  {image.source ? `Image source: ${image.source}` : ""}
                </Text.Bullet>
              );
            })}
          </Text>
        )}
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

    const bulletPointFontSize = totalBulletPoints > 4 ? 15 : 17;
    const subBulletPointFontSize = totalBulletPoints > 4 ? 13 : 15;

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
            x: 1,
            y: 0.3,
            w: "85%",
            h: 0.5,
            fontSize: 20,
            bold: true,
            align: "center",
            fontFace: "Candara",
          }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text
          style={{
            x: 0.5,
            y: 1,
            w: "90%",
            h: textHeight,
            fontSize: 15,
            fontFace: "Candara",
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
              fontFace: "Candara",
            }}
          >
            {slideData.imageUrls.map((image, index) => {
              return (
                <Text.Bullet key={index}>
                  {image.source ? `Image source: ${image.source}` : ""}
                </Text.Bullet>
              );
            })}
          </Text>
        )}
      </Slide>,
    ];
  };

  const contentSlideV3 = (slideData: ExportSlideData) => {
    if (slideData?.imageUrls?.length > 0) {
      return contentSlideV2(slideData);
    } else {
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
        totalBulletPoints > 6
          ? totalBulletPoints * 0.25
          : totalBulletPoints * 1;

      return (
        <Slide
          key={slideData.heading}
          style={{ backgroundImage: { kind: "path", path: contentSlide3Img } }}
        >
          {/* Heading */}
          <Text
            style={{
              x: 0.5,
              y: slideData.heading.length > 30 ? "35%" : "40%",
              w: "27%",
              h: 0.5,
              fontSize: 28,
              bold: true,
              align: "left",
              fontFace: "Candara",
            }}
          >
            {slideData.heading.toUpperCase()}
          </Text>

          {/* Bullet Points */}
          <Text
            style={{
              x: "53%",
              y: 1.5,
              w: "45%",
              h: textHeight,
              fontSize: 15,
              fontFace: "Candara",
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
        </Slide>
      );
    }
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
            fontSize: 40,
            bold: true,
            align: "center",
            color: "#FFFFFF",
            fontFace: "Candara",
          }}
        >
          {slideData.heading.toUpperCase()}
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
          } else if (index % 3 === 0) {
            return contentSlideV1(slideData);
          } else if (index % 3 === 1) {
            return contentSlideV2(slideData);
          } else if (index % 3 === 2) {
            return contentSlideV3(slideData);
          } else {
            return [];
          }
        })
      : []),
  ];
}

export default MinimalistTemplate02;
