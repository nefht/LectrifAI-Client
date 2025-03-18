import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDrag, useDrop } from "react-dnd";
import { FaCirclePlus, FaRegTrashCan } from "react-icons/fa6";
import "animate.css";
import {
  convertHtmlToBulletPoints,
  convertSlideDataToHtml,
} from "../../utils/ConvertSlideData";
import DeleteModal from "../NotificationModal/DeleteModal";
import "./Card.css";
import { SlideData } from "./constants/slide-data";
import { TiDelete } from "react-icons/ti";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

export const ItemTypes = {
  CARD: "card",
};

export interface CardProps {
  index: number;
  heading: string;
  bulletPoints: (string | string[])[];
  imageUrls: { title: string; imageUrl: string }[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addCard: (index: number) => void;
  deleteCard: (index: number) => void;
  setCardList: React.Dispatch<React.SetStateAction<SlideData>>;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: FC<CardProps> = ({
  index,
  heading,
  bulletPoints,
  imageUrls,
  moveCard,
  addCard,
  deleteCard,
  setCardList,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);

  const [currentHeading, setCurrentHeading] = useState(heading);
  const [currentBulletPoints, setCurrentBulletPoints] =
    useState<(string | string[])[]>(bulletPoints);
  const [currentImages, setCurrentImages] = useState(imageUrls);
  const [viewedFile, setViewedFile] = useState<string>("");

  // Ref for the heading textarea to dynamically adjust its height
  const headingRef = useRef<HTMLTextAreaElement | null>(null);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      // [{ header: [1, 2, false] }],
      // ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      // ["link", "image"],
      // ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
  ];

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.8 : 1;

  drag(dragRef);
  drop(dropRef);

  const handleAddCard = () => {
    setIsClicked(true);
    addCard(index);
    setTimeout(() => {
      setIsClicked(false);
    }, 300); // Duration of the click effect
  };

  const handleDeleteCard = () => {
    deleteCard(index);
    setDeleteCardModalOpen(false);
  };

  useEffect(() => {
    setCurrentHeading(heading);
  }, [heading]);

  // Handle textarea auto-expand
  useEffect(() => {
    const textarea = headingRef.current;
    if (textarea) {
      // Adjust height based on content
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [currentHeading]); // Re-run when heading changes

  const handleHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHeading = e.target.value;
    setCurrentHeading(newHeading);

    // Update the parent cardList
    setCardList((prevState) => {
      const updatedSlides = [...prevState.slides];
      updatedSlides[index].heading = newHeading; // Update the heading for this card
      return {
        ...prevState,
        slides: updatedSlides,
      };
    });
  };

  const handleBulletPointsChange = (newBulletPoints: (string | string[])[]) => {
    setCurrentBulletPoints(newBulletPoints);

    // Update the parent cardList
    setCardList((prevState) => {
      const updatedSlides = [...prevState.slides];
      updatedSlides[index].bulletPoints = newBulletPoints; // Update the bullet points for this card
      return {
        ...prevState,
        slides: updatedSlides,
      };
    });
  };

  // Handle ReactQuill changes - fix sau
  const handleQuillChange = (newContent: string) => {
    const bulletPoints = convertHtmlToBulletPoints(newContent);
    // handleBulletPointsChange(bulletPoints);
  };

  // Xóa ảnh khi không tải được
  const handleImageError = (url: string) => {
    const updatedImages = currentImages.filter(
      (image) => image.imageUrl !== url
    );
    setCurrentImages(updatedImages);

    // Cập nhật lại state của cardList
    setCardList((prevState) => {
      const updatedSlides = [...prevState.slides];
      updatedSlides[index].imageUrls = updatedImages;
      return {
        ...prevState,
        slides: updatedSlides,
      };
    });
  };

  // Thêm ảnh vào danh sách
  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) => ({
        title: file.name,
        imageUrl: URL.createObjectURL(file),
      }));
      setCurrentImages((prevImages) => [...prevImages, ...fileUrls]);

      setCardList((prevState) => {
        const updatedSlides = [...prevState.slides];
        updatedSlides[index].imageUrls = [...currentImages, ...fileUrls];
        return {
          ...prevState,
          slides: updatedSlides,
        };
      });
    }
  };

  // Xóa ảnh khỏi danh sách
  const handleRemoveImage = (url: string) => {
    const updatedImages = currentImages.filter(
      (image) => image.imageUrl !== url
    );
    setCurrentImages(updatedImages);

    setCardList((prevState) => {
      const updatedSlides = [...prevState.slides];
      updatedSlides[index].imageUrls = updatedImages;
      return {
        ...prevState,
        slides: updatedSlides,
      };
    });
  };

  const handleViewFile = (url: string) => {
    setViewedFile(url);
  };

  return (
    <>
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

      {deleteCardModalOpen && (
        <DeleteModal
          open={deleteCardModalOpen}
          setOpen={setDeleteCardModalOpen}
          modalInformation={{
            title: "Delete slide",
            content:
              "Are you sure you want to delete this slide card? All of your data will be permanently removed. This action cannot be undone.",
          }}
          handleDelete={handleDeleteCard}
        />
      )}
      <div className="w-full flex flex-col items-center">
        <div
          ref={dropRef}
          data-handler-id={handlerId}
          className={`relative flex items-stretch w-full h-auto bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg ${
            isDragging ? "border-2 border-purple-500" : ""
          }`}
          style={{ opacity }}
        >
          <FaRegTrashCan
            className={`absolute top-6 right-5 hover:text-purple-700 hover:cursor-pointer transform hover:scale-125 transition-transform duration-200 ease-in-out hover:shadow-lg`}
            onClick={() => setDeleteCardModalOpen(true)}
          />
          <div
            ref={dragRef}
            className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 hover:cursor-pointer font-bold text-gray-700"
          >
            {/* {isDragging ? <FiMove /> : index + 1} */}
            {index + 1}
          </div>
          <div className="w-full p-4 pr-6 overflow-auto">
            <textarea
              ref={headingRef}
              className="border-none w-full text-lg font-semibold resize-none focus:outline-none focus:ring-0"
              rows={1}
              value={heading}
              onChange={handleHeadingChange}
            />
            <ReactQuill
              className=""
              modules={modules}
              formats={formats}
              value={convertSlideDataToHtml([{ bulletPoints, imageUrls }])}
              onChange={handleQuillChange}
            ></ReactQuill>
            <div className="mt-2 flex gap-4">
              {currentImages.map((image, i) => (
                <div key={i} className="relative">
                  <img
                    key={i}
                    src={image?.imageUrl}
                    alt="Slide image"
                    className="max-w-32 h-auto my-2 cursor-pointer"
                    onClick={() => handleViewFile(image?.imageUrl)}
                    onError={() => handleImageError(image?.imageUrl)}
                  />
                  <TiDelete
                    onClick={() => handleRemoveImage(image?.imageUrl)}
                    className="absolute top-2 right-0 text-red-500 rounded-full w-7 h-7 hover:cursor-pointer hover:bg-red-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`relative flex items-center w-2/3 group hover:cursor-pointer transition-transform duration-300 ${
            isClicked ? "scale-95" : ""
          }`}
          onClick={handleAddCard}
        >
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FaCirclePlus className="mx-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex-1 border-b border-[1px] border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </>
  );
};
