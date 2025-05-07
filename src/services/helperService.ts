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


/**
 * Search content based on category and query
 * @param {string} category - The category to search in (all, slides, lectures, quizzes, users)
 * @param {string} query - The search query
 */
export const searchByCategory = async (category: string, query: string) => {
  try {
    // Convert category name to match backend format
    const categoryParam = category === "All categories" 
      ? "all" 
      : category.toLowerCase();
    
    const response = await api.get("/helpers/search", {
      params: {
        category: categoryParam,
        query
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Failed to search content:", error);
    throw new Error(error.response?.data?.message || "Failed to search content.");
  }
};

const helperService = { getAllLanguages, searchByCategory };
export default helperService;
