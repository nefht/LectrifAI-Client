import api from "./apiService";

export const getUploadedSlides = async () => {
  try {
    const response = await api.get("/uploaded-slide");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch slides:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch slides.");
  }
};

/**
 *
 * @param id of the slide
 * @returns slide in detail
 */
export const getUploadedSlideById = async (id: string) => {
  try {
    const response = await api.get(`/uploaded-slide/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch slide detail:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch slide detail."
    );
  }
};

/**
 * Download file slide from fileId
 * @param id of the slide
 */
export const downloadSlide = async (id: string) => {
  try {
    const response = await api.get(`/uploaded-slide/download/${id}`, {
      responseType: "blob",
    });

    // Lấy tên file từ header
    const contentDisposition =
      response.headers["content-disposition"]?.split("filename*=")[1];

    const fileName = contentDisposition
      ? decodeURIComponent(contentDisposition)
      : "downloaded_file";

    // Lấy định dạng file từ header
    const contentType = response.headers["content-type"];

    // Tạo URL từ blob và kích hoạt download
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: contentType })
    );

    // Tạo link ẩn và kích hoạt click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  } catch (error: any) {
    console.error("Failed to download slide:", error);
    throw new Error(error.response?.data?.error || "Failed to download slide.");
  }
};

export const uploadSlide = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/uploaded-slide", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upload slide");
  }
};

const uploadedSlideService = {
  getUploadedSlides,
  getUploadedSlideById,
  downloadSlide,
  uploadSlide,
};

export default uploadedSlideService;
