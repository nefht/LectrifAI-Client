import { useState } from "react";
import {
  Presentation,
  Slide,
  Text,
  Shape,
  Image,
  render,
  Table,
} from "react-pptx";
import Preview from "react-pptx/preview";
import { saveAs } from "file-saver";

function MinimalistTemplate01() {
  const slides = [
    <Slide key={0}>
      <Text
        style={{
          x: 3,
          y: 1,
          w: 3,
          h: 0.5,
          fontSize: 32,
          bold: true,
        }}
      >
        Hello there!
      </Text>
      <Shape
        type="rect"
        style={{
          x: 3,
          y: 1.55,
          w: 3,
          h: 0.1,
          backgroundColor: "#FF0000",
        }}
      />
    </Slide>,

    <Slide key={1} style={{ backgroundColor: "#DDDDDD" }}>
      <Text style={{ x: 3, y: 1, w: 3, h: 0.5, fontSize: 32 }}>
        <Text.Bullet>Adding bullet 1</Text.Bullet>
        <Text.Bullet>Adding bullet 2</Text.Bullet>
      </Text>
    </Slide>,

    <Slide key={2}>
      <Image
        src={{
          kind: "path",
          path: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxPwqyV35kl4DIBeyxo_szC6c3VTH8IHvqCvArkFX5AzDxnaQTuA44JRBhVg0Kv17Kyb5RL2tWbRpSrhAxlnvu6Q",
        }}
        style={{ x: "10%", y: "10%", w: "80%", h: "80%" }}
      />
    </Slide>,

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

    <Slide key={6} style={{ backgroundColor: "#DDDDDD" }}>
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
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 📥 Xuất file PPTX
  const exportPptx = async () => {
    try {
      const pptxBlob = new Blob(
        [
          await render(<Presentation>{slides}</Presentation>, {
            outputType: "arraybuffer",
          }),
        ],
        {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        }
      );
      saveAs(pptxBlob, "presentation.pptx");
    } catch (error) {
      console.error("❌ Error exporting PowerPoint:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Slide chính */}
      <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md">
        <Preview>
          <Presentation>{slides[currentSlide]}</Presentation>
        </Preview>
      </div>

      {/* Điều hướng */}
      <div className="flex gap-4 my-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={prevSlide}
        >
          ⬅ Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={nextSlide}
        >
          Next ➡
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 p-2 rounded-lg w-full overflow-x-scroll hide-scrollbar">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <div
              className={`w-40 cursor-pointer rounded-md overflow-hidden border-2 ${
                index === currentSlide ? "border-gray-400" : "border-transparent"
              }`}
              onClick={() => goToSlide(index)}
            >
              <Preview key={index}>
                <Presentation>{slide}</Presentation>
              </Preview>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Generating thumbnails...</p>
        )}
      </div>

      {/* Xuất PPTX */}
      <button
        className="mt-6 px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 transition"
        onClick={exportPptx}
      >
        📥 Export to PowerPoint
      </button>

      {/* Hidden Slide Render for Thumbnails */}
      <div className="hidden">
        {slides.map((slide, index) => (
          <div key={index}>
            <Preview>
              <Presentation>{slide}</Presentation>
            </Preview>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MinimalistTemplate01;
