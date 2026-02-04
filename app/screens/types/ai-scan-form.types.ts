import * as yup from "yup";

export const scanFormSchema = yup.object({
  selectedIngredients: yup.array().of(yup.string()).default([]),
  timePreference: yup.number().required().default(30),
  dietPreferences: yup.array().of(yup.string()).default([]),
});

export type ScanFormData = yup.InferType<typeof scanFormSchema>;
