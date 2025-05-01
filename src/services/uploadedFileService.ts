import api from "./apiService";

/**
 * Download file from fileId
 * @param fileId - The ID of the file to download
 */
export const downloadFile = async (fileId: string) => {
  try {
    const response = await api.get(`/uploaded-file/${fileId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileId); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

const uploadedFileService = {
  downloadFile,
};

export default uploadedFileService;
