import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  useGetPendingSignatures,
  useSignDocument,
  useRejectSignature,
} from "../../../../hooks/signatures/signaturesHooks.ts";
import {
  PENDING_SIGNATURES_TITLE,
  NO_PENDING_SIGNATURES,
  BUTTON_SIGN,
  BUTTON_REJECT,
  BUTTON_DOWNLOAD,
  SIGN_DIALOG_TITLE,
  SIGN_DIALOG_LABEL,
  SIGN_DIALOG_CANCEL,
  SIGN_DIALOG_CONFIRM,
  REJECT_DIALOG_TITLE,
  REJECT_DIALOG_LABEL,
  REJECT_DIALOG_CANCEL,
  REJECT_DIALOG_CONFIRM,
} from "./constants.ts";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useFileDownload } from "../../../../hooks/utils/useFileDownload";
import { formatDate } from "../../../../utils/formatDate.ts";
import { useState } from "react";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";
import { GenericCard } from "../../../../components/genericCard/genericCard";

export const PendingSignatures = () => {
  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const {
    data: pendingSignatures = [],
    isLoading,
    refetch,
  } = useGetPendingSignatures(user?.id);

  const { handleDownloadFile } = useFileDownload();
  const signMutation = useSignDocument();
  const rejectMutation = useRejectSignature();

  const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(
    null
  );

  const [popupState, setPopupState] = useState<{
    open: boolean;
    mode: "sign" | "reject" | null;
    documentId: number | null;
    reason: string;
  }>({
    open: false,
    mode: null,
    documentId: null,
    reason: "",
  });

  const openPopup = (mode: "sign" | "reject", documentId: number) => {
    setPopupState({ open: true, mode, documentId, reason: "" });
  };

  const closePopup = () => {
    setPopupState({ open: false, mode: null, documentId: null, reason: "" });
  };

  const confirmPopup = async () => {
    const { documentId, mode, reason } = popupState;
    if (!documentId || !mode) return;

    if (mode === "sign") {
      await signMutation.mutateAsync({
        documentId,
        userId: user?.id,
        signReason: reason.trim(),
      });
    }

    if (mode === "reject" && reason.trim()) {
      await rejectMutation.mutateAsync({
        documentId,
        userId: user?.id,
        rejectReason: reason.trim(),
      });
    }

    closePopup();
    refetch();
  };

  const handleDownload = (fileName: string) => {
    setFileNameToDownload(fileName);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {PENDING_SIGNATURES_TITLE}
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : pendingSignatures.length === 0 ? (
        <Typography>{NO_PENDING_SIGNATURES}</Typography>
      ) : (
        <Grid container spacing={2}>
          {pendingSignatures.map((signature) => {
            const document = signature.document;
            const infoItems = [
              { label: "Revision", value: document.revision },
              {
                label: "Created",
                value: formatDate(String(document.createdAt)),
              },
            ];

            const actions = [
              {
                label: BUTTON_SIGN,
                onClick: () => openPopup("sign", signature.documentId),
                color: "success" as const,
                variant: "contained" as const,
                disabled: signMutation.isPending,
              },
              {
                label: BUTTON_REJECT,
                onClick: () => openPopup("reject", signature.documentId),
                color: "error" as const,
                variant: "outlined" as const,
                disabled: rejectMutation.isPending,
              },
              {
                label: BUTTON_DOWNLOAD,
                onClick: () => handleDownload(document.fileName),
                color: "primary" as const,
                variant: "outlined" as const,
                icon: <DownloadForOfflineIcon />,
              },
            ];

            return (
              <Grid item xs={12} md={6} lg={4} key={signature.id}>
                <GenericCard
                  title={document.name}
                  infoItems={infoItems}
                  actions={actions}
                  sx={{ minWidth: 300 }}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      <GenericPopup
        open={popupState.open}
        onClose={closePopup}
        onConfirm={confirmPopup}
        title={
          popupState.mode === "sign" ? SIGN_DIALOG_TITLE : REJECT_DIALOG_TITLE
        }
        confirmButtonText={
          popupState.mode === "sign"
            ? SIGN_DIALOG_CONFIRM
            : REJECT_DIALOG_CONFIRM
        }
        cancelButtonText={
          popupState.mode === "sign" ? SIGN_DIALOG_CANCEL : REJECT_DIALOG_CANCEL
        }
        disabledConfirm={
          popupState.mode === "reject" && !popupState.reason.trim()
        }
      >
        <TextField
          fullWidth
          multiline
          rows={popupState.mode === "reject" ? 4 : 3}
          value={popupState.reason}
          onChange={(e) =>
            setPopupState((prev) => ({ ...prev, reason: e.target.value }))
          }
          placeholder={
            popupState.mode === "sign" ? SIGN_DIALOG_LABEL : REJECT_DIALOG_LABEL
          }
        />
      </GenericPopup>
    </Box>
  );
};
