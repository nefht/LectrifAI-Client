import api from "../../../services/apiService";

/**
 * Get chat history for a lecture
 * @param lectureId The lecture id
 * @returns The chat history messages
 */
export const getChatMessages = async (lectureId: string) => {
  try {
    const response = await api.get(`/chat-message/${lectureId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

/**
 * Create chat message
 * @param lectureId The lecture id
 * @param lectureScriptId The lecture script id
 * @param message The message content
 * @returns The response from the server
 */

export const createChatMessage = async (body: {
  lectureId: string;
  lectureScriptId: string;
  message: string;
}) => {
  try {
    const token = JSON.parse(localStorage.getItem("authData") || "{}").token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/chat-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.body;
  } catch (error: any) {
    console.error("❌ Failed to create chat message:", error);
    throw new Error("Failed to create chat message.");
  }
};

/**
 * Delete chat message
 * @param lectureId The message id
 * @returns The response from the server
 */
export const deleteChatMessage = async (lectureId: string) => {
  try { 
    const response = await api.delete(`/chat-message/${lectureId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete chat message:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete chat message."
    );
  }
}

const chatBotService = {
  getChatMessages,
  createChatMessage,
  deleteChatMessage,
};

export default chatBotService;
