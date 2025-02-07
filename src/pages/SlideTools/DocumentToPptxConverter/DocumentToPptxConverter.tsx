import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineUploadFile } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useHeader } from "../../../hooks/useHeader";
import styles from "./DocumentToPptxConverter.module.css";

function DocumentToPptxConverter() {
  const { setHeaderClass } = useHeader();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log(files[0]);
      navigate("/slide/generate-process/input", { state: { file: files[0] } });
    }
  };

  useEffect(() => {
    setHeaderClass("bg-header text-white border-none shadow-none");
  }, []);

  return (
    <div className="flex w-full pb-24 bg-gradient-to-b from-header to-background">
      <div className="animate-slidein flex flex-col items-center justify-center w-full h-1/4 px-4 lg:px-60 xl:px-72 2xl:px-96 gap-y-8 mt-8 lg:mt-20">
        <h1
          className={`text-4xl lg:text-5xl font-semibold font-degular ${styles["gradient-text"]}`}
        >
          Document to PPTX converter
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-800">
          Transform your documents into professional presentations with our
          AI-powered converter. Fast, simple, and efficient-get started in just
          a few clicks!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2 w-full px-20 lg:px-0 2xl:px-10">
          <label
            htmlFor="file-upload"
            className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white hover:shadow-lg hover:border-purple-500 hover:cursor-pointer"
          >
            <div className="text-center">
              <MdOutlineUploadFile
                aria-hidden="true"
                className="mx-auto size-12 text-purple-300"
              />
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.txt,.md"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">
                .pdf, .doc, .docx, .txt, .md
              </p>
              <p className="text-xs/5 text-gray-600">Max. 25MB per file.</p>
            </div>
          </label>
          <Link
            to="/slide/generate-process/input"
            className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white hover:shadow-lg hover:border-purple-500 hover:cursor-pointer"
          >
            <div className="text-center">
              <FiFileText
                aria-hidden="true"
                className="mx-auto size-12 text-purple-300"
              />
              <div className="mt-4 flex text-sm/6 text-gray-600 justify-center">
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                  <span>Paste text here</span>
                </label>
              </div>
              <p className="text-xs/5 text-gray-600">
                Paste any plain text to begin right away.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DocumentToPptxConverter;
