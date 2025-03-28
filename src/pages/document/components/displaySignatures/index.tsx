import { Box, Typography } from "@mui/material";
import { displaySignaturesProps } from "./types";
import { TITLE, NO_SIGNATURES_TEXT, CLOSE_BUTTON_TEXT } from "./constants";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";

export const DisplaySignatures = ({
  open,
  onClose,
  documentId,
  signatures,
}: displaySignaturesProps) => {
  const signedSignatures = signatures.filter((sig) => sig.signedAt);

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={TITLE(documentId)}
      cancelButtonText={CLOSE_BUTTON_TEXT}
    >
      {signedSignatures.length === 0 ? (
        <Typography>{NO_SIGNATURES_TEXT}</Typography>
      ) : (
        signedSignatures.map((sig) => (
          <Box key={sig.id} sx={{ mb: 1 }}>
            <strong>{sig.user.email}</strong> –{" "}
            {new Date(sig.signedAt).toLocaleDateString()}
          </Box>
        ))
      )}
    </GenericPopup>
  );
};
