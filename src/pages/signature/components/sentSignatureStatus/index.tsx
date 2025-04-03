import { Box, Typography, Grid, CircularProgress, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetSentSignatures } from "../../../../hooks/signatures/signaturesHooks";
import {
  SENT_SIGNATURES_TITLE,
  NO_SENT_SIGNATURES,
  INFO_LABEL_REVISION,
  INFO_LABEL_PART_NUMBER,
  INFO_LABEL_CREATED_AT,
  INFO_LABEL_STATUS,
  INFO_LABEL_SIGNATURES,
  REJECT_REASON_LABEL,
} from "./constants";
import { SentSignatureType } from "./types";
import { GenericCard } from "../../../../components/genericCard/genericCard";
import { formatDate } from "../../../../utils/formatDate.ts";

export const SentSignatureStatus = () => {
  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const { data: sentSignatures = [], isLoading } = useGetSentSignatures(
    user?.id
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {SENT_SIGNATURES_TITLE}
      </Typography>

      {isLoading ? (
        <CenteredLoader />
      ) : sentSignatures.length === 0 ? (
        <Typography>{NO_SENT_SIGNATURES}</Typography>
      ) : (
        <Grid container spacing={2}>
          {sentSignatures.map((doc) => (
            <Grid item xs={12} md={6} lg={4} key={doc.documentId}>
              <SignatureCard data={doc} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const CenteredLoader = () => (
  <Box display="flex" justifyContent="center" mt={3}>
    <CircularProgress />
  </Box>
);

const SignatureCard = ({ data }: { data: SentSignatureType }) => {
  const {
    documentId,
    name,
    revision,
    createdAt,
    documentPartNumber,
    totalSignatures,
    signedCount,
    status,
    signers,
  } = data;

  const infoItems = [
    { label: INFO_LABEL_REVISION, value: revision },
    { label: INFO_LABEL_PART_NUMBER, value: documentPartNumber },
    {
      label: INFO_LABEL_CREATED_AT,
      value: formatDate(String(createdAt)),
    },
    { label: INFO_LABEL_STATUS, value: status },
    {
      label: INFO_LABEL_SIGNATURES,
      value: `${signedCount} / ${totalSignatures} signed`,
    },
  ];

  const bottomContent = (
    <>
      {signers.map(({ fullName, email, status, rejectReason }) => (
        <Box key={email} sx={{ mt: 1, pl: 1 }}>
          <Chip
            label={`${fullName || email} – ${status}`}
            color={
              status === "SIGNED"
                ? "success"
                : status === "REJECTED"
                ? "error"
                : "default"
            }
            size="small"
            variant="outlined"
          />
          {rejectReason && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", pl: 2 }}
            >
              {REJECT_REASON_LABEL}: {rejectReason}
            </Typography>
          )}
        </Box>
      ))}
    </>
  );

  return (
    <GenericCard
      title={name}
      infoItems={infoItems}
      bottomContent={bottomContent}
    />
  );
};
