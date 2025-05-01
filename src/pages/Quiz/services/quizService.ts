import api from "../../../services/apiService";

/**
 * Create quiz with topic
 * @param topic Quiz topic
 * @param academicLevel Quiz academic level
 * @param language Quiz language
 * @param questionType Quiz question type
 * @param numberOfQuestions Quiz number of questions
 * @param specificRequirements Quiz specific requirements
 * @returns Quiz data
 */
export const createQuizWithTopic = async (
  topic: string | null,
  documentText: string | null,
  academicLevel: string,
  language: string,
  questionType: string,
  numberOfQuestions: number,
  specificRequirements: string
) => {
  try {
    const response = await api.post("/quiz/v1", {
      topic,
      documentText,
      academicLevel,
      language,
      questionType,
      numberOfQuestions,
      specificRequirements,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to create quiz.");
  }
};

/**
 * Create quiz with file
 * @param file Quiz file
 * @param academicLevel Quiz academic level
 * @param language Quiz language
 * @param questionType Quiz question type
 * @param numberOfQuestions Quiz number of questions
 * @param specificRequirements Quiz specific requirements
 * @returns Quiz data
 */
export const createQuizWithFile = async (
  file: File,
  academicLevel: string,
  language: string,
  questionType: string,
  numberOfQuestions: number,
  specificRequirements: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("academicLevel", academicLevel);
    formData.append("language", language);
    formData.append("questionType", questionType);
    formData.append("numberOfQuestions", numberOfQuestions.toString());
    formData.append("specificRequirements", specificRequirements);

    const response = await api.post("/quiz/v2", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to create quiz.");
  }
};

/**
 * Get quiz by id
 * @param id Quiz id
 * @returns Quiz data
 */
export const getQuizById = async (id: string) => {
  try {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to get quiz.");
  }
};

/**
 * Get all quizzes
 * @returns Quizzes
 */
export const getAllQuizzes = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  try {
    const queryParams: any = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      order: params.order,
    };

    const response = await api.get("/quiz", { params: queryParams });
    return response.data;
  } catch (error: any) {
    console.error("Failed to get quizzes:", error);
    throw new Error(error.response?.data?.error || "Failed to get quizzes.");
  }
};

/**
 * Check short answer quiz
 * @param question Quiz question
 * @param answer Correct answer
 * @param explanation Quiz explanation
 * @param points Quiz points
 * @param userAnswer User answer
 * @return { feedback: string, score: number }
 */
export const checkShortAnswerQuiz = async (
  question: string,
  answer: string,
  explanation: string,
  points: number,
  userAnswer: string
) => {
  try {
    const response = await api.post("/quiz/check-short-answer", {
      question,
      answer,
      explanation,
      points,
      userAnswer,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to check short answer quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to check quiz.");
  }
};

/**
 * Get user by id
 * @param id User id
 * @returns User data
 */
export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get user:", error);
    throw new Error(error.response?.data?.error || "Failed to get user.");
  }
};

/**
 * Update quiz
 * @param id Quiz id
 * @param quizData
 */
export const updateQuiz = async (id: string, quizData: any) => {
  try {
    const response = await api.patch(`/quiz/${id}`, {
      quizData,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to update quiz.");
  }
};

/**
 * Update quiz information
 * @param id Quiz id
 * @param quizName
 * @param academicLevel
 * @returns
 */
export const updateQuizInfo = async (
  id: string,
  quizName: string,
  academicLevel: string
) => {
  try {
    const response = await api.patch(`/quiz/info/${id}`, {
      quizName,
      academicLevel,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update quiz information:", error);
    throw new Error(error.response?.data?.error || "Failed to update quiz.");
  }
};

/**
 * Delete quiz set
 * @param id
 * @returns
 */
export const deleteQuiz = async (id: string) => {
  try {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to delete quiz.");
  }
};

/**
 * Share quiz set
 * @param id
 * @param isPublic
 * @param sharedWith {userId: string, permissionType: string}[]
 * @returns
 */
export const shareQuiz = async (
  id: string,
  isPublic: boolean,
  sharedWith: string[]
) => {
  try {
    const response = await api.post(`/quiz/share/${id}`, {
      isPublic,
      sharedWith,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to share quiz:", error);
    throw new Error(error.response?.data?.error || "Failed to share quiz.");
  }
};

/**
 * Get current user permissions with quiz
 * @param quizId
 * @returns permissionType
 */
export const getCurrentUserPermissionWithQuiz = async (quizId: string) => {
  try {
    const response = await api.get(`/quiz/permission/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get current user permissions with quiz:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get quiz permissions."
    );
  }
};

/**
 * Get quiz permissions
 * @param quizId
 * @returns
 */
export const getQuizPermissions = async (quizId: string) => {
  try {
    const response = await api.get(`/quiz/share/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get quiz permissions:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get quiz permissions."
    );
  }
};

/**
 * Create room for multiple players
 * @param quizId
 * @param timeLimit
 * @param maxPlayers
 * @retunrs
 */
export const createMultiplePlayersRoom = async (
  quizId: string,
  timeLimit: number,
  maxPlayers: number
) => {
  try {
    const response = await api.post("/quiz/multiple-play", {
      quizId,
      timeLimit,
      maxPlayers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create room for multiple players:", error);
    throw new Error(
      error.response?.data?.error ||
        "Failed to create room for multiple players."
    );
  }
};

/**
 * Join room for multiple players
 * @param token
 * @returns
 */
export const joinMultiplePlayersRoom = async (token: string) => {
  try {
    const response = await api.get(`/quiz/multiple-play/${token}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to join room for multiple players:", error);
    throw new Error(
      error.response?.data?.error || "Failed to join room for multiple players."
    );
  }
};

/**
 * Get room info by id
 * @param id
 * @returns
 */
export const getRoomById = async (id: string) => {
  try {
    const response = await api.get(`/quiz/multiple-play/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get quiz room information:", error);
    throw new Error(
      error.reponse?.data?.error || "Failed to get quiz room information"
    );
  }
};

/**
 * Get public quizzes by userId
 * @param userId
 * @returns
 */
export const getPublicQuizzesByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/quiz/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get public quizzes by userId:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get public quizzes."
    );
  }
};

const quizService = {
  createQuizWithTopic,
  createQuizWithFile,
  getAllQuizzes,
  getQuizById,
  checkShortAnswerQuiz,
  getUserById,
  updateQuiz,
  updateQuizInfo,
  deleteQuiz,
  shareQuiz,
  getCurrentUserPermissionWithQuiz,
  getQuizPermissions,
  createMultiplePlayersRoom,
  joinMultiplePlayersRoom,
  getRoomById,
  getPublicQuizzesByUserId,
};

export default quizService;
