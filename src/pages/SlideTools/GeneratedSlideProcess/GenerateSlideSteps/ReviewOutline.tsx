import { useParams } from "react-router";
import { DragAndDropContainer } from "../../../../components/DragAndDrop/DragAndDropContainer";
import { useEffect, useState } from "react";
import { useSlideData } from "../../hooks/useSlideData";
import generatedSlideService from "../../service/generatedSlideService";
import ContentCard from "./components/ContentCardList";

function ReviewOutline() {
  const { id } = useParams();
  const { slideData, setSlideData } = useSlideData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await generatedSlideService.getSlideContent(id);
          if (response?.slideData) {
            console.log(response?.slideData);

            setSlideData(response?.slideData);
          }
          console.log(slideData);
        }
      } catch (error) {
        console.error("Failed to get slide content:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <h1 className="font-degular font-semibold text-2xl md:text-3xl xl:text-4xl">
        Review the outline and slides
      </h1>
      <p className="font-degular text-xl text-center">
        Go over the outline and table of contents to finalize your presentation
      </p>
      <ContentCard />
      {/* <DragAndDropContainer cardList={slideData} setCardList={setSlideData} /> */}
    </>
  );
}

export default ReviewOutline;
