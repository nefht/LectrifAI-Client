import update from "immutability-helper";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Card } from "./Card";

interface DragAndDropContainerProps {
  cardList: {
    title: string;
    slides: {
      heading: string;
      bulletPoints: (string | string[])[];
      images: string[];
    }[];
  };
}

export const DragAndDropContainer: FC<DragAndDropContainerProps> = ({
  cardList,
}) => {
  {
    const [cards, setCards] = useState(cardList.slides);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);

    const addCard = useCallback(
      (index: number) => {
        const newCard = { heading: "New Card", bulletPoints: [], images: [] };
        setCards((prevCards) =>
          update(prevCards, {
            $splice: [[index + 1, 0, newCard]],
          })
        );
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
      },
      [cards]
    );

    const renderCard = useCallback(
      (
        card: {
          heading: string;
          bulletPoints: (string | string[])[];
          images: string[];
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
              images={card.images}
              moveCard={moveCard}
              addCard={addCard}
              deleteCard={deleteCard}
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

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex 2xl:w-max gap-10">
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
          <div className="w-full 2xl:w-[60%]">
            <div className="w-full flex items-stretch justify-center bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg">
              <div className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 font-bold text-gray-700">
                Title
              </div>
              <input
                type="text"
                value={cardList.title}
                className="w-full border-none px-6 py-4 font-semibold text-lg focus:outline-none focus:ring-0"
              />
            </div>
            {cards?.map((card, i) => renderCard(card, i))}
          </div>
        </div>
      </DndProvider>
    );
  }
};
