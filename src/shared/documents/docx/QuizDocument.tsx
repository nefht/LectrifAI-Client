import { Document, Paragraph, TextRun } from "docx";
import { QuizQuestion } from "../../../pages/Quiz/constants/quiz-data";
import {
  downloadDoc,
  getFooterTemplate,
  getHeaderTemplate,
  pageConfigDefault,
} from "../docx-utils";

export const QuizDocument = (data: QuizQuestion[], fileName?: string) => {
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
                text: `${fileName?.toUpperCase() ?? "QUIZ SET"}`,
                bold: true,
                size: 36,
              }),
            ],
            alignment: "center",
          }),
          ...data.map((quiz, index) => {
            return new Paragraph({
              spacing: {
                line: 100,
              },
              children: [
                new TextRun({
                  children: [
                    new TextRun({
                      text: `${index + 1}. ${quiz.question}`,
                      bold: true,
                      size: 26,
                      ...(index == 0 && { break: 2 }),
                    }),
                    new TextRun({
                      text: ` (${quiz.points} points)`,
                      italics: true,
                      size: 26,
                    }),
                  ],
                }),
                ...(quiz.questionType === "multiple choice"
                  ? quiz.options.map((option, i) => {
                      return new Paragraph({
                        spacing: {
                          line: 100,
                        },
                        children: [
                          new TextRun({
                            text: `${String.fromCharCode(65 + i)}. ${option}`,
                            size: 26,
                            ...(i == 0 && { break: 1 }),
                          }),
                        ],
                      });
                    })
                  : []),
              ],
            });
          }),
        ],
      },
    ],
  });

  downloadDoc(doc, `${fileName ? fileName : "Quiz_Set"}_`);
};
