import { enqueueSnackbar } from "notistack";

export const snackBarSuccess = (message: string): void => {
  enqueueSnackbar(message, {
    variant: "success",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 2500,
  });
};

export const snackBarError = (message: string): void => {
  enqueueSnackbar(message, {
    variant: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 2500,
  });
};

export const snackBarWarning = (message: string): void => {
  enqueueSnackbar(message, {
    variant: "warning",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 2500,
  });
};

export const snackBarInfo = (
  message: string,
  autoHideDuration: number = 2500,
): void => {
  enqueueSnackbar(message, {
    variant: "info",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: autoHideDuration,
  });
};

export const snackBarDefault = (message: string) => {
  enqueueSnackbar(message, {
    variant: "default",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 2500,
  });
};
