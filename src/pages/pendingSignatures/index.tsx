import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  useGetPendingSignatures,
  useSignDocument,
  useRejectSignature,
} from "../../hooks/signatures/signaturesHooks.ts";
import {
  PENDING_SIGNATURES_TITLE,
  NO_PENDING_SIGNATURES,
  BUTTON_SIGN,
  BUTTON_REJECT,
  BUTTON_DOWNLOAD,
} from "./constants.ts";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useGetFile } from "../../hooks/document/documentHooks.ts";
import { useEffect, useState } from "react";

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

  const signMutation = useSignDocument();
  const rejectMutation = useRejectSignature();

  const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(
    null
  );
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pendingRejectDocumentId, setPendingRejectDocumentId] = useState<
    number | null
  >(null);

  const fileQuery = useGetFile(fileNameToDownload ?? "");

  useEffect(() => {
    if (fileQuery.data && fileNameToDownload) {
      const url = window.URL.createObjectURL(new Blob([fileQuery.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileNameToDownload);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setFileNameToDownload(null);
    }
  }, [fileQuery.data, fileNameToDownload]);

  const handleSign = async (documentId: number) => {
    await signMutation.mutateAsync({ documentId, userId: user?.id });
    refetch();
  };

  const handleRejectClick = (documentId: number) => {
    setPendingRejectDocumentId(documentId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (pendingRejectDocumentId && rejectReason.trim()) {
      await rejectMutation.mutateAsync({
        documentId: pendingRejectDocumentId,
        userId: user?.id,
        rejectReason: rejectReason.trim(),
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      setPendingRejectDocumentId(null);
      refetch();
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectReason("");
    setPendingRejectDocumentId(null);
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
          {pendingSignatures.map((signature) => (
            <Grid item xs={12} md={6} lg={2.1} key={signature.id}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">
                    {/* @ts-ignore */}
                    {signature.document.name}
                  </Typography>
                  <Typography variant="body2">
                    {/* @ts-ignore */}
                    Revision: {signature.document.revision} | Created on:{" "}
                    {new Date(
                      // @ts-ignore
                      signature.document.createdAt
                    ).toLocaleDateString()}
                  </Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleSign(signature.documentId)}
                      // @ts-ignore
                      disabled={signMutation.isLoading}
                    >
                      {BUTTON_SIGN}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRejectClick(signature.documentId)}
                      // @ts-ignore
                      disabled={rejectMutation.isLoading}
                    >
                      {BUTTON_REJECT}
                    </Button>
                  </Box>
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        // @ts-ignore
                        handleDownload(signature.document.fileName)
                      }
                      startIcon={<DownloadForOfflineIcon />}
                    >
                      {BUTTON_DOWNLOAD}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog fullWidth open={rejectDialogOpen} onClose={handleRejectCancel}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reject Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            color="error"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
