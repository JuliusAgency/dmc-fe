export interface SelectSignersPopupProps {
  open: boolean;
  onClose: () => void;
  documentId: number | null;
  refetch: () => Promise<void>;
}

export interface Option {
  id: number;
  name: string;
  typeId?: string;
  type?: "user" | "group";
  originalId?: number;
  users?: { id: number; email: string }[];
}
