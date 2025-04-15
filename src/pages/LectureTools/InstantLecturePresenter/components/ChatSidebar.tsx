import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { BiPencil, BiSidebar } from "react-icons/bi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline, MdMoreHoriz } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import SettingModal from "./SettingModal";
import { Message } from "../InstantLecturePresenter";
import instantLectureService from "../../services/instantLectureService";
import DeleteModal from "../../../../components/NotificationModal/DeleteModal";
import SearchModal from "./SearchModal";

interface ChatSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  lectures: any[];
  setLectures: React.Dispatch<React.SetStateAction<any[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
}

function ChatSidebar({
  isOpen,
  setIsOpen,
  lectures,
  setLectures,
  setMessages,
  setSettings,
}: ChatSidebarProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Lưu lại chatId đã chọn để hiển thị
  const [selectedChat, setSelectedChat] = useState<string | null>("0");
  // Chọn chat để rename hoặc delete
  const [updatedChat, setUpdatedChat] = useState({} as any);
  const [deletedChatId, setDeletedChatId] = useState<string>("");
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setSelectedChat(id);
    }
  }, [id]);

  const handleCreateChat = () => {
    setMessages([]);
    setSelectedChat(null);
    navigate("/lecture/instant-presenter");
  };

  const handleRenameChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChatTitle = e.target.value;
    setUpdatedChat((prev: any) => ({
      ...prev,
      lectureName: newChatTitle,
    }));
  };

  const handleSaveRenameChat = (chatId: string) => {
    try {
      if (selectedChat && updatedChat.lectureName) {
        const response = instantLectureService.updateInstantLecture(
          chatId,
          updatedChat.lectureName
        );

        setLectures(
          lectures.map((chat) =>
            chat._id === selectedChat
              ? { ...chat, lectureName: updatedChat.lectureName }
              : chat
          )
        );
        setUpdatedChat({} as any);
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      if (!deletedChatId) return;
      const response = await instantLectureService.deleteInstantLecture(
        deletedChatId
      );

      setLectures(lectures.filter((chat) => chat._id !== deletedChatId));
      if (selectedChat === deletedChatId) {
        setSelectedChat(null);
      }
      setUpdatedChat({} as any);
      setMessages([]);
      closeDeleteModal();
      navigate("/lecture/instant-presenter");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Setting modal
  const openSettingModal = () => setIsSettingModalOpen(true);
  const closeSettingModal = () => setIsSettingModalOpen(false);

  // Delete modal
  const openDeleteModal = (chatId: string) => {
    setDeletedChatId(chatId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Search modal
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  return (
    // Comment isOpen để tạo hiệu ứng slide
    <>
      {/* Setting Modal */}
      <SettingModal
        isOpen={isSettingModalOpen}
        closeModal={closeSettingModal}
        setSettings={setSettings}
      />
      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        setOpen={closeDeleteModal}
        modalInformation={{
          title: "Delete Lecture",
          content: "Are you sure you want to delete this lecture?",
        }}
        handleDelete={() => handleDeleteChat()}
      />
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        closeModal={closeSearchModal}
        lectures={lectures}
        setLectures={setLectures}
      />
      {isOpen && (
        <>
          <div
            className={`fixed top-0 left-0 z-40 h-full p-4 pt-20 bg-gray-100 bg-gradient-to-b from-header to-background border-r border-r-gray-200 dark:bg-gray-800 shadow-md flex flex-col overflow-y-scroll custom-scrollbar transition-all duration-300 ease-in-out transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } w-3/4 md:w-56 lg:w-64 xl:w-72 hide-scrollbar`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <div
                  className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <BiSidebar className="text-xl lg:text-2xl text-purple-800/80" />
                </div>
                <div
                  className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer"
                  onClick={openSettingModal}
                >
                  <IoMdSettings className="text-xl lg:text-2xl text-purple-800/80" />
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className="p-1 rounded-md hover:bg-purple-200/80 cursor-pointer"
                  onClick={openSearchModal}
                >
                  <IoSearch className="text-xl lg:text-2xl text-purple-900/80" />
                </div>
                <div
                  // to={"/lecture/instant-presenter"}
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
            <p className="text-xs md:text-sm/snug text-center text-gray-800 pb-4 border-b border-gray-200">
              Upload your images and listen to the lecture.
            </p>

            {/** Chat titles */}
            <div className="flex flex-col gap-y-1">
              {lectures.map((chat, index) => (
                <Link
                  to={`/lecture/instant-presenter/${chat._id}`}
                  className={`flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer group ${
                    chat._id === selectedChat
                      ? "bg-black/20 font-semibold"
                      : "hover:bg-black/10"
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedChat(chat._id);
                  }}
                >
                  {chat._id !== updatedChat._id ? (
                    <p className="text-gray-900 truncate">{chat.lectureName}</p>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-transparent border-none p-0 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      value={updatedChat.lectureName}
                      onChange={(e) => handleRenameChat(e)}
                      onBlur={() => handleSaveRenameChat(chat._id)}
                      autoFocus
                    />
                  )}
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
                          onClick={() => setUpdatedChat(chat)}
                        >
                          <BiPencil className="text-gray-900" />
                          <p className="text-gray-900">Rename</p>
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          className="flex items-center gap-2 data-[focus]:bg-gray-100 p-2 rounded-md text-sm cursor-pointer"
                          onClick={() => openDeleteModal(chat._id)}
                        >
                          <MdDeleteOutline className="text-red-600" />
                          <p className="text-red-600">Delete</p>
                        </div>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </Link>
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
