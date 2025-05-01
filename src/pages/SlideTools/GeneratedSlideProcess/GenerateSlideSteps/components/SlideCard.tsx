import { Fragment, useEffect, useState } from "react";
import { FaCirclePlus, FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { TbPointFilled, TbPoint } from "react-icons/tb";
import "animate.css";
import { IoClose } from "react-icons/io5";
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { TiDelete } from "react-icons/ti";
import DeleteModal from "../../../../../components/NotificationModal/DeleteModal";

type SlideCardProps = {
  cardIndex: number;
  lastIndex: number;
  heading: string;
  bulletPoints: (string | string[])[];
  imageUrls?: {
    title: string;
    imageUrl: string;
  }[];
  addCard: (cardIndex: number) => void;
  deleteCard: (index: number) => void;
  updateHeading: (index: number, newHeading: string) => void;
  addBulletPoint: (cardIndex: number, bulletIndex: number) => void;
  updateBulletPoint: (
    cardIndex: number,
    bulletIndex: number,
    newBulletPoint: string
  ) => void;
  deleteBulletPoint: (cardIndex: number, bulletIndex: number) => void;
  addSubBulletPoint: (
    cardIndex: number,
    bulletIndex: number,
    subIndex?: number
  ) => void;
  updateSubBulletPoint: (
    cardIndex: number,
    bulletIndex: number,
    subIndex: number,
    newSubBulletPoint: string
  ) => void;
  deleteSubBulletPoint: (
    cardIndex: number,
    bulletIndex: number,
    subIndex: number
  ) => void;
  deleteImage: (cardIndex: number, imageIndex: number) => void;
};

const SlideCard = ({
  cardIndex,
  lastIndex,
  heading,
  bulletPoints,
  imageUrls,
  addCard,
  deleteCard,
  updateHeading,
  addBulletPoint,
  updateBulletPoint,
  deleteBulletPoint,
  addSubBulletPoint,
  updateSubBulletPoint,
  deleteSubBulletPoint,
  deleteImage,
}: SlideCardProps) => {
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);
  const [viewedFile, setViewedFile] = useState<string>("");

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, []);

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleViewFile = (url: string) => {
    setViewedFile(url);
  };

  const handleImageError = (imgIndex: number) => {
    const newImageUrls = [...(imageUrls || [])];
    newImageUrls.splice(imgIndex, 1);
    deleteImage(cardIndex, imgIndex);
  };

  return (
    <>
      {deleteCardModalOpen && (
        <DeleteModal
          open={deleteCardModalOpen}
          setOpen={setDeleteCardModalOpen}
          modalInformation={{
            title: "Delete slide",
            content:
              "Are you sure you want to delete this slide card? All of your data will be permanently removed. This action cannot be undone.",
          }}
          handleDelete={() => {
            deleteCard(cardIndex);
            setDeleteCardModalOpen(false);
          }}
        />
      )}

      {viewedFile && (
        <Transition show={viewedFile.length > 0} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setViewedFile("")}
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
                <Dialog.Panel className="pointer-events-auto relative bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] lg:max-h-full overflow-auto hide-scrollbar">
                  <img src={viewedFile} alt="Viewed file" className="w-full" />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}

      <div className="w-full flex flex-col items-center">
        <div className="relative flex items-stretch w-full h-auto bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg">
          {cardIndex !== lastIndex && (
            <FaRegTrashCan
              className={`absolute top-7 right-5 hover:text-purple-700 hover:cursor-pointer transform hover:scale-125 transition-transform duration-200 ease-in-out hover:shadow-lg`}
              onClick={() => setDeleteCardModalOpen(true)}
            />
          )}
          <div className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 hover:cursor-pointer font-bold text-gray-700">
            {cardIndex + 1}
          </div>
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="w-full p-4 pr-6 overflow-auto">
              <div className="">
                <textarea
                  name=""
                  className="w-full font-semibold text-lg pr-6 border-none resize-none focus:ring-0"
                  rows={1}
                  value={heading}
                  onInput={autoResize}
                  onChange={(e) => updateHeading(cardIndex, e.target.value)}
                ></textarea>
                {bulletPoints.length > 0 ? (
                  <div className="border border-gray-200 rounded-md ml-2 py-2 pl-4 pr-2 shadow-sm">
                    {bulletPoints.map((data, bulletIndex) =>
                      Array.isArray(data) ? (
                        <div key={bulletIndex} className="ml-8">
                          {data.map((subPoint, subIndex) => (
                            <div
                              className="flex justify-center group"
                              key={subIndex}
                            >
                              <div className="pt-3">
                                <TbPoint />
                              </div>
                              <textarea
                                value={subPoint}
                                rows={1}
                                onInput={autoResize}
                                className="w-full text-sm resize-none overflow-hidden p-1.5 rounded border-none focus:ring-0"
                                onChange={(e) =>
                                  updateSubBulletPoint(
                                    cardIndex,
                                    bulletIndex,
                                    subIndex,
                                    e.target.value
                                  )
                                }
                              />
                              <div className="flex items-center justify-center">
                                <div className="pt-2">
                                  <div
                                    className="hover:bg-purple-200 rounded-md p-1 cursor-pointer"
                                    onClick={() =>
                                      addSubBulletPoint(
                                        cardIndex,
                                        bulletIndex,
                                        subIndex
                                      )
                                    }
                                  >
                                    <FaPlus className="hidden group-hover:block text-sm text-purple-600/90 hover:text-purple-700 hover:scale-110" />
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <div
                                    className="hover:bg-purple-200 rounded-md p-0.5 cursor-pointer"
                                    onClick={() =>
                                      deleteSubBulletPoint(
                                        cardIndex,
                                        bulletIndex,
                                        subIndex
                                      )
                                    }
                                  >
                                    <IoClose className="hidden group-hover:block text-xl font-bold text-purple-600/90 hover:text-purple-700 hover:scale-110" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="flex justify-center group"
                          key={bulletIndex}
                        >
                          <div className="pt-3">
                            <TbPointFilled />
                          </div>
                          <textarea
                            value={data}
                            rows={1}
                            onInput={autoResize}
                            className="w-full text-sm resize-none overflow-hidden p-1.5 rounded border-none focus:ring-0"
                            onChange={(e) =>
                              updateBulletPoint(
                                cardIndex,
                                bulletIndex,
                                e.target.value
                              )
                            }
                          />
                          <div className="flex items-center justify-center">
                            <Menu>
                              <MenuButton>
                                {({ active }) => (
                                  <div className="hover:bg-purple-200 rounded-md p-1 cursor-pointer">
                                    <FaPlus className="hidden group-hover:block text-sm text-purple-600/90 hover:text-purple-700 hover:scale-110" />
                                  </div>
                                )}
                              </MenuButton>
                              <MenuItems
                                anchor="bottom start"
                                className="flex flex-col bg-white p-2 rounded-lg border border-gray-200 shadow-md z-50"
                              >
                                <MenuItem>
                                  <div
                                    className="flex items-center gap-2 data-[focus]:bg-purple-100 p-2 rounded-md text-sm cursor-pointer"
                                    onClick={() =>
                                      addBulletPoint(cardIndex, bulletIndex)
                                    }
                                  >
                                    <TbPointFilled className="text-gray-900" />
                                    <p className="text-gray-900">
                                      Add Bullet point
                                    </p>
                                  </div>
                                </MenuItem>
                                <MenuItem>
                                  <div
                                    className="flex items-center gap-2 data-[focus]:bg-purple-100 p-2 rounded-md text-sm cursor-pointer"
                                    onClick={() =>
                                      addSubBulletPoint(cardIndex, bulletIndex)
                                    }
                                  >
                                    <TbPoint className="text-gray-900" />
                                    <p className="text-gray-900">
                                      Add Sub Bullet point
                                    </p>
                                  </div>
                                </MenuItem>
                              </MenuItems>
                            </Menu>
                            <div className="">
                              <div
                                className="hover:bg-purple-200 rounded-md p-0.5 cursor-pointer"
                                onClick={() =>
                                  deleteBulletPoint(cardIndex, bulletIndex)
                                }
                              >
                                <IoClose className="hidden group-hover:block text-xl font-bold text-purple-600/90 hover:text-purple-700 hover:scale-110" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <>
                    {cardIndex !== lastIndex && (
                      <div
                        className="group flex flex-col items-center justify-center ml-2 mb-4 h-40 p-4 xl:p-0 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-gray-700 hover:bg-purple-100 dark:border-purple-600 dark:hover:border-purple-500 dark:hover:bg-purple-600"
                        onClick={() => addBulletPoint(cardIndex, 0)}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaCirclePlus className="w-8 h-8 mb-2 text-purple-500 dark:text-purple-400 group-active:scale-110 transition" />
                          <p className="text-center mb-2 font-semibold text-purple-500 dark:text-purple-400">
                            Add bullet points to this slide
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {imageUrls && imageUrls.length > 0 && (
              <div className="flex items-center gap-4 px-6 pb-4 w-full h-1/2 overflow-auto">
                {imageUrls.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      key={index}
                      src={image?.imageUrl}
                      alt="Slide image"
                      className="max-w-20 md:max-w-32 h-auto my-2 cursor-pointer"
                      onClick={() => handleViewFile(image?.imageUrl)}
                      onError={() => handleImageError(index)}
                    />
                    <TiDelete
                      className="absolute top-2 right-0 text-red-500 rounded-full w-7 h-7 hover:cursor-pointer hover:bg-red-700"
                      onClick={() => deleteImage(cardIndex, index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="relative flex items-center w-2/3 group hover:cursor-pointer transition-transform duration-300 active:scale-90"
          onClick={() => addCard(cardIndex)}
        >
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FaCirclePlus className="mx-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </>
  );
};

export default SlideCard;
