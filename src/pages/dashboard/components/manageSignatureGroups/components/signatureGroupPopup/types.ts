import { User } from "../../../../../../api/authAPI/types";
import { SignatureGroup } from "../../types";

export type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, userIds: number[]) => void;
  users: User[];
  editMode: boolean;
  group: SignatureGroup | null;
};
