import { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import ManageUsers from "./components/manageUsers";
import ManageHomePage from "./components/manageHomePage";
import ManageCategories from "./components/manageCategories";

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        דשבורד ניהול מערכת
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        centered
      >
        <Tab label="ניהול משתמשים" />
        <Tab label="ניהול דף הבית" />
        <Tab label="ניהול קטגוריות" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ManageUsers />}
        {tabIndex === 1 && <ManageHomePage />}
        {tabIndex === 2 && <ManageCategories />}
      </Box>
    </Container>
  );
}
