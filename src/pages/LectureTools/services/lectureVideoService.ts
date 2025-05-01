import api from "../../../services/apiService";

/**
 * Upload a slide to the server
 * @param file The file to upload
 * @returns The response from the server
 */
export const uploadSlide = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/uploaded-slide", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to upload slide:", error);
    throw new Error(error.response?.data?.error || "Failed to upload slide.");
  }
};

/**
 * Create lecture script
 * @param fileId The file id
 * @param academicLevel The academic level
 * @param language The language
 * @param voiceType The voice type
 * @param backgroundMusic The background music
 * @param voiceStyle The voice style
 * @param lectureSpeed The lecture speed
 * @param lectureLength The lecture length
 * @param interactiveQuiz The interactive quiz
 * @param specificRequirements The specific requirements
 * @returns The response from the server
 */
export const createLectureScript = async (scriptSettings: {
  fileId: string;
  academicLevel: string;
  language: string;
  voiceType: string;
  // backgroundMusic: string;
  voiceStyle: string;
  lectureSpeed: string;
  lectureLength: string;
  interactiveQuiz: boolean;
  specificRequirements: string;
}) => {
  try {
    const response = await api.post("/lecture-script", scriptSettings);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create lecture script:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create lecture script."
    );
  }
};

/**
 * Get lecture script
 * @param lectureScriptId The lecture script id
 * @returns The response from the server
 */
export const getLectureScript = async (lectureScriptId: string) => {
  try {
    const response = await api.get(`/lecture-script/${lectureScriptId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get lecture script:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get lecture script."
    );
  }
};

/**
 * Get slide by id
 * @param fileId fileId
 * @return slide
 */
export const getUploadedSlide = async (fileId: string) => {
  try {
    const response = await api.get(`/uploaded-slide/${fileId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get uploaded slide:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get uploaded slide."
    );
  }
};

/**
 * Update lecture script - khi đang tạo video
 * @param id lecture script id
 * @param lectureScript
 * @return
 */
export const updateLectureScript = async (id: string, lectureScript: any) => {
  try {
    const response = await api.patch(`/lecture-script/${id}`, lectureScript);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update lecture script:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update lecture script."
    );
  }
};

/**
 * Create lecture video
 * @param fileId The slide id
 * @param lectureScriptId The lecture script id
 * @param languageCode The code of language
 * @param voiceType Male/Female
 * @param lectureSpeed slow/normal/fast
 * @returns The response from the server
 */
export const createLectureVideo = async (videoSettings: {
  fileId: string;
  lectureScriptId: string;
  languageCode: string;
  voiceType: string;
  lectureSpeed: string;
}) => {
  try {
    const response = await api.post("/lecture-video", videoSettings);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create lecture video:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create lecture video."
    );
  }
};

/**
 * Get lecture video by id
 * @param lectureVideoId The lecture video id
 * @returns The response from the server
 */
export const getLectureVideo = async (lectureVideoId: string) => {
  try {
    const response = await api.get(`/lecture-video/${lectureVideoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get lecture video:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get lecture video."
    );
  }
};

/**
 * Get all lecture videos
 * @returns The response from the server
 */
export const getAllLectureVideos = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  interactiveQuiz?: boolean;
  shareMode?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  try {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      interactiveQuiz: params.interactiveQuiz,
      shareMode: params.shareMode,
      sortBy: params.sortBy,
      order: params.order,
    };

    const response = await api.get("/lecture-video", { params: queryParams });
    return response.data;
  } catch (error: any) {
    console.error("Failed to get lecture videos:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get lecture videos."
    );
  }
};

/**
 * Get lecture video permissions
 * @param lectureVideoId The lecture video id
 * @returns
 */
export const getLectureVideoPermissions = async (lectureVideoId: string) => {
  try {
    const response = await api.get(`/lecture-video/share/${lectureVideoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get lecture video permissions:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get lecture video permissions."
    );
  }
};

/**
 * Share lecture video
 * @param lectureVideoId The lecture video id
 * @param isPublic
 * @param sharedWith Array of users
 * @returns
 */
export const shareLectureVideo = async (
  lectureVideoId: string,
  isPublic: boolean,
  sharedWith: string[]
) => {
  try {
    const response = await api.post(`/lecture-video/share/${lectureVideoId}`, {
      isPublic,
      sharedWith,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to share lecture video:", error);
    throw new Error(
      error.response?.data?.error || "Failed to share lecture video."
    );
  }
};

/**
 * Delete lecture video
 * @param lectureVideoId The lecture video id
 * @returns The response from the server
 */
export const deleteLectureVideo = async (lectureVideoId: string) => {
  try {
    const response = await api.delete(`/lecture-video/${lectureVideoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete lecture video:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete lecture video."
    );
  }
};

/**
 * Update lecture video
 * @param lectureVideoId The lecture video id
 * @param lectureName
 * @returns
 */
export const updateLectureVideo = async (
  lectureVideoId: string,
  lectureName: string
) => {
  try {
    const response = await api.patch(`/lecture-video/${lectureVideoId}`, {
      lectureName,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update lecture video:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update lecture video."
    );
  }
};

/**
 * Update lecture script - sau khi đã tạo video, có check permission
 * @param id lecture script id
 * @param lectureScript
 */
export const editLectureQuiz = async (id: string, lectureScript: any) => {
  try {
    const response = await api.patch(`/lecture-script/edit-quiz/${id}`, lectureScript);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update lecture script:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update lecture script."
    );
  }
};

/**
 * Get public lecture video by userId
 * @param userId
 * @returns
 */
export const getPublicLectureVideosByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/lecture-video/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get public lecture videos:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get public lecture videos."
    );
  }
}

const lectureVideoService = {
  uploadSlide,
  createLectureScript,
  getLectureScript,
  getUploadedSlide,
  updateLectureScript,
  createLectureVideo,
  getLectureVideo,
  getAllLectureVideos,
  getLectureVideoPermissions,
  shareLectureVideo,
  deleteLectureVideo,
  updateLectureVideo,
  editLectureQuiz,
  getPublicLectureVideosByUserId,
};

export default lectureVideoService;
