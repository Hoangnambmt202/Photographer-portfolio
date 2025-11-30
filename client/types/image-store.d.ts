export interface ImageFormStore<T extends object> {
  formData: T;
  setFormData: (data: Partial<T>) => void;
}
