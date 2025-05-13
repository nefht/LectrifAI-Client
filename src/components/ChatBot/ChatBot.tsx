import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Avatar, Tooltip } from "flowbite-react";
import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { FaComments, FaTimes } from "react-icons/fa";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import chatBotImg from "../../assets/images/chat-bot/bot-avatar.png";
import chatBotService from "../../pages/LectureTools/services/chatBotService";
import DeleteModal from "../NotificationModal/DeleteModal";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";
import { MdOutlineDelete } from "react-icons/md";

interface ChatBotProps {
  lectureScriptId: string;
}
const ChatBot = ({ lectureScriptId }: ChatBotProps) => {
  const { id: lectureId } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<
    { text: string; role: "user" | "model" }[]
  >([
    {
      text: "Hello, I am LectrifAI Chat Bot 🤖. How can I help you with your lecture?",
      role: "model",
    },
  ]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Màn hình nhỏ hơn md (768px)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (lectureId) {
        const response = await chatBotService.getChatMessages(lectureId);
        const chatHistory = response.chatHistory;

        if (chatHistory && chatHistory.length > 0) {
          setMessages(chatHistory);
        } else {
          setMessages([
            {
              text: "Hello, I am LectrifAI Chat Bot 🤖. How can I help you with your lecture?",
              role: "model",
            },
          ]);
        }
      }
    };

    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, lectureId]);

  // Theo dõi kích thước màn hình để cập nhật trạng thái `isMobile`
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Kích thước & vị trí ban đầu của ChatBot trên Desktop
  const [chatSize, setChatSize] = useState({ width: 380, height: 500 });
  const [chatPosition, setChatPosition] = useState({
    x: window.innerWidth - 500,
    y: window.innerHeight - 600,
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = async (text: string) => {
    try {
      setMessages([...messages, { text, role: "user" }]);

      const botMessage: { text: string; role: "user" | "model" } = {
        text: "Bot is typing...",
        role: "model",
      };

      setMessages((prev) => [...prev, botMessage]);

      if (lectureId) {
        const response = await chatBotService.createChatMessage({
          lectureId,
          lectureScriptId,
          message: text,
        });
        const reader = response?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let botResponse = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkText = decoder.decode(value, { stream: true });
            botResponse += chunkText;

            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 ? { ...msg, text: botResponse } : msg
              )
            );
          }
        }
      } else {
        console.error("Lecture ID is undefined");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleDeleteChat = useMutation({
    mutationFn: async () => {
      if (lectureId) {
        await chatBotService.deleteChatMessage(lectureId);
        setMessages([
          {
            text: "Hello, I am LectrifAI Chat Bot 🤖. How can I help you with your lecture?",
            role: "model",
          },
        ]);
      }
      showToast("success", "Delete chat messages successfully");
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to delete chat messages:", error);
      showToast("error", "Failed to delete chat messages");
    },
  });

  return (
    <>
      {/* Modal xác nhận xóa tin nhắn */}
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        modalInformation={{
          title: "Delete chat messages",
          content: "Are you sure you want to delete all chat messages?",
        }}
        disabledButton={handleDeleteChat.isPending}
        handleDelete={() => handleDeleteChat.mutate()}
      />

      {/* Float Button mở chat */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 right-6 w-10 h-10 md:w-14 md:h-14 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-800 transition z-50"
        >
          <FaComments className="text-lg md:text-2xl" />
        </motion.button>
      )}

      {/* Hiển thị ChatBot */}
      {isOpen && (
        <>
          {isMobile ? (
            // Mobile: Hiển thị full màn hình
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: isOpen ? "0%" : "100%", opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-white shadow-lg z-[9999] flex flex-col"
            >
              {/* Header ChatBot */}
              <div className="bg-purple-700 text-white p-3 flex justify-between items-center">
                <span className="font-semibold text-lg">ChatBot</span>
                <div className="flex gap-3">
                  {messages.length > 1 && (
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-white hover:text-gray-200"
                    >
                      <MdOutlineDelete size={18} className="active:scale-105"/>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              </div>

              {/* Nội dung chat */}
              <div className="p-3 flex-1 overflow-y-auto flex flex-col space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="flex space-x-2">
                    {msg.role === "model" && (
                      <div>
                        <Avatar rounded img={chatBotImg} />
                      </div>
                    )}
                    <MessageBubble
                      key={index}
                      text={msg.text}
                      role={msg.role}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-0" />
              </div>

              {/* Ô nhập tin nhắn */}
              <div className="sticky bottom-0 left-0 right-0 bg-white">
                <ChatInput onSend={sendMessage} />
              </div>
            </motion.div>
          ) : (
            // Desktop: Dùng Rnd để kéo & resize
            <Rnd
              size={{ width: chatSize.width, height: chatSize.height }}
              position={{ x: chatPosition.x, y: chatPosition.y }}
              onDragStop={(e, d) => setChatPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setChatSize({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                });
                setChatPosition(position);
              }}
              minWidth={300}
              minHeight={400}
              maxWidth={window.innerWidth * 0.9}
              maxHeight={window.innerHeight * 0.9}
              dragHandleClassName="chatbot-header"
              className="fixed z-[9998] bg-white shadow-lg rounded-2xl overflow-hidden"
            >
              <div className="relative h-full">
                {/* Header ChatBot */}
                <div className="chatbot-header bg-purple-700 text-white p-3 flex justify-between items-center cursor-move">
                  <span className="font-semibold text-lg">ChatBot</span>
                  <div className="flex gap-3">
                    {messages.length > 1 && (
                     <Tooltip content="Delete chat messages">
                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="text-white hover:text-gray-200"
                        >
                          <MdOutlineDelete size={18} className="active:scale-105"/>
                        </button>
                     </Tooltip>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gray-200"
                    >
                      <FaTimes size={18} />
                    </button>
                  </div>
                </div>

                {/* Nội dung chat */}
                <div className="w-full p-3 h-[calc(100%-60px)] overflow-y-auto flex flex-col space-y-3 pb-20">
                  {messages.map((msg, index) => (
                    <div key={index} className="flex space-x-2">
                      {msg.role === "model" && (
                        <div>
                          <Avatar rounded img={chatBotImg} />
                        </div>
                      )}
                      <MessageBubble
                        key={index}
                        text={msg.text}
                        role={msg.role}
                      />
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-0 scroll-mb-[80px]" />
                </div>

                {/* Ô nhập tin nhắn */}
                <div className="absolute bottom-0 left-0 right-0 bg-white">
                  <ChatInput onSend={sendMessage} />
                </div>
              </div>
            </Rnd>
          )}
        </>
      )}
    </>
  );
};

export default ChatBot;
