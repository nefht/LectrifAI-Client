import api from "../../../services/apiService";

/**
 * Register
 * @param fullName Full name
 * @param email Email
 * @param account account
 * @param password Password
 * @returns User information
 */
export const register = async (body: {
  fullName: string;
  email: string;
  account: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/register", body);
    return response.data;
  } catch (error: any) {
    console.error("Failed to register:", error);
    throw new Error(error.response?.data?.error || "Failed to register.");
  }
};

/**
 * Login
 * @param account account
 * @param password Password
 * @param rememberMe Remember me
 * @returns User information
 */
export const login = async (
  account: string,
  password: string,
  rememberMe: boolean
) => {
  try {
    const response = await api.post("/auth/login", {
      account,
      password,
      rememberMe,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to login:", error);
    throw new Error(error.response?.data?.error || "Failed to login.");
  }
};

/**
 * Change password
 * @param oldPassword Old password
 * @param newPassword New password
 * @returns void
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to change password:", error);
    throw new Error(
      error.response?.data?.error || "Failed to change password."
    );
  }
};

/**
 * Forgot password
 * @param email Email
 * @returns void
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error: any) {
    console.error("Failed to request password reset:", error);
    throw new Error(
      error.response?.data?.error || "Failed to request password reset."
    );
  }
};

/**
 * Reset password
 * @param resetToken Reset token
 * @param newPassword New password
 * @returns void
 */
export const resetPassword = async (
  resetToken: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/auth/reset-password", {
      resetToken,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to reset password:", error);
    throw new Error(error.response?.data?.error || "Failed to reset password.");
  }
};

const authService = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;
