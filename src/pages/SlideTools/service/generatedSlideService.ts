import api from "../../../services/apiService";

/**
 * Get slide contents with pagination, search, filter, and sort
 */
export const getAllSlideContents = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  writingTone?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  numberOfSlides?: {
    gte?: number;
    lte?: number;
  };
}) => {
  try {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      language: params.language,
      writingTone: params.writingTone,
      sortBy: params.sortBy,
      order: params.order,
    };

    // Add range filters for numberOfSlides if available
    if (params.numberOfSlides?.gte !== undefined) {
      queryParams["numberOfSlides[gte]"] = params.numberOfSlides.gte;
    }
    if (params.numberOfSlides?.lte !== undefined) {
      queryParams["numberOfSlides[lte]"] = params.numberOfSlides.lte;
    }

    const response = await api.get("/slide-content", {
      params: queryParams,
    });

    return response.data; // { data, total, page, totalPages }
  } catch (error: any) {
    console.error("Failed to get slide contents:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get slide contents."
    );
  }
};

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
 * @param templateCode Template code for the slide
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

/**
 * Upload topic file
 * @param file File to upload
 * @returns Uploaded file data
 */
export const uploadTopicFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/uploaded-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to upload topic file:", error);
    throw new Error(
      error.response?.data?.error || "Failed to upload topic file."
    );
  }
};

/**
 * Generate slide content from file
 * @param topicFileId Topic file id
 * @param writingTone Writing tone of the slide
 * @param language Language of the slide
 * @param numberOfSlides Number of slides to generate
 * @param templateCode Template code for the slide
 * @returns Slide content
 */
export const generateSlideContentFromFile = async (body: any) => {
  try {
    const response = await api.post("/slide-content/v2", body);
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate slide from file:", error);
    throw new Error(
      error.response?.data?.error || "Failed to generate slide from file."
    );
  }
};

/**
 * Generate slide content from document text
 * @param topicParagraph
 * @param writingTone
 * @param language
 * @param numberOfSlides
 * @param templateCode
 * @returns 
 */
export const generateSlideContentFromDocumentText = async (body: any) => {
  try {
    const response = await api.post("/slide-content/v3", body);
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate slide from document text:", error);
    throw new Error(
      error.response?.data?.error || "Failed to generate slide from document text."
    );
  }
};

/**
 * Update slide content
 * @param id Slide content id
 * @param slideData Slide content data
 */
export const updateSlideContent = async (id: string, slideData: any) => {
  try {
    const response = await api.patch(`/slide-content/${id}`, { slideData });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update slide content:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update slide content."
    );
  }
};

/**
 * Delete slide content
 * @param id
 * @returns
 */
export const deleteSlideContent = async (id:string) => {
  try {
    const response = await api.delete(`/slide-content/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete slide content:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete slide content."
    );
  }
}

const generatedSlideService = {
  getAllSlideContents,
  getSlideContent,
  generateSlideContent,
  uploadTopicFile,
  generateSlideContentFromFile,
  generateSlideContentFromDocumentText,
  updateSlideContent,
  deleteSlideContent,
};

export default generatedSlideService;
