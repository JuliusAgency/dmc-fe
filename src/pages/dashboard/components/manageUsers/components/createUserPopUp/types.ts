export type CreateUserPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userData: {
    email: string;
    password: string;
    role: string;
    classification: string;
  };
  setUserData: (data: any) => void;
};
