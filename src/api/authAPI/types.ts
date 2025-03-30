export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
}
