import api from "../../../services/apiService";

/**
 * Get all user's classrooms
 */
export const getAllClassrooms = async (params: {
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
    const response = await api.get(
      "/classroom",
      params ? { params: queryParams } : {}
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    throw new Error("Failed to fetch classrooms. Please try again later.");
  }
};

/**
 * Get all added classrooms
 */
export const getAllAddedClassrooms = async (params: {
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
    const response = await api.get("/classroom/added", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching added classrooms:", error);
    throw new Error(
      "Failed to fetch added classrooms. Please try again later."
    );
  }
};

/**
 * Create a classroom
 * @param classroomName
 * @returns
 */
export const createClassroom = async (classroomName: string) => {
  try {
    const response = await api.post("/classroom", { classroomName });
    return response.data;
  } catch (error) {
    console.error("Error creating classroom:", error);
    throw new Error("Failed to create classroom. Please try again later.");
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
 * Delete classroom
 * @param classroomId
 * @returns
 */
export const deleteClassroom = async (classroomId: string) => {
  try {
    const response = await api.delete(`/classroom/${classroomId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw new Error("Failed to delete classroom. Please try again later.");
  }
};

const classroomManagementService = {
  getAllClassrooms,
  getAllAddedClassrooms,
  createClassroom,
  addStudentsToClassroom,
  deleteClassroom,
};

export default classroomManagementService;
