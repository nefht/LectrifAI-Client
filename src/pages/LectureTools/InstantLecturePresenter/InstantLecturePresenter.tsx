import { Fragment, useEffect, useRef, useState } from "react";
import { BiSidebar } from "react-icons/bi";
import { IoClose, IoSend } from "react-icons/io5";
import { BsImages } from "react-icons/bs";
import { Avatar } from "flowbite-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TiDelete } from "react-icons/ti";
import { useNavigate, useParams } from "react-router";
import { FiMaximize } from "react-icons/fi";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import lectrifaiAvatar from "../../../assets/images/logo/logo2.png";
import { useHeader } from "../../../hooks/useHeader";
import UploadDropzone from "./components/UploadDropzone";
import ChatSidebar from "./components/ChatSidebar";
import instantLectureService from "../services/instantLectureService";
import { useToast } from "../../../hooks/useToast";

export interface Message {
  text: string;
  files: File[];
  fileUrls: string[];
  role: string; // "user" or "model"
  imageUrl?: string; // Image URL from backend
}

function InstantLecturePresenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setHeaderClass } = useHeader();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewedFile, setViewedFile] = useState<string>("");
  // History lectures
  const [lectures, setLectures] = useState<any[]>([]);
  const [messageData, setMessageData] = useState<Message>({
    text: "",
    files: [],
    fileUrls: [],
    role: "user",
  });
  // Data của 1 lecture lấy từ server
  const [messages, setMessages] = useState<Message[] | null>([]);
  // State loading message
  const [isLoading, setIsLoading] = useState(false);
  // State show full screen
  const [showFullScreenStream, setShowFullScreenStream] = useState(false);
  const [streamedImage, setStreamedImage] = useState<string>("");
  const [streamedText, setStreamedText] = useState<string>("");
  // Setting modal
  const storedSettings = JSON.parse(
    localStorage.getItem("instantLectureSettings") || "{}"
  );
  const [settings, setSettings] = useState({
    teachingStyle: storedSettings.teachingStyle || "professional",
    languageCode: storedSettings.languageCode || "vi-VN",
    voiceType: storedSettings.voiceType || "FEMALE",
  });

  useEffect(() => {
    setHeaderClass("shadow-none dark:border-none bg-white");

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  // Lấy danh sách các bài giảng đã lưu
  // useEffect(() => {
  //   async function fetchLectures() {
  //     try {
  //       const response = await instantLectureService.getAllInstantLectures();
  //       setLectures(response);
  //     } catch (error) {
  //       console.error("Error fetching lectures:", error);
  //     }
  //   }

  //   fetchLectures();
  // }, []);
  const fetchLectures = useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      const response = await instantLectureService.getAllInstantLectures();
      setLectures(response);
      return response;
    },
  });

  // Lấy history của bài giảng
  useEffect(() => {
    async function fetchLectureById() {
      try {
        if (id) {
          const response = await instantLectureService.getInstantLecture(id);
          setMessages(response.history);
        }
      } catch (error) {
        console.error("Error fetching lecture messages:", error);
      }
    }

    fetchLectureById();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Xem ảnh full screen
  const handleViewFile = (url: string) => {
    setViewedFile(url);
  };

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageData((prevData) => ({
      ...prevData,
      text: event.target.value,
    }));
  };

  const handlePasteImage = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter((item) =>
      item.type.includes("image")
    );

    imageItems.forEach((item) => {
      const file = item.getAsFile();
      if (file) {
        const url = URL.createObjectURL(file);
        setMessageData((prev) => ({
          ...prev,
          files: [...prev.files, file],
          fileUrls: [...prev.fileUrls, url],
        }));
      }
    });
  };

  const handleDropFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.includes("image")
    );
    const urls = fileArray.map((file) => URL.createObjectURL(file));

    setMessageData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...fileArray],
      fileUrls: [...prevData.fileUrls, ...urls],
    }));
  };

  // const handleSendMessage = useMutation({
  //   mutationFn: async () => {
  //     if (messageData.text || messageData.files[0]) {
  //       try {
  //         setMessages((prev) => [...prev!, { ...messageData }]);
  //         setMessageData({
  //           text: "",
  //           files: [],
  //           fileUrls: [],
  //           role: "user", // Reset the role after sending
  //         });
  //         // Loading
  //         setIsLoading(true);
  //         // Show full screen
  //         if (!streamedImage) {
  //           setStreamedImage(messageData.fileUrls[0] || "");
  //         }
  //         setStreamedText("");

  //         const audioQueue: string[] = []; // Initialize audio queue
  //         let isPlaying = false;

  //         const playAudio = async (audioString: string) => {
  //           if (isPlaying) {
  //             audioQueue.push(audioString); // Add to queue if already playing
  //           } else {
  //             isPlaying = true;
  //             const audioData = atob(audioString);
  //             const byteArray = new Uint8Array(audioData.length);
  //             for (let i = 0; i < audioData.length; i++) {
  //               byteArray[i] = audioData.charCodeAt(i);
  //             }
  //             const blob = new Blob([byteArray], { type: "audio/mpeg" });
  //             const audioUrl = URL.createObjectURL(blob);
  //             const audio = new Audio(audioUrl);
  //             audio.play();

  //             audio.onended = () => {
  //               isPlaying = false;
  //               if (audioQueue.length > 0) {
  //                 playAudio(audioQueue.shift()!); // Play audio tiếp theo trong queue
  //               }
  //             };
  //           }
  //         };

  //         let response;
  //         if (!id) {
  //           response = await instantLectureService.createInstantLecture(
  //             messageData.text,
  //             messageData.files[0],
  //             settings.teachingStyle,
  //             settings.languageCode,
  //             settings.voiceType
  //           );
  //         } else {
  //           response = await instantLectureService.sendMessage(
  //             id,
  //             messageData.text,
  //             messageData.files[0],
  //             settings.teachingStyle,
  //             settings.languageCode,
  //             settings.voiceType
  //           );
  //         }
  //         const reader = response?.getReader();
  //         const decoder = new TextDecoder();
  //         let botResponse = "";
  //         let buffer = ""; // Tạm thời lưu các đoạn chưa parse được

  //         if (reader) {
  //           setIsLoading(false);
  //           setShowFullScreenStream(true);
  //           while (true) {
  //             const { done, value } = await reader.read();
  //             if (done) break;

  //             const chunk = decoder.decode(value, { stream: true });
  //             buffer += chunk;

  //             let boundary;
  //             while ((boundary = buffer.indexOf("\n\n\n")) !== -1) {
  //               const jsonStr = buffer.slice(0, boundary).trim();
  //               buffer = buffer.slice(boundary + 3); // remove parsed part

  //               try {
  //                 const parsed = JSON.parse(jsonStr);
  //                 if (parsed.text) {
  //                   botResponse += parsed.text;
  //                   setStreamedText((prev) => prev + parsed.text);
  //                   setMessages((prev) => {
  //                     if (!prev || prev.length === 0) return [];

  //                     const lastMsg = prev[prev.length - 1];
  //                     if (lastMsg.role === "model") {
  //                       // Nếu đã có message model ở cuối thì cập nhật nội dung
  //                       return [
  //                         ...prev.slice(0, -1),
  //                         { ...lastMsg, text: botResponse },
  //                       ];
  //                     } else {
  //                       // Nếu message cuối cùng là của user, thêm mới message model
  //                       return [
  //                         ...prev,
  //                         {
  //                           text: parsed.text,
  //                           files: [],
  //                           fileUrls: [],
  //                           role: "model",
  //                         },
  //                       ];
  //                     }
  //                   });
  //                 }
  //                 if (parsed.audio) {
  //                   await playAudio(parsed.audio);
  //                 }
  //               } catch (err) {
  //                 console.error("JSON parse error:", err, jsonStr);
  //               }
  //             }
  //           }
  //         }

  //         console.log("Response:", response);
  //       } catch (error) {
  //         console.error("Error sending message:", error);
  //       }
  //     } else {
  //       showToast("warning", "Please enter a message or upload an image.");
  //     }
  //   },
  // });

  // Sử dụng WebAudio API với AudioBufferSourceNode liên tiếp
  const handleSendMessage = useMutation({
    mutationFn: async () => {
      console.log(id);
      if (messageData.text || messageData.files[0]) {
        try {
          setMessages((prev) => [...prev!, { ...messageData }]);
          setMessageData({
            text: "",
            files: [],
            fileUrls: [],
            role: "user",
          });
          setIsLoading(true);

          if (!streamedImage) {
            setStreamedImage(messageData.fileUrls[0] || "");
          }
          setStreamedText("");

          // Sử dụng Web Audio API
          const audioContext = new window.AudioContext();
          let audioQueue: any[] = [];
          let isDecoding = false;
          let startTime = 0;

          // Xử lý các audio một cách mượt mà
          const scheduleBuffers = async () => {
            if (isDecoding || audioQueue.length === 0) return;

            isDecoding = true;

            try {
              // Lấy buffer kế tiếp từ hàng đợi
              const audioBase64 = audioQueue.shift();
              const audioData = atob(audioBase64);
              const byteArray = new Uint8Array(audioData.length);
              for (let i = 0; i < audioData.length; i++) {
                byteArray[i] = audioData.charCodeAt(i);
              }

              // Giải mã dữ liệu âm thanh
              const audioBuffer = await audioContext.decodeAudioData(
                byteArray.buffer
              );

              // Tạo source và kết nối
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContext.destination);

              // Nếu là buffer đầu tiên, bắt đầu ngay lập tức
              // Nếu không, lên lịch phát sau buffer trước đó
              if (startTime === 0) {
                startTime = audioContext.currentTime;
              }

              source.start(startTime);

              // Cập nhật thời gian bắt đầu cho buffer tiếp theo
              startTime += audioBuffer.duration;

              // Khi buffer này gần kết thúc, lên lịch giải mã buffer tiếp theo
              setTimeout(() => {
                isDecoding = false;
                scheduleBuffers();
              }, audioBuffer.duration * 1000 - 3000); // Trừ 2000ms để có overlap nhỏ
            } catch (err) {
              console.error("Error processing audio:", err);
              isDecoding = false;
              scheduleBuffers(); // Tiếp tục với buffer tiếp theo nếu có lỗi
            }
          };

          let response;
          if (!id) {
            response = await instantLectureService.createInstantLecture(
              messageData.text,
              messageData.files[0],
              settings.teachingStyle,
              settings.languageCode,
              settings.voiceType
            );

            const updatedLectures = await fetchLectures.refetch();
            console.log(updatedLectures)
            if (updatedLectures.data && Array.isArray(updatedLectures.data)) {
              navigate(`/lecture/instant-presenter/${updatedLectures.data[0]._id}`, {
                replace: true,
              }); // { replace: true } sẽ thay thế URL hiện tại trong lịch sử trình duyệt
            }
          } else {
            response = await instantLectureService.sendMessage(
              id,
              messageData.text,
              messageData.files[0],
              settings.teachingStyle,
              settings.languageCode,
              settings.voiceType
            );
          }

          const reader = response?.getReader();
          const decoder = new TextDecoder();
          let botResponse = "";
          let buffer = "";

          if (reader) {
            setIsLoading(false);
            setShowFullScreenStream(true);

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;

              let boundary;
              while ((boundary = buffer.indexOf("\n\n\n")) !== -1) {
                const jsonStr = buffer.slice(0, boundary).trim();
                buffer = buffer.slice(boundary + 3);

                try {
                  const parsed = JSON.parse(jsonStr);
                  if (parsed.text) {
                    botResponse += parsed.text;
                    setStreamedText((prev) => prev + parsed.text);
                    setMessages((prev) => {
                      if (!prev || prev.length === 0) return [];

                      const lastMsg = prev[prev.length - 1];
                      if (lastMsg.role === "model") {
                        return [
                          ...prev.slice(0, -1),
                          { ...lastMsg, text: botResponse },
                        ];
                      } else {
                        return [
                          ...prev,
                          {
                            text: parsed.text,
                            files: [],
                            fileUrls: [],
                            role: "model",
                          },
                        ];
                      }
                    });
                  }
                  if (parsed.audio) {
                    // Thêm audio vào queue
                    audioQueue.push(parsed.audio);

                    // Nếu chưa đang giải mã, bắt đầu xếp lịch các audio buffer
                    if (!isDecoding) {
                      scheduleBuffers();
                    }
                  }
                } catch (err) {
                  console.error("JSON parse error:", err, jsonStr);
                }
              }
            }
          }
          fetchLectures.refetch();
          console.log("Response:", response);
        } catch (error) {
          console.error("Error sending message:", error);
          showToast("error", "Failed to send message.");
          setIsLoading(false);
        }
      } else {
        showToast("warning", "Please enter a message or upload an image.");
      }
    },
  });

  return (
    <div className="relative flex w-full h-full-screen overflow-hidden">
      {/** Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        lectures={lectures}
        setLectures={setLectures}
        setMessages={setMessages}
        setSettings={setSettings}
      />

      {/** Show full screen lecture */}
      {showFullScreenStream && (
        <Transition
          show={showFullScreenStream}
          appear
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full h-full flex flex-col md:flex-row p-2 pt-6 md:p-0 gap-4 md:gap-0">
              {/* Left: Image */}
              <div
                className={`${
                  streamedImage && "md:w-1/2"
                } flex items-center justify-center`}
              >
                {streamedImage && (
                  <img
                    src={streamedImage}
                    alt="stream"
                    className="w-[90%] rounded-lg"
                  />
                )}
              </div>

              {/* Right: Streaming panel */}
              <div
                className={`${
                  streamedImage ? "md:w-1/2" : "md:w-full md:px-20 xl:px-40"
                } flex justify-center items-center`}
              >
                <div className="relative w-[90%] h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-y-auto h-full rounded-2xl custom-scrollbar p-6 md:p-8">
                    <ReactMarkdown
                      components={{
                        code(props) {
                          const { children, className, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              PreTag="div"
                              language={match[1]}
                              style={materialOceanic}
                              customStyle={{
                                fontSize: "12px",
                                overflowX: "auto",
                              }}
                              showLineNumbers
                              wrapLines={true}
                              wrapLongLines={true}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...rest} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {streamedText}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 md:top-4 md:right-4">
                <IoClose
                  className="text-3xl text-gray-200/60 hover:text-gray-200 dark:text-gray-300 dark:hover:text-white cursor-pointer"
                  onClick={() => setShowFullScreenStream(false)}
                />
              </div>
            </div>
          </div>
        </Transition>
      )}

      {/** Chat section */}
      <div className="flex flex-col w-full h-full-screen">
        <div className="relative flex-1 w-full min-h-[70vh] pt-6 px-6 md:px-20 lg:px-40 2xl:px-60 overflow-y-scroll">
          <div
            className={`${
              isSidebarOpen && "hidden"
            } fixed top-20 left-5 md:left-10 p-1 rounded-md bg-white/80 hover:bg-purple-300/80 cursor-pointer`}
            onClick={handleOpenSidebar}
          >
            <BiSidebar className="text-2xl text-purple-800/80" />
          </div>

          {messages?.length === 0 && (
            <UploadDropzone
              uploadedFiles={messageData.files}
              handleFileChange={handleFileChange}
              handleDropFiles={handleDropFiles}
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

          {messages?.map((msg, index) => (
            <div
              className={`flex flex-col justify-end ${
                msg.role === "user"
                  ? "pl-12 lg:pl-20 xl:pl-40"
                  : "pr-12 lg:pr-20 xl:pr-40"
              } py-2`}
              key={index}
            >
              {(msg.imageUrl || msg.fileUrls?.length > 0) && (
                <div className="flex gap-2 flex-wrap mb-2 ml-auto">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="uploaded"
                      className="w-36 rounded-lg shadow-lg cursor-pointer"
                      onClick={() => handleViewFile(msg.imageUrl!)}
                    />
                  )}
                  {msg.fileUrls?.map((fileUrl, i) => (
                    <img
                      key={i}
                      src={fileUrl}
                      alt={`uploaded-${i}`}
                      className="w-36 rounded-lg shadow-lg cursor-pointer"
                      onClick={() => handleViewFile(fileUrl)}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                {msg.role == "user" ? (
                  <div
                    className={`bg-gray-200/60 px-4 py-3 rounded-xl text-sm md:text-base ${
                      !msg.text && "hidden"
                    }`}
                  >
                    {msg?.text}
                  </div>
                ) : (
                  <div
                    className={`mr-auto max-w-[70vw] sm:max-w-[80vw] ${
                      isSidebarOpen ? "md:max-w-[40vw]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 py-4">
                      <Avatar img={lectrifaiAvatar} rounded size="sm" />
                      <p className="text-xl font-degular font-semibold text-gray-800">
                        Lectrifai
                      </p>
                      <FiMaximize
                        title="Mở toàn màn hình"
                        className="ml-1 text-lg text-purple-500 hover:text-purple-800 cursor-pointer transition-transform hover:scale-110"
                        onClick={() => {
                          setStreamedImage(messages[index - 1].imageUrl ?? "");
                          setStreamedText(msg.text);
                          setShowFullScreenStream(true);
                        }}
                      />
                    </div>
                    <div className="bg-purple-200 px-4 py-3 rounded-xl mb-2 text-sm md:text-base">
                      <ReactMarkdown
                        components={{
                          code(props) {
                            const { children, className, node, ...rest } =
                              props;
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return match ? (
                              <SyntaxHighlighter
                                PreTag="div"
                                language={match[1]}
                                style={materialOceanic}
                                customStyle={{
                                  fontSize: "12px",
                                  overflowX: "auto",
                                }}
                                showLineNumbers
                                wrapLines={true}
                                wrapLongLines={true}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code {...rest} className={className}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg?.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col justify-end pr-12 lg:pr-20 xl:pr-40">
              <div className="flex items-center gap-2 py-4">
                <Avatar img={lectrifaiAvatar} rounded size="sm" />
                <p className="text-xl font-degular font-semibold text-gray-800">
                  Lectrifai
                </p>
              </div>
              <div className="ml-3 w-5 h-5 mb-4 border-2 border-purple-500 rounded-full animate-ping"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
                className="w-full h-10 md:h-auto max-h-60 text-sm md:text-base resize-none border-none bg-transparent ring-transparent focus:ring-transparent dark:text-white dark:placeholder-gray-400 dark:bg-transparent dark:focus:ring-transparent custom-scrollbar"
                placeholder="Your message here..."
                value={messageData.text}
                onChange={(e) => handleChangeMessage(e)}
                onPaste={handlePasteImage}
              ></textarea>
              <label htmlFor="dropzone-file">
                <BsImages className="absolute bottom-4 left-6 text-xl text-purple-400 hover:text-purple-700 cursor-pointer active:scale-90" />
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  // multiple // Hỗ trợ chọn nhiều file
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              <IoSend
                className={`absolute bottom-4 right-4 text-xl text-purple-400 hover:text-purple-700 cursor-pointer active:scale-90 ${
                  isLoading && "pointer-events-none cursor-none"
                }`}
                onClick={() => handleSendMessage.mutate()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstantLecturePresenter;
