import api from "../../../services/apiService";

/**
 * Generate slide content from topic and content
 * @param topic Topic of the slide
 * @param writingTone Writing tone of the slide
 * @param language Language of the slide
 * @param numberOfSlides Number of slides to generate
 * @param specificRequirements Specific requirements for the slide
 * @returns Slide content
 */
export const generateSlideContent = async (body: any) => {
  try {
    const response = await api.post("/generated-slide", body);
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate slide:", error);
    throw new Error(error.response?.data?.error || "Failed to generate slide.");
  }
};

const generatedSlideService = { generateSlideContent };

export default generatedSlideService;
