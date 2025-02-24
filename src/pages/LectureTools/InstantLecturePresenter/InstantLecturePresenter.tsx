import { Fragment, useEffect, useState } from "react";
import { BiSidebar } from "react-icons/bi";
import { IoClose, IoSend } from "react-icons/io5";
import { BsImages } from "react-icons/bs";
import { Avatar } from "flowbite-react";
import lectrifaiAvatar from "../../../assets/images/logo/logo2.png";
import { useHeader } from "../../../hooks/useHeader";
import UploadDropzone from "./components/UploadDropzone";
import ChatSidebar from "./components/ChatSidebar";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { TiDelete } from "react-icons/ti";

interface Message {
  message: string;
  messageId: string;
  files: File[];
  fileUrls: string[];
}

function InstantLecturePresenter() {
  const { setHeaderClass } = useHeader();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewedFile, setViewedFile] = useState<string>("");

  // Fake data
  const [messageData, setMessageData] = useState<Message>({
    message: "",
    messageId: "",
    files: [],
    fileUrls: [],
  });
  const [mockMessages, setMockMessages] = useState<Message[] | null>([]);

  useEffect(() => {
    setHeaderClass("bg-white shadow-none dark:border-none");

    // Handle screen resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setMessageData((prevData) => ({
        ...prevData,
        files: [...prevData.files!, ...files],
        fileUrls: [...prevData.fileUrls!, ...fileUrls],
      }));
      console.log(messageData);
    }
  };

  // Xóa preview ảnh
  const handleRemoveUploadedFile = (url: string) => {
    const fileIndex = messageData.fileUrls.indexOf(url);

    if (fileIndex !== -1) {
      setMessageData((prevData) => ({
        ...prevData,
        files: prevData.files.filter((_, index) => index !== fileIndex),
        fileUrls: prevData.fileUrls.filter((_, index) => index !== fileIndex),
      }));
    }
    console.log(messageData);
  };

  const handleViewFile = (url: string) => {
    setViewedFile(url);
  };

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageData((prevData) => ({
      ...prevData,
      message: event.target.value,
    }));
  };

  const handleSendMessage = () => {
    if (messageData) {
      setMockMessages([...mockMessages!, messageData]);
      setMessageData({
        message: "",
        messageId: "",
        files: [],
        fileUrls: [],
      });
    }
  };

  return (
    <div className="relative flex w-full h-full-screen overflow-hidden">
      {/** Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/** Chat section */}
      <div className="flex flex-col w-full h-full-screen">
        <div className="relative flex-1 w-full min-h-[70vh] px-6 md:px-20 lg:px-40 2xl:px-60 overflow-y-scroll">
          <div
            className={`${
              isSidebarOpen && "hidden"
            } fixed top-20 right-5 md:right-10 p-1 rounded-md hover:bg-purple-200/80 cursor-pointer`}
            onClick={handleOpenSidebar}
          >
            <BiSidebar className="text-2xl text-purple-800/80" />
          </div>
          <div className="flex items-center gap-2 py-4">
            <Avatar img={lectrifaiAvatar} rounded size="sm" />
            <p className="text-xl font-degular font-semibold text-gray-800">
              Lectrifai
            </p>
          </div>

          {mockMessages?.length === 0 && (
            <UploadDropzone
              uploadedFiles={messageData.files}
              handleFileChange={handleFileChange}
            />
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
                <div className="fixed inset-0 flex items-center justify-center md:p-4">
                  <div
                    className="absolute inset-0 bg-gray-500/50"
                    onClick={() => setViewedFile("")}
                  />
                  <IoClose
                    onClick={() => setViewedFile("")}
                    className="absolute top-3 right-3 z-50 text-gray-600 rounded-full w-10 h-10 hover:cursor-pointer hover:text-gray-900 active:scale-90"
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
                    <DialogPanel className="pointer-events-auto relative bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] lg:max-h-full overflow-auto hide-scrollbar">
                      <img src={viewedFile} alt="" />
                    </DialogPanel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          )}

          {mockMessages?.map((msg, index) => (
            <div
              className="flex flex-col justify-end pl-12 lg:pl-20 xl:pl-40 py-2"
              key={index}
            >
              <div className="grid grid-cols-5 gap-4">
                {msg.fileUrls.map((file, index) => (
                  <div key={index} className="relative mb-4">
                    <img
                      src={file}
                      alt={`Preview ${index + 1}`}
                      className="rounded-lg shadow-lg w-28"
                      onClick={() => handleViewFile(file)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <div className="bg-gray-200/60 px-4 py-3 rounded-xl">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex-1 w-full max-h-full-screen">
          <div className="absolute bottom-0 left-0 right-0 w-full pb-6 bg-white rounded-t-3xl dark:bg-gray-800 px-6 md:px-20 lg:px-40 2xl:px-60">
            <div className="relative p-2 pb-8 md:p-4 md:pb-12 bg-gray-50 border border-gray-100 md:border-gray-300/80 shadow-md rounded-3xl dark:bg-gray-800">
              <div className="relative flex gap-4 overflow-x-scroll hide-scrollbar">
                {messageData.fileUrls.map((file, index) => (
                  <div key={index} className="relative mb-4 min-w-28">
                    <img
                      src={file}
                      alt={`Preview ${index + 1}`}
                      className="rounded-lg shadow-lg w-28"
                      onClick={() => handleViewFile(file)}
                    />
                    <TiDelete
                      onClick={() => handleRemoveUploadedFile(file)}
                      className="absolute top-0 right-0 text-red-500 rounded-full w-7 h-7 hover:cursor-pointer hover:bg-red-700"
                    />
                  </div>
                ))}
              </div>
              <textarea
                name="message"
                className="w-full h-10 md:h-auto max-h-60 resize-none border-none bg-transparent ring-transparent focus:ring-transparent dark:text-white dark:placeholder-gray-400 dark:bg-transparent dark:focus:ring-transparent custom-scrollbar"
                placeholder="Your message here..."
                value={messageData.message}
                onChange={(e) => handleChangeMessage(e)}
              ></textarea>
              <label htmlFor="dropzone-file">
                <BsImages className="absolute bottom-4 left-6 text-xl text-purple-400 hover:text-purple-700 cursor-pointer active:scale-90" />
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  multiple // Hỗ trợ chọn nhiều file
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <IoSend
                className="absolute bottom-4 right-4 text-xl text-purple-400 hover:text-purple-700 cursor-pointer active:scale-90"
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstantLecturePresenter;
