import api from "../../../services/apiService";

/**
 * Get all instant lectures
 */
export const getAllInstantLectures = async () => {
  try {
    const response = await api.get("/instant-lecture");
    return response.data;
  } catch (error: any) {
    console.error("Failed to get all instant lectures:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get all instant lectures."
    );
  }
};

/**
 * Get instant lecture by id
 * @param instantLectureId The instant lecture id
 * @returns The response from the server
 */
export const getInstantLecture = async (instantLectureId: string) => {
  try {
    const response = await api.get(`/instant-lecture/${instantLectureId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get instant lecture:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get instant lecture."
    );
  }
};

/**
 * Search instant lectures by keyword
 * @param keyword The keyword to search
 * @returns The response from the server
 */
export const searchInstantLectures = async (keyword: string) => {
  try {
    const response = await api.get("/instant-lecture/search", {
      params: { keyword },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to search instant lectures:", error);
    throw new Error(
      error.response?.data?.error || "Failed to search instant lectures."
    );
  }
};

/**
 * Create instant lecture
 * @param message
 * @param file Image file
 * @param teachingStyle Teaching style
 * @param languageCode Language code
 * @param voiceType Voice type
 * @return message + audio
 */
export const createInstantLecture = async (
  message: string,
  file: File,
  teachingStyle: string,
  languageCode: string,
  voiceType: string
) => {
  try {
    const token = JSON.parse(localStorage.getItem("authData") || "{}").token;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("file", file);
    formData.append("teachingStyle", teachingStyle);
    formData.append("languageCode", languageCode);
    formData.append("voiceType", voiceType);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/instant-lecture`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.body;
  } catch (error: any) {
    console.error("Failed to create instant lecture:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create instant lecture."
    );
  }
};

/**
 * Send message
 * @param lectureId The lecture id
 * @param message The message to send
 * @param file The file to send
 * @param teachingStyle The teaching style
 * @param languageCode The language code
 * @param voiceType The voice type
 * @returns The response from the server
 */
export const sendMessage = async (
  lectureId: string,
  message: string,
  file: File,
  teachingStyle: string,
  languageCode: string,
  voiceType: string
) => {
  try {
    const token = JSON.parse(localStorage.getItem("authData") || "{}").token;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("file", file);
    formData.append("teachingStyle", teachingStyle);
    formData.append("languageCode", languageCode);
    formData.append("voiceType", voiceType);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/instant-lecture/${lectureId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.body;
  } catch (error: any) {
    console.error("Failed to send message:", error);
    throw new Error(error.response?.data?.error || "Failed to send message.");
  }
};

/**
 * Update instant lecture
 * @param lectureId The lecture id
 * @param lectureName The lecture name
 * @returns
 */
export const updateInstantLecture = async (
  lectureId: string,
  lectureName: string
) => {
  try {
    const response = await api.put(`/instant-lecture/${lectureId}`, {
      lectureName,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update instant lecture:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update instant lecture."
    );
  }
};

/**
 * Delete instant lecture
 * @param lectureId The lecture id
 * @return The response from the server
 */
export const deleteInstantLecture = async (lectureId: string) => {
  try {
    const response = await api.delete(`/instant-lecture/${lectureId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete instant lecture:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete instant lecture."
    );
  }
};

const instantLectureService = {
  getAllInstantLectures,
  getInstantLecture,
  searchInstantLectures,
  createInstantLecture,
  sendMessage,
  updateInstantLecture,
  deleteInstantLecture,
};

export default instantLectureService;
