import api from "./apiService";

/**
 * Get all languages list
 */

export const getAllLanguages = async () => {
  try {
    const response = await api.get("/helpers/languages-list");
    const sortedLanguages = [...response.data].sort((a, b) => {
      if (a.code === "eng") return -1; // Đưa English lên đầu
      if (b.code === "eng") return 1;
      return 0;
    });
    sortedLanguages.unshift({
      code: "auto",
      name: "Auto",
    });
    return sortedLanguages;
  } catch (error: any) {
    console.error("Failed to get languages:", error);
    throw new Error(error.response?.data?.error || "Failed to get languages.");
  }
};

const helperService = { getAllLanguages };
export default helperService;
