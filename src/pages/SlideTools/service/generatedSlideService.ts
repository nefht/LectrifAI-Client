import api from "../../../services/apiService";

/**
 * Get slide content by id
 * @param id Slide id
 * @returns Slide content
 */
export const getSlideContent = async (id: string) => {
  try {
    const response = await api.get(`/slide-content/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get slide content:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get slide content."
    );
  }
};

/**
 * Generate slide content from topic and content
 * @param topicText Topic of the slide
 * @param writingTone Writing tone of the slide
 * @param language Language of the slide
 * @param numberOfSlides Number of slides to generate
 * @param specificRequirements Specific requirements for the slide
 * @returns Slide content
 */
export const generateSlideContent = async (body: any) => {
  try {
    const response = await api.post("/slide-content/v1", body);
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate slide:", error);
    throw new Error(error.response?.data?.error || "Failed to generate slide.");
  }
};

const generatedSlideService = { getSlideContent, generateSlideContent };

export default generatedSlideService;
