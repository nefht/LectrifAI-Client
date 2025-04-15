import {
  Packer,
  Document,
  Header,
  Table,
  BorderStyle,
  TableRow,
  TableCell,
  Paragraph,
  ImageRun,
  AlignmentType,
  TextRun,
  Footer,
  PageNumber,
} from "docx";
// import logo from "../documents/assets/header-logo.svg";
import { logo } from "../documents/assets/logo-base64.ts";
import logoPng from "../documents/assets/logo.png";

export const downloadDoc = async (doc: Document, fileName?: string) => {
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  a.download = fileName
    ? `${fileName + day + month + year}`
    : `document_${day + month + year}.docx`;

  a.click();
};

export const borderNoneConfig = {
  top: {
    style: BorderStyle.NONE,
  },
  bottom: {
    style: BorderStyle.NONE,
  },
  left: {
    style: BorderStyle.NONE,
  },
  right: {
    style: BorderStyle.NONE,
  },
};

export const pageConfigDefault = {
  margin: {
    top: "0.79in", // Lề trên
    right: "0.79in", // Lề phải
    bottom: "0.69in", // Lề dưới
    left: "1.18in", // Lề trái
  },
};

export const getHeaderTemplate = (includeLine?: boolean) => {
  return new Header({
    children: [
      new Table({
        alignment: "center",
        // rộng full trang
        width: {
          size: 100,
          type: "pct",
        },
        borders: {
          ...borderNoneConfig,
          bottom: {
            style: includeLine ? "single" : "none",
          },
          insideHorizontal: {
            style: "none",
          },
          insideVertical: {
            style: "none",
          },
        } as any,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 30,
                  type: "pct",
                },
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: logo,
                        transformation: {
                          width: 170,
                          height: 50,
                        },
                        type: "png",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                ],
                // không border
                borders: {
                  ...(borderNoneConfig as any),
                },
                // không có vạch ngăn cách
              }),
              new TableCell({
                width: {
                  size: 70,
                  type: "pct",
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: " ",
                        size: 18,
                        bold: true,
                      }),
                      new TextRun({
                        text: " ",
                        size: 18,
                        break: 1,
                      }),
                      new TextRun({
                        text: " ",
                        size: 18,
                        break: 1,
                      }),
                      new TextRun({
                        text: " ",
                        size: 18,
                        break: 1,
                      }),
                      new TextRun({
                        text: " ",
                        size: 18,
                        break: 1,
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                  }),
                ],
                // không border
                borders: {
                  ...(borderNoneConfig as any),
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export const getFooterTemplate = () => {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 26,
          }),
        ],
      }),
    ],
  });
};
