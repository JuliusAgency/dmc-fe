import { Option } from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";

export const TITLE_NEW_DOCUMENT = "Create New Document";
export const TITLE_EDIT_DOCUMENT = "Edit Document";
export const ERROR_REQUIRED_FIELDS =
  "All fields are required, including a file upload!";
export const ERROR_INVALID_FILE =
  "Invalid file format! Allowed: PDF, Word, Excel, Images.";
export const ERROR_UPLOAD = "An error occurred while uploading the document.";
export const SUCCESS_UPLOAD = "Document uploaded successfully!";
export const BUTTON_SAVE = "Save";
export const BUTTON_CANCEL = "Cancel";

export const CLASSIFICATION_OPTIONS: Option[] = [
  { id: 1, name: "Public" },
  { id: 2, name: "Internal" },
  { id: 3, name: "Confidential" },
  { id: 4, name: "Secret" },
];

export const FILE_TYPE_OPTIONS: Option[] = [
  { id: 1, name: "PDF" },
  { id: 2, name: "DOCX" },
  { id: 3, name: "XLSX" },
  { id: 4, name: "PPTX" },
  { id: 5, name: "PNG" },
  { id: 6, name: "WORD" },
  { id: 7, name: "EXCEL" },
];

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];
