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
    throw new Error("Failed to fetch student answer. Please try again later.");
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
export const getAnswerStatusByClassroomQuizId = async (
  classroomQuizId: string
) => {
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

/**
 * Add students to classroom
 * @param classroomId
 * @param studentIds
 * @returns
 */
export const addStudentsToClassroom = async (
  classroomId: string,
  studentIds: string[]
) => {
  try {
    const response = await api.put(`/classroom/students/${classroomId}`, {
      studentIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding students to classroom:", error);
    throw new Error(
      "Failed to add students to classroom. Please try again later."
    );
  }
};

/**
 * Add quizzes to classroom
 * @param classroomId
 * @param quizzes Array of {quizId, startTime, endTime, duration}
 * @returns
 */
export const addQuizzesToClassroom = async (
  classroomId: string,
  quizzes: Array<{
    quizId: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
  }>
) => {
  try {
    const response = await api.post(`/classroom/quizzes/${classroomId}`, {
      quizzes,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding quizzes to classroom:", error);
    throw new Error(
      "Failed to add quizzes to classroom. Please try again later."
    );
  }
};

/**
 * Add lecture videos to classroom
 * @param classroomId
 * @param lectureVideos - Array of {lectureVideoId, lectureScriptId}
 * @returns
 */
export const addLecturesToClassroom = async (
  classroomId: string,
  lectureVideos: Array<{
    lectureVideoId: string;
    lectureScriptId?: string;
  }>
) => {
  try {
    const response = await api.post(`/classroom/lectures/${classroomId}`, {
      lectureVideos,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding lectures to classroom:", error);
    throw new Error(
      "Failed to add lectures to classroom. Please try again later."
    );
  }
};

/**
 * Rename classroom
 * @param classroomId
 * @param classroomName
 * @returns
 */
export const renameClassroom = async (
  classroomId: string,
  classroomName: string
) => {
  try {
    const response = await api.patch(`/classroom/${classroomId}`, {
      classroomName,
    });
    return response.data;
  } catch (error) {
    console.error("Error renaming classroom:", error);
    throw new Error("Failed to rename classroom. Please try again later.");
  }
};

/**
 * Reset invite link
 * @param classroomId
 * @returns
 */
export const resetInviteLink = async (classroomId: string) => {
  try {
    const response = await api.put(`/classroom/reset-invite/${classroomId}`);
    return response.data;
  } catch (error) {
    console.error("Error resetting invite link:", error);
    throw new Error("Failed to reset invite link. Please try again later.");
  }
};

/**
 * Get classroom by invite token
 * @param inviteToken
 * @returns
 */
export const getClassroomByInviteToken = async (inviteToken: string) => {
  try {
    const response = await api.get(`/classroom/invite/${inviteToken}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom by invite token:", error);
    throw new Error(
      "Failed to fetch classroom by invite token. Please try again later."
    );
  }
};

/**
 * Join classroom by invite token
 * @param inviteToken
 * @returns
 */
export const joinClassroomByInviteToken = async (inviteToken: string) => {
  try {
    const response = await api.get(`/classroom/join/${inviteToken}`);
    return response.data;
  } catch (error) {
    console.error("Error joining classroom by invite token:", error);
    throw new Error(
      "Failed to join classroom by invite token. Please try again later."
    );
  }
};

/**
 * Get students list by classroom id
 * @param classroomId
 * @returns
 */
export const getStudentsList = async (
  classroomId: string,
  page = 1,
  limit = 20,
  search = "",
  sortField = "fullName",
  sortOrder = "asc"
) => {
  try {
    const response = await api.get(`/classroom/students/${classroomId}`, {
      params: {
        page,
        limit,
        search,
        sortField,
        sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching students list:", error);
    throw new Error("Failed to fetch students list. Please try again later.");
  }
};

/**
 * Remove students from classroom
 * @param classroomId
 * @param studentIds
 * @returns
 */
export const removeStudentsFromClassroom = async (
  classroomId: string,
  studentIds: string[]
) => {
  try {
    const response = await api.put(
      `/classroom/remove-students/${classroomId}`,
      { studentIds }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing students from classroom:", error);
    throw new Error(
      "Failed to remove students from classroom. Please try again later."
    );
  }
};

/**
 * Delete classroom lecture video
 * @param classroomLectureId
 * @returns
 */
export const deleteClassroomLectureVideo = async (
  classroomLectureId: string
) => {
  try {
    const response = await api.delete(
      `/classroom-lecture/${classroomLectureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting classroom lecture video:", error);
    throw new Error(
      "Failed to delete classroom lecture video. Please try again later."
    );
  }
};

/**
 * Delete classroom quiz
 * @param classroomQuizId
 * @returns
 */
export const deleteClassroomQuiz = async (classroomQuizId: string) => {
  try {
    const response = await api.delete(`/classroom-quiz/${classroomQuizId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting classroom quiz:", error);
    throw new Error("Failed to delete classroom quiz. Please try again later.");
  }
};

/**
 * Update classroom quiz
 * @param classroomQuizId
 * @param startTime
 * @param endTime
 * @param duration
 * @returns
 */
export const updateClassroomQuiz = async (
  classroomQuizId: string,
  updatedSettings: { startTime?: Date; endTime?: Date; duration?: number }
) => {
  try {
    const response = await api.put(
      `/classroom-quiz/${classroomQuizId}`,
      updatedSettings
    );
    return response.data;
  } catch (error) {
    console.error("Error updating classroom quiz:", error);
    throw new Error("Failed to update classroom quiz. Please try again later.");
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
  addStudentsToClassroom,
  addQuizzesToClassroom,
  addLecturesToClassroom,
  renameClassroom,
  resetInviteLink,
  getClassroomByInviteToken,
  joinClassroomByInviteToken,
  getStudentsList,
  removeStudentsFromClassroom,
  deleteClassroomLectureVideo,
  deleteClassroomQuiz,
  updateClassroomQuiz,
};

export default classroomService;
