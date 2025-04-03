import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import { DASHBOARD_TITLE, TAB_LABELS } from "./constants";
import { PendingSignatures } from "./components/pendingSignatures";
import { SentSignatureStatus } from "./components/sentSignatureStatus";

const TAB_COMPONENTS = [PendingSignatures, SentSignatureStatus];

export const SignatureDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const SelectedComponent = TAB_COMPONENTS[tabIndex];

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {DASHBOARD_TITLE}
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
        centered
        sx={{ mb: 3, "& .MuiTab-root": { textTransform: "none" } }}
      >
        {TAB_LABELS.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Box>
        <SelectedComponent />
      </Box>
    </Container>
  );
};
