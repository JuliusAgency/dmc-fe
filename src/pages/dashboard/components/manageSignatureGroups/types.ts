import { User } from "../../../../api/authAPI/types";

export type SignatureGroup = {
  id: number;
  name: string;
  users: User[];
};
