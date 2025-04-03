import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useGetSentSignatures } from "../../../../hooks/signatures/signaturesHooks";
import { SENT_SIGNATURES_TITLE, NO_SENT_SIGNATURES } from "./constants";

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
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : sentSignatures.length === 0 ? (
        <Typography>{NO_SENT_SIGNATURES}</Typography>
      ) : (
        <Grid container spacing={2}>
          {sentSignatures.map((doc) => (
            <Grid item xs={12} md={6} lg={4} key={doc.documentId}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {doc.name}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    Revision: {doc.revision} <br />
                    Part Number: {doc.documentPartNumber} <br />
                    Created At: {new Date(
                      doc.createdAt
                    ).toLocaleDateString()}{" "}
                    <br />
                    Status: <strong>{doc.status}</strong>
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    <strong>Signatures:</strong> {doc.signedCount} /{" "}
                    {doc.totalSignatures} signed
                  </Typography>

                  {doc.signers?.map((signer) => (
                    <Box key={signer.email} sx={{ mt: 1, pl: 1 }}>
                      <Chip
                        label={`${signer.fullName || signer.email} – ${
                          signer.status
                        }`}
                        color={
                          signer.status === "SIGNED"
                            ? "success"
                            : signer.status === "REJECTED"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        variant="outlined"
                      />
                      {signer.rejectReason && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: "block", pl: 2 }}
                        >
                          Reason: {signer.rejectReason}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
