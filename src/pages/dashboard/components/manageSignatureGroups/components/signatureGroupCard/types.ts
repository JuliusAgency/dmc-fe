import { SignatureGroup } from "../../types";

export type Props = {
  group: SignatureGroup;
  onEdit: (group: SignatureGroup) => void;
  onDelete: (groupId: number) => void;
};
