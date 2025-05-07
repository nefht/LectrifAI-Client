interface ValidationErrors {
  [key: string]: string;
}

export const validateRequiredFields = (
  values: Record<string, any>,
  requiredFields: string[],
  fieldLabels: Record<string, string>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = `${fieldLabels[field]} is required.`;
    }
  });

  return errors;
};


export const formatToLocalISOString = (date: any) => {
  const d = new Date(date);

  // Lấy năm, tháng, ngày, giờ, phút từ thời gian địa phương
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  // Tạo chuỗi định dạng YYYY-MM-DDThh:mm mà không chuyển đổi múi giờ
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
