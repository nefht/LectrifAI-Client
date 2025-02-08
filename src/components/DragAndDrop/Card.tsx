import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDrag, useDrop } from "react-dnd";
import { FaCirclePlus, FaRegTrashCan } from "react-icons/fa6";
import "animate.css";
import { convertSlideDataToHtml } from "../../utils/ConvertSlideDataToHtml";
import DeleteModal from "../NotificationModal/DeleteModal";

export const ItemTypes = {
  CARD: "card",
};

export interface CardProps {
  index: number;
  heading: string;
  bulletPoints: (string | string[])[];
  images: string[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  addCard: (index: number) => void;
  deleteCard: (index: number) => void;
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
  images,
  moveCard,
  addCard,
  deleteCard,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [deleteCardModalOpen, setDeleteCardModalOpen] = useState(false);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
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
            className={`absolute top-5 right-5 hover:text-purple-700 hover:cursor-pointer transform hover:scale-125 transition-transform duration-200 ease-in-out hover:shadow-lg`}
            onClick={() => setDeleteCardModalOpen(true)}
          />
          <div
            ref={dragRef}
            className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 hover:cursor-pointer font-bold text-gray-700"
          >
            {/* {isDragging ? <FiMove /> : index + 1} */}
            {index + 1}
          </div>
          <div className="w-full p-4 overflow-auto">
            <textarea
              className="border-none w-full text-lg font-semibold resize-none focus:outline-none focus:ring-0"
              rows={1}
              value={heading}
              onChange={(e) => console.log(e.target.value)}
            />
            <ReactQuill
              modules={modules}
              formats={formats}
              value={convertSlideDataToHtml([
                { heading, bulletPoints, images },
              ])}
              onChange={(e) => console.log(e)}
            ></ReactQuill>
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
