import api from "../../../services/apiService";

/**
 * Get classroom by id
 * @param classroomId
 */
export const getClassroomById = async (classroomId: string) => {
  try {
    const response = await api.get(`/classroom/${classroomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom:", error);
    throw new Error("Failed to fetch classroom. Please try again later.");
  }
};

/**
 * Get classroom materials by classroom id
 * @param classroomId
 */
export const getClassroomMaterialsById = async (classroomId: string) => {
  try {
    const response = await api.get(`/classroom/materials/${classroomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom materials:", error);
    throw new Error(
      "Failed to fetch classroom materials. Please try again later."
    );
  }
};

/**
 * Start quiz
 * @param classroomQuizId
 * @returns
 */
export const startQuiz = async (classroomQuizId: string) => {
  try {
    const response = await api.post("/student-answer/start-quiz", {
      classroomQuizId,
    });
    return response.data;
  } catch (error) {
    console.error("Error starting quiz:", error);
    throw new Error("Failed to start quiz. Please try again later.");
  }
};

/**
 * Get student answer by id
 * @param studentAnswerId
 * @return
 */
export const getStudentAnswerById = async (studentAnswerId: string) => {
  try {
    const response = await api.get(`student-answer/${studentAnswerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student answer:", error);
    throw new Error(
      "Failed to fetch student answer. Please try again later."
    );
  }
};

/**
 * Submit quiz answers
 * @param studentAnswerId
 * @return
 */
export const submitQuizAnswers = async (studentAnswerId: string) => {
  try {
    const response = await api.post(`student-answer/submit/${studentAnswerId}`);
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    throw new Error("Failed to submit quiz answers. Please try again later.");
  }
};

/**
 * Grade student answer
 * @param studentAnswerId
 * @return
 */
export const gradeStudentAnswer = async (studentAnswerId: string) => {
  try {
    const response = await api.post(`student-answer/grade/${studentAnswerId}`);
    return response.data;
  } catch (error) {
    console.error("Error grading student answer:", error);
    throw new Error("Failed to grade student answer. Please try again later.");
  }
};

/**
 * Get student answer status
 * @param classroomQuizId
 * @return
 */
export const getAnswerStatusByClassroomQuizId = async (classroomQuizId: string) => {
  try {
    const response = await api.get(`student-answer/status/${classroomQuizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student answer status:", error);
    throw new Error(
      "Failed to fetch student answer status. Please try again later."
    );
  }
};

const classroomService = {
  getClassroomById,
  getClassroomMaterialsById,
  startQuiz,
  getStudentAnswerById,
  submitQuizAnswers,
  gradeStudentAnswer,
  getAnswerStatusByClassroomQuizId,
};

export default classroomService;
