import api from "./apiService";

/**
 * Get all users list
 */
export const getAllUsers = async (searchQuery?: string) => {
  try {
    const response = await api.get("/user", {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to get users:", error);
    throw new Error(error.response?.data?.error || "Failed to get users.");
  }
};

/**
 * Get user by ID
 * @param userId The user ID
 * @returns User data
 */
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get user:", error);
    throw new Error(error.response?.data?.error || "Failed to get user.");
  }
};

/**
 * Get user profile by userId
 * @param userId The user ID
 * @returns
 */
export const getUserProfileByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to get user profile:", error);
    throw new Error(
      error.response?.data?.error || "Failed to get user profile."
    );
  }
};

/**
 * Update user information
 * @param userData (fullName, email)
 * @returns
 */
export const updateUser = async (userData: any) => {
  try {
    const response = await api.put(`/user`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update user:", error);
    throw new Error(error.response?.data?.error || "Failed to update user.");
  }
};

/**
 * Update user profile
 * @param userProfile (bio, dateOfBirth, phoneNumber, isPublic)
 */
export const updateUserProfile = async (userProfile: any) => {
  try {
    const response = await api.put(`/user/profile`, userProfile);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update user profile:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update user profile."
    );
  }
};

/**
 * Upload avatar
 * @param file The file to upload
 * @returns
 */
export const uploadUserAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to upload avatar:", error);
    throw new Error(error?.response?.data?.error || "Failed to upload avatar.");
  }
};

const userService = {
  getAllUsers,
  getUserById,
  getUserProfileByUserId,
  updateUser,
  updateUserProfile,
  uploadUserAvatar,
};

export default userService;
