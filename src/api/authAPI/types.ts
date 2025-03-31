import { Category } from "../categoryAPI/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  blockedCategories: Category[];
}

export interface AuthFormProps {
  type: "login" | "register";
  onSuccess: () => void;
}

export interface AuthData {
  name?: string;
  email: string;
  password: string;
  rememberMe?: boolean;
  blockedCategoryIds: Category[];
}
