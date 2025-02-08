import { createContext, ReactNode, useState } from "react";
import { Presentation, render } from "react-pptx";
import { saveAs } from "file-saver";

interface SlideExportContextType {
  exportPptx: () => Promise<void>;
  setExportSlides: (slides: JSX.Element[]) => void;
}

const SlideExportContext = createContext<SlideExportContextType | undefined>(
  undefined
);

function SlideExportProvider({ children }: { children: ReactNode }) {
  const [slides, setExportSlides] = useState<JSX.Element[]>([]);

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
      console.log("✅ Exported Successfully!");
    } catch (error) {
      console.error("❌ Error exporting PowerPoint:", error);
    }
  };

  return (
    <SlideExportContext.Provider value={{ exportPptx, setExportSlides }}>
      {children}
    </SlideExportContext.Provider>
  );
}

export { SlideExportContext, SlideExportProvider };
