import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@coolbytes/editorjs-delimiter";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import InlineCode from "@editorjs/inline-code";
import EJLaTeX from "editorjs-latex";
import Warning from "@editorjs/warning";
import ToggleBlock from "editorjs-toggle-block";
import ColorPicker from "editorjs-color-picker";
import Alert from "editorjs-alert";
import TextVariantTune from "@editorjs/text-variant-tune";
import { useDebouncedCallback } from "use-debounce";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import "./EditorJS.css";
import notebookService from "../../../../LectureTools/services/notebookService";

const Notebook = () => {
  const { id: lectureId } = useParams<{ id: string }>();
  const editorRef = useRef<EditorJS | null>(null);
  const initialized = useRef(false); // Ngăn khởi tạo lại

  useEffect(() => {
    if (!lectureId || initialized.current) return;
    initialized.current = true; // Đánh dấu đã khởi tạo

    const fetchOrCreateNotebook = async () => {
      try {
        const notebook = await notebookService.createOrGetNotebook(lectureId);
        console.log("📓 Notebook:", notebook);
        initalizeEditor(notebook.content);
      } catch (error: any) {
        console.error("Failed to create or get notebook:", error);
      }
    };

    fetchOrCreateNotebook();
  }, [lectureId]);

  const initalizeEditor = (content: any) => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      placeholder: "Start typing...",
      tools: {
        paragraph: {
          class: Paragraph as any,
          inlineToolbar: true,
          tunes: ["textVariant"],
        },
        header: {
          class: Header as any,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header...",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          tunes: ["textVariant"],
        },
        list: List as any,
        quote: {
          class: Quote as any,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote...",
            captionPlaceholder: "Author",
          },
        },
        code: Code as any,
        delimiter: {
          class: Delimiter as any,
          config: {
            styleOptions: ["star", "dash", "line"],
            defaultStyle: "star",
            lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
            defaultLineWidth: 25,
            lineThicknessOptions: [1, 2, 3, 4, 5, 6],
            defaultLineThickness: 2,
          },
        },
        table: {
          class: Table as any,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        marker: Marker as any,
        underline: Underline as any,
        // image: {
        //   class: ImageTool as any,
        //   config: {
        //     endpoints: {
        //       byFile: "https://your-server.com/uploadFile",
        //       byUrl: "https://your-server.com/fetchUrl",
        //     },
        //   },
        // },
        embed: {
          class: Embed as any,
          config: {
            services: {
              youtube: true,
              twitter: true,
              instagram: true,
            },
          },
        },
        inlineCode: {
          class: InlineCode as any,
        },
        math: {
          class: EJLaTeX as any,
          config: {
            displayMode: true,
          },
        },
        warning: {
          class: Warning as any,
          inlineToolbar: true,
          config: {
            titlePlaceholder: "Title",
            messagePlaceholder: "Message",
          },
        },
        toggle: {
          class: ToggleBlock as any,
          inlineToolbar: true,
        },
        ColorPicker: {
          class: ColorPicker as any,
        },
        alert: {
          class: Alert as any,
          inlineToolbar: true,
          config: {
            alertTypes: [
              "primary",
              "secondary",
              "info",
              "success",
              "warning",
              "danger",
              "light",
              "dark",
            ],
            defaultType: "primary",
            messagePlaceholder: "Enter something",
          },
        },
        textVariant: TextVariantTune as any,
      },
      data: content || { blocks: [] },
      onChange: async () => {
        debouncedSave(editor);
      },
      onReady: () => {
        new Undo({ editor });
        new DragDrop(editor, "1px dashed #A888B5");
      },
    });

    editorRef.current = editor;
  };

  const debouncedSave = useDebouncedCallback(async (editorInstance) => {
    if (!editorInstance) return;

    try {
      const content = await editorInstance.saver.save();

      if (!content || !content.blocks) {
        throw new Error("Invalid EditorJS data format");
      }

      if (lectureId) {
        await notebookService.updateNotebook(lectureId, content);
      } else {
        console.error("🚨 Error: lectureId is undefined");
      }
      console.log("📓 Notebook saved:", content);

      // console.log("Saving content:", content);
      // localStorage.setItem("notebook-content", JSON.stringify(content));
      // console.log("Saved to localStorage");
    } catch (error) {
      console.error("🚨 Error saving notebook:", error);
    }
  }, 1000);

  return (
    <div
      id="content"
      className="w-full h-full max-h-full-screen py-8 px-8 xl:px-16 2xl:px-10 border-l border-gray-300 overflow-y-scroll shadow-md"
    >
      <h2 className="text-xl font-semibold">Notebook</h2>
      <p className="text-gray-500 mt-2 mb-10">
        This is a notebook where you can take notes during the lecture. The
        content will be saved automatically.
      </p>
      <div id="editorjs" className="rounded"></div>
    </div>
  );
};

export default Notebook;
