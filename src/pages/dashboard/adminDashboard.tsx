import { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import { TAB_LABELS, TAB_COMPONENTS, DASHBOARD_TITLE } from "./constants";

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const SelectedComponent = TAB_COMPONENTS[tabIndex];

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        {DASHBOARD_TITLE}
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        centered
        sx={{ "& .MuiTab-root": { textTransform: "none" } }}
      >
        {TAB_LABELS.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Box sx={{ mt: 3 }}>
        <SelectedComponent />
      </Box>
    </Container>
  );
}
