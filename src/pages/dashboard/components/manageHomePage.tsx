import { useState } from "react";
import { Button, TextField, Typography, Container } from "@mui/material";
import { updateHomeContent } from "../../../api";

export default function ManageHomePage() {
  const [homeContent, setHomeContent] = useState({
    imageUrl: "",
    announcement: "",
  });

  const handleUpdateHomeContent = async () => {
    try {
      await updateHomeContent(homeContent);
      alert("תוכן דף הבית עודכן בהצלחה!");
    } catch (error) {
      console.error("Error updating home content:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        ניהול דף הבית
      </Typography>
      <TextField
        label="כתובת תמונה"
        value={homeContent.imageUrl}
        onChange={(e) =>
          setHomeContent({ ...homeContent, imageUrl: e.target.value })
        }
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="הודעה רצה"
        value={homeContent.announcement}
        onChange={(e) =>
          setHomeContent({ ...homeContent, announcement: e.target.value })
        }
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleUpdateHomeContent}>
        עדכן דף הבית
      </Button>
    </Container>
  );
}
