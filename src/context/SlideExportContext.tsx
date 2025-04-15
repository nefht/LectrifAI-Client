import { createContext, ReactNode, useState } from "react";
import { Presentation, render } from "react-pptx";
import { saveAs } from "file-saver";
import { ExportPptxHelper } from "../shared/templates/export-pptx";

interface SlideExportContextType {
  exportPptx: () => Promise<void>;
  downloadPptxHelper: (
    templateCode: string,
    slideData: any,
    fileName?: string
  ) => void;
  setExportSlides: (slides: JSX.Element[]) => void;
}

const SlideExportContext = createContext<SlideExportContextType | undefined>(
  undefined
);

function SlideExportProvider({ children }: { children: ReactNode }) {
  const [slides, setExportSlides] = useState<JSX.Element[]>([]);

  // Xuất file PPTX - react-pptx
  const exportPptx = async () => {
    try {
      // Export dùng react-pptx
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
      console.log("Exported Successfully!");
    } catch (error) {
      console.error("Error exporting PowerPoint:", error);
    }
  };

  // // Xuất file PPTX - PptxGenJS
  const downloadPptxHelper = (
    templateCode: string,
    slideData: any,
    fileName?: string
  ) => {
    ExportPptxHelper[templateCode as keyof typeof ExportPptxHelper](
      slideData,
      fileName
    );
  };

  return (
    <SlideExportContext.Provider
      value={{ exportPptx, downloadPptxHelper, setExportSlides }}
    >
      {children}
    </SlideExportContext.Provider>
  );
}

export { SlideExportContext, SlideExportProvider };
