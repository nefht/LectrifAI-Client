import { Document, Packer, Paragraph, TextRun } from "docx";
import { QuizQuestion } from "../../../pages/Quiz/constants/quiz-data";
import {
  downloadDoc,
  getFooterTemplate,
  getHeaderTemplate,
  pageConfigDefault,
} from "../docx-utils";

export const QuizDocumentWithAnswer = (
  data: QuizQuestion[],
  fileName?: string
) => {
  const header = getHeaderTemplate();
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
                        children: [
                          new TextRun({
                            text: `${String.fromCharCode(65 + i)}. ${option}`,
                            size: 26,
                            ...(i == 0 && { break: 1 }),
                            color: quiz.answer === option ? "028A0F" : "000000",
                          }),
                        ],
                        spacing: {
                          before: 100,
                        },
                      });
                    })
                  : []),
                new Paragraph({
                  children: [
                    // new TextRun({
                    //   text: `Answer: ${quiz.answer}`,
                    //   bold: true,
                    //   size: 26,
                    //   break: 1,
                    // }),
                    new TextRun({
                      children: [
                        new TextRun({
                          text: `Answer: `,
                          bold: true,
                          size: 26,
                          break:
                            quiz.questionType === "multiple choice" ? 1 : 2,
                        }),
                        new TextRun({
                          text: `${quiz.answer}`,
                          bold:
                            quiz.questionType === "multiple choice"
                              ? true
                              : false,
                          size: 26,
                        }),
                      ],
                    }),
                    ...(quiz.explanation
                      ? [
                          new TextRun({
                            text: `Explanation: ${
                              quiz.explanation || "No explanation provided."
                            }`,
                            italics: true,
                            size: 26,
                            break: 1,
                          }),
                        ]
                      : []),
                  ],
                }),
              ],
            });
          }),
        ],
      },
    ],
  });

  downloadDoc(doc, `${fileName ? fileName : "Quiz_Set_Answer"}_`);
};
