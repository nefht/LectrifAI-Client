import update from "immutability-helper";
import type { FC } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Card } from "./Card";
import { SlideData } from "./constants/slide-data";

interface DragAndDropContainerProps {
  cardList: SlideData;
  setCardList: React.Dispatch<React.SetStateAction<SlideData>>;
}

export const DragAndDropContainer: FC<DragAndDropContainerProps> = ({
  cardList,
  setCardList,
}) => {
  const [cards, setCards] = useState(cardList.slides);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCards(cardList.slides);
  }, [cardList]);

  // Handle textarea auto-expand
  useEffect(() => {
    const textarea = titleRef.current;
    if (textarea) {
      // Adjust height based on content
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [cardList.title]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
    // setCardList((prevState) => {
    //   return {
    //     ...prevState,
    //     slides: cards,
    //   };
    // });
  }, []);

  const addCard = useCallback(
    (index: number) => {
      const newCard = {
        heading: "New Card",
        bulletPoints: [],
        imageUrls: [],
      };
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [[index + 1, 0, newCard]],
        })
      );
      // setCardList((prevState) => {
      //   return {
      //     ...prevState,
      //     slides: cards,
      //   };
      // });
    },
    [cards]
  );

  const deleteCard = useCallback(
    (index: number) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [[index, 1]],
        })
      );
      // setCardList((prevState) => {
      //   return {
      //     ...prevState,
      //     slides: cards,
      //   };
      // });
    },
    [cards]
  );

  const renderCard = useCallback(
    (
      card: {
        heading: string;
        bulletPoints: (string | string[])[];
        imageSuggestions?: string[];
        imageUrls?: { title: string; imageUrl: string }[];
      },
      index: number
    ) => {
      return (
        <div
          ref={(el) => (cardRefs.current[index] = el)}
          key={index}
          className="scroll-mt-[80px]"
        >
          <Card
            key={index}
            index={index}
            heading={card.heading}
            bulletPoints={card.bulletPoints}
            imageUrls={card.imageUrls || []}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            setCardList={setCardList}
          />
        </div>
      );
    },
    []
  );

  const handleScrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    // setCardList((prevState) => {
    //   return {
    //     ...prevState,
    //     title: newTitle,
    //   };
    // });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex 2xl:w-full gap-10">
        <div className="hidden 2xl:block 2xl:w-[20%] 2xl:max-h-[70vh] sticky top-24 left-5 mt-2 ml-4 self-start rounded-lg bg-white shadow-lg overflow-scroll overflow-x-hidden custom-scrollbar">
          <div className="flex items-center justify-center w-full p-3 sticky top-0 bg-white font-semibold text-xl">
            Presentation outline
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-gray-200"></div>
          </div>
          <div className="p-4">
            <div className="font-semibold">{cardList.title}</div>
            <ul>
              {cards?.map((card, i) => (
                <li
                  key={i}
                  className="my-2 hover:text-purple-700 hover:font-semibold hover:cursor-pointer"
                  onClick={() => handleScrollToCard(i)}
                >
                  {i + 1}. {card.heading}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-[70vw] 2xl:w-[60%]">
          <div className="w-full flex items-stretch justify-center bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg">
            <div className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 font-bold text-gray-700">
              Title
            </div>
            <textarea
              ref={titleRef}
              rows={1}
              value={cardList.title}
              className="w-full border-none resize-none px-6 py-4 font-semibold text-lg focus:outline-none focus:ring-0"
              onChange={handleTitleChange}
            />
          </div>
          {cards?.map((card, i) => renderCard(card, i))}
        </div>
      </div>
    </DndProvider>
  );
};
