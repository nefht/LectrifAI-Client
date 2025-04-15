import { useEffect, useRef, useState } from "react";
import SlideCard from "./SlideCard";
import { useSlideData } from "../../../hooks/useSlideData";

interface CardSlideData {
  heading: string;
  bulletPoints: (string | string[])[];
  imageSuggestions?: string[];
  imageUrls?: {
    height: number;
    width: number;
    title: string;
    imageUrl: string;
  }[];
}

function ContentCardList() {
  const { slideData, setSlideData } = useSlideData();
  const [title, setTitle] = useState<string>("");
  const [cards, setCards] = useState<CardSlideData[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  useEffect(() => {
    if (slideData) {
      setTitle(slideData.title);
      setCards(slideData.slides);
    }
  }, [slideData]);

  // Cập nhật tiêu đề
  const updateTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setSlideData((prev) => {
      return {
        ...prev,
        title: e.target.value,
      };
    });
  };

  // Thêm card mới
  const addCard = (cardIndex: number) => {
    const newCards = [...cards];
    console.log(slideData);

    newCards.splice(cardIndex + 1, 0, {
      heading: "New Heading",
      bulletPoints: [],
      imageSuggestions: [],
      imageUrls: [],
    });

    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Xóa card
  const deleteCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Cập nhật tiêu đề card
  const updateHeading = (cardIndex: number, newHeading: string) => {
    const newCards = [...cards];
    newCards[cardIndex].heading = newHeading;
    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Thêm bullet point vào card
  const addBulletPoint = (cardIndex: number, bulletIndex: number) => {
    const newCards = [...cards];
    const bulletPoints = newCards[cardIndex].bulletPoints;

    const newBulletPoint = "";

    // Kiểm tra sau bullet point có sub bullet point hay không
    if (Array.isArray(bulletPoints[bulletIndex + 1])) {
      bulletPoints.splice(bulletIndex + 2, 0, newBulletPoint);
    } else {
      bulletPoints.splice(bulletIndex + 1, 0, newBulletPoint);
    }

    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Cập nhật bullet point
  const updateBulletPoint = (
    cardIndex: number,
    bulletIndex: number,
    newBulletPoint: string
  ) => {
    const newCards = [...cards];
    newCards[cardIndex].bulletPoints[bulletIndex] = newBulletPoint;
    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Xóa bullet point
  const deleteBulletPoint = (cardIndex: number, bulletIndex: number) => {
    const newCards = [...cards];
    const bulletPoints = newCards[cardIndex].bulletPoints;

    if (Array.isArray(bulletPoints[bulletIndex + 1])) {
      bulletPoints.splice(bulletIndex, 2);
    } else {
      bulletPoints.splice(bulletIndex, 1);
    }

    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Thêm sub bullet point vào bullet point
  const addSubBulletPoint = (
    cardIndex: number,
    bulletIndex: number,
    subIndex?: number
  ) => {
    const newCards = [...cards];
    const bulletPoints = newCards[cardIndex].bulletPoints;
    const bulletPoint = bulletPoints[bulletIndex];
    if (subIndex !== undefined && Array.isArray(bulletPoint)) {
      bulletPoint.splice(subIndex + 1, 0, "");
    } else if (Array.isArray(bulletPoints[bulletIndex + 1])) {
      (bulletPoints[bulletIndex + 1] as string[]).push("");
    } else {
      bulletPoints.splice(bulletIndex + 1, 0, [""]);
    }

    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Cập nhật sub bullet point
  const updateSubBulletPoint = (
    cardIndex: number,
    bulletIndex: number,
    subIndex: number,
    newSubBulletPoint: string
  ) => {
    const newCards = [...cards];
    const bulletPoint = newCards[cardIndex].bulletPoints[bulletIndex];
    if (Array.isArray(bulletPoint)) {
      bulletPoint[subIndex] = newSubBulletPoint;
    }
    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  // Xóa sub bullet point
  const deleteSubBulletPoint = (
    cardIndex: number,
    bulletIndex: number,
    subIndex: number
  ) => {
    const newCards = [...cards];
    const bulletPoint = newCards[cardIndex].bulletPoints[bulletIndex];
    if (Array.isArray(bulletPoint)) {
      bulletPoint.splice(subIndex, 1);
    }

    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  const handleScrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const deleteImage = (cardIndex: number, imgIndex: number) => {
    const newCards = [...cards];
    newCards[cardIndex].imageUrls?.splice(imgIndex, 1);
    setCards(newCards);
    setSlideData((prev) => {
      return {
        ...prev,
        slides: newCards,
      };
    });
  };

  return (
    <div className="flex gap-10 w-full h-full justify-center 2xl:justify-start mt-10">
      <div className="hidden 2xl:block 2xl:w-[20%] 2xl:max-h-[70vh] sticky top-24 left-5 mt-2 ml-4 self-start rounded-lg bg-white shadow-lg overflow-scroll overflow-x-hidden custom-scrollbar">
        <div className="flex items-center justify-center w-full p-3 sticky top-0 bg-white font-semibold text-xl">
          Presentation outline
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-gray-200"></div>
        </div>
        <div className="p-4">
          <div className="font-semibold"></div>
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
      <div className="w-[80vw] 2xl:w-[60%]">
        <div className="w-full flex items-stretch justify-center bg-white border border-gray-300 rounded-md my-2 overflow-hidden shadow-lg">
          <div className="flex items-center justify-center w-12 bg-purple-300 border-r border-gray-300 font-bold text-gray-700">
            Title
          </div>
          <textarea
            rows={1}
            onInput={autoResize}
            placeholder="Enter presentation title here..."
            value={title}
            className="w-full border-none resize-none px-6 py-4 font-semibold text-lg focus:outline-none focus:ring-0"
            onChange={updateTitle}
          />
        </div>
        {cards?.map((item, index) => (
          <div
            ref={(el) => (cardRefs.current[index] = el)}
            key={index}
            className="scroll-mt-[82px]"
          >
            <SlideCard
              key={index}
              cardIndex={index}
              heading={item.heading}
              bulletPoints={item.bulletPoints}
              imageUrls={item.imageUrls}
              addCard={addCard}
              deleteCard={deleteCard}
              updateHeading={updateHeading}
              addBulletPoint={addBulletPoint}
              updateBulletPoint={updateBulletPoint}
              deleteBulletPoint={deleteBulletPoint}
              addSubBulletPoint={addSubBulletPoint}
              updateSubBulletPoint={updateSubBulletPoint}
              deleteSubBulletPoint={deleteSubBulletPoint}
              deleteImage={deleteImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentCardList;
