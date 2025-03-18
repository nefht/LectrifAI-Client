import { Image, Slide, Text, Table, Shape, Line } from "react-pptx";
import titleSlideImg from "../../../assets/templates/minimalist-01/title-slide.png";
import contentSlideImg from "../../../assets/templates/minimalist-01/content-slide.png";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

function MinimalistTemplate01(data: any) {
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
          y: 2,
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
    return [
      <Slide
        key={slideData.heading}
        style={{ backgroundImage: { kind: "path", path: contentSlideImg } }}
      >
        {/* Heading */}
        <Text
          style={{ x: 0.5, y: 0.5, w: "100%", h: 0.5, fontSize: 28, bold: true }}
        >
          {slideData.heading.toUpperCase()}
        </Text>

        {/* Bullet Points */}
        <Text style={{ x: 1, y: 2, w: 8, h: 1, fontSize: 20 }}>
          {slideData.bulletPoints.map((bulletPoint, index) => {
            if (Array.isArray(bulletPoint)) {
              return bulletPoint.map((subBullet, subIndex) => (
                <Text.Bullet
                  key={`${index}-${subIndex}`}
                  style={{
                    x: 2,
                    y: 2 + (index + subIndex) * 0.5,
                    w: 8,
                    h: 1,
                    fontSize: 16,
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
                    x: 1,
                    y: 2 + index * 0.5,
                    w: 8,
                    h: 1,
                    fontSize: 20,
                    breakLine: true,
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
          ) => contentSlideV1(slideData)
        )
      : []),

    <Slide key={1} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
      <Text style={{ x: 3, y: 3.5, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet type="number">Adding bullet</Text.Bullet>
        <Text.Bullet type="number">Adding bullet</Text.Bullet>
      </Text>
    </Slide>,

    // <Slide key={2}>
    //   <Image
    //     src={{
    //       kind: "path",
    //       path: "https://hocmai.vn/kho-tai-lieu/documents/1548673568/page-1.png",
    //     }}
    //     style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
    //   />
    // </Slide>,

    <Slide key={3}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

    <Slide key={4}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

    <Slide key={5}>
      <Table
        rows={[
          [
            <Table.Cell
              colSpan={2}
              style={{
                align: "center",
                backgroundColor: "#115599",
                color: "white",
              }}
            >
              Title
            </Table.Cell>,
          ],
          [
            "foo",
            <Table.Cell style={{ align: "right", backgroundColor: "#404040" }}>
              bar
            </Table.Cell>,
          ],
          [
            <Table.Cell style={{ verticalAlign: "bottom" }}>
              what about a{" "}
              <Text.Link url="https://www.youtube.com/watch?v=6IqKEeRS90A">
                link
              </Text.Link>
            </Table.Cell>,
            "xyz",
          ],
        ]}
        style={{
          x: "10%",
          y: "10%",
          w: "80%",
          h: "80%",
          borderWidth: 4,
          borderColor: "#ff0000",
          margin: 20,
        }}
      />
    </Slide>,

    <Slide key={6}>
      <Shape
        type="rect"
        style={{
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
          backgroundColor: "#DDDDDD",
        }}
      />
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={7} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={8} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={9} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={10} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={11} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,
  ];
}

export default MinimalistTemplate01;
