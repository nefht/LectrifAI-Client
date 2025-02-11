import { useContext } from "react"
import { ImageToSlideContext } from "../context/ImageToSlideContext"

export const useImageToSlide = () => {
    const context = useContext(ImageToSlideContext);
    if (!context) {
        throw new Error(
            "useImageToSlide must be used within a ImageToSlideProvider"
        )
    }
    return context;
}