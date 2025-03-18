export interface SelectSignersPopupProps {
  open: boolean;
  onClose: () => void;
  documentId: number | null;
}

export interface Option {
  id: number;
  name: string;
}
