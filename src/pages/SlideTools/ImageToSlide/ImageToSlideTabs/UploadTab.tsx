import React, { useState, Fragment } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { TiDelete } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { useImageToSlide } from "../hooks/useImageToSlide";
import { EGeneratedSlideForm } from "../../constants/generated-slide-form";

function UploadTab() {
  const [uploadedFilesUrls, setUploadedFilesUrls] = useState<string[]>([]); // Lưu danh sách URL ảnh
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Lưu danh sách file ảnh
  const [viewedFile, setViewedFile] = useState<string>("");
  const { presentationOptions, handleGetPresentationOptions } =
    useImageToSlide();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedFilesUrls((prev) => [...prev, ...fileUrls]); // Cập nhật danh sách ảnh
      setUploadedFiles((prev) => [...prev, ...files]); // Cập nhật danh sách file ảnh
      handleGetPresentationOptions({
        target: { name: EGeneratedSlideForm.CONTENT, value: uploadedFiles },
      });
    }
  };

  const handleViewFile = (url: string) => {
    setViewedFile(url);
  };

  const handleRemoveUploadedFile = (url: string) => {
    // Xóa preview ảnh
    setUploadedFilesUrls((prev) => prev.filter((file) => file !== url));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Upload Area */}
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full mb-4 h-64 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-600 ${
          uploadedFilesUrls.length > 0 ? "h-20" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-purple-500 dark:text-purple-400"
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
          <p className="mb-2 text-sm text-purple-500 dark:text-purple-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          name={EGeneratedSlideForm.CONTENT}
          id="dropzone-file"
          type="file"
          accept="image/*"
          multiple // Hỗ trợ chọn nhiều file
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview Images */}
      {uploadedFilesUrls.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {uploadedFilesUrls.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file}
                alt={`Preview ${index + 1}`}
                className="max-w-full max-h-40 rounded-lg shadow-lg"
                onClick={() => handleViewFile(file)}
              />
              <TiDelete
                onClick={() => handleRemoveUploadedFile(file)}
                className="absolute top-0 right-0 text-red-500 rounded-full w-7 h-7 hover:cursor-pointer hover:bg-red-700"
              />
            </div>
          ))}
        </div>
      )}

      {/* Viewed Image */}
      {viewedFile && (
        <Transition show={viewedFile.length > 0} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => {
              () => setViewedFile("");
            }}
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-gray-500/50"
                onClick={() => setViewedFile("")}
              />
              <IoClose
                onClick={() => setViewedFile("")}
                className="absolute top-2 right-2 text-gray-700 rounded-full w-10 h-10 hover:cursor-pointer hover:text-gray-900"
              />
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-500"
                enterFrom="translate-y-4 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition ease-in duration-500"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-4 opacity-0"
              >
                <DialogPanel className="pointer-events-auto relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] lg:max-h-full overflow-auto hide-scrollbar">
                  <img src={viewedFile} alt="" />
                </DialogPanel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
}

export default UploadTab;
