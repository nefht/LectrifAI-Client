import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { BiPencil, BiSidebar } from "react-icons/bi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline, MdMoreHoriz } from "react-icons/md";

interface ChatSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function ChatSidebar({ isOpen, setIsOpen }: ChatSidebarProps) {
  const [mockChat, setMockChat] = useState([
    { id: "0", title: "Hello, how are you? I'm fine thank you" },
    { id: "1", title: "Hello, how are you?" },
    { id: "2", title: "I'm fine, thank you." },
    { id: "3", title: "What are you doing?" },
    { id: "4", title: "I'm working on my project." },
    { id: "5", title: "Can I help you?" },
    { id: "6", title: "Yes, please." },
  ]);
  const [selectedChat, setSelectedChat] = useState<string | null>("0");
  // Chọn chat để rename hoặc delete
  const [selectedChatTitle, setSelectedChatTitle] = useState({} as any);

  // Fix sau
  const handleCreateChat = () => {
    const newChat = { id: mockChat.length.toString(), title: "New chat title" };
    setMockChat([newChat, ...mockChat]);
    setSelectedChat(newChat.id);
  };

  const handleRenameChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChatTitle = e.target.value;
    setSelectedChatTitle((prev: any) => ({ ...prev, title: newChatTitle }));
  };

  const handleSaveRenameChat = () => {
    if (selectedChat && selectedChatTitle.title) {
      setMockChat(
        mockChat.map((chat) =>
          chat.id === selectedChat
            ? { ...chat, title: selectedChatTitle.title }
            : chat
        )
      );
      setSelectedChatTitle({} as any);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setMockChat(mockChat.filter((chat) => chat.id !== chatId));
    if (selectedChat === chatId) {
      setSelectedChat(null);
      setSelectedChatTitle({} as any);
    }
  };

  return (
    // Comment isOpen để tạo hiệu ứng slide
    <>
      {isOpen && (
        <>
          <div
            className={`fixed top-0 left-0 z-40 h-full p-4 pt-20 bg-gray-100 bg-gradient-to-b from-header to-background border-r border-r-gray-200 dark:bg-gray-800 shadow-md flex flex-col overflow-y-scroll custom-scrollbar transition-all duration-300 ease-in-out transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } w-3/4 md:w-56 lg:w-64 xl:w-72`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <BiSidebar className="text-xl lg:text-2xl text-purple-800/80" />
              </div>
              <div className="flex gap-2">
                <div className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer">
                  <IoSearch className="text-xl lg:text-2xl text-purple-900/80" />
                </div>
                <div
                  className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer"
                  onClick={handleCreateChat}
                >
                  <HiMiniPencilSquare className="text-xl lg:text-2xl text-purple-900/80" />
                </div>
              </div>
            </div>
            <p className="text-center font-degular font-bold text-lg md:text-xl gradient-text">
              Instant Lecture Presenter
            </p>
            <p className="text-xs md:text-sm/snug text-center text-gray-800 pb-4 mb-4 border-b border-gray-200">
              Upload your images and listen to the lecture.
            </p>

            {/** Chat titles */}
            <div className="flex flex-col gap-y-1">
              {mockChat.map((chat, index) => (
                <div
                  className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer group ${
                    chat.id === selectedChat
                      ? "bg-gray-400/50 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                  key={index}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  {chat.id !== selectedChatTitle.id ? (
                    <p className="text-gray-900 truncate">{chat.title}</p>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-transparent border-none p-0 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      value={selectedChatTitle.title}
                      onChange={(e) => handleRenameChat(e)}
                      onBlur={handleSaveRenameChat}
                      autoFocus
                    />
                  )}
                  {/* <MdMoreHoriz className="text-xl hidden group-hover:block text-gray-600 hover:text-gray-800" /> */}
                  <Menu>
                    <MenuButton>
                      {({ active }) => (
                        <MdMoreHoriz
                          className={`text-xl group-hover:block text-gray-600 hover:text-gray-800 ${
                            active ? "block" : "hidden"
                          }`}
                        />
                      )}
                    </MenuButton>
                    <MenuItems
                      anchor="bottom start"
                      className="flex flex-col bg-white p-2 rounded-lg border border-gray-200 shadow-md z-50"
                    >
                      <MenuItem>
                        <div
                          className="flex items-center gap-2 data-[focus]:bg-gray-100 p-2 rounded-md text-sm cursor-pointer"
                          onClick={() => setSelectedChatTitle(chat)}
                        >
                          <BiPencil className="text-gray-900" />
                          <p className="text-gray-900">Rename</p>
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          className="flex items-center gap-2 data-[focus]:bg-gray-100 p-2 rounded-md text-sm cursor-pointer"
                          onClick={() => handleDeleteChat(chat.id)}
                        >
                          <MdDeleteOutline className="text-red-600" />
                          <p className="text-red-600">Delete</p>
                        </div>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              ))}
            </div>
          </div>
          <div className="md:mr-56 lg:mr-64 xl:mr-72"></div>
        </>
      )}
    </>
  );
}

export default ChatSidebar;
