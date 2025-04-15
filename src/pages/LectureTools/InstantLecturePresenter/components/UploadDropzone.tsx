import { useState } from "react";

interface UploadDropzoneProps {
  uploadedFiles: File[];
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropFiles: (files: FileList) => void;
}

function UploadDropzone({
  uploadedFiles,
  handleFileChange,
  handleDropFiles,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      handleDropFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <label
      htmlFor="dropzone-file"
      className={`flex flex-col items-center justify-center w-full mb-4 h-64 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-600 ${
        uploadedFiles.length > 0 ? "h-20" : ""
      } ${
        isDragging
          ? "bg-purple-100 border-purple-500 dark:bg-purple-800 dark:border-purple-300"
          : "bg-purple-50 border-purple-300 dark:bg-gray-700 dark:border-purple-600"
      } hover:bg-purple-100 dark:hover:border-purple-500 dark:hover:bg-purple-600`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          className={`w-8 h-8 mb-4 ${
            isDragging ? "text-purple-700 animate-bounce" : "text-purple-500"
          } dark:text-purple-400`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-md text-purple-500 dark:text-purple-400">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-sm text-center text-purple-500 dark:text-purple-400">
          Drop your image here and send your messages, then we will start
          teaching
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        accept="image/*"
        multiple // Hỗ trợ chọn nhiều file
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
}

export default UploadDropzone;
