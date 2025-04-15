import api from "../../../services/apiService";

/**
 * Create or get notebook
 * @param lectureId The lecture id
 * @returns The response from the server
 */

export const createOrGetNotebook = async (lectureId: string) => {
  try {
    const response = await api.post("/notebook", { lectureId });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create or get notebook:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create or get notebook."
    );
  }
};

/**
 * Update notebook
 * @param lectureId The lecture id
 * @param content The notebook content
 * @returns The response from the server
 */
export const updateNotebook = async (lectureId: string, content: string) => {
  try {
    const response = await api.put(`/notebook/${lectureId}`, { content });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update notebook:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update notebook."
    );
  }
};

const notebookService = {
  createOrGetNotebook,
  updateNotebook,
};

export default notebookService;
