import { Document, Paragraph, Tab, TabStopType, TextRun } from "docx";
import {
  downloadDoc,
  getFooterTemplate,
  getHeaderTemplate,
  pageConfigDefault,
} from "../docx-utils";

export const QuizOriginalText = (data: string, fileName?: string) => {
  const title = fileName?.replace("_Original File", "") ?? "QUIZ ORIGINAL FILE";
  const header = getHeaderTemplate(true);
  const footer = getFooterTemplate();
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { ...(pageConfigDefault as any) },
        },
        headers: {
          default: header,
        },
        footers: {
          default: footer,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 36,
                break: 1,
              }),
            ],
            alignment: "center",
          }),
          new Paragraph({
            children: [
              new TextRun({
                children: [new Tab(), data],
                size: 26,
                break: 1,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.LEFT,
                position: 800,
              },
            ],
            spacing: {
              line: 300,
            },
            alignment: "both",
          }),
        ],
      },
    ],
  });

  downloadDoc(doc, `${fileName ? fileName : "Quiz_Document_Text"}_`);
};
