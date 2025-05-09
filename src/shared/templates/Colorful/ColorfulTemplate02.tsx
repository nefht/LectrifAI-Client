import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/colorful-02/title-slide.png";
import contentSlideImg from "../../../assets/templates/colorful-02/content-slide.png";
import contentSlide2Img from "../../../assets/templates/colorful-02/content-slide-2.png";
import contentSlide3Img from "../../../assets/templates/colorful-02/content-slide-3.png";
import contentSlide4Img from "../../../assets/templates/colorful-02/content-slide-4.png";
import endSlideImg from "../../../assets/templates/colorful-02/end-slide.png";
import { ExportSlideData } from "../constants/export-slide-data";

function ColorfulTemplate02(data: any) {
  console.log(data);
  // Title slide
  const titleSlide = [
    <Slide
      key={0}
      style={{ backgroundImage: { kind: "path", path: titleSlideImg } }}
    >
      <Text
        style={{
          x: 0.2,
          y: "30%",
          w: "75%",
          h: 1.5,
          fontSize: 34,
          bold: true,
          color: "#FFFFFF", // Màu chữ sáng để nổi bật trên nền ảnh
          align: "left",
          fontFace: "Candara",
        }}
      >
        {data?.title?.toUpperCase()}
      </Text>
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
            x: 0.2,
            y: 0.3,
            w: "95%",
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
            y: 1.2,
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
                  x: 1 + (imagesNum > 2 ? 3 : 4) * index,
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
            y: "20%",
            w: "20%",
            h: 0.5,
            fontSize: 24,
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
            x: "34%",
            y: "18%",
            w: "62%",
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
                  x: 1 + (imagesNum > 2 ? 3 : 4) * index,
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
      </Slide>,
    ];
  };

  const contentSlideV3 = (slideData: ExportSlideData) => {
    {
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

      const imagesNum = (slideData.imageUrls ?? []).length;

      return (
        <Slide
          key={slideData.heading}
          style={{ backgroundImage: { kind: "path", path: contentSlide3Img } }}
        >
          {/* Heading */}
          <Text
            style={{
              x: 0.2,
              y: 0.2,
              w: "70%",
              h: 0.5,
              fontSize: 20,
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
              x: 0.2,
              y: 1,
              w: "70%",
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
                    x: 1 + (imagesNum > 2 ? 3 : 4) * index,
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
        </Slide>
      );
    }
  };

  const contentSlideV4 = (slideData: ExportSlideData) => {
    {
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

      const imagesNum = (slideData.imageUrls ?? []).length;

      return (
        <Slide
          key={slideData.heading}
          style={{ backgroundImage: { kind: "path", path: contentSlide4Img } }}
        >
          {/* Heading */}
          <Text
            style={{
              x: "74%",
              y: 0.5,
              w: "24%",
              h: 0.5,
              fontSize: 28,
              bold: true,
              align: "right",
              fontFace: "Candara",
              color: "#FFFFFF",
            }}
          >
            {slideData.heading.toUpperCase()}
          </Text>

          {/* Bullet Points */}
          <Text
            style={{
              x: 0.3,
              y: 0.5,
              w: "70%",
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
                    x: 1 + (imagesNum > 2 ? 3 : 4) * index,
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
            x: "30%",
            y: "35%",
            w: "40%",
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
          console.log("Index", index);
          const containImage = slideData?.imageUrls?.length > 0;
          console.log("contain image", containImage);
          if (index === data.slides.length - 1) {
            return endSlide(slideData);
          }
          if (containImage) {
            if (index % 3 === 0) {
              return contentSlideV1(slideData);
            } else if (index % 3 === 1) {
              return contentSlideV3(slideData);
            } else {
              return contentSlideV4(slideData);
            }
          } else {
            if (index % 2 === 0) {
              return contentSlideV4(slideData);
            } else {
              return contentSlideV2(slideData);
            }
          }
        })
      : []),
  ];
}

export default ColorfulTemplate02;
