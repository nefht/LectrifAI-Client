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
